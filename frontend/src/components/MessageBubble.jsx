import React, { useMemo } from "react";
import DOMPurify from "dompurify";

const fmt = (text) => {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/((?:^[-•] .+(?:\n|$))+)/gm, (m) => {
      const items = m.trim().split("\n").map(li => `<li>${li.replace(/^[-•] /, "").trim()}</li>`).join("");
      return `<ul>${items}</ul>`;
    })
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n(?!<)/g, "<br>");
};

const MessageBubble = React.memo(({ message, toolIcon, toolName }) => {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  const cleanHTML = useMemo(() => {
    if (isUser || isError) return null;

    const srcHTML = message.sources?.length
      ? `<div class="sources-strip">🔗 <strong>Sources:</strong> ${
          [...new Map(message.sources.map(s => [s.uri, s])).values()]
            .slice(0, 5)
            .map(s => `<a href="${s.uri}" target="_blank" rel="noopener noreferrer">${s.title}</a>`)
            .join(" · ")
        }</div>`
      : "";

    return DOMPurify.sanitize(fmt(message.text) + srcHTML, {
      ALLOWED_TAGS: ["strong", "em", "h3", "ul", "li", "br", "div", "span", "a", "p"],
      ALLOWED_ATTR: ["href", "target", "rel", "class"],
    });
  }, [message.text, message.sources, isUser, isError]);

  if (isUser) {
    return (
      <div className="message user">
        <div className="msg-bubble">
          {message.fileName && (
            <div style={{ fontWeight: 600, marginBottom: 4 }} aria-label={`Attached file: ${message.fileName}`}>
              <span aria-hidden="true">📄</span> {message.fileName}
            </div>
          )}
          {message.text}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="message ai">
        <div className="msg-bubble">
          <span className="red-flag" aria-hidden="true">⚠️</span> {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="message ai">
      <div>
        <div className="expert-tag" aria-hidden="true">{toolIcon} {toolName}</div>
        <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
