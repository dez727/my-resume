// IP-based rate limiting using Cloudflare Workers KV.
// Limits each IP to MAX_REQUESTS per WINDOW_MS (LLM04 mitigation).

const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Normalize IP for rate limiting.
 * IPv6: key on /64 prefix to prevent enumeration bypass.
 * IPv4: use full address.
 */
function normalizeIp(ip) {
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 4).join(":") + "::/64";
  }
  return ip;
}

/**
 * Check and increment the request count for an IP.
 * @param {string} ip - Client IP address
 * @param {KVNamespace} kv - Cloudflare KV binding
 * @returns {{ allowed: boolean, remaining: number }}
 *
 * Known limitation: KV has no compare-and-swap, so two concurrent requests
 * from the same IP can both read count=N and both write count=N+1, allowing
 * a small burst above the limit. Acceptable for a low-traffic resume chatbot;
 * fix with Durable Objects if abuse becomes a concern.
 */
export async function checkRateLimit(ip, kv) {
  const key = `rl:${normalizeIp(ip)}`;
  const now = Date.now();

  const raw = await kv.get(key, "json");
  let record = raw && raw.resetAt > now ? raw : { count: 0, resetAt: now + WINDOW_MS };

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  // TTL in seconds — expire shortly after the window resets
  const ttl = Math.ceil((record.resetAt - now) / 1000) + 60;
  await kv.put(key, JSON.stringify(record), { expirationTtl: ttl });

  return { allowed: true, remaining: MAX_REQUESTS - record.count };
}
