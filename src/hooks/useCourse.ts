"use client";

import { useState, useCallback, useRef } from "react";
import type { CourseData, ModuleOutline, SubmoduleContent } from "@/src/types/course";

export function useCourse() {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [submoduleContents, setSubmoduleContents] = useState<Record<string, SubmoduleContent>>({});
  const [loadingSubmodule, setLoadingSubmodule] = useState<string | null>(null);

  const courseRef = useRef<CourseData | null>(null);
  const inflight = useRef<Set<string>>(new Set());
  const loaded = useRef<Set<string>>(new Set());

  const generateCourse = useCallback(async (topic: string, difficulty: string) => {
    setGenerating(true);
    setError(null);
    setCourse(null);
    setProgress({});
    setSubmoduleContents({});
    courseRef.current = null;
    inflight.current.clear();
    loaded.current.clear();

    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate course");
      courseRef.current = data;
      setCourse(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to generate course");
    } finally {
      setGenerating(false);
    }
  }, []);

  const loadSubmodule = useCallback((moduleId: string, submoduleId: string) => {
    const c = courseRef.current;
    if (!c) return;
    if (loaded.current.has(submoduleId) || inflight.current.has(submoduleId)) return;

    const mod = c.modules.find((m) => m.id === moduleId);
    const sub = mod?.submodules.find((s) => s.id === submoduleId);
    if (!mod || !sub) return;

    inflight.current.add(submoduleId);
    setLoadingSubmodule(submoduleId);

    fetch("/api/course/submodule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: c.topic,
        difficulty: c.difficulty,
        moduleTitle: mod.title,
        submoduleTitle: sub.title,
        submoduleDescription: sub.description,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        loaded.current.add(submoduleId);
        setSubmoduleContents((prev) => ({ ...prev, [submoduleId]: data }));
        setLoadingSubmodule((cur) => (cur === submoduleId ? null : cur));
      })
      .catch(() => {
        setLoadingSubmodule((cur) => (cur === submoduleId ? null : cur));
      })
      .finally(() => {
        inflight.current.delete(submoduleId);
      });
  }, []);

  const completeSubmodule = useCallback((submoduleId: string) => {
    setProgress((prev) => ({ ...prev, [submoduleId]: true }));
  }, []);

  const isModuleComplete = useCallback(
    (module: ModuleOutline): boolean => {
      return module.submodules.every((s) => progress[s.id]);
    },
    [progress]
  );

  return {
    course,
    generating,
    error,
    progress,
    submoduleContents,
    loadingSubmodule,
    generateCourse,
    loadSubmodule,
    completeSubmodule,
    isModuleComplete,
  };
}
