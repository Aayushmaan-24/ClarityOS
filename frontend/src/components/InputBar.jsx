import React, { useState, useRef } from "react";
const MAX_MB = parseInt(import.meta.env.VITE_MAX_PDF_MB || "10");

export default function InputBar({ onSend, isLoading }) {
  const [text, setText] = useState("");
  const [pdf, setPdf] = useState(null);
  const ref = useRef(null);

  const send = () => {
    if (isLoading || (!text.trim() && !pdf)) return;
    onSend({ text: text.trim(), pdfFile: pdf });
    setText(""); setPdf(null);
  };

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") { alert("Only PDF files accepted."); return; }
    if (f.size > MAX_MB * 1024 * 1024) { alert(`Max ${MAX_MB}MB.`); return; }
    setPdf(f); e.target.value = "";
  };

  return (
    <div className="input-area">
      <div className="input-wrap">
        {pdf && (
          <div className="pdf-preview">
            <span aria-hidden="true">📄</span>
            <span className="pdf-name">{pdf.name}</span>
            <button onClick={() => setPdf(null)} aria-label="Remove PDF">✕</button>
          </div>
        )}
        <textarea value={text}
          onChange={e => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
          }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Paste document text, upload a PDF 📎, or describe your situation..."
          rows={1}
          disabled={isLoading}
          aria-label="Message text"
        />
      </div>
      <input type="file" ref={ref} accept="application/pdf" style={{display:"none"}} onChange={onFile}/>
      <button className="upload-btn" onClick={() => ref.current?.click()} disabled={isLoading} title="Upload PDF" aria-label="Upload PDF">📎</button>
      <button
        className="send-btn"
        onClick={send}
        disabled={isLoading || (!text.trim() && !pdf)}
        aria-label="Send message"
        title={isLoading ? "Sending..." : (text.trim() || pdf ? "Send Message" : "Enter text or upload PDF to send")}
      >
        ➤
      </button>
    </div>
  );
}
