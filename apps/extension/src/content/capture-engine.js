export class CaptureEngine {
    adapter;
    lastCapturedText = "";
    constructor(adapter) {
        this.adapter = adapter;
    }
    start() {
        const input = this.adapter.findPromptInput();
        if (!input) {
            console.warn(`[OptiPrompt] Could not find input for adapter: ${this.adapter.name}`);
            return;
        }
        // Monitor for changes
        input.addEventListener("input", (e) => {
            const text = this.extractText(e.target);
            if (text === this.lastCapturedText)
                return;
            this.lastCapturedText = text;
            this.sendToBackground({
                type: "PROMPT_CHANGED",
                payload: {
                    ...this.adapter.capturePrompt(text),
                    draftId: "", // Resolved by background
                    previousPromptText: "", // Not tracked here yet
                }
            });
        });
        // Monitor for submissions
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                const text = this.extractText(e.target);
                this.sendToBackground({
                    type: "PROMPT_SUBMITTED",
                    payload: {
                        ...this.adapter.capturePrompt(text),
                        draftId: "",
                        submittedAt: new Date().toISOString(),
                    }
                });
            }
        });
    }
    extractText(el) {
        if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
            return el.value;
        }
        return el.innerText || el.textContent || "";
    }
    sendToBackground(event) {
        chrome.runtime.sendMessage(event);
    }
}
