import React from "react";
export const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button style={{ background: "#4F46E5", color: "white", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
    {children}
  </button>
);
