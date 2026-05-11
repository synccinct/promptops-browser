import React from "react";
import { PanelShell } from "./components/panel-shell";
import { LivePromptCard } from "./components/live-prompt-card";
import { SuggestionCard } from "./components/suggestion-card";
import { useSidePanelStore } from "./stores/sidepanel-store";

export const App: React.FC = () => {
  const { activeSession, currentDraft, suggestions, isAnalyzing } = useSidePanelStore();

  return (
    <PanelShell>
      <LivePromptCard draft={currentDraft} isAnalyzing={isAnalyzing} />
      
      <div className="suggestions-list">
        {suggestions.length > 0 && (
          <div className="section-label">RECOMMENDATIONS</div>
        )}
        
        {suggestions.flatMap(env => env.cards).map(card => (
          <SuggestionCard key={card.id} card={card} />
        ))}
      </div>

      <style>{`
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
      `}</style>
    </PanelShell>
  );
};
