import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions } from "../../../../server/services/suggestions-service";
import { SuggestionsRequestSchema } from "@optiprompt/schemas";
import { getSession } from "../../../../lib/auth/get-session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate request
    const validated = SuggestionsRequestSchema.parse(body);

    // In a real app, resolve userId and workspaceId from auth session
    const userId = session.user.id;
    const workspaceId = validated.workspaceId || "test-workspace";

    // Generate suggestions
    const envelope = await generateSuggestions({
      ...validated,
      userId,
      workspaceId,
      promptText: validated.promptText,
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
