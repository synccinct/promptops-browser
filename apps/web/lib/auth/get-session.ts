import { NextRequest } from "next/server";

export async function getSession(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  const token = authHeader.replace("Bearer ", "");
  if (!token || token.length < 5) {
    return null;
  }

  // Temporary mock user until full Supabase auth is integrated
  return {
    user: {
      id: "test-user"
    }
  };
}
