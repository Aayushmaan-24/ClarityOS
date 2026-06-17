## 2025-05-14 - [A11y & Markdown Grounding]
**Learning:** Icon-only buttons (like 📎 and ➤) must have explicit `aria-label` attributes for screen readers. Additionally, AI responses with grounding (Google Search) often return markdown links `[text](url)` which need explicit regex handling if a custom formatter is used, otherwise links are rendered as plain text.
**Action:** Always include `aria-label` for icon-buttons and ensure markdown link regex is present in the message formatter.
