import React, { useMemo, memo } from "react";
import DOMPurify from "dompurify";

// Bolt ⚡: Optimization - fmt and sanitization is expensive for large texts.
// Using useMemo inside the component and memoizing the component itself
// prevents redundant processing on every parent re-render.
function fmt(text) {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/^[-•] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, m => `<ul>${m}</ul>`)
    .replace(/<\/ul>\s*<ul>/g, "")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n(?!<)/g, "<br>");
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["strong","em","h3","ul","li","br","div","span","a","p"],
    ALLOWED_ATTR: ["href","target","rel","class"],
  });
}

const MessageBubble = memo(({ message, toolIcon, toolName }) => {
  const formattedContent = useMemo(() => {
    if (message.role !== "assistant") return null;

    const srcHTML = message.sources?.length
      ? `<div class="sources-strip">🔗 <strong>Sources:</strong> ${
          [...new Map(message.sources.map(s=>[s.uri,s])).values()].slice(0,5)
            .map(s=>`<a href="${s.uri}" target="_blank" rel="noopener noreferrer">${s.title}</a>`).join(" · ")
        }</div>`
      : "";

    return fmt(message.text) + srcHTML;
  }, [message.text, message.sources, message.role]);

  if (message.role === "user") return (
    <div className="message user">
      <div className="msg-av u-av">👤</div>
      <div className="msg-bubble">
        {message.fileName && <div style={{fontWeight:600,marginBottom:4}}>📄 {message.fileName}</div>}
        {message.text}
      </div>
    </div>
  );
  if (message.role === "error") return (
    <div className="message ai">
      <div className="msg-av ai-av">{toolIcon}</div>
      <div className="msg-bubble"><span className="red-flag">⚠️ {message.text}</span></div>
    </div>
  );

  return (
    <div className="message ai">
      <div className="msg-av ai-av">{toolIcon}</div>
      <div>
        <div className="expert-tag">{toolIcon} {toolName}</div>
        <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: formattedContent }}/>
      </div>
    </div>
  );
});

export default MessageBubble;
