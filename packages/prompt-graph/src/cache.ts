export class GraphCache {
  private store: Map<string, any> = new Map();

  get(key: string) {
    return this.store.get(key);
  }

  set(key: string, value: any) {
    this.store.set(key, value);
  }

  has(key: string) {
    return this.store.has(key);
  }

  clear() {
    this.store.clear();
  }
}
