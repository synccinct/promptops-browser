import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PanelShell = ({ children }) => {
    return (_jsxs("div", { className: "panel-container", children: [_jsxs("header", { className: "panel-header", children: [_jsxs("div", { className: "logo-container", children: [_jsx("div", { className: "logo-icon" }), _jsx("h1", { className: "logo-text", children: "OptiPrompt" })] }), _jsxs("div", { className: "status-badge", children: [_jsx("span", { className: "status-dot" }), "Live"] })] }), _jsx("main", { className: "panel-content", children: children }), _jsx("style", { children: `
        :root {
          --primary: #6366f1;
          --bg: #0f172a;
          --card: rgba(30, 41, 59, 0.7);
          --border: rgba(255, 255, 255, 0.1);
          --text: #f8fafc;
          --text-muted: #94a3b8;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          height: 100vh;
          overflow: hidden;
        }

        .panel-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          backdrop-filter: blur(20px);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border-radius: 6px;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
        }

        .logo-text {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.625rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      ` })] }));
};
