import React from "react";

export const PanelShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ padding: "16px", minHeight: "100vh", boxSizing: "border-box" }}>
      {children}
    </div>
  );
};
