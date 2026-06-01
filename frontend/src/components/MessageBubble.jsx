import React from "react";
import DOMPurify from "dompurify";

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

export default function MessageBubble({ message, toolIcon, toolName }) {
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
  const srcHTML = message.sources?.length
    ? `<div class="sources-strip">🔗 <strong>Sources:</strong> ${
        [...new Map(message.sources.map(s=>[s.uri,s])).values()].slice(0,5)
          .map(s=>`<a href="${s.uri}" target="_blank" rel="noopener noreferrer">${s.title}</a>`).join(" · ")
      }</div>`
    : "";
  return (
    <div className="message ai">
      <div className="msg-av ai-av">{toolIcon}</div>
      <div>
        <div className="expert-tag">{toolIcon} {toolName}</div>
        <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: fmt(message.text) + srcHTML }}/>
      </div>
    </div>
  );
}
