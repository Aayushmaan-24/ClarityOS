import React from "react";

export default function Header() {
  return (
    <header>
      <div className="hdr-inner">
        <div className="logo">
          <span className="logo-word">Clarity<span>OS</span></span>
          <span className="logo-tag">Beta</span>
        </div>
        <div className="hdr-right">
          <div className="live-badge"><div className="live-dot"/>Live Govt. Data</div>
          <div className="powered-by">Gemini 2.0 Flash</div>
        </div>
      </div>
    </header>
  );
}
