import { XCircle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 rounded-[8px] border"
      style={{
        background: "rgba(239,68,68,0.08)",
        borderColor: "rgba(239,68,68,0.2)",
      }}
    >
      <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-400">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-red-400/70 hover:text-red-400 underline transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
