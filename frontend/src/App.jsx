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
        <section className="hero">
          <div className="hero-eyebrow">ClarityOS</div>
          <h1>Stop signing what you don't <em>understand.</em></h1>
          <p className="hero-sub">
            AI-powered financial document decoder for India. Get the truth backed by <strong>live regulations</strong>.
          </p>
          <div className="trust-row">
            {["RBI & IRDAI Rules", "Real ₹ Numbers", "PDF Analysis"].map(t => (
              <div key={t} className="trust-item"><div className="trust-dot"/>{t}</div>
            ))}
          </div>
        </section>

        <ToolGrid activeTool={activeTool} onToolChange={setActiveTool} />
        <ChatPanel toolId={activeTool} tool={TOOLS[activeTool]} />
      </main>

      <footer className="footer">
        <p><strong>ClarityOS</strong> — Powered by Gemini 2.0 Flash</p>
        <p><small>For informational purposes only. Not financial advice.</small></p>
      </footer>
    </div>
  );
}
