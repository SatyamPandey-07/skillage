import { NextRequest } from "next/server";
import { getSession } from "@/src/lib/session";

// Called by Privy-authenticated users to establish a backend session.
// We trust the wallet address since Privy handles auth on the frontend.
// For production you'd verify a Privy access token here.
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return Response.json({ error: "Invalid address" }, { status: 400 });
    }

    const session = await getSession();
    session.walletAddress = address;
    session.authMethod = "privy";
    await session.save();

    return Response.json({ success: true, address });
  } catch (err) {
    console.error("[/api/auth/privy]", err);
    return Response.json({ error: "Session creation failed" }, { status: 500 });
  }
}
