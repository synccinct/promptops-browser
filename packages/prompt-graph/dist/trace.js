"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracer = void 0;
class Tracer {
    traces = [];
    record(nodeId, reason, state) {
        this.traces.push({ nodeId, reason, state });
    }
    getTraces() {
        return this.traces;
    }
}
exports.Tracer = Tracer;
