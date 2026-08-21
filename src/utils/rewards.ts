export function calculateQuizStars(score: number, total: number): number {
  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0 || score < 0) return 0;

  const ratio = Math.min(score, total) / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

export function sumBestStars(starsByLesson: Readonly<Record<string, number>>): number {
  return Object.values(starsByLesson).reduce(
    (total, stars) => total + Math.min(3, Math.max(0, Math.floor(stars))),
    0,
  );
}

export function levelFromXp(xp: number): number { return Math.floor(Math.max(0, xp) / 100) + 1; }
export function xpIntoLevel(xp: number): number { return Math.max(0, xp) % 100; }
