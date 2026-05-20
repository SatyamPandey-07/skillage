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
        className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-white/10"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <Wallet size={14} className="text-white/50" />
        <span
          className="text-sm text-white/60"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {shortenAddress(address)}
        </span>
      </div>
      <Link
        href={`https://sepolia.basescan.org/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-[8px] border border-white/10 text-white/40 hover:text-white/70 transition-colors"
        style={{ background: "rgba(255,255,255,0.04)" }}
        aria-label="View on BaseScan"
      >
        <ExternalLink size={14} />
      </Link>
      <button
        onClick={logout}
        className="p-1.5 rounded-[8px] border border-white/10 text-white/40 hover:text-red-400 transition-colors"
        style={{ background: "rgba(255,255,255,0.04)" }}
        aria-label="Sign out"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
