import type { SRSCard, VocabItem } from '@/types/learning';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function createCard(vocab: VocabItem, now: number = Date.now()): SRSCard {
  const safeNow = Number.isFinite(now) && now > 0 ? now : Date.now();
  return {
    en: vocab.en,
    es: vocab.es,
    ipa: vocab.ipa,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    dueDate: safeNow,
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
  const safeNow = Number.isFinite(now) && now > 0 ? now : Date.now();
  const rawQuality = Number.isFinite(quality) ? quality : 0;
  const q = Math.max(0, Math.min(5, Math.floor(rawQuality)));

  let repetitions = Number.isFinite(card.repetitions) ? Math.max(0, card.repetitions) : 0;
  let interval = Number.isFinite(card.interval) ? Math.max(0, card.interval) : 0;
  let easeFactor = Number.isFinite(card.easeFactor) ? Math.max(1.3, card.easeFactor) : 2.5;

  if (q >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // SM-2 Ease Factor formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (!Number.isFinite(easeFactor) || easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const cleanInterval = Math.max(1, interval);
  const cleanDueDate = safeNow + cleanInterval * ONE_DAY_MS;

  return {
    ...card,
    repetitions,
    interval: cleanInterval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    dueDate: cleanDueDate,
    lastReviewed: safeNow,
  };
}

export function getDueCards(srs: Record<string, SRSCard>, now: number = Date.now()): SRSCard[] {
  if (!srs || typeof srs !== 'object') return [];
  const safeNow = Number.isFinite(now) ? now : Date.now();
  return Object.values(srs).filter((c) => c && typeof c === 'object' && Number.isFinite(c.dueDate) && c.dueDate <= safeNow);
}

export function masteryLevel(card: SRSCard): 'new' | 'learning' | 'mastered' {
  if (!card || !Number.isFinite(card.repetitions) || card.repetitions === 0) return 'new';
  if (card.repetitions >= 4 && card.interval >= 14) return 'mastered';
  return 'learning';
}
