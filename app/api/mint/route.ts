import { NextRequest } from "next/server";
import { ethers } from "ethers";
import { connectDB } from "@/src/lib/mongoose";
import { CertRecord } from "@/src/lib/models/CertRecord";
import { getBackendSigner } from "@/src/lib/contract";
import { getSession } from "@/src/lib/session";

const CONTRACT_ABI = [
  "function mintCertificate(address,string,string,uint8) returns (uint256)",
];

export async function POST(request: NextRequest) {
  try {
    // Session check
    const session = await getSession();
    if (!session.walletAddress) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { learnerAddress, topic, difficulty, score } = await request.json();

    // Server-side score verification
    if (!score || score < 80) {
      return Response.json({ error: "Score below passing threshold" }, { status: 400 });
    }

    if (!learnerAddress || !topic || !difficulty) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify learner matches session
    if (learnerAddress.toLowerCase() !== session.walletAddress.toLowerCase()) {
      return Response.json({ error: "Address mismatch" }, { status: 403 });
    }

    const backendWallet = getBackendSigner();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) throw new Error("CONTRACT_ADDRESS not set");

    // Encode the mint call
    const iface = new ethers.Interface(CONTRACT_ABI);
    const calldata = iface.encodeFunctionData("mintCertificate", [
      learnerAddress,
      topic,
      difficulty,
      score,
    ]);

    // Check if UGF SDK is available, otherwise send tx directly
    let txHash: string;

    try {
      // Try UGF gasless mint
      const { UGFClient } = await import("@tychilabs/ugf-testnet-js");
      const client = new UGFClient();

      await client.auth.login(backendWallet);

      const quote = await client.quote.get({
        payer_address: backendWallet.address,
        tx_object: JSON.stringify({
          from: backendWallet.address,
          to: contractAddress,
          data: calldata,
          value: "0",
        }),
      });

      await client.payment.x402.execute({ quote, signer: backendWallet });

      const result = await client.chains.evm.sponsorAndExecute(
        quote.digest,
        backendWallet,
        async () => ({
          to: contractAddress,
          data: calldata,
          value: 0n,
        })
      );

      txHash = result.userTxHash;
    } catch (ugfErr) {
      // Fallback: direct transaction (no gas sponsorship)
      console.warn("[mint] UGF failed, falling back to direct tx:", ugfErr);
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, backendWallet);
      const tx = await contract.mintCertificate(learnerAddress, topic, difficulty, score);
      const receipt = await tx.wait();
      txHash = receipt.hash;
    }

    // Save to MongoDB
    await connectDB();
    await CertRecord.create({
      learner: learnerAddress.toLowerCase(),
      topic,
      difficulty,
      score,
      txHash,
      mintedAt: new Date(),
    });

    return Response.json({
      txHash,
      explorerUrl: `https://sepolia.basescan.org/tx/${txHash}`,
    });
  } catch (err) {
    console.error("[/api/mint]", err);
    const message = err instanceof Error ? err.message : "Mint failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
