interface KeyPoint {
  point: string;
}

interface LessonData {
  title: string;
  summary: string;
  keyPoints: string[];
  funFact: string;
}

export function LessonCard({ lesson }: { lesson: LessonData }) {
  return (
    <div className="se-card overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="se-label mb-2">AI-generated lesson</div>
        <h2 className="text-xl font-semibold text-white tracking-tight">{lesson.title}</h2>
        <p className="mt-3 text-sm text-white/65 leading-relaxed">{lesson.summary}</p>
      </div>

      {/* Key points — indigo left border */}
      <div className="px-6 pb-4">
        <div className="se-label mb-3">Key points</div>
        <ul className="space-y-2">
          {lesson.keyPoints.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-3 pl-3 py-1"
              style={{ borderLeft: "2px solid rgba(99,102,241,0.5)" }}
            >
              <span className="text-sm text-white/75 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fun fact — amber strip */}
      <div
        className="mx-4 mb-4 px-4 py-3 rounded-[8px]"
        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <span className="text-xs font-medium text-amber-400/80 uppercase tracking-widest">Fun fact</span>
        <p className="mt-1 text-sm text-amber-100/70 leading-relaxed">{lesson.funFact}</p>
      </div>
    </div>
  );
}
