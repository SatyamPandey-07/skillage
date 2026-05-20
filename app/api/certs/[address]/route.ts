import { NextRequest } from "next/server";
import { getCertsByAddress } from "@/src/lib/contract";
import { connectDB } from "@/src/lib/mongoose";
import { CertRecord } from "@/src/lib/models/CertRecord";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return Response.json({ error: "Invalid address" }, { status: 400 });
    }

    // Try MongoDB first (fast), then fall back to contract read
    try {
      await connectDB();
      const records = await CertRecord.find({ learner: address.toLowerCase() })
        .sort({ mintedAt: -1 })
        .lean();

      if (records.length > 0) {
        return Response.json({ certs: records });
      }
    } catch {
      // MongoDB unavailable, fall through to contract read
    }

    const certs = await getCertsByAddress(address);
    return Response.json({ certs });
  } catch (err) {
    console.error("[/api/certs]", err);
    return Response.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}
