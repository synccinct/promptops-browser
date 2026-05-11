import React from "react";
import { SuggestionCard as SuggestionCardType } from "@optiprompt/domain";

interface SuggestionCardProps {
  card: SuggestionCardType;
  onApply?: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ card, onApply }) => {
  const getKindColor = (kind: string) => {
    switch (kind) {
      case "constraint": return "#3b82f6";
      case "context": return "#8b5cf6";
      case "format": return "#ec4899";
      case "risk": return "#f59e0b";
      default: return "#6366f1";
    }
  };

  return (
    <div className="suggestion-card" style={{ '--kind-color': getKindColor(card.kind) } as any}>
      <div className="kind-badge">{card.kind}</div>
      <h3 className="suggestion-title">{card.title}</h3>
      <p className="suggestion-message">{card.message}</p>
      
      {card.actionLabel && (
        <button className="action-button" onClick={onApply}>
          {card.actionLabel}
        </button>
      )}

      <style>{`
        .suggestion-card {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border);
          border-left: 4px solid var(--kind-color);
          border-radius: 8px;
          padding: 1rem;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .suggestion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          background: rgba(30, 41, 59, 0.6);
        }

        .kind-badge {
          display: inline-block;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--kind-color);
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .suggestion-title {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #fff;
        }

        .suggestion-message {
          font-size: 0.8125rem;
          line-height: 1.4;
          color: var(--text-muted);
          margin: 0 0 1rem 0;
        }

        .action-button {
          width: 100%;
          padding: 0.5rem;
          background: var(--kind-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: filter 0.2s ease;
        }

        .action-button:hover {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
};
