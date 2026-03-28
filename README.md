# Desmond Adongo Resume Site

Static resume site with a Cloudflare Worker-backed chat assistant.

## Structure

- `index.html` contains the one-page resume markup and chat widget shell.
- `style.css` contains the site styling.
- `script.js` handles navigation, expandable sections, smooth scrolling, and the chat widget client.
- `worker/src/index.js` validates chat requests, applies rate limits, logs lightweight analytics, and proxies streaming responses.
- `worker/src/chat.js` builds the system prompt and sends chat completions to OpenRouter.
- `worker/src/resume-data.js` is the structured resume corpus used by the assistant.

## Chat Safety Model

- The browser sends only the last 3 successful user questions to the Worker.
- The Worker accepts only `user` messages from the client.
- Each user message is capped at 500 characters.
- Total request size is capped at 8 KB.
- The Worker collapses prior user questions into contextual blocks before sending a single `user` turn to the model provider.
- The Worker wraps each user turn in explicit delimiters before sending it to the model.

This keeps the chat context useful for follow-up questions without trusting client-supplied assistant turns as authoritative context.

## Local Development

Frontend:

```powershell
# From the repo root, serve the static files with any local static server.
```

Worker:

```powershell
cd worker
npm install
npm run dev
```

The Worker expects:

- An `OPENROUTER_API_KEY` secret in Cloudflare Workers.
- KV bindings for `RATE_LIMIT` and `ANALYTICS`.
- `ALLOWED_ORIGIN`, `MODEL`, and `MAX_TOKENS` values from `worker/wrangler.toml` or environment overrides.

## Content Updates

If you change the visible resume copy in `index.html`, also update `worker/src/resume-data.js` so the assistant stays aligned with what visitors can verify on the page.
