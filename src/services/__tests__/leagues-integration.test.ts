import { describe, it, expect } from 'vitest';
import {
  generateWeeklyDivision,
  updateUserDivisionXp,
  calculateLeagueOutcome,
  getIsoWeekKey,
} from '../leagues';
import { ProgressManager } from '../../utils/progress-manager';
import { DEFAULT_PROGRESS, sanitizeProgress } from '../../utils/progress-storage';
import { LEAGUE_TIERS } from '../../types/leagues';
import type { ProgressState } from '../../types/learning';

describe('Leagues & Lesson XP Integration (Real Flow)', () => {
  it('1. completar lección suma XP semanal y XP general sin duplicar', () => {
    const manager = new ProgressManager();
    const now = new Date('2026-09-06T12:00:00Z').getTime();

    // Estado inicial
    expect(manager.progress.experiencia).toBe(0);
    expect(manager.progress.weeklyLeague?.weeklyXp).toBe(0);

    // Completa lección con acierto perfecto (10 base + 15 bono = 25 XP)
    manager.recordQuizResult('en-unit-1-lesson-1', 5, 5, now, 'attempt_001');

    expect(manager.progress.experiencia).toBe(25);
    expect(manager.progress.weeklyLeague?.weeklyXp).toBe(25);
    expect(manager.progress.weeklyLeague?.completedAttempts?.['attempt_001']).toBe(now);
  });

  it('2. repetir flujo con el mismo attemptId NO duplica XP (idempotencia y protección anti-reapertura)', () => {
    const manager = new ProgressManager();
    const now = new Date('2026-09-06T12:00:00Z').getTime();

    // Primer intento
    manager.recordQuizResult('en-unit-1-lesson-1', 4, 5, now, 'attempt_fixed_id');
    const xpAfterFirst = manager.progress.experiencia;
    const weeklyXpAfterFirst = manager.progress.weeklyLeague?.weeklyXp;

    expect(xpAfterFirst).toBe(10); // 10 base (no perfecto)
    expect(weeklyXpAfterFirst).toBe(10);

    // Simular re-apertura de pantalla o re-render con el mismo attemptId
    manager.recordQuizResult('en-unit-1-lesson-1', 4, 5, now + 1000, 'attempt_fixed_id');

    expect(manager.progress.experiencia).toBe(xpAfterFirst);
    expect(manager.progress.weeklyLeague?.weeklyXp).toBe(weeklyXpAfterFirst);
  });

  it('3. ranking cambia correctamente cuando el usuario gana XP en la lección', () => {
    const initialWeeklyXp = 10;
    const initialDiv = generateWeeklyDivision('oro', initialWeeklyXp);
    const initialRank = initialDiv.userRank;

    // Usuario gana 1500 XP tras varias lecciones
    const newWeeklyXp = initialWeeklyXp + 1500;
    const updatedDiv = updateUserDivisionXp(initialDiv, newWeeklyXp);

    expect(updatedDiv.userRank).toBeLessThan(initialRank);
    expect(updatedDiv.userRank).toBe(1);
    expect(updatedDiv.participants.find(p => p.isUser)?.xp).toBe(newWeeklyXp);
  });

  it('4. cambio de posición y asignación de bots es 100% determinista para la misma semana', () => {
    const date = new Date('2026-09-06T10:00:00Z');
    const divA = generateWeeklyDivision('zafiro', 350, date);
    const divB = generateWeeklyDivision('zafiro', 350, date);

    expect(divA.weekKey).toBe(divB.weekKey);
    expect(divA.userRank).toBe(divB.userRank);
    expect(divA.participants.length).toBe(30);
    expect(divA.participants.map(p => p.id)).toEqual(divB.participants.map(p => p.id));
    expect(divA.participants.map(p => p.xp)).toEqual(divB.participants.map(p => p.xp));
  });

  it('5. semana nueva genera división válida, evalúa desenlace de liga y aplica recompensas', () => {
    const week1Date = new Date('2026-08-30T12:00:00Z'); // Semana W35
    const week2Date = new Date('2026-09-06T12:00:00Z'); // Semana W36
    const week1Key = getIsoWeekKey(week1Date);
    const week2Key = getIsoWeekKey(week2Date);

    expect(week1Key).not.toBe(week2Key);

    // Simular que el usuario terminó la semana 1 en Liga Plata con 9000 XP (posición #1)
    const prevDiv = generateWeeklyDivision('plata', 9000, week1Date);
    const outcome = calculateLeagueOutcome(prevDiv);

    expect(outcome.action).toBe('ascenso');
    expect(outcome.currentTier).toBe('plata');
    expect(outcome.nextTier).toBe('oro');
    expect(outcome.rewardCoins).toBe(LEAGUE_TIERS.plata.rewardCoins);

    // Al comenzar la semana 2, se genera la nueva división en Liga Oro
    const week2Div = generateWeeklyDivision(outcome.nextTier, 0, week2Date);
    expect(week2Div.tier).toBe('oro');
    expect(week2Div.weekKey).toBe(week2Key);
    expect(week2Div.participants.length).toBe(30);
    expect(week2Div.participants.find(p => p.isUser)?.xp).toBe(0);
  });

  it('6. sanitización de almacenamiento conserva weeklyLeague íntegro y seguro', () => {
    const rawProgress: Partial<ProgressState> = {
      ...DEFAULT_PROGRESS,
      experiencia: 500,
      weeklyLeague: {
        tier: 'zafiro',
        weekKey: '2026-W36',
        weeklyXp: 420,
        completedAttempts: {
          'lesson-1-try': 1234567,
        },
      },
    };

    const sanitized = sanitizeProgress(rawProgress);
    expect(sanitized.weeklyLeague).toBeDefined();
    expect(sanitized.weeklyLeague?.tier).toBe('zafiro');
    expect(sanitized.weeklyLeague?.weekKey).toBe('2026-W36');
    expect(sanitized.weeklyLeague?.weeklyXp).toBe(420);
    expect(sanitized.weeklyLeague?.completedAttempts?.['lesson-1-try']).toBe(1234567);
  });
});
