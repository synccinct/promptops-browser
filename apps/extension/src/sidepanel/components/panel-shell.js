import { jsx as _jsx } from "react/jsx-runtime";
export const PanelShell = ({ children }) => {
    return (_jsx("div", { style: { padding: "16px", minHeight: "100vh", boxSizing: "border-box" }, children: children }));
};
