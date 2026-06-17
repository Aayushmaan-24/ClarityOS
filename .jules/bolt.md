## 2025-05-15 - [Memoizing Message Rendering]
**Learning:** React components that perform heavy string manipulation or DOM sanitization (like `DOMPurify`) during render can significantly slow down the UI, especially in long chat histories. Every new message causes all previous messages to re-render and re-sanitize if not memoized.
**Action:** Use `React.memo` for list items in chat/logs and `useMemo` for expensive formatting logic within those items. This ensures that only the new message is processed and rendered, while older messages are skipped.
