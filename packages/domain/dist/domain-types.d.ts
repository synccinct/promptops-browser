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
import type { PromptVariable, PromptStructure } from "@optiprompt/schemas";
export type { PromptVariable, PromptStructure };
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
    modelId: string | null;
    score: number | null;
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
    /** Extension-only: the Chrome tab ID associated with this session. Not persisted to DB. */
    tabId?: number;
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
export type { PromptPatch, SuggestionScores, SuggestionCard, PromptVariant, SuggestionTrace, SuggestionEnvelope } from "@optiprompt/schemas";
