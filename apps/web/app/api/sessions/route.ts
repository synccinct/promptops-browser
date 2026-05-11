import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth/get-session";
import { SyncSessionRequestSchema } from "@optiprompt/schemas";
import { syncSession } from "../../../server/services/session-service";

export async function POST(req: NextRequest) {
  try {
    const authSession = await getSession(req);
    if (!authSession || !authSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = SyncSessionRequestSchema.parse(body);

    const session = await syncSession({
      sessionId: validated.sessionId,
      userId: authSession.user.id,
      sourceSite: validated.sourceSite,
      tabUrl: validated.tabUrl,
      conversationTitle: validated.conversationTitle || undefined,
      workspaceId: validated.workspaceId,
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error("[API] Sessions Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
