import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions } from "../../../../server/services/suggestions-service";
import { RequestSuggestionsSchema } from "@optiprompt/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request
    const validated = RequestSuggestionsSchema.parse(body);

    // In a real app, resolve userId and workspaceId from auth session
    const userId = "test-user";
    const workspaceId = validated.workspaceId || "test-workspace";

    // Generate suggestions
    const envelope = await generateSuggestions({
      ...validated,
      userId,
      workspaceId,
      promptText: (body as any).promptText, // Pass prompt text if available for the mock
    });

    return NextResponse.json(envelope);
  } catch (error) {
    console.error("[API] Suggestions Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
