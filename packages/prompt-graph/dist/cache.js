"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphCache = void 0;
class GraphCache {
    store = new Map();
    get(key) {
        return this.store.get(key);
    }
    set(key, value) {
        this.store.set(key, value);
    }
    has(key) {
        return this.store.has(key);
    }
    clear() {
        this.store.clear();
    }
}
exports.GraphCache = GraphCache;
