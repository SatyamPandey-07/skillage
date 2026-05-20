"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCertificates } from "@/src/hooks/useCertificates";
import { CertCard } from "@/src/components/learn/CertCard";
import { CertCardSkeleton } from "@/src/components/ui/Skeleton";
import { WalletHeader } from "@/src/components/ui/WalletHeader";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { GraduationCap, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import { shortenAddress } from "@/src/utils/shortenAddress";

export default function Dashboard() {
  const { authenticated, ready, login } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  const address = wallets[0]?.address ?? null;
  const { certs, loading, error } = useCertificates(address);

  if (!ready) return null;
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-center space-y-4">
          <GraduationCap size={40} className="mx-auto text-white/20" />
          <p className="text-white/60">Connect your wallet to view your certificates</p>
          <button
            onClick={login}
            className="px-6 py-2.5 rounded-[8px] text-sm font-semibold text-white"
            style={{ background: "rgb(99,102,241)" }}
          >
            Connect
          </button>
        </div>
      </div>
    );
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
        <WalletHeader />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Your Certificates</h1>
            {address && (
              <p className="text-sm text-white/35 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                {shortenAddress(address, 6)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}
              >
                {certs.length} cert{certs.length !== 1 ? "s" : ""}
              </span>
            )}
            <Link
              href={`/verify/${address}`}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-[8px] border border-white/10"
            >
              <ExternalLink size={12} />
              Public page
            </Link>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CertCardSkeleton key={i} />)}
          </div>
        ) : certs.length === 0 ? (
          <div
            className="flex flex-col items-center gap-4 py-20 rounded-[12px] border border-dashed border-white/10"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <Award size={36} className="text-white/15" />
            <div className="text-center">
              <p className="text-white/50 font-medium">No certificates yet</p>
              <p className="text-white/30 text-sm mt-1">Complete a quiz with ≥80% to earn your first</p>
            </div>
            <Link
              href="/"
              className="px-5 py-2 rounded-[8px] text-sm font-semibold text-white mt-2"
              style={{ background: "rgb(99,102,241)" }}
            >
              Start your first lesson →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <CertCard key={cert.tokenId ?? i} cert={cert} showShareLink />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
