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
import { GraduationCap, LogOut, LogIn, Sparkles } from "lucide-react";
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
  const { authenticated, login } = usePrivy();
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

  const [selectedTopic, setSelectedTopic] = useState(prefillTopic);

  useEffect(() => {
    if (prefillTopic) {
      setSelectedTopic(prefillTopic);
    }
  }, [prefillTopic]);

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
    setSelectedTopic("");
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
    <div className="min-h-screen se-grid relative pt-14 overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Glow overlay */}
      <div className="pointer-events-none absolute inset-0 se-hero-bg" style={{ opacity: 0.7 }} />

      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-40 flex items-center justify-between px-4 h-14 border-b transition-all duration-300"
        style={{ 
          background: "rgba(5, 5, 8, 0.8)", 
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255, 255, 255, 0.05)"
        }}
      >
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-cyan-400 animate-pulse" />
          <span className="font-semibold text-white tracking-tight">SkillChain</span>
        </div>

        {appState !== "home" && (
          <StepIndicator current={currentStep} total={3} labels={STEP_LABELS} />
        )}

        <div className="flex items-center gap-3">
          <Link href="/course" className="text-xs text-white/40 hover:text-cyan-400 transition-colors">
            Courses
          </Link>
          <Link href="/dashboard" className="text-xs text-white/40 hover:text-cyan-400 transition-colors">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all duration-300"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              }}
            >
              <LogIn size={13} />
              Sign in
            </button>
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

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className={`w-full ${appState === "home" ? "max-w-5xl" : "max-w-2xl"} space-y-6 transition-all duration-500`}>
          {/* Home */}
          {appState === "home" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full py-6">
              {/* Left Column: Title + Subtitle + Input */}
              <div className="md:col-span-6 space-y-6 text-left">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                  style={{
                    background: "rgba(6, 182, 212, 0.08)",
                    border: "1px solid rgba(6, 182, 212, 0.2)",
                    color: "#a5f3fc",
                  }}
                >
                  <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                  Next-Gen Onchain Credentials
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                    Learn anything.<br />
                    <span className="se-glow-text-brand">Prove it onchain.</span>
                  </h1>
                  <p className="text-white/50 text-base max-w-lg">
                    Instantly generate personalized interactive lessons on any topic, complete comprehensive Claude-graded quizzes, and mint official gasless soulbound NFT certificates.
                  </p>
                </div>
                
                <div className="pt-2">
                  <TopicInput
                    onSubmit={handleTopicSubmit}
                    loading={lessonLoading}
                    defaultTopic={selectedTopic}
                    defaultDifficulty={prefillDifficulty}
                    defaultNumQuestions={prefillNumQ}
                  />
                </div>

                {/* Popular suggestions */}
                <div className="space-y-2.5 pt-2 animate-fade-in animate-delay-150">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono font-semibold">Popular Hot Topics:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Zero Knowledge Proofs 🌌", topic: "Zero Knowledge Proofs" },
                      { label: "Solidity Smart Contracts 📝", topic: "Solidity Smart Contracts" },
                      { label: "DeFi Liquidity Pools 💸", topic: "DeFi Liquidity Pools" },
                      { label: "AI Agents on Web3 🤖", topic: "AI Agents on Web3" },
                      { label: "Layer 2 Scaling ⚡", topic: "Layer 2 Scaling" },
                    ].map((item) => (
                      <button
                        key={item.topic}
                        onClick={() => setSelectedTopic(item.topic)}
                        className="px-3.5 py-1.5 rounded-full text-xs bg-white/[0.03] border border-white/5 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] active:scale-95 transition-all duration-300 cursor-pointer font-medium"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {lessonError && (
                  <ErrorBanner
                    message={lessonError}
                    onRetry={() => handleTopicSubmit(topic, difficulty, numQuestions)}
                  />
                )}
              </div>

              {/* Right Column: Breathtaking Illustration */}
              <div className="md:col-span-6 flex justify-center relative">
                <div className="relative group w-full max-w-md">
                  {/* Rotating neon background glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  
                  {/* Main card wrapper */}
                  <div className="relative se-card overflow-hidden rounded-2xl border border-white/5 p-2 bg-black/45 backdrop-blur-2xl">
                    <img 
                      src="/blockchain_hero.png" 
                      alt="Blockchain illustration" 
                      className="w-full h-auto rounded-xl object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-102"
                    />
                    
                    {/* Floating HUD status */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Network: Active</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono font-semibold">Base Sepolia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
