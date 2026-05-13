import { NextResponse } from "next/server";
import { ExtensionRecordDraftSchema } from "@optiprompt/schemas";
import { recordDraft } from "../../../../server/services/session-service";
import { withExtensionAuth } from "../../../../lib/auth/with-extension-auth";

export const POST = withExtensionAuth(async (req, { auth }) => {
  try {
    const body = await req.json();
    const validated = ExtensionRecordDraftSchema.parse(body);

    const draft = await recordDraft({
      draftId: validated.draftId,
      sessionId: validated.sessionId,
      rawText: validated.rawText,
      normalizedText: validated.normalizedText,
    });

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("[API] Extension Draft Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
});

