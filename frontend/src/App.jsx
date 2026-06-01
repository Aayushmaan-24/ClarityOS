import React, { useState } from "react";
import Header from "./components/Header";
import ToolGrid from "./components/ToolGrid";
import ChatPanel from "./components/ChatPanel";
import { TOOLS } from "./config/tools";

export default function App() {
  const [activeTool, setActiveTool] = useState("policy");
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="hero">
          <div className="hero-eyebrow">India's Financial Document Decoder</div>
          <h1>Stop signing what you don't <em>understand.</em></h1>
          <p className="hero-sub">
            Paste or upload any Indian financial document and get the truth
            backed by <strong>live government data</strong>.
          </p>
          <div className="trust-row">
            {["Live RBI / IRDAI / SEBI rules","Current IT slabs & CGHS rates","Real ₹ numbers, not %","PDF upload supported"].map(t => (
              <div key={t} className="trust-item"><div className="trust-dot"/>{t}</div>
            ))}
          </div>
        </div>
        <ToolGrid activeTool={activeTool} onToolChange={setActiveTool} />
        <ChatPanel toolId={activeTool} tool={TOOLS[activeTool]} />
      </main>
      <footer className="footer">
        <strong>ClarityOS</strong> — Powered by Gemini 2.0 Flash + Google Search Grounding<br/>
        <small>For informational purposes only. Always consult a qualified professional.</small>
      </footer>
    </div>
  );
}
