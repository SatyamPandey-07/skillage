import { getSession } from "@/src/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.walletAddress) {
      return Response.json({ authenticated: false });
    }
    return Response.json({
      authenticated: true,
      address: session.walletAddress,
      authMethod: session.authMethod,
    });
  } catch {
    return Response.json({ authenticated: false });
  }
}
