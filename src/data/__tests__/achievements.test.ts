import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, evaluateAchievements, resolveMetricValue } from '../achievements';

describe('Achievements Evaluation & Metric System', () => {
  it('every achievement defines an explicit metric, targetValue, and xpReward', () => {
    for (const ach of ACHIEVEMENTS) {
      expect(ach.metric).toBeDefined();
      expect(ach.targetValue).toBeGreaterThan(0);
      expect(ach.xpReward).toBeGreaterThan(0);
    }
  });

  it('resolves metric values accurately by declared metric key', () => {
    const context = {
      lecciones: 6,
      racha: 7,
      mensajes: 15,
      spokenPhrases: 5,
      unlockedCities: 2,
      reviewsCompleted: 8,
      scenariosCompleted: 2,
    };

    expect(resolveMetricValue('lessonsCompleted', context)).toBe(6);
    expect(resolveMetricValue('streakDays', context)).toBe(7);
    expect(resolveMetricValue('chatMessages', context)).toBe(15);
    expect(resolveMetricValue('spokenPhrases', context)).toBe(5);
    expect(resolveMetricValue('citiesUnlocked', context)).toBe(2);
    expect(resolveMetricValue('reviewsCompleted', context)).toBe(8);
    expect(resolveMetricValue('scenariosCompleted', context)).toBe(2);
  });

  it('evaluates unlocked achievements when requirements are met', () => {
    const context = {
      lecciones: 1,
      racha: 3,
      mensajes: 1,
      personajes: 1,
      spokenPhrases: 0,
      unlockedCities: 0,
      reviewsCompleted: 0,
      scenariosCompleted: 0,
    };

    const unlocked = evaluateAchievements(context);
    expect(unlocked).toContain('primera-leccion');
    expect(unlocked).toContain('primera-charla');
    expect(unlocked).toContain('racha-3');
    expect(unlocked).not.toContain('racha-7');
    expect(unlocked).not.toContain('maestro-lecciones');
  });
});
