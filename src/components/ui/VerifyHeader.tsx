"use client";

import { usePrivy } from "@privy-io/react-auth";
import { WalletHeader } from "@/src/components/ui/WalletHeader";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export function VerifyHeader() {
  const { authenticated, login } = usePrivy();
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-40 flex items-center justify-between px-4 h-14 border-b transition-all duration-300"
      style={{
        background: "rgba(5, 5, 8, 0.8)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <GraduationCap size={20} className="text-cyan-400 animate-pulse" />
        <span className="font-semibold text-white tracking-tight">Skillage</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xs transition-colors text-white/40 hover:text-cyan-400"
        >
          Quick Lesson
        </Link>
        {(user || authenticated) && (
          <Link
            href="/dashboard"
            className="text-xs transition-colors text-white/40 hover:text-cyan-400"
          >
            Dashboard
          </Link>
        )}
        
        {/* Privy wallet */}
        {authenticated ? (
          <WalletHeader />
        ) : (
          <button
            onClick={login}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all duration-300 border hover:scale-105"
            style={{
              background: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.25)",
              color: "#22d3ee",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
