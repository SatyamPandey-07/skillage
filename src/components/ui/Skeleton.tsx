export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`se-skeleton ${className}`} />;
}

export function LessonSkeleton() {
  return (
    <div className="se-card p-6 space-y-4">
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <div className="space-y-2 pt-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-[8px]" />
    </div>
  );
}

export function CertCardSkeleton() {
  return (
    <div className="se-card p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
