import React from "react";

export default function PromptDetailPage({ params }: { params: { promptId: string } }) {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Prompt Detail</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>ID: {params.promptId}</p>
      
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <h3 style={{ marginTop: 0 }}>Current Structure</h3>
        <pre style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px", overflowX: "auto" }}>
          {`{
  "system": "You are a helpful assistant.",
  "format": "JSON"
}`}
        </pre>
      </div>
    </div>
  );
}
