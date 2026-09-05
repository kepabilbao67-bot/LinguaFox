import type { CEFRLevel, Lesson, ProgressState } from '@/types/learning';

function getProgressKey(language: string, lessonId: string): string {
  return `${language}:${lessonId}`;
}

export interface CompetencyEvaluation {
  reading: number | null;
  listening: number | null;
  vocabulary: number | null;
  grammar: number | null;
  writing: number | null;
  speakingRecorded: number;
}

export interface LevelCompetencyInput {
  level: CEFRLevel;
  levelLessons: readonly Lesson[];
  progress: ProgressState;
}

/**
 * Calculates genuine CEFR competency percentages based strictly on specific evidence.
 * If there is not enough telemetry for a specific competency, returns null ("Sin datos suficientes").
 */
export function calculateLevelCompetencies(input: LevelCompetencyInput): CompetencyEvaluation {
  const { level, levelLessons, progress } = input;
  const totalLessons = levelLessons.length;

  if (totalLessons === 0) {
    return {
      reading: null,
      listening: null,
      vocabulary: null,
      grammar: null,
      writing: null,
      speakingRecorded: progress.spokenPhrasesCount ?? 0,
    };
  }

  // 1. Vocabulary (Learned words vs total words in level)
  const totalWords = levelLessons.reduce((acc, l) => acc + l.words.length, 0);
  const completedLessons = levelLessons.filter((l) =>
    progress.leccionesCompletadas?.includes(getProgressKey(l.language, l.id))
  );

  const learnedWords = completedLessons.reduce((acc, l) => acc + l.words.length, 0);
  const vocabulary = totalWords > 0 && completedLessons.length > 0
    ? Math.min(100, Math.round((learnedWords / totalWords) * 100))
    : null;

  // Real Competency Telemetry for this language & level
  const statsKey = `${progress.idiomaObjetivo}:${level}`;
  const levelStats = progress.competencyStats?.[statsKey];

  // 2. Reading (Direct real telemetry)
  let reading: number | null = null;
  if (levelStats?.reading && levelStats.reading.total > 0) {
    reading = Math.min(100, Math.round((levelStats.reading.correct / levelStats.reading.total) * 100));
  }

  // 3. Listening (Direct real telemetry ONLY - NO fallback to completedLessons / totalLessons)
  let listening: number | null = null;
  if (levelStats?.listening && levelStats.listening.total > 0) {
    listening = Math.min(100, Math.round((levelStats.listening.correct / levelStats.listening.total) * 100));
  }

  // 4. Grammar (Direct real telemetry ONLY - NO assuming fixed quiz denominator)
  let grammar: number | null = null;
  if (levelStats?.grammar && levelStats.grammar.total > 0) {
    grammar = Math.min(100, Math.round((levelStats.grammar.correct / levelStats.grammar.total) * 100));
  }

  // 5. Writing (Direct real telemetry ONLY - NO * 80 fallback)
  let writing: number | null = null;
  if (levelStats?.writing && levelStats.writing.total > 0) {
    writing = Math.min(100, Math.round((levelStats.writing.correct / levelStats.writing.total) * 100));
  }

  return {
    reading,
    listening,
    vocabulary,
    grammar,
    writing,
    speakingRecorded: progress.spokenPhrasesCount ?? 0,
  };
}
