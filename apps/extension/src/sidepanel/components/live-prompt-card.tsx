import React from "react";
import { PromptDraft } from "@optiprompt/domain";

interface LivePromptCardProps {
  draft: PromptDraft | null;
  isAnalyzing?: boolean;
}

export const LivePromptCard: React.FC<LivePromptCardProps> = ({ draft, isAnalyzing }) => {
  if (!draft) {
    return (
      <div className="empty-state">
        <p>Start typing in an AI tool to see live analysis.</p>
        <style>{`
          .empty-state {
            padding: 2rem 1rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.875rem;
            border: 1px dashed var(--border);
            border-radius: 12px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="live-card">
      <div className="card-header">
        <span className="card-label">LIVE DRAFT</span>
        {isAnalyzing && <span className="analyzing-tag">Analyzing...</span>}
      </div>
      <div className="card-body">
        {draft.rawText || <span className="placeholder">Awaiting input...</span>}
      </div>
      
      <style>{`
        .live-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .card-label {
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--primary);
          text-transform: uppercase;
        }

        .analyzing-tag {
          font-size: 0.625rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .card-body {
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--text);
          max-height: 120px;
          overflow-y: auto;
          white-space: pre-wrap;
        }

        .placeholder {
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
