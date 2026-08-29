import { describe, it, expect } from 'vitest';
import { createCard, reviewCard, getDueCards, masteryLevel } from '../srs';
import type { VocabItem } from '@/types/learning';

describe('SRS SuperMemo-2 (SM-2) Logic', () => {
  const vocab: VocabItem = { en: 'hello', es: 'hola', ipa: '/həˈloʊ/' };

  it('crea una nueva tarjeta lista para repasar hoy', () => {
    const now = 1000000;
    const card = createCard(vocab, now);
    expect(card.en).toBe('hello');
    expect(card.es).toBe('hola');
    expect(card.repetitions).toBe(0);
    expect(card.interval).toBe(0);
    expect(card.easeFactor).toBe(2.5);
    expect(card.dueDate).toBe(now);
    expect(masteryLevel(card)).toBe('new');
  });

  it('primer repaso correcto (calidad 5) avanza a intervalo 1 día', () => {
    const now = 1000000;
    const card = createCard(vocab, now);
    const reviewed = reviewCard(card, 5, now);

    expect(reviewed.repetitions).toBe(1);
    expect(reviewed.interval).toBe(1);
    expect(reviewed.easeFactor).toBe(2.6); // 2.5 + (0.1 - 0) = 2.6
    expect(reviewed.dueDate).toBe(now + 1 * 24 * 60 * 60 * 1000);
    expect(masteryLevel(reviewed)).toBe('learning');
  });

  it('segundo repaso correcto (calidad 4) avanza a intervalo 6 días', () => {
    const now = 1000000;
    const card = createCard(vocab, now);
    const rev1 = reviewCard(card, 5, now);
    const rev2 = reviewCard(rev1, 4, now);

    expect(rev2.repetitions).toBe(2);
    expect(rev2.interval).toBe(6);
    expect(rev2.dueDate).toBe(now + 6 * 24 * 60 * 60 * 1000);
  });

  it('un fallo (calidad 2 o menor) reinicia repeticiones a 0 e intervalo a 1', () => {
    const now = 1000000;
    const card = createCard(vocab, now);
    const rev1 = reviewCard(card, 5, now);
    const rev2 = reviewCard(rev1, 5, now);
    const failed = reviewCard(rev2, 1, now);

    expect(failed.repetitions).toBe(0);
    expect(failed.interval).toBe(1);
    expect(failed.dueDate).toBe(now + 1 * 24 * 60 * 60 * 1000);
  });

  it('filtra correctamente las tarjetas vencidas (getDueCards)', () => {
    const now = 5000000;
    const card1 = { ...createCard(vocab, now), dueDate: now - 1000 }; // vencida
    const card2 = { ...createCard({ en: 'water', es: 'agua' }, now), dueDate: now + 50000 }; // futura
    const srs = { hello: card1, water: card2 };

    const due = getDueCards(srs, now);
    expect(due).toHaveLength(1);
    expect(due[0].en).toBe('hello');
  });
});
