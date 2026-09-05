import { describe, expect, it } from 'vitest';
import { getDailyChallenges, getTodayDateString } from '../daily-challenges';
import { DEFAULT_PROGRESS } from '../progress-storage';

describe('Daily Challenges Engine', () => {
  it('formats today date string properly in YYYY-MM-DD format', () => {
    const fixedTimestamp = new Date('2026-09-05T12:00:00Z').getTime();
    const dateStr = getTodayDateString(fixedTimestamp);
    expect(dateStr).toBe('2026-09-05');
  });

  it('marks challenges as uncompleted when progress is empty', () => {
    const challenges = getDailyChallenges(DEFAULT_PROGRESS);
    expect(challenges).toHaveLength(3);
    expect(challenges.every((c) => !c.completed && !c.claimed)).toBe(true);
  });

  it('detects completed lesson challenge and recognizes claimed status', () => {
    const fixedNow = new Date('2026-09-05T10:00:00Z').getTime();
    const today = getTodayDateString(fixedNow);

    const progress = {
      ...DEFAULT_PROGRESS,
      leccionesCompletadas: ['en:unit-1-lesson-1'],
      dailyChallengeClaims: {
        'daily-lesson': today,
      },
    };

    const challenges = getDailyChallenges(progress, fixedNow);
    const lessonChallenge = challenges.find((c) => c.id === 'daily-lesson');

    expect(lessonChallenge).toBeDefined();
    expect(lessonChallenge?.completed).toBe(true);
    expect(lessonChallenge?.claimed).toBe(true);
  });
});
