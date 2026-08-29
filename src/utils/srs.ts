import type { SRSCard, VocabItem } from '@/types/learning';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function createCard(vocab: VocabItem, now: number = Date.now()): SRSCard {
  return {
    en: vocab.en,
    es: vocab.es,
    ipa: vocab.ipa,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    dueDate: now,
    lastReviewed: 0,
  };
}

/**
 * SuperMemo-2 (SM-2) algorithm
 * quality: 0 - 5
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout.
 */
export function reviewCard(card: SRSCard, quality: number, now: number = Date.now()): SRSCard {
  const q = Math.max(0, Math.min(5, Math.floor(quality)));
  let repetitions = card.repetitions;
  let interval = card.interval;
  let easeFactor = card.easeFactor;

  if (q >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return {
    ...card,
    repetitions,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    dueDate: now + interval * ONE_DAY_MS,
    lastReviewed: now,
  };
}

export function getDueCards(srs: Record<string, SRSCard>, now: number = Date.now()): SRSCard[] {
  return Object.values(srs).filter((c) => c.dueDate <= now);
}

export function masteryLevel(card: SRSCard): 'new' | 'learning' | 'mastered' {
  if (card.repetitions === 0) return 'new';
  if (card.repetitions >= 4 && card.interval >= 14) return 'mastered';
  return 'learning';
}
