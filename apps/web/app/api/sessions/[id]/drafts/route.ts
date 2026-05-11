import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/get-session";
import { RecordDraftRequestSchema } from "@optiprompt/schemas";
import { recordDraft } from "../../../../../server/services/session-service";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authSession = await getSession(req);
    if (!authSession || !authSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;
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
    console.error(`[API] Drafts Error (Session: ${params.id}):`, error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
