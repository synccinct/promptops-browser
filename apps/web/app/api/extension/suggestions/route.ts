import { NextResponse } from "next/server";
import { generateSuggestions } from "../../../../server/services/suggestions-service";
import { SuggestionsRequestSchema } from "@optiprompt/schemas";
import { withExtensionAuth } from "../../../../lib/auth/with-extension-auth";

export const POST = withExtensionAuth(async (req, { auth }) => {
  try {
    const body = await req.json();
    
    // Validate request
    const validated = SuggestionsRequestSchema.parse(body);

    // Generate suggestions
    const envelope = await generateSuggestions({
      ...validated,
      userId: auth.user.id,
      workspaceId: auth.workspaceId,
    });

    return NextResponse.json(envelope);
  } catch (error) {
    console.error("[API] Suggestions Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
});
