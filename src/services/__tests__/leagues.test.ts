import { describe, it, expect } from 'vitest';
import {
  getIsoWeekKey,
  getWeekEndIsoString,
  generateWeeklyDivision,
  updateUserDivisionXp,
  calculateLeagueOutcome,
  getTierProgression,
} from '../leagues';
import { LEAGUE_TIERS } from '../../types/leagues';

describe('Leagues Service (Deterministic Local-First)', () => {
  describe('ISO Week & Date Utilities', () => {
    it('genera claves de semana en formato YYYY-Www', () => {
      const fixedDate = new Date('2026-09-06T12:00:00Z');
      const weekKey = getIsoWeekKey(fixedDate);
      expect(weekKey).toMatch(/^\d{4}-W\d{2}$/);
      expect(weekKey).toBe('2026-W36');
    });

    it('calcula el fin de semana para el domingo 23:59:59', () => {
      const fixedDate = new Date('2026-09-02T10:00:00Z'); // Miércoles
      const endIso = getWeekEndIsoString(fixedDate);
      const endDate = new Date(endIso);
      expect(endDate.getDay()).toBe(0); // Domingo
      expect(endDate.getHours()).toBe(23);
      expect(endDate.getMinutes()).toBe(59);
    });
  });

  describe('generateWeeklyDivision', () => {
    it('crea una división con exactamente 30 participantes (29 bots + 1 usuario)', () => {
      const division = generateWeeklyDivision('oro', 250);
      expect(division.participants.length).toBe(30);
      expect(division.tier).toBe('oro');

      const user = division.participants.find(p => p.isUser);
      expect(user).toBeDefined();
      expect(user?.name).toBe('Tú');
      expect(user?.xp).toBe(250);
      expect(user?.rank).toBe(division.userRank);
    });

    it('es completamente determinista con la misma semilla de semana y nivel', () => {
      const fixedDate = new Date('2026-09-06T12:00:00Z');
      const div1 = generateWeeklyDivision('plata', 100, fixedDate);
      const div2 = generateWeeklyDivision('plata', 100, fixedDate);

      expect(div1.weekKey).toBe(div2.weekKey);
      expect(div1.participants.map(p => p.id)).toEqual(div2.participants.map(p => p.id));
      expect(div1.participants.map(p => p.xp)).toEqual(div2.participants.map(p => p.xp));
    });

    it('mantiene la ordenación descendente por XP y rangos consecutivos 1..30', () => {
      const division = generateWeeklyDivision('bronce', 50);
      for (let i = 0; i < division.participants.length - 1; i++) {
        expect(division.participants[i].xp).toBeGreaterThanOrEqual(division.participants[i + 1].xp);
        expect(division.participants[i].rank).toBe(i + 1);
      }
      expect(division.participants[29].rank).toBe(30);
    });
  });

  describe('updateUserDivisionXp', () => {
    it('actualiza dinámicamente el XP del usuario y recalcula su posición en la tabla', () => {
      const initialDivision = generateWeeklyDivision('bronce', 0);
      expect(initialDivision.userRank).toBeGreaterThan(20);

      // Ahora el usuario completa lecciones y consigue 5000 XP
      const updated = updateUserDivisionXp(initialDivision, 5000);
      expect(updated.userRank).toBe(1);
      expect(updated.participants[0].isUser).toBe(true);
      expect(updated.participants[0].xp).toBe(5000);
    });
  });

  describe('getTierProgression', () => {
    it('asciende correctamente a través de los tiers hasta Diamante', () => {
      expect(getTierProgression('bronce', 'ascenso')).toBe('plata');
      expect(getTierProgression('plata', 'ascenso')).toBe('oro');
      expect(getTierProgression('oro', 'ascenso')).toBe('zafiro');
      expect(getTierProgression('zafiro', 'ascenso')).toBe('diamante');
      expect(getTierProgression('diamante', 'ascenso')).toBe('diamante'); // Cima
    });

    it('desciende correctamente a través de los tiers hasta Bronce', () => {
      expect(getTierProgression('diamante', 'descenso')).toBe('zafiro');
      expect(getTierProgression('zafiro', 'descenso')).toBe('oro');
      expect(getTierProgression('oro', 'descenso')).toBe('plata');
      expect(getTierProgression('plata', 'descenso')).toBe('bronce');
      expect(getTierProgression('bronce', 'descenso')).toBe('bronce'); // Base
    });

    it('mantiene el mismo tier en caso de permanencia', () => {
      expect(getTierProgression('oro', 'permanencia')).toBe('oro');
    });
  });

  describe('calculateLeagueOutcome', () => {
    it('declara ascenso cuando el usuario termina en el top de promoción', () => {
      const division = generateWeeklyDivision('oro', 99999);
      const outcome = calculateLeagueOutcome(division);

      expect(outcome.action).toBe('ascenso');
      expect(outcome.rank).toBe(1);
      expect(outcome.nextTier).toBe('zafiro');
      expect(outcome.rewardCoins).toBe(LEAGUE_TIERS.oro.rewardCoins);
      expect(outcome.message).toContain('asciendes a Liga Zafiro');
    });

    it('declara permanencia cuando el usuario está en zona media', () => {
      const division = generateWeeklyDivision('oro', 0);
      // Forzar que el usuario quede en puesto 15
      division.participants.forEach((p, idx) => {
        p.isUser = idx === 14;
        p.rank = idx + 1;
      });
      division.userRank = 15;

      const outcome = calculateLeagueOutcome(division);
      expect(outcome.action).toBe('permanencia');
      expect(outcome.nextTier).toBe('oro');
      expect(outcome.rewardCoins).toBeGreaterThan(0);
      expect(outcome.message).toContain('mantenido tu posición');
    });

    it('declara descenso en tiers superiores cuando el usuario queda en la zona roja', () => {
      const division = generateWeeklyDivision('oro', 0);
      // Forzar que el usuario quede en puesto 28
      division.participants.forEach((p, idx) => {
        p.isUser = idx === 27;
        p.rank = idx + 1;
      });
      division.userRank = 28;

      const outcome = calculateLeagueOutcome(division);
      expect(outcome.action).toBe('descenso');
      expect(outcome.nextTier).toBe('plata');
      expect(outcome.rewardCoins).toBe(0);
      expect(outcome.message).toContain('Desciendes a Liga Plata');
    });

    it('nunca desciende a un usuario en Liga Bronce', () => {
      const division = generateWeeklyDivision('bronce', 0);
      division.participants.forEach((p, idx) => {
        p.isUser = idx === 29;
        p.rank = idx + 1;
      });
      division.userRank = 30;

      const outcome = calculateLeagueOutcome(division);
      expect(outcome.action).toBe('permanencia');
      expect(outcome.nextTier).toBe('bronce');
    });
  });
});
