import { getSession } from "@/src/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    session.nonce = nonce;
    await session.save();
    return Response.json({ nonce });
  } catch (err) {
    console.error("[/api/auth/nonce]", err);
    return Response.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}
