## 2026-06-17 - [HIGH] XSS via unsanitized source HTML and javascript: URIs
**Vulnerability:** The `MessageBubble.jsx` component was concatenating a manually constructed HTML string for "Sources" (using data from `message.sources`) with the already-sanitized message body. This combined string was then injected using `dangerouslySetInnerHTML`. An attacker (or a compromised/malicious LLM output) could inject `javascript:` URIs or malicious HTML via the source `uri` or `title` fields.

**Learning:** Sanitizing only *part* of the data before concatenating it into a raw HTML string for injection is a common pitfall. If any part of the final string comes from an untrusted or non-validated source, the entire injection point is compromised.

**Prevention:** Always prefer React's built-in element rendering over `dangerouslySetInnerHTML`. If raw HTML injection is unavoidable (e.g., for Markdown-to-HTML), ensure the *final* string is sanitized immediately before injection, and validate all URIs against an allowlist of protocols (e.g., `http:`, `https:`).
