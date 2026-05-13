import { NextResponse } from "next/server";
import { RecordDraftRequestSchema } from "@optiprompt/schemas";
import { recordDraft } from "../../../../../server/services/session-service";
import { withExtensionAuth } from "../../../../../lib/auth/with-extension-auth";

export const POST = withExtensionAuth(async (req, { params, auth }) => {
  try {
    const { sessionId } = params;
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const body = await req.json();
    const validated = RecordDraftRequestSchema.parse(body);

    const draft = await recordDraft({
      draftId: validated.draftId,
      sessionId: sessionId,
      rawText: validated.rawText,
      normalizedText: validated.normalizedText,
    });

    return NextResponse.json({ draft });
  } catch (error) {
    console.error(`[API] Drafts Error (Session: ${params.sessionId}):`, error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
});
