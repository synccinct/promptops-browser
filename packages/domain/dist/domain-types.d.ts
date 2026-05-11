export type Role = "owner" | "admin" | "editor" | "viewer";
export type PromptAssetStatus = "draft" | "approved" | "deprecated";
export type PromptVersionSource = "extension" | "web" | "api";
export type SuggestionStatus = "pending" | "ready" | "failed";
export type SuggestionCardKind = "constraint" | "context" | "format" | "model-fit" | "risk";
export type VariantStrategy = "concise" | "structured" | "model-specific" | "safer";
export interface Workspace {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}
export interface Membership {
    id: string;
    workspaceId: string;
    userId: string;
    role: Role;
    createdAt: string;
}
export interface PromptVariable {
    name: string;
    required: boolean;
    defaultValue?: string;
}
export interface PromptStructure {
    intent?: string;
    audience?: string;
    constraints: string[];
    outputFormat?: string;
    examples: string[];
    variables: PromptVariable[];
}
export interface PromptAsset {
    id: string;
    workspaceId: string;
    name: string;
    slug: string;
    description: string | null;
    status: PromptAssetStatus;
    latestVersionId: string | null;
    tags: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export interface PromptVersion {
    id: string;
    promptAssetId: string;
    versionNumber: number;
    source: PromptVersionSource;
    rawText: string;
    normalizedText: string;
    structure: PromptStructure;
    modelProfile: string | null;
    summary: string | null;
    createdBy: string;
    createdAt: string;
}
export interface PromptSession {
    id: string;
    workspaceId: string | null;
    userId: string;
    sourceSite: string;
    tabUrl: string;
    conversationTitle: string | null;
    startedAt: string;
    lastSeenAt: string;
}
export interface PromptDraft {
    id: string;
    sessionId: string;
    rawText: string;
    normalizedText: string;
    createdAt: string;
}
export interface PromptPatch {
    replaceText?: string;
    insertions?: Array<{
        at: number;
        text: string;
    }>;
}
export interface SuggestionScores {
    clarity: number;
    specificity: number;
    completeness: number;
    modelFit: number;
}
export interface SuggestionCard {
    id: string;
    kind: SuggestionCardKind;
    title: string;
    message: string;
    actionLabel?: string;
    actionPatch?: PromptPatch;
}
export interface PromptVariant {
    id: string;
    label: string;
    strategy: VariantStrategy;
    promptText: string;
}
export interface SuggestionTrace {
    nodeId: string;
    reason: string;
    state: "cached" | "updated" | "pending" | "failed";
}
export interface SuggestionEnvelope {
    id: string;
    sessionId: string;
    promptDraftId: string;
    status: SuggestionStatus;
    scores: SuggestionScores;
    cards: SuggestionCard[];
    variants: PromptVariant[];
    trace: SuggestionTrace[];
    createdAt: string;
}
