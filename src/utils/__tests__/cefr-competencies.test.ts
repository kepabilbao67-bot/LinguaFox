import { describe, expect, it } from 'vitest';
import { calculateLevelCompetencies } from '../cefr-competencies';
import { DEFAULT_PROGRESS } from '../progress-storage';
import type { Lesson } from '@/types/learning';

describe('CEFR Competencies Calculation', () => {
  const sampleLessons: Lesson[] = [
    {
      id: 'unit-1-lesson-1',
      title: 'Greetings',
      description: 'Learn basic greetings',
      language: 'en',
      level: 'A1',
      words: [
        { id: 'w1', source: 'hello', translation: 'hola' },
        { id: 'w2', source: 'goodbye', translation: 'adiós' },
      ],
    },
    {
      id: 'unit-1-lesson-2',
      title: 'Numbers',
      description: 'Learn numbers 1-5',
      language: 'en',
      level: 'A1',
      words: [
        { id: 'w3', source: 'one', translation: 'uno' },
        { id: 'w4', source: 'two', translation: 'dos' },
      ],
    },
  ];

  it('returns null ("Sin datos suficientes") for competencies when student has 0 completed lessons', () => {
    const result = calculateLevelCompetencies({
      level: 'A1',
      levelLessons: sampleLessons,
      progress: DEFAULT_PROGRESS,
    });

    expect(result.reading).toBeNull();
    expect(result.listening).toBeNull();
    expect(result.vocabulary).toBeNull();
    expect(result.grammar).toBeNull();
    expect(result.writing).toBeNull();
    expect(result.speakingRecorded).toBe(0);
  });

  it('calculates specific competencies when student completes 1 of 2 lessons with quiz score', () => {
    const progressWithOneLesson = {
      ...DEFAULT_PROGRESS,
      leccionesCompletadas: ['en:unit-1-lesson-1'],
      mejorPuntuacionPorLeccion: {
        'unit-1-lesson-1': 5,
      },
      spokenPhrasesCount: 4,
    };

    const result = calculateLevelCompetencies({
      level: 'A1',
      levelLessons: sampleLessons,
      progress: progressWithOneLesson,
    });

    // 2 words of 4 total words = 50%
    expect(result.vocabulary).toBe(50);
    // Without specific telemetry, Reading, Listening, Grammar, Writing are strictly null
    expect(result.reading).toBeNull();
    expect(result.listening).toBeNull();
    expect(result.grammar).toBeNull();
    expect(result.writing).toBeNull();
    expect(result.speakingRecorded).toBe(4);
  });

  it('calculates independent telemetry for specific competencies based on real correct/total ratios', () => {
    const progressWithTelemetry = {
      ...DEFAULT_PROGRESS,
      leccionesCompletadas: ['en:unit-1-lesson-1'],
      spokenPhrasesCount: 6,
      competencyStats: {
        'en:A1': {
          reading: { correct: 8, total: 10 },
          listening: { correct: 3, total: 4 },
          grammar: { correct: 5, total: 5 },
          writing: { correct: 2, total: 4 },
        },
      },
    };

    const result = calculateLevelCompetencies({
      level: 'A1',
      levelLessons: sampleLessons,
      progress: progressWithTelemetry,
    });

    expect(result.reading).toBe(80); // 8/10
    expect(result.listening).toBe(75); // 3/4
    expect(result.grammar).toBe(100); // 5/5
    expect(result.writing).toBe(50); // 2/4
    expect(result.vocabulary).toBe(50); // 2 of 4 words
    expect(result.speakingRecorded).toBe(6);
  });

  it('ensures Listening is independent and does not change when only Reading was performed', () => {
    const progressReadingOnly = {
      ...DEFAULT_PROGRESS,
      competencyStats: {
        'en:A1': {
          reading: { correct: 4, total: 5 },
        },
      },
    };

    const result = calculateLevelCompetencies({
      level: 'A1',
      levelLessons: sampleLessons,
      progress: progressReadingOnly,
    });

    expect(result.reading).toBe(80);
    expect(result.listening).toBeNull(); // Strictly null, not influenced by reading
    expect(result.grammar).toBeNull();
    expect(result.writing).toBeNull();
  });
});
