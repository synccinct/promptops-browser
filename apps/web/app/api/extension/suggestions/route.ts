import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = {
    id: crypto.randomUUID(),
    sessionId: body.sessionId,
    promptDraftId: body.draftId,
    status: "ready",
    scores: {
      clarity: 0.74,
      specificity: 0.62,
      completeness: 0.58,
      modelFit: 0.80,
    },
    cards: [
      {
        id: crypto.randomUUID(),
        kind: "context",
        title: "Add missing context",
        message: "Specify audience, output shape, and any non-negotiable constraints.",
        actionLabel: "Insert structure",
      },
      {
        id: crypto.randomUUID(),
        kind: "format",
        title: "Request a structured response",
        message: "Ask for bullets, JSON, or a fixed template to make outputs more reusable.",
        actionLabel: "Add format clause",
      },
    ],
    variants: [
      {
        id: crypto.randomUUID(),
        label: "Structured",
        strategy: "structured",
        promptText: `${body.promptText ?? ""}\n\nReturn the result as:\n- Objective\n- Constraints\n- Output\n- Edge cases`,
      },
      {
        id: crypto.randomUUID(),
        label: "Concise",
        strategy: "concise",
        promptText: `${body.promptText ?? ""}\n\nBe concise and explicit.`,
      },
    ],
    trace: [
      { nodeId: "constraintParse", reason: "Prompt changed", state: "updated" },
      { nodeId: "formatParse", reason: "No explicit output format detected", state: "updated" },
    ],
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
