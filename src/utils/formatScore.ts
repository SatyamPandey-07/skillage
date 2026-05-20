export function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function scoreColor(score: number): string {
  if (score >= 80) return "emerald";
  if (score >= 60) return "amber";
  return "red";
}
