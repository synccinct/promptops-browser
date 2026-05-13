import { NextResponse } from "next/server";
import { SyncSessionRequestSchema } from "@optiprompt/schemas";
import { syncSession } from "../../../../server/services/session-service";
import { withExtensionAuth } from "../../../../lib/auth/with-extension-auth";

export const POST = withExtensionAuth(async (req, { auth }) => {
  try {
    const body = await req.json();
    const validated = SyncSessionRequestSchema.parse(body);

    const session = await syncSession({
      sessionId: validated.sessionId,
      userId: auth.user.id,
      workspaceId: auth.workspaceId,
      sourceSite: validated.sourceSite,
      tabUrl: validated.tabUrl,
      conversationTitle: validated.conversationTitle || undefined,
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error("[API] Extension Sync Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
});
