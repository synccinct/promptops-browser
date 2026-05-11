import React from "react";
import { Button } from "@optiprompt/ui";

export default function DashboardPage() {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Dashboard</h1>
        <Button>New Asset</Button>
      </header>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--text-muted)" }}>Total Optimizations</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>1,284</p>
        </div>
        <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--text-muted)" }}>Active Experiments</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>3</p>
        </div>
        <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--text-muted)" }}>Token Savings</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, color: "var(--secondary)" }}>$432.50</p>
        </div>
      </div>
    </div>
  );
}
