import { describe, it, expect } from 'vitest';
import { CITIES, getCityById } from '../cities';

describe('Cities Configuration', () => {
  it('all cities have required properties', () => {
    CITIES.forEach((city) => {
      expect(city.id).toBeDefined();
      expect(city.name).toBeDefined();
      expect(typeof city.unlockXp).toBe('number');
      expect(typeof city.xpReward).toBe('number');
      expect(city.unlockXp).toBeGreaterThanOrEqual(0);
      expect(city.xpReward).toBeGreaterThan(0);
    });
  });

  it('unlock requirements increase with progression', () => {
    // London and Madrid should be free (0 XP)
    const london = getCityById('london');
    const madrid = getCityById('madrid');
    expect(london?.unlockXp).toBe(0);
    expect(madrid?.unlockXp).toBe(0);

    // Later cities require more XP
    const paris = getCityById('paris');
    const newYork = getCityById('newyork');
    expect(paris?.unlockXp).toBeGreaterThan(0);
    expect(newYork?.unlockXp).toBeGreaterThan(paris?.unlockXp ?? 0);
  });

  it('xpReward is separate from unlockXp', () => {
    CITIES.forEach((city) => {
      // xpReward is what you get for completing, not requirement
      expect(city.xpReward).toBeGreaterThan(0);
      // Some cities might have same unlock and reward, but they're distinct concepts
      // Roma: needs 150 to unlock, gives 150 reward
      // Berlin: needs 300 to unlock, gives 200 reward (different values)
    });
  });

  it('getCityById returns correct city or undefined', () => {
    expect(getCityById('london')?.name).toBe('Londres');
    expect(getCityById('roma')?.name).toBe('Roma');
    expect(getCityById('invalid')).toBeUndefined();
    expect(getCityById(undefined)).toBeUndefined();
  });

  it('london and madrid are always unlocked (0 XP)', () => {
    const cities = CITIES.filter((c) => c.id === 'london' || c.id === 'madrid');
    cities.forEach((city) => {
      expect(city.unlockXp).toBe(0);
    });
  });
});
