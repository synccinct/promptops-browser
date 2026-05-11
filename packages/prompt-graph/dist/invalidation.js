"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidationEngine = void 0;
class InvalidationEngine {
    computeDirty(currentContext, previousContext) {
        return JSON.stringify(currentContext) !== JSON.stringify(previousContext);
    }
}
exports.InvalidationEngine = InvalidationEngine;
