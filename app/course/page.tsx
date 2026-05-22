"use client";

import { useState, useEffect, useRef } from "react";
import { GraduationCap, Menu, X, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { CourseOutline } from "@/src/components/course/CourseOutline";
import { SubmoduleViewer } from "@/src/components/course/SubmoduleViewer";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { useCourse } from "@/src/hooks/useCourse";
import { usePrivy } from "@privy-io/react-auth";
import { WalletHeader } from "@/src/components/ui/WalletHeader";
import { useAuth } from "@/src/context/AuthContext";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

export default function CoursePage() {
  const {
    course,
    generating,
    error,
    progress,
    submoduleContents,
    submoduleErrors,
    loadingSubmodule,
    generateCourse,
    loadSubmodule,
    retrySubmodule,
    completeSubmodule,
    isModuleComplete,
  } = useCourse();

  const { authenticated, login } = usePrivy();
  const { user } = useAuth();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeSubmoduleId, setActiveSubmoduleId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // Auto-select first submodule when course loads
  useEffect(() => {
    if (!course?.modules?.[0]?.submodules?.[0]) return;
    const m = course.modules[0];
    const s = m.submodules[0];
    setActiveModuleId(m.id);
    setActiveSubmoduleId(s.id);
    loadSubmodule(m.id, s.id);
  }, [course]);

  // Scroll to top on submodule change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSubmoduleId]);

  async function handleSelectSubmodule(moduleId: string, submoduleId: string) {
    setActiveModuleId(moduleId);
    setActiveSubmoduleId(submoduleId);
    loadSubmodule(moduleId, submoduleId);
  }

  function handleComplete() {
    if (activeSubmoduleId) completeSubmodule(activeSubmoduleId);
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || generating) return;
    generateCourse(topic.trim(), difficulty);
  }

  const activeModule = course?.modules.find((m) => m.id === activeModuleId);
  const activeSubmodule = activeModule?.submodules.find((s) => s.id === activeSubmoduleId);
  const activeContent = activeSubmoduleId ? submoduleContents[activeSubmoduleId] : undefined;
  const activeError = activeSubmoduleId ? submoduleErrors[activeSubmoduleId] : undefined;
  const isLoadingContent = loadingSubmodule === activeSubmoduleId;

  /* ── Landing / input ── */
  if (!course && !generating) {
    return (
      <div className="min-h-screen se-grid relative pt-14 overflow-hidden" style={{ background: "var(--bg)" }}>
        <div
          className="pointer-events-none absolute inset-0 se-hero-bg"
          style={{ opacity: 0.7 }}
        />
        <header
          className="fixed top-0 left-0 right-0 w-full z-40 flex items-center justify-between px-4 h-14 border-b"
          style={{
            background: "rgba(5, 5, 8, 0.8)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-cyan-400 animate-pulse" />
            <span className="font-semibold text-white tracking-tight">Skillage</span>
          </div>
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

        <main className="flex flex-col items-center px-4 py-16 relative">
          <div className="w-full max-w-2xl space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(6, 182, 212, 0.08)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  color: "#a5f3fc",
                }}
              >
                <BookOpen size={12} className="text-cyan-400 animate-pulse" />
                Structured Course Mode
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Learn deeply.{" "}
                <span className="se-glow-text-brand">Step by step.</span>
              </h1>
              <p className="text-lg max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
                AI generates a full multi-module course — reading content, code examples, resources, and quizzes.
              </p>
            </div>

            {/* Input form */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What do you want to master?"
                  className="se-input text-lg px-5 py-4 pr-44"
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="appearance-none pl-3 pr-7 py-1.5 text-sm rounded-[8px] border text-white/70 cursor-pointer focus:outline-none focus:border-indigo-500"
                      style={{
                        background: "rgba(20,20,32,0.9)",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                    >
                      <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    disabled={!topic.trim() || generating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-semibold text-white transition-all disabled:opacity-40"
                    style={{ background: "rgb(99,102,241)" }}
                  >
                    <Sparkles size={14} />
                    Generate Course
                  </button>
                </div>
              </div>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                Generates 3–5 modules with reading, examples, and quizzes per submodule.
              </p>
            </form>

            {error && <ErrorBanner message={error} />}

            {/* Feature hints */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Modules", desc: "3–5 logical chapters" },
                { label: "Submodules", desc: "Deep-dive sub-topics" },
                { label: "Quizzes", desc: "4-question knowledge check" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="se-card px-4 py-3 text-center space-y-1"
                >
                  <p className="text-xs font-semibold text-white/70">{f.label}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── Generating spinner ── */
  if (generating) {
    return (
      <div
        className="min-h-screen se-grid flex items-center justify-center"
        style={{ background: "#0a0a0f" }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-10 h-10 rounded-full border-2 mx-auto"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              borderTopColor: "#6366f1",
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Building your course…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!course) return null;

  /* ── Course viewer ── */
  return (
    <div className="h-screen flex flex-col pt-14" style={{ background: "var(--bg)" }}>
      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-40 flex items-center justify-between px-4 h-14 border-b"
        style={{
          background: "rgba(5, 5, 8, 0.85)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="shrink-0 p-1.5 rounded-[6px] transition-all hover:text-cyan-400"
            style={{ color: "rgba(255,255,255,0.45)" }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <GraduationCap size={17} className="shrink-0 text-cyan-400 animate-pulse" />
          <span
            className="font-semibold tracking-tight text-sm truncate text-white"
          >
            {course.title}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
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
          <button
            onClick={() => {
              setActiveModuleId(null);
              setActiveSubmoduleId(null);
              generateCourse(course.topic, course.difficulty);
            }}
            className="text-xs transition-colors text-white/40 hover:text-cyan-400"
          >
            New Course
          </button>
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

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            className="w-68 shrink-0 overflow-y-auto border-r py-3"
            style={{
              width: "272px",
              background: "rgba(10,10,15,0.7)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <div className="px-4 mb-3">
              <p
                className="text-[11px] leading-relaxed line-clamp-3"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {course.description}
              </p>
            </div>
            <div
              className="mx-4 mb-3"
              style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
            />
            <CourseOutline
              course={course}
              activeSubmoduleId={activeSubmoduleId}
              progress={progress}
              isModuleComplete={isModuleComplete}
              onSelectSubmodule={handleSelectSubmodule}
            />
          </aside>
        )}

        {/* Main content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-10">
            {activeModule && activeSubmodule ? (
              <SubmoduleViewer
                module={activeModule}
                submodule={activeSubmodule}
                content={activeContent}
                loading={isLoadingContent}
                error={activeError}
                completed={progress[activeSubmoduleId!] ?? false}
                onComplete={handleComplete}
                onRetry={activeSubmoduleId && activeModuleId
                  ? () => retrySubmodule(activeModuleId, activeSubmoduleId)
                  : undefined}
              />
            ) : (
              <div
                className="text-center py-24 text-sm"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Select a submodule from the sidebar to begin.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
