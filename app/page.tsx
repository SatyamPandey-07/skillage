"use client";

import { useState, useEffect, Suspense } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { TopicInput } from "@/src/components/learn/TopicInput";
import { LessonCard } from "@/src/components/learn/LessonCard";
import { QuizForm, type McqAnswer } from "@/src/components/learn/QuizForm";
import { GradeResult, type McqGradeData } from "@/src/components/learn/GradeResult";
import { MintProgress } from "@/src/components/learn/MintProgress";
import { CertCard } from "@/src/components/learn/CertCard";
import { WalletHeader } from "@/src/components/ui/WalletHeader";
import { StepIndicator } from "@/src/components/ui/StepIndicator";
import { LessonSkeleton } from "@/src/components/ui/Skeleton";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { useLesson, type McqQuestion } from "@/src/hooks/useLesson";
import { useMint } from "@/src/hooks/useMint";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { GraduationCap, LogOut, LogIn } from "lucide-react";
import Link from "next/link";

type AppState = "home" | "lesson" | "quiz" | "result" | "minting" | "done";

function computeGrade(questions: McqQuestion[], answers: McqAnswer[]): McqGradeData {
  const results = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    const selectedIndex = answer?.selectedIndex ?? -1;
    const correct = selectedIndex === q.correctIndex;
    return {
      questionId: q.id,
      question: q.question,
      options: [...q.options],
      selectedIndex,
      correctIndex: q.correctIndex,
      correct,
    };
  });
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const totalScore = Math.round((correct / total) * 100);
  return { results, correct, total, totalScore, passed: totalScore >= 80 };
}

function HomeContent() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { user, signInWithGoogle, signOut } = useAuth();
  const searchParams = useSearchParams();

  const [appState, setAppState] = useState<AppState>("home");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [grade, setGrade] = useState<McqGradeData | null>(null);
  const [mintedCert, setMintedCert] = useState<any>(null);
  const [savingQuiz, setSavingQuiz] = useState(false);

  const {
    lesson,
    loading: lessonLoading,
    error: lessonError,
    generateLesson,
    retryQuestions,
  } = useLesson();
  const { stage, txHash, error: mintError, mint, reset: resetMint } = useMint();

  const address = wallets[0]?.address;

  // Pre-fill from URL params (for reattempt from dashboard)
  const prefillTopic = searchParams.get("topic") ?? "";
  const prefillDifficulty = (searchParams.get("difficulty") ?? "Easy") as "Easy" | "Medium" | "Hard";
  const prefillNumQ = Number(searchParams.get("numQuestions") ?? 5);

  async function handleTopicSubmit(t: string, d: string, n: number) {
    setTopic(t);
    setDifficulty(d);
    setNumQuestions(n);
    setGrade(null);
    setAppState("lesson");
    await generateLesson(t, d, n);
  }

  async function handleQuizSubmit(answers: McqAnswer[]) {
    if (!lesson) return;
    const gradeResult = computeGrade(lesson.questions, answers);
    setGrade(gradeResult);
    setAppState("result");

    // Save attempt to Supabase (only if signed in)
    if (user) {
      setSavingQuiz(true);
      try {
        await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          topic,
          difficulty,
          num_questions: lesson.questions.length,
          score: gradeResult.totalScore,
          passed: gradeResult.passed,
          questions: lesson.questions,
          user_answers: answers,
        });
      } catch {
        // non-fatal
      } finally {
        setSavingQuiz(false);
      }
    }
  }

  async function handleMint() {
    if (!grade || !address) return;

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
      setMintedCert({ topic, difficulty, score: grade.totalScore, txHash: result.txHash, learner: address });
      setAppState("done");
    }
  }

  async function handleRetry() {
    await retryQuestions(topic, difficulty, numQuestions);
    setAppState("quiz");
  }

  function startNew() {
    setAppState("home");
    setTopic("");
    setDifficulty("Easy");
    setNumQuestions(5);
    setGrade(null);
    setMintedCert(null);
    resetMint();
  }

  const STEP_LABELS = ["Lesson", "Quiz", "Result"];
  const currentStep =
    ({ lesson: 1, quiz: 2, result: 3, minting: 3, done: 3 } as Record<string, number>)[appState] ?? 1;

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
          <Link href="/course" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Courses
          </Link>
          <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Dashboard
          </Link>

          {/* Supabase Google auth */}
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
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
              }}
            >
              <LogIn size={13} />
              Sign in
            </button>
          )}

          {/* Privy wallet (for minting) */}
          {authenticated && <WalletHeader />}
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
                  AI lesson → MCQ quiz → soulbound certificate. No ETH needed.
                </p>
              </div>
              <TopicInput
                onSubmit={handleTopicSubmit}
                loading={lessonLoading}
                defaultTopic={prefillTopic}
                defaultDifficulty={prefillDifficulty}
                defaultNumQuestions={prefillNumQ}
              />
              {lessonError && (
                <ErrorBanner
                  message={lessonError}
                  onRetry={() => handleTopicSubmit(topic, difficulty, numQuestions)}
                />
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
                    I&apos;m ready — take the quiz →
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
              loading={savingQuiz}
            />
          )}

          {/* Result */}
          {appState === "result" && grade && (
            <GradeResult grade={grade} onMint={handleMint} onRetry={handleRetry} />
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
              <MintProgress stage="confirmed" txHash={mintedCert.txHash} onNewLesson={startNew} />
              <CertCard cert={mintedCert} showShareLink />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
