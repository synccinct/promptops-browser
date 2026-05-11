export class InvalidationEngine {
  computeDirty(currentContext: any, previousContext: any): boolean {
    return JSON.stringify(currentContext) !== JSON.stringify(previousContext);
  }
}
