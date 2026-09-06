import { describe, expect, it } from 'vitest';
import { evaluateCityCompletion } from '../city-adventure';

describe('evaluateCityCompletion', () => {
  // Valid city IDs
  it('london primera finalización → +150', () => {
    const result = evaluateCityCompletion('london', 0, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(150);
    expect(result.completedCities).toEqual(['london']);
  });

  it('madrid → +150', () => {
    const result = evaluateCityCompletion('madrid', 0, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(150);
    expect(result.completedCities).toEqual(['madrid']);
  });

  it('roma → +150 (unlocked when experience >= 150)', () => {
    const result = evaluateCityCompletion('roma', 150, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(150);
    expect(result.completedCities).toEqual(['roma']);
  });

  it('roma → bloqueada cuando experience < 150', () => {
    const result = evaluateCityCompletion('roma', 149, [], []);
    expect(result.allowed).toBe(false);
    expect(result.xpAwarded).toBe(0);
    expect(result.completedCities).toEqual([]);
  });

  it('roma → desbloqueada explícitamente en unlockedCities', () => {
    const result = evaluateCityCompletion('roma', 0, ['roma'], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(150);
  });

  it('lisboa → +150', () => {
    const result = evaluateCityCompletion('lisboa', 150, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(150);
  });

  it('paris → +180', () => {
    const result = evaluateCityCompletion('paris', 250, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(180);
  });

  it('berlin → +200', () => {
    const result = evaluateCityCompletion('berlin', 300, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(200);
  });

  it('newyork → +220', () => {
    const result = evaluateCityCompletion('newyork', 500, [], []);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(true);
    expect(result.xpAwarded).toBe(220);
  });

  // No reward duplication
  it('ya completada → 0 XP adicional', () => {
    const result = evaluateCityCompletion('london', 0, [], ['london']);
    expect(result.allowed).toBe(true);
    expect(result.firstCompletion).toBe(false);
    expect(result.xpAwarded).toBe(0);
    expect(result.completedCities).toEqual(['london']);
  });

  it('paris nunca modifica london en completedCities', () => {
    const result = evaluateCityCompletion('paris', 250, [], ['london']);
    expect(result.completedCities).toEqual(['london', 'paris']);
  });

  it('newyork nunca modifica london en completedCities', () => {
    const result = evaluateCityCompletion('newyork', 500, [], ['london']);
    expect(result.completedCities).toEqual(['london', 'newyork']);
  });

  // Access protection
  it('ID inválido → 0 XP', () => {
    const result = evaluateCityCompletion('invalid-city', 1000, [], []);
    expect(result.allowed).toBe(false);
    expect(result.xpAwarded).toBe(0);
    expect(result.completedCities).toEqual([]);
  });

  it('undefined cityId → allowed false', () => {
    const result = evaluateCityCompletion(undefined, 1000, [], []);
    expect(result.allowed).toBe(false);
    expect(result.xpAwarded).toBe(0);
  });

  it('bloqueada por XP insuficiente → 0 XP', () => {
    const result = evaluateCityCompletion('paris', 200, [], []);
    expect(result.allowed).toBe(false);
    expect(result.xpAwarded).toBe(0);
    expect(result.completedCities).toEqual([]);
  });

  it('URL manual a newyork sin desbloqueo → 0 XP', () => {
    // User with 100 XP tries newyork (requires 500)
    // Even if they reached the route manually via URL
    const result = evaluateCityCompletion('newyork', 100, [], []);
    expect(result.allowed).toBe(false);
    expect(result.xpAwarded).toBe(0);
  });

  // Data integrity
  it('completar no resta experiencia', () => {
    const result = evaluateCityCompletion('london', 50, [], []);
    // xpAwarded is positive
    expect(result.xpAwarded).toBeGreaterThan(0);
  });

  it('completar agrega exactamente un cityId', () => {
    const result = evaluateCityCompletion('london', 0, [], []);
    expect(result.completedCities.length).toBe(1);
    expect(result.completedCities[0]).toBe('london');
  });

  it('repetición no duplica completedCities', () => {
    const result1 = evaluateCityCompletion('london', 0, [], ['london']);
    expect(result1.completedCities.filter((c) => c === 'london').length).toBe(1);
  });

  it('multiple cities en completedCities se preservan', () => {
    const result = evaluateCityCompletion('berlin', 300, [], ['london', 'madrid']);
    expect(result.completedCities).toContain('london');
    expect(result.completedCities).toContain('madrid');
    expect(result.completedCities).toContain('berlin');
  });
});
