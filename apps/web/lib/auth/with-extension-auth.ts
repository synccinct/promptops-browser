import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./get-session";

export type ExtensionAuthContext = {
  user: { id: string };
  workspaceId: string;
};

export type AuthenticatedHandler = (
  req: NextRequest,
  context: { params: Record<string, string>; auth: ExtensionAuthContext }
) => Promise<NextResponse> | NextResponse;

export function withExtensionAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    const session = await getSession(req);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract workspaceId from headers or default to a test one for now
    // In Phase 5, this should be strictly validated against the user's memberships
    const workspaceId = req.headers.get("x-workspace-id") || "test-workspace";

    return handler(req, { 
      params, 
      auth: { 
        user: session.user as { id: string }, 
        workspaceId 
      } 
    });
  };
}
