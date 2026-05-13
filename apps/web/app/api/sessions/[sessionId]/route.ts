import { NextResponse } from "next/server";
import { getSession } from "../../../../server/services/session-service";
import { withExtensionAuth } from "../../../../lib/auth/with-extension-auth";

export const GET = withExtensionAuth(async (req, { params, auth }) => {
  try {
    const { sessionId } = params;
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Tenant validation: Ensure the session belongs to the user or workspace
    if (session.user_id !== auth.user.id) {
       // In a real multi-tenant app, we'd also check workspace membership
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error(`[API] Session GET Error (${params.sessionId}):`, error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
});
