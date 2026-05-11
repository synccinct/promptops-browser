import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PanelShell } from "./components/panel-shell";
import { LivePromptCard } from "./components/live-prompt-card";
import { SuggestionCard } from "./components/suggestion-card";
import { useSidePanelStore } from "./stores/sidepanel-store";
export const App = () => {
    const { activeSession, currentDraft, suggestions, isAnalyzing } = useSidePanelStore();
    return (_jsxs(PanelShell, { children: [_jsx(LivePromptCard, { draft: currentDraft, isAnalyzing: isAnalyzing }), _jsxs("div", { className: "suggestions-list", children: [suggestions.length > 0 && (_jsx("div", { className: "section-label", children: "RECOMMENDATIONS" })), suggestions.flatMap(env => env.cards).map(card => (_jsx(SuggestionCard, { card: card }, card.id)))] }), _jsx("style", { children: `
        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-label {
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          margin-top: 0.5rem;
        }
      ` })] }));
};
