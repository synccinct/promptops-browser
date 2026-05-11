"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const react_1 = __importDefault(require("react"));
const Button = ({ children }) => (react_1.default.createElement("button", { style: { background: "#4F46E5", color: "white", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" } }, children));
exports.Button = Button;
