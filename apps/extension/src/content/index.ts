import { findActiveAdapter } from "./adapter-registry";
import { CaptureEngine } from "./capture-engine";

function init() {
  const adapter = findActiveAdapter(window.location.href);
  if (!adapter) return;

  console.log(`[OptiPrompt] Active adapter: ${adapter.name}`);
  const engine = new CaptureEngine(adapter);
  engine.start();
}

// Ensure the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
