import { describe, expect, it } from 'vitest';
import { createCard, reviewCard } from '../srs';
import type { SRSCard } from '@/types/learning';

describe('SuperMemo-2 SRS Robustness & Math Guards', () => {
  const sampleVocab = { en: 'apple', es: 'manzana', ipa: '/ˈæp.əl/' };
  const FIXED_NOW = 1725500000000;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  it('initializes card with clean defaults and valid dueDate', () => {
    const card = createCard(sampleVocab, FIXED_NOW);
    expect(card.en).toBe('apple');
    expect(card.repetitions).toBe(0);
    expect(card.interval).toBe(0);
    expect(card.easeFactor).toBe(2.5);
    expect(card.dueDate).toBe(FIXED_NOW);
  });

  it('quality 0 (complete blackout) resets repetitions and schedules next review in 1 day', () => {
    const initialCard: SRSCard = {
      en: 'apple',
      es: 'manzana',
      repetitions: 3,
      interval: 15,
      easeFactor: 2.5,
      dueDate: FIXED_NOW,
      lastReviewed: FIXED_NOW - 15 * ONE_DAY_MS,
    };

    const updated = reviewCard(initialCard, 0, FIXED_NOW);
    expect(updated.repetitions).toBe(0);
    expect(updated.interval).toBe(1);
    expect(updated.dueDate).toBe(FIXED_NOW + ONE_DAY_MS);
    expect(updated.lastReviewed).toBe(FIXED_NOW);
  });

  it('quality 5 (perfect response) increases interval and repetition cleanly', () => {
    const card0 = createCard(sampleVocab, FIXED_NOW);
    // 1st review: rep 0 -> 1, interval 1
    const card1 = reviewCard(card0, 5, FIXED_NOW);
    expect(card1.repetitions).toBe(1);
    expect(card1.interval).toBe(1);
    expect(card1.easeFactor).toBeGreaterThanOrEqual(2.5);

    // 2nd review: rep 1 -> 2, interval 6
    const card2 = reviewCard(card1, 5, FIXED_NOW);
    expect(card2.repetitions).toBe(2);
    expect(card2.interval).toBe(6);

    // 3rd review: rep 2 -> 3, interval 6 * EF
    const card3 = reviewCard(card2, 5, FIXED_NOW);
    expect(card3.repetitions).toBe(3);
    expect(card3.interval).toBeGreaterThanOrEqual(15);
    expect(Number.isFinite(card3.dueDate)).toBe(true);
    expect(card3.dueDate).toBe(FIXED_NOW + card3.interval * ONE_DAY_MS);
  });

  it('easeFactor never drops below the strict minimum threshold of 1.3', () => {
    let card = createCard(sampleVocab, FIXED_NOW);
    // Grade with 0 multiple times to depress ease factor
    for (let i = 0; i < 10; i++) {
      card = reviewCard(card, 0, FIXED_NOW);
    }
    expect(card.easeFactor).toBe(1.3);
    expect(Number.isNaN(card.easeFactor)).toBe(false);
  });

  it('handles invalid or NaN inputs safely without crashing or corrupting state', () => {
    const corruptedCard = {
      en: 'apple',
      es: 'manzana',
      repetitions: NaN,
      interval: -5,
      easeFactor: NaN,
      dueDate: NaN,
      lastReviewed: NaN,
    } as unknown as SRSCard;

    const updated = reviewCard(corruptedCard, NaN, NaN);
    expect(Number.isFinite(updated.repetitions)).toBe(true);
    expect(Number.isFinite(updated.interval)).toBe(true);
    expect(updated.interval).toBeGreaterThanOrEqual(1);
    expect(Number.isFinite(updated.easeFactor)).toBe(true);
    expect(updated.easeFactor).toBeGreaterThanOrEqual(1.3);
    expect(Number.isFinite(updated.dueDate)).toBe(true);
  });
});
