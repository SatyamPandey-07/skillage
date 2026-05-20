"use client";

import { useState } from "react";
import type { MintStage } from "@/src/components/learn/MintProgress";

interface MintParams {
  learnerAddress: string;
  topic: string;
  difficulty: string;
  score: number;
}

export function useMint() {
  const [stage, setStage] = useState<MintStage | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function mint(params: MintParams): Promise<{ txHash: string } | null> {
    setStage("quoting");
    setError(null);
    setTxHash(null);

    try {
      setStage("settling");

      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(params),
      });

      setStage("executing");
      const data = await res.json();

      if (!res.ok) {
        setStage("error");
        setError(data.error ?? "Mint failed");
        return null;
      }

      setTxHash(data.txHash);
      setStage("confirmed");
      return { txHash: data.txHash };
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "EXECUTION_ERROR");
      return null;
    }
  }

  function reset() {
    setStage(null);
    setTxHash(null);
    setError(null);
  }

  return { stage, txHash, error, mint, reset };
}
