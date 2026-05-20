"use client";

import { ExternalLink, Code2, BookOpen, FileText, GitBranch, Video } from "lucide-react";
import { QuizSlider } from "./QuizSlider";
import type { SubmoduleContent, SubmoduleOutline, ModuleOutline } from "@/src/types/course";

function CodeBlock({
  language,
  code,
  explanation,
}: {
  language: string;
  code: string;
  explanation: string;
}) {
  return (
    <div
      className="rounded-[10px] overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <Code2 size={13} className="text-indigo-400" />
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
          {language}
        </span>
      </div>
      <pre
        className="px-5 py-4 overflow-x-auto text-sm leading-relaxed"
        style={{
          background: "rgba(0,0,0,0.7)",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        }}
      >
        <code style={{ color: "#86efac" }}>{code}</code>
      </pre>
      {explanation && (
        <div
          className="px-4 py-2.5"
          style={{
            background: "rgba(99,102,241,0.05)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

const resourceIcons: Record<string, React.ElementType> = {
  article: FileText,
  video: Video,
  docs: BookOpen,
  github: GitBranch,
};

interface SubmoduleViewerProps {
  module: ModuleOutline;
  submodule: SubmoduleOutline;
  content: SubmoduleContent | undefined;
  loading: boolean;
  completed: boolean;
  onComplete: () => void;
}

export function SubmoduleViewer({
  module,
  submodule,
  content,
  loading,
  completed,
  onComplete,
}: SubmoduleViewerProps) {
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="se-skeleton h-4 w-32 rounded" />
          <div className="se-skeleton h-8 w-2/3 rounded" />
          <div className="se-skeleton h-4 w-1/2 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="se-skeleton rounded-[10px]" style={{ height: `${80 + i * 12}px` }} />
        ))}
      </div>
    );
  }

  if (!content) return null;

  const paragraphs = content.content.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="se-label">{module.title}</p>
        <h2 className="text-2xl font-bold text-white tracking-tight">{submodule.title}</h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          {submodule.description}
        </p>
        {completed && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-1"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#6ee7b7",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            ✓ Completed
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Reading content */}
      <div className="space-y-5">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-sm leading-[1.85]"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Code snippets */}
      {content.codeSnippets.length > 0 && (
        <div className="space-y-4">
          <div className="se-label">Code Examples</div>
          {content.codeSnippets.map((snippet, i) => (
            <CodeBlock key={i} {...snippet} />
          ))}
        </div>
      )}

      {/* Resources */}
      {content.resources.length > 0 && (
        <div className="se-card p-5 space-y-4">
          <div className="se-label">Further Reading</div>
          <div className="space-y-3">
            {content.resources.map((r, i) => {
              const Icon = resourceIcons[r.type] ?? FileText;
              return (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    <Icon size={14} className="text-indigo-400" />
                  </div>
                  <span
                    className="text-sm flex-1 transition-colors group-hover:text-white/90"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {r.title}
                  </span>
                  <ExternalLink
                    size={12}
                    className="shrink-0 transition-colors group-hover:text-white/50"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz */}
      <div className="space-y-4">
        <div
          className="flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem" }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0)" }}
          />
          <span className="se-label">Knowledge Check</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0)" }} />
        </div>
        <QuizSlider questions={content.questions} onComplete={onComplete} />
      </div>
    </div>
  );
}
