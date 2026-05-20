"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { TopicInput } from "@/src/components/learn/TopicInput";
import { LessonCard } from "@/src/components/learn/LessonCard";
import { QuizForm } from "@/src/components/learn/QuizForm";
import { GradeResult } from "@/src/components/learn/GradeResult";
import { MintProgress } from "@/src/components/learn/MintProgress";
import { CertCard } from "@/src/components/learn/CertCard";
import { WalletHeader } from "@/src/components/ui/WalletHeader";
import { StepIndicator } from "@/src/components/ui/StepIndicator";
import { LessonSkeleton } from "@/src/components/ui/Skeleton";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { useLesson } from "@/src/hooks/useLesson";
import { useGrade } from "@/src/hooks/useGrade";
import { useMint } from "@/src/hooks/useMint";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

type AppState = "home" | "lesson" | "quiz" | "result" | "minting" | "done";

export default function Home() {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const [appState, setAppState] = useState<AppState>("home");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [mintedCert, setMintedCert] = useState<any>(null);

  const {
    lesson,
    loading: lessonLoading,
    error: lessonError,
    generateLesson,
    retryQuestions,
  } = useLesson();
  const { grade, loading: gradeLoading, error: gradeError, gradeAnswers } = useGrade();
  const { stage, txHash, error: mintError, mint, reset: resetMint } = useMint();

  const address = wallets[0]?.address;

  async function handleTopicSubmit(t: string, d: string) {
    setTopic(t);
    setDifficulty(d);
    setAppState("lesson");
    await generateLesson(t, d);
  }

  async function handleQuizSubmit(answers: { questionId: number; answer: string }[]) {
    if (!lesson) return;
    setAppState("result");
    await gradeAnswers({
      topic,
      difficulty,
      lessonSummary: lesson.summary,
      questions: lesson.questions,
      answers,
    });
  }

  async function handleMint() {
    if (!grade || !address) return;

    // Establish backend session for this Privy-authenticated wallet
    await fetch("/api/auth/privy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ address }),
    });

    setAppState("minting");
    const result = await mint({
      learnerAddress: address,
      topic,
      difficulty,
      score: grade.totalScore,
    });

    if (result?.txHash) {
      setMintedCert({
        topic,
        difficulty,
        score: grade.totalScore,
        txHash: result.txHash,
        learner: address,
      });
      setAppState("done");
    }
  }

  // Mint completion handled inside handleMint via useEffect below

  async function handleRetry() {
    await retryQuestions(topic, difficulty);
    setAppState("quiz");
  }

  function startNew() {
    setAppState("home");
    setTopic("");
    setDifficulty("Beginner");
    setMintedCert(null);
    resetMint();
  }

  const STEP_LABELS = ["Lesson", "Quiz", "Result"];
  const currentStep = (
    { lesson: 1, quiz: 2, result: 3, minting: 3, done: 3 } as Record<string, number>
  )[appState] ?? 1;

  return (
    <div className="min-h-screen se-grid relative" style={{ background: "#0a0a0f" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/8"
        style={{ background: "rgba(12,12,18,0.9)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-indigo-400" />
          <span className="font-semibold text-white tracking-tight">SkillChain</span>
        </div>

        {appState !== "home" && (
          <StepIndicator current={currentStep} total={3} labels={STEP_LABELS} />
        )}

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Dashboard
          </Link>
          {authenticated ? (
            <WalletHeader />
          ) : (
            <button
              onClick={login}
              className="px-4 py-1.5 rounded-[8px] text-sm font-semibold text-white transition-all"
              style={{ background: "rgb(99,102,241)" }}
            >
              Connect
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* Home */}
          {appState === "home" && (
            <>
              <div className="text-center space-y-3 mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  Learn anything.{" "}
                  <span style={{ color: "#818cf8" }}>Prove it onchain.</span>
                </h1>
                <p className="text-white/50 text-lg max-w-md mx-auto">
                  AI lesson → quiz → soulbound certificate. No ETH needed.
                </p>
              </div>
              <TopicInput onSubmit={handleTopicSubmit} loading={lessonLoading} />
              {lessonError && (
                <ErrorBanner message={lessonError} onRetry={() => handleTopicSubmit(topic, difficulty)} />
              )}
            </>
          )}

          {/* Lesson view */}
          {appState === "lesson" && (
            <>
              {lessonLoading ? (
                <LessonSkeleton />
              ) : lesson ? (
                <>
                  <LessonCard lesson={lesson} />
                  <button
                    onClick={() => setAppState("quiz")}
                    className="w-full py-3 rounded-[8px] text-sm font-semibold text-white transition-all"
                    style={{ background: "rgb(99,102,241)" }}
                  >
                    I'm ready to take the quiz →
                  </button>
                </>
              ) : null}
            </>
          )}

          {/* Quiz */}
          {appState === "quiz" && lesson && (
            <QuizForm
              questions={lesson.questions}
              onSubmit={handleQuizSubmit}
              loading={gradeLoading}
            />
          )}

          {/* Result */}
          {appState === "result" && (
            <>
              {gradeLoading && (
                <div className="flex flex-col items-center gap-3 py-16">
                  <div
                    className="w-6 h-6 rounded-full border-2"
                    style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#6366f1", animation: "spin 1s linear infinite" }}
                    role="status"
                    aria-label="Grading answers"
                  />
                  <p className="text-sm text-white/50">Claude is reviewing your answers…</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}
              {gradeError && <ErrorBanner message={gradeError} />}
              {grade && !gradeLoading && (
                <GradeResult
                  grade={grade}
                  onMint={handleMint}
                  onRetry={handleRetry}
                />
              )}
            </>
          )}

          {/* Minting */}
          {appState === "minting" && stage && (
            <MintProgress
              stage={stage}
              txHash={txHash ?? undefined}
              error={mintError ?? undefined}
              onNewLesson={stage === "confirmed" ? startNew : undefined}
            />
          )}

          {/* Done */}
          {appState === "done" && mintedCert && (
            <div className="space-y-6">
              <MintProgress
                stage="confirmed"
                txHash={mintedCert.txHash}
                onNewLesson={startNew}
              />
              <CertCard cert={mintedCert} showShareLink />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
