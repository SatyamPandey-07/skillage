"use client";

import { useEffect, useRef } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 140 }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      circle.style.strokeDashoffset = String(circumference * (1 - score / 100));
      return;
    }

    circle.style.strokeDashoffset = String(circumference);
    const targetOffset = circumference * (1 - score / 100);

    let start: number | null = null;
    const duration = 600;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      circle!.style.strokeDashoffset = String(
        circumference - eased * (circumference - targetOffset)
      );
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score, circumference]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`Score: ${score} out of 100`}
        role="img"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={8}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
           transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke 300ms" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`${size < 100 ? "text-sm font-bold" : "text-4xl font-bold"}`} style={{ color }}>
          {score}
        </span>
        {size >= 100 && <span className="text-xs text-white/40">/ 100</span>}
      </div>
    </div>
  );
}
