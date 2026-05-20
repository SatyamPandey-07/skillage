import { getCertsByAddress } from "@/src/lib/contract";
import { CertCard } from "@/src/components/learn/CertCard";
import { shortenAddress } from "@/src/utils/shortenAddress";
import { ShieldCheck, Award, GraduationCap } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ address: string }>;
}

export default async function VerifyPage({ params }: Props) {
  const { address } = await params;

  let certs: Awaited<ReturnType<typeof getCertsByAddress>> = [];
  let fetchError = false;

  if (/^0x[0-9a-fA-F]{40}$/.test(address)) {
    try {
      certs = await getCertsByAddress(address);
    } catch {
      fetchError = true;
    }
  }

  return (
    <div className="min-h-screen se-grid" style={{ background: "#0a0a0f" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/8"
        style={{ background: "rgba(12,12,18,0.9)", backdropFilter: "blur(16px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap size={20} className="text-indigo-400" />
          <span className="font-semibold text-white tracking-tight">SkillChain</span>
        </Link>
        <Link
          href="/"
          className="px-4 py-1.5 rounded-[8px] text-sm font-semibold text-white"
          style={{ background: "rgb(99,102,241)" }}
        >
          Start learning
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Certificates for{" "}
              <span style={{ fontFamily: "var(--font-mono)" }}>
                {shortenAddress(address, 6)}
              </span>
            </h1>
            {certs.length > 0 && (
              <span
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "#34d399",
                }}
              >
                <ShieldCheck size={11} />
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-white/35">
            Verified onchain · Base Sepolia · SkillChain
          </p>
        </div>

        {fetchError && (
          <div
            className="p-4 rounded-[8px] border mb-6"
            role="alert"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
          >
            <p className="text-sm text-red-400">Failed to load certificates. Check the address and try again.</p>
          </div>
        )}

        {certs.length === 0 && !fetchError ? (
          <div
            className="flex flex-col items-center gap-4 py-20 rounded-[12px] border border-dashed border-white/10"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <Award size={36} className="text-white/15" />
            <div className="text-center">
              <p className="text-white/50 font-medium">No certificates found for this wallet</p>
              <p className="text-white/30 text-sm mt-1">
                <span style={{ fontFamily: "var(--font-mono)" }}>{shortenAddress(address)}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {certs.map((cert) => (
              <div key={cert.tokenId} className="max-w-sm">
                <CertCard
                  cert={{ ...cert, learner: address }}
                  showShareLink
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
