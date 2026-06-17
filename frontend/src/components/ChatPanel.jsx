import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

export default function ChatPanel({ toolId, tool }) {
  const { messages, isLoading, sendMessage, resetChat } = useChat(toolId);
  const prevTool = useRef(toolId);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (prevTool.current !== toolId) { resetChat(); prevTool.current = toolId; }
  }, [toolId, resetChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="panel">
      <div className="panel-hdr">
        <div className="ph-icon">{tool.icon}</div>
        <div className="ph-info">
          <div className="ph-name">{tool.fullName}</div>
          <div className="ph-role">{tool.role}</div>
        </div>
        <div className="ph-status"><div className="status-dot"/>Gemini + Live Search</div>
      </div>
      <div className="chat-area">
        <div className="message ai">
          <div className="msg-av ai-av">{tool.icon}</div>
          <div>
            <div className="expert-tag">{tool.icon} {tool.name}</div>
            <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tool.greeting) }}/>
          </div>
        </div>
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} toolIcon={tool.icon} toolName={tool.name}/>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="msg-av ai-av">{tool.icon}</div>
            <div className="typing">
              <div className="dot"/><div className="dot"/><div className="dot"/>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {messages.length === 0 && (
        <div className="quick-wrap">
          {tool.prompts.map(p => (
            <button key={p} className="qbtn" onClick={() => sendMessage({ text: p })}>{p}</button>
          ))}
        </div>
      )}
      <InputBar onSend={sendMessage} isLoading={isLoading}/>
    </div>
  );
}
