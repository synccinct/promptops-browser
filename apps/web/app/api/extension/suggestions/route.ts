import { NextRequest, NextResponse } from "next/server";
import { RequestSuggestionsPayloadSchema } from "@optiprompt/schemas";
import { generateSuggestions } from "../../../../server/services/suggestions-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Parse and validate request
    const parsed = RequestSuggestionsPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error }, { status: 400 });
    }

    // 2. Authenticate (Mocked for now)
    const userId = "mock-user-id";
    const workspaceId = parsed.data.workspaceId || "default-workspace";

    // 3. Call the core service
    const suggestionEnvelope = await generateSuggestions({
      ...parsed.data,
      userId,
      workspaceId,
    });

    // 4. Return the standard contract
    return NextResponse.json(suggestionEnvelope);
  } catch (error: any) {
    console.error("[Suggestions API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
