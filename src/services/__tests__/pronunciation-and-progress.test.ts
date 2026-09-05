import { describe, it, expect } from 'vitest';
import { CITIES, getCityById, getCityForLanguage } from '../../data/cities';
import { levelFromXp, xpIntoLevel } from '../../utils/rewards';

describe('Pronunciation, Cities & CEFR Progression', () => {
  it('calculates CEFR progression level and XP offsets correctly', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(xpIntoLevel(0)).toBe(0);

    expect(levelFromXp(150)).toBe(2);
    expect(xpIntoLevel(150)).toBe(50);

    expect(levelFromXp(450)).toBe(5);
    expect(xpIntoLevel(450)).toBe(50);
  });

  it('includes all major world cities in travel adventure including New York', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(7);
    const ny = getCityById('newyork');
    expect(ny).toBeDefined();
    expect(ny?.flag).toBe('🇺🇸');
    expect(ny?.landmarks).toContain('Central Park');

    const london = getCityById('london');
    expect(london).toBeDefined();
    expect(london?.landmarks).toContain('Big Ben');

    const paris = getCityForLanguage('fr');
    expect(paris.id).toBe('paris');
    expect(paris.landmarks).toContain('Tour Eiffel');
  });
});
