import { NextRequest } from "next/server";
import { SiweMessage } from "siwe";
import { getSession } from "@/src/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();
    const session = await getSession();

    if (!session.nonce) {
      return Response.json({ error: "No nonce found. Request a new nonce." }, { status: 422 });
    }

    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    });

    if (!result.success) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    session.walletAddress = result.data.address;
    session.authMethod = "siwe";
    session.nonce = undefined;
    await session.save();

    return Response.json({ success: true, address: result.data.address });
  } catch (err) {
    console.error("[/api/auth/siwe]", err);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return Response.json({ success: true });
}
