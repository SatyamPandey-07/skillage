"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet, ExternalLink, LogOut } from "lucide-react";
import { shortenAddress } from "@/src/utils/shortenAddress";
import Link from "next/link";

export function WalletHeader() {
  const { authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();

  const address = wallets[0]?.address ?? user?.wallet?.address;

  if (!authenticated || !address) return null;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border transition-all duration-300"
        style={{ 
          background: "rgba(6, 182, 212, 0.06)", 
          borderColor: "rgba(6, 182, 212, 0.2)",
          boxShadow: "0 0 15px rgba(6, 182, 212, 0.05)"
        }}
      >
        <Wallet size={14} className="text-cyan-400 animate-pulse" />
        <span
          className="text-xs font-semibold text-cyan-200 tracking-wide"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {shortenAddress(address)}
        </span>
      </div>
      <Link
        href={`https://sepolia.basescan.org/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-[8px] border transition-all duration-300 text-white/40 hover:text-cyan-400 hover:scale-105"
        style={{ 
          background: "rgba(255,255,255,0.03)", 
          borderColor: "rgba(255,255,255,0.06)" 
        }}
        aria-label="View on BaseScan"
      >
        <ExternalLink size={14} />
      </Link>
      <button
        onClick={logout}
        className="p-1.5 rounded-[8px] border transition-all duration-300 text-white/40 hover:text-red-400 hover:scale-105"
        style={{ 
          background: "rgba(255,255,255,0.03)", 
          borderColor: "rgba(255,255,255,0.06)" 
        }}
        aria-label="Sign out"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
