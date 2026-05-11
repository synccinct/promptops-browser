export interface GraphNode<T = any> {
  id: string;
  dependencies: string[];
  compute: (inputs: Record<string, any>, context: any) => Promise<T>;
  isDirty: (inputs: Record<string, any>, previousState: any) => boolean;
}
