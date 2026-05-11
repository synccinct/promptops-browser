import { useState, useEffect } from "react";
// A simple singleton store using browser messaging as the source of truth
export function useSidePanelStore() {
    const [state, setState] = useState({
        activeSession: null,
        currentDraft: null,
        suggestions: [],
        isAnalyzing: false,
    });
    useEffect(() => {
        const listener = (message) => {
            console.log("[SidePanel] Received message:", message);
            switch (message.type) {
                case "SESSION_UPDATED":
                    setState(prev => ({ ...prev, activeSession: message.payload.session }));
                    break;
                case "DRAFT_UPDATED":
                    setState(prev => ({ ...prev, currentDraft: message.payload.draft }));
                    break;
                case "SUGGESTIONS_READY":
                    setState(prev => ({
                        ...prev,
                        suggestions: [message.payload.envelope, ...prev.suggestions],
                        isAnalyzing: false
                    }));
                    break;
                case "ANALYSIS_STARTED":
                    setState(prev => ({ ...prev, isAnalyzing: true }));
                    break;
            }
        };
        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);
    return state;
}
