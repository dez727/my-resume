import { streamChat } from "./chat.js";
import { checkRateLimit } from "./rate-limiter.js";
import { logTopic } from "./analytics.js";

// Maximum request body size in bytes (LLM04)
const MAX_BODY_BYTES = 2048;
// Maximum length of a single user message (LLM01)
const MAX_MESSAGE_LENGTH = 500;

/**
 * Return CORS headers scoped to the allowed origin.
 */
function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || "https://dez727.github.io";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Respond with JSON + CORS headers.
 */
function jsonResponse(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

/**
 * Sanitize a single message string (LLM01).
 * Strips control characters and trims excessive whitespace.
 */
function sanitizeInput(text) {
  // Strip non-printable control chars (keep newlines and tabs)
  return text.replace(/[^\P{Cc}\n\t]/gu, "").replace(/\s{3,}/g, "  ").trim();
}

/**
 * Validate the messages array from the client.
 * Returns { ok, messages?, error? }.
 */
function validateMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: "messages must be a non-empty array" };
  }
  if (raw.length > 20) {
    return { ok: false, error: "too many messages" };
  }

  const cleaned = [];
  for (const msg of raw) {
    if (!msg || typeof msg.content !== "string" || typeof msg.role !== "string") {
      return { ok: false, error: "invalid message format" };
    }
    if (!["user", "assistant"].includes(msg.role)) {
      return { ok: false, error: "invalid role" };
    }
    const content = sanitizeInput(msg.content);
    if (content.length === 0) {
      return { ok: false, error: "empty message" };
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { ok: false, error: `message exceeds ${MAX_MESSAGE_LENGTH} characters` };
    }
    cleaned.push({ role: msg.role, content });
  }
  return { ok: true, messages: cleaned };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    // Only POST /api/chat is valid
    if (url.pathname !== "/api/chat" || request.method !== "POST") {
      return jsonResponse({ error: "not found" }, 404, env);
    }

    // Parse and validate body before rate-limiting so invalid requests
    // don't consume the user's quota.
    let body;
    try {
      const text = await request.text();
      // Enforce body size limit in bytes, not characters (LLM04)
      if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
        return jsonResponse({ error: "request too large" }, 413, env);
      }
      body = JSON.parse(text);
    } catch {
      return jsonResponse({ error: "invalid JSON" }, 400, env);
    }

    const validation = validateMessages(body.messages);
    if (!validation.ok) {
      return jsonResponse({ error: validation.error }, 400, env);
    }

    // Rate limiting — only counted for valid requests
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const { allowed, remaining } = await checkRateLimit(ip, env.RATE_LIMIT);
    if (!allowed) {
      return jsonResponse(
        { error: "Rate limit exceeded. Please wait a few minutes before trying again." },
        429,
        env
      );
    }

    // Log anonymized topic (fire-and-forget, never blocks response)
    const lastUserMsg = validation.messages.filter(m => m.role === "user").pop();
    if (lastUserMsg) {
      ctx.waitUntil(logTopic(lastUserMsg.content, env.RATE_LIMIT));
    }

    // Stream the LLM response
    try {
      const stream = await streamChat(validation.messages, env);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": String(remaining),
          ...corsHeaders(env),
        },
      });
    } catch (err) {
      console.error("Chat error:", err);
      return jsonResponse({ error: "Failed to generate response" }, 502, env);
    }
  },
};
