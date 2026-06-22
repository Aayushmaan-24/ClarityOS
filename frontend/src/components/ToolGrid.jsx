import React from "react";
import { TOOLS } from "../config/tools";

export default function ToolGrid({ activeTool, onToolChange }) {
  return (
    <section className="tools-wrap">
      <div className="section-label">Select a decoder</div>
      <div className="tool-grid">
        {Object.values(TOOLS).map(tool => (
          <button
            key={tool.id}
            className={`tool-card ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onToolChange(tool.id)}
            aria-pressed={activeTool === tool.id}
          >
            <div className="tc-icon">{tool.icon}</div>
            <div className="tc-name">{tool.name}</div>
            <div className="tc-desc">{tool.fullName.split("—")[1]?.trim()}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
