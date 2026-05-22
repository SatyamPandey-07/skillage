"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { useCertificates } from "@/src/hooks/useCertificates";
import { CertCard } from "@/src/components/learn/CertCard";
import { CertCardSkeleton } from "@/src/components/ui/Skeleton";
import { WalletHeader } from "@/src/components/ui/WalletHeader";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import {
  GraduationCap,
  Award,
  History,
  LogIn,
  LogOut,
  RefreshCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { shortenAddress } from "@/src/utils/shortenAddress";

interface QuizAttempt {
  id: string;
  topic: string;
  difficulty: string;
  num_questions: number;
  score: number;
  passed: boolean;
  created_at: string;
}

function ScoreBadge({ score, passed }: { score: number; passed: boolean }) {
  const color = passed
    ? { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "#34d399" }
    : score >= 60
    ? { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#fbbf24" }
    : { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#f87171" };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-semibold"
      style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
    >
      {passed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
      {score}%
    </span>
  );
}

export default function Dashboard() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { user, signInWithGoogle, signOut } = useAuth();

  const [tab, setTab] = useState<"history" | "certs">("history");
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);

  const address = wallets[0]?.address ?? null;
  const { certs, loading: certsLoading, error: certsError } = useCertificates(address);

  useEffect(() => {
    if (!user) return;
    setAttemptsLoading(true);
    setAttemptsError(null);
    supabase
      .from("quiz_attempts")
      .select("id, topic, difficulty, num_questions, score, passed, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setAttemptsError("Failed to load quiz history.");
        else setAttempts(data ?? []);
        setAttemptsLoading(false);
      });
  }, [user]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-7 h-7 rounded-full border border-white/10"
                />
              )}
              <span className="text-xs text-white/50 hidden sm:block">{user.email}</span>
              <button
                onClick={signOut}
                className="p-1.5 rounded-[8px] border border-white/10 text-white/40 hover:text-red-400 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)" }}
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : null}
          {authenticated && <WalletHeader />}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 p-1 rounded-[10px] w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => setTab("history")}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-all"
            style={
              tab === "history"
                ? { background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }
                : { color: "rgba(255,255,255,0.4)" }
            }
          >
            <History size={14} />
            Quiz History
          </button>
          <button
            onClick={() => setTab("certs")}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-all"
            style={
              tab === "certs"
                ? { background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }
                : { color: "rgba(255,255,255,0.4)" }
            }
          >
            <Award size={14} />
            Certificates
          </button>
        </div>

        {/* ── Quiz History tab ── */}
        {tab === "history" && (
          <>
            {!user ? (
              <div
                className="flex flex-col items-center gap-4 py-20 rounded-[12px] border border-dashed border-white/10"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <History size={36} className="text-white/15" />
                <div className="text-center">
                  <p className="text-white/50 font-medium">Sign in to see your quiz history</p>
                  <p className="text-white/30 text-sm mt-1">
                    Your attempts are saved when you&apos;re signed in with Google
                  </p>
                </div>
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-5 py-2 rounded-[8px] text-sm font-semibold text-white mt-2"
                  style={{ background: "rgb(99,102,241)" }}
                >
                  <LogIn size={14} />
                  Sign in with Google
                </button>
              </div>
            ) : attemptsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="se-skeleton rounded-[10px] h-20" />
                ))}
              </div>
            ) : attemptsError ? (
              <ErrorBanner message={attemptsError} />
            ) : attempts.length === 0 ? (
              <div
                className="flex flex-col items-center gap-4 py-20 rounded-[12px] border border-dashed border-white/10"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <History size={36} className="text-white/15" />
                <div className="text-center">
                  <p className="text-white/50 font-medium">No quizzes yet</p>
                  <p className="text-white/30 text-sm mt-1">Take your first quiz to see it here</p>
                </div>
                <Link
                  href="/"
                  className="px-5 py-2 rounded-[8px] text-sm font-semibold text-white mt-2"
                  style={{ background: "rgb(99,102,241)" }}
                >
                  Start a quiz →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="se-card px-5 py-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-medium text-white/85 truncate">{attempt.topic}</p>
                        <ScoreBadge score={attempt.score} passed={attempt.passed} />
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {attempt.difficulty} · {attempt.num_questions} questions · {formatDate(attempt.created_at)}
                      </p>
                    </div>
                    <Link
                      href={`/?topic=${encodeURIComponent(attempt.topic)}&difficulty=${encodeURIComponent(attempt.difficulty)}&numQuestions=${attempt.num_questions}`}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        color: "#a5b4fc",
                      }}
                    >
                      <RefreshCcw size={11} />
                      Reattempt
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Certificates tab ── */}
        {tab === "certs" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Soulbound Certificates</h2>
                {address && (
                  <p className="text-xs text-white/35 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                    {shortenAddress(address, 6)}
                  </p>
                )}
              </div>
              {!certsLoading && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#818cf8",
                  }}
                >
                  {certs.length} cert{certs.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {!authenticated ? (
              <div
                className="flex flex-col items-center gap-4 py-20 rounded-[12px] border border-dashed border-white/10"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <Award size={36} className="text-white/15" />
                <div className="text-center">
                  <p className="text-white/50 font-medium">Connect your wallet to view certificates</p>
                </div>
              </div>
            ) : certsError ? (
              <ErrorBanner message={certsError} />
            ) : certsLoading ? (
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
          </>
        )}
      </main>
    </div>
  );
}
