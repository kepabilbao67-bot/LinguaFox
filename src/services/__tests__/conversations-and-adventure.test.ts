import { describe, it, expect } from 'vitest';
import { fetchTutorReply } from '../tutor-reply';
import { fetchCharacterReply } from '../character-reply';
import { CHARACTERS, getCharacterById, getCharactersByLanguage } from '../../data/characters';
import { SCENARIOS, getScenarioById, getScenariosForLanguage } from '../../data/scenarios';
import { CITIES, getCityById, getCityForLanguage } from '../../data/cities';
import { COMMON_ERROR_TEMPLATES, getErrorsForLanguage } from '../../data/error-bank';

describe('Conversations, Characters & Adventure Hub', () => {
  it('loads all native and roleplay characters correctly', () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(10);
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(6);
    expect(CITIES.length).toBeGreaterThanOrEqual(5);
    const fox = getCharacterById('fox');
    expect(fox).toBeDefined();
    expect(fox?.avatar).toBe('🦊');

    const emma = getCharacterById('emma');
    expect(emma).toBeDefined();
    expect(emma?.city).toBe('London');

    const luca = getCharacterById('luca');
    expect(luca).toBeDefined();
    expect(luca?.language).toBe('it');
  });

  it('filters characters by target language including global guide fox', () => {
    const itChars = getCharactersByLanguage('it');
    expect(itChars.some((c) => c.id === 'luca')).toBe(true);
    expect(itChars.some((c) => c.id === 'fox')).toBe(true);
  });

  it('provides rich conversational replies with character reply engine', async () => {
    const reply = await fetchCharacterReply('emma', 'Hello Emma, how are you?');
    expect(reply).toBeDefined();
    expect(reply?.text.length).toBeGreaterThan(10);
    expect(reply?.suggestions.length).toBeGreaterThan(0);
    expect(reply?.translation).toBeDefined();
  });

  it('responds with quick actions for speed, meaning, and hints in tutor reply', async () => {
    const slowReply = await fetchTutorReply('más despacio por favor');
    expect(slowReply?.text).toContain('slowly');

    const meaningReply = await fetchTutorReply('¿Qué significa esta palabra?');
    expect(meaningReply?.text).toContain('explain');

    const hintReply = await fetchTutorReply('dame una pista');
    expect(hintReply?.text).toContain('hint');
  });

  it('resolves scenarios by id and language filter', () => {
    const cafe = getScenarioById('cafe-order');
    expect(cafe).toBeDefined();
    expect(cafe?.icon).toBe('☕');
    expect(cafe?.goals.length).toBe(3);

    const enScenarios = getScenariosForLanguage('en');
    expect(enScenarios.length).toBeGreaterThan(0);
  });

  it('resolves city adventures for target languages', () => {
    const london = getCityById('london');
    expect(london).toBeDefined();
    expect(london?.flag).toBe('🇬🇧');

    const roma = getCityForLanguage('it');
    expect(roma.id).toBe('roma');
    expect(roma.flag).toBe('🇮🇹');

    const berlin = getCityForLanguage('de');
    expect(berlin.id).toBe('berlin');
    expect(berlin.flag).toBe('🇩🇪');
  });

  it('provides categorized error bank items for user review', () => {
    const errors = getErrorsForLanguage(COMMON_ERROR_TEMPLATES, 'en');
    expect(errors.length).toBeGreaterThanOrEqual(4);
    expect(errors.some((e) => e.category === 'verb-tense')).toBe(true);
    expect(errors.some((e) => e.category === 'preposition')).toBe(true);
  });
});
