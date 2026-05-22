"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { GraduationCap } from "lucide-react";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => router.push("/"));
    } else {
      router.push("/");
    }
  }, []);

  return null;
}

export default function AuthCallback() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#0a0a0f" }}
    >
      <GraduationCap size={32} className="text-indigo-400" />
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
        Signing you in…
      </p>
      <Suspense>
        <CallbackInner />
      </Suspense>
    </div>
  );
}
