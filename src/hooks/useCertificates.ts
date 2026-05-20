"use client";

import { useState, useEffect } from "react";
import type { CertData } from "@/src/components/learn/CertCard";

export function useCertificates(address: string | null) {
  const [certs, setCerts] = useState<CertData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(null);

    fetch(`/api/certs/${address}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCerts(data.certs ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [address]);

  return { certs, loading, error };
}
