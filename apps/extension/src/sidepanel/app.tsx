import React from "react";
import { PanelShell } from "./components/panel-shell";

export const App: React.FC = () => {
  return (
    <PanelShell>
      <h1>OptiPrompt</h1>
      <p>Live prompt telemetry is ready.</p>
    </PanelShell>
  );
};
