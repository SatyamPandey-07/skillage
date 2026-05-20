interface StepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
}

export function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {labels.map((label, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${
                isDone
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : isActive
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                  : "bg-white/5 text-white/30 border border-white/10"
              }`}
            >
              {isDone ? "✓" : step}
            </div>
            <span
              className={`${
                isActive ? "text-white/80" : isDone ? "text-white/40" : "text-white/30"
              } ${step < total ? "hidden sm:inline" : ""}`}
            >
              {label}
            </span>
            {step < total && (
              <div
                className={`w-8 h-px ${isDone ? "bg-emerald-500/30" : "bg-white/10"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
