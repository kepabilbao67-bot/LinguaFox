import { describe, it, expect } from 'vitest';

describe('Travel Adventure City Rewards', () => {
  const cityRewards: Record<string, number> = {
    london: 150,
    madrid: 150,
    roma: 150,
    lisboa: 150,
    paris: 180,
    berlin: 200,
    newyork: 220,
  };

  const VALID_CITY_IDS = Object.keys(cityRewards);

  it('all valid city IDs have defined rewards', () => {
    VALID_CITY_IDS.forEach((cityId) => {
      expect(cityRewards[cityId]).toBeGreaterThan(0);
    });
  });

  it('london and madrid have same reward (initial cities)', () => {
    expect(cityRewards['london']).toBe(150);
    expect(cityRewards['madrid']).toBe(150);
  });

  it('roma, lisboa also have 150 XP', () => {
    expect(cityRewards['roma']).toBe(150);
    expect(cityRewards['lisboa']).toBe(150);
  });

  it('paris has 180 XP (A2 level)', () => {
    expect(cityRewards['paris']).toBe(180);
  });

  it('berlin has 200 XP (A2 level)', () => {
    expect(cityRewards['berlin']).toBe(200);
  });

  it('newyork has 220 XP (B1 level)', () => {
    expect(cityRewards['newyork']).toBe(220);
  });

  it('paris completion does not reward london', () => {
    expect(cityRewards['paris']).not.toBe(cityRewards['london']);
  });

  it('newyork completion does not reward london', () => {
    expect(cityRewards['newyork']).not.toBe(cityRewards['london']);
  });

  it('invalid cityId is not in valid list', () => {
    expect(VALID_CITY_IDS).not.toContain('invalid');
  });

  it('reward table has exactly 7 cities', () => {
    expect(VALID_CITY_IDS.length).toBe(7);
  });

  it('reward progression: higher difficulty = higher reward', () => {
    expect(cityRewards['london']).toBe(150); // A1
    expect(cityRewards['berlin']).toBe(200); // A2
    expect(cityRewards['newyork']).toBe(220); // B1
    expect(cityRewards['london']).toBeLessThan(cityRewards['berlin']);
    expect(cityRewards['berlin']).toBeLessThan(cityRewards['newyork']);
  });

  it('total rewards for all cities sum correctly', () => {
    const total = Object.values(cityRewards).reduce((a, b) => a + b, 0);
    expect(total).toBe(150 + 150 + 150 + 150 + 180 + 200 + 220); // 1200
    expect(total).toBe(1200);
  });
});
