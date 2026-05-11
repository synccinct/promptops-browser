import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LivePromptCard = ({ draft, isAnalyzing }) => {
    if (!draft) {
        return (_jsxs("div", { className: "empty-state", children: [_jsx("p", { children: "Start typing in an AI tool to see live analysis." }), _jsx("style", { children: `
          .empty-state {
            padding: 2rem 1rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.875rem;
            border: 1px dashed var(--border);
            border-radius: 12px;
          }
        ` })] }));
    }
    return (_jsxs("div", { className: "live-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("span", { className: "card-label", children: "LIVE DRAFT" }), isAnalyzing && _jsx("span", { className: "analyzing-tag", children: "Analyzing..." })] }), _jsx("div", { className: "card-body", children: draft.rawText || _jsx("span", { className: "placeholder", children: "Awaiting input..." }) }), _jsx("style", { children: `
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
      ` })] }));
};
