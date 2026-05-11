import React from "react";

export default function PromptsPage() {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Prompt Assets</h1>
      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <strong>Customer Support Agent</strong>
          <span style={{ color: "var(--secondary)" }}>Active</span>
        </div>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <strong>Sales Email Generator</strong>
          <span style={{ color: "var(--secondary)" }}>Active</span>
        </div>
      </div>
    </div>
  );
}
