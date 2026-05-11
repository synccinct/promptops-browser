"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
class Scheduler {
    schedule(nodes) {
        // Very simple topological sort/execution plan. For now just run sequentially or parallel based on no deps.
        // Assuming sequential for MVP.
        return [nodes];
    }
}
exports.Scheduler = Scheduler;
