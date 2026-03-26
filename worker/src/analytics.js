// Anonymized query topic analytics.
// Categorizes user messages by keyword matching and logs topic counts to KV.
// No full messages are stored — only aggregate category counts.

const TOPIC_KEYWORDS = {
  ai: ["ai", "artificial intelligence", "machine learning", "automation", "chatbot", "prompt", "llm", "gpt"],
  experience: ["experience", "work", "job", "role", "career", "position", "company", "intern"],
  leadership: ["leadership", "regent", "board", "policy", "governor", "appointed", "public official"],
  skills: ["skill", "technology", "tech", "programming", "python", "sql", "tool", "certification"],
  projects: ["project", "built", "portfolio", "homelab", "docker", "website"],
  education: ["education", "degree", "university", "school", "college", "study", "gpa", "major"],
  contact: ["contact", "email", "reach", "hire", "interview", "phone", "linkedin"],
};

/**
 * Classify a user message into a topic category.
 * Returns the best-matching topic or "other".
 */
function classifyTopic(message) {
  const lower = message.toLowerCase();
  let bestTopic = "other";
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestTopic;
}

/**
 * Log an anonymized topic hit to KV.
 * Stores only: { topic: count } per day — no message content.
 * @param {string} message - The user's message (used only for classification, not stored)
 * @param {KVNamespace} kv - Cloudflare KV binding
 */
export async function logTopic(message, kv) {
  const topic = classifyTopic(message);
  const today = new Date().toISOString().slice(0, 10); // "2026-03-26"
  const key = `analytics:${today}`;

  try {
    const raw = await kv.get(key, "json");
    const counts = raw || {};
    counts[topic] = (counts[topic] || 0) + 1;
    // Expire after 90 days
    await kv.put(key, JSON.stringify(counts), { expirationTtl: 90 * 24 * 60 * 60 });
  } catch (_) {
    // Analytics should never block the chat response
  }
}
