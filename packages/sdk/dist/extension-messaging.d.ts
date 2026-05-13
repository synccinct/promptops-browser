import { ExtensionEvent } from "@optiprompt/domain";
export declare function sendMessage<TResponse = any>(message: ExtensionEvent): Promise<TResponse>;
export declare function sendTabMessage<TResponse = any>(tabId: number, message: ExtensionEvent): Promise<TResponse>;
