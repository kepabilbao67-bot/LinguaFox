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

  it('detects completed lesson challenge and recognizes claimed status from today activity', () => {
    const fixedNow = new Date('2026-09-05T10:00:00Z').getTime();
    const today = getTodayDateString(fixedNow);

    const progress = {
      ...DEFAULT_PROGRESS,
      activityByDate: {
        [today]: {
          lessonsCompleted: 1,
          chatMessages: 0,
          spokenPhrases: 0,
          reviewsCompleted: 0,
        },
      },
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

  it('does NOT complete today challenge if activity was done yesterday', () => {
    const todayTs = new Date('2026-09-05T10:00:00Z').getTime();
    const yesterdayStr = '2026-09-04';

    const progress = {
      ...DEFAULT_PROGRESS,
      activityByDate: {
        [yesterdayStr]: {
          lessonsCompleted: 5,
          chatMessages: 10,
          spokenPhrases: 8,
          reviewsCompleted: 4,
        },
      },
    };

    const challenges = getDailyChallenges(progress, todayTs);
    expect(challenges.every((c) => !c.completed)).toBe(true);
  });
});
