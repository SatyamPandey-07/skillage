"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import type { CourseData, ModuleOutline } from "@/src/types/course";

interface CourseOutlineProps {
  course: CourseData;
  activeSubmoduleId: string | null;
  progress: Record<string, boolean>;
  isModuleComplete: (module: ModuleOutline) => boolean;
  onSelectSubmodule: (moduleId: string, submoduleId: string) => void;
}

export function CourseOutline({
  course,
  activeSubmoduleId,
  progress,
  isModuleComplete,
  onSelectSubmodule,
}: CourseOutlineProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(course.modules.map((m, i) => [m.id, i === 0]))
  );

  const totalSubs = course.modules.reduce((acc, m) => acc + m.submodules.length, 0);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const pct = totalSubs ? Math.round((completedCount / totalSubs) * 100) : 0;

  return (
    <nav className="space-y-0.5">
      {/* Overall progress */}
      <div className="px-3 py-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="se-label">Progress</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            {completedCount}/{totalSubs} · {pct}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }}
          />
        </div>
      </div>

      {/* Modules */}
      {course.modules.map((module, mIdx) => {
        const isOpen = expanded[module.id];
        const moduleComplete = isModuleComplete(module);

        return (
          <div key={module.id}>
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [module.id]: !prev[module.id] }))}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-left transition-colors hover:bg-white/[0.04]"
            >
              {moduleComplete ? (
                <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
              ) : (
                <span
                  className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "#818cf8",
                  }}
                >
                  {mIdx + 1}
                </span>
              )}
              <span
                className="flex-1 text-xs font-medium leading-tight"
                style={{ color: moduleComplete ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.75)" }}
              >
                {module.title}
              </span>
              {isOpen ? (
                <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
              ) : (
                <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
              )}
            </button>

            {isOpen && (
              <div
                className="ml-5 pl-3 mt-0.5 mb-1 space-y-0.5"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
              >
                {module.submodules.map((sub) => {
                  const isActive = activeSubmoduleId === sub.id;
                  const isComplete = progress[sub.id];

                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSubmodule(module.id, sub.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-left transition-all"
                      style={{
                        background: isActive ? "rgba(99,102,241,0.1)" : "transparent",
                        border: `1px solid ${isActive ? "rgba(99,102,241,0.22)" : "transparent"}`,
                      }}
                    >
                      {isComplete ? (
                        <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
                      ) : (
                        <Circle
                          size={12}
                          className="shrink-0"
                          style={{ color: isActive ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.18)" }}
                        />
                      )}
                      <span
                        className="text-xs leading-tight"
                        style={{
                          color: isActive
                            ? "#a5b4fc"
                            : isComplete
                            ? "rgba(255,255,255,0.45)"
                            : "rgba(255,255,255,0.52)",
                        }}
                      >
                        {sub.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
