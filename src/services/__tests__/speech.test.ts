import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Speech from 'expo-speech';
import {
  speakText,
  stopSpeaking,
  resolveTtsLocale,
  LANGUAGE_LOCALE_MAP,
  normalizePronunciation,
  matchesPronunciation,
} from '../speech';
import type { LanguageCode } from '@/types/learning';

vi.mock('expo-speech', () => ({
  speak: vi.fn(),
  stop: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Speech Service & TTS Locale Resolution', () => {
  const EXPECTED_MAPPINGS: Record<LanguageCode, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    it: 'it-IT',
    de: 'de-DE',
    pt: 'pt-PT',
    eu: 'eu-ES',
    ca: 'ca-ES',
  };

  it.each(Object.entries(EXPECTED_MAPPINGS))(
    'maps LanguageCode "%s" to BCP-47 locale "%s"',
    (code, expectedLocale) => {
      expect(LANGUAGE_LOCALE_MAP[code as LanguageCode]).toBe(expectedLocale);
      expect(resolveTtsLocale(code as LanguageCode)).toBe(expectedLocale);
    }
  );

  it('falls back to "en-US" when no language code is provided', () => {
    expect(resolveTtsLocale()).toBe('en-US');
    expect(resolveTtsLocale(undefined)).toBe('en-US');
    expect(resolveTtsLocale('')).toBe('en-US');
  });

  it('preserves direct BCP-47 locale strings if already supplied', () => {
    expect(resolveTtsLocale('es-MX')).toBe('es-MX');
    expect(resolveTtsLocale('en-GB')).toBe('en-GB');
    expect(resolveTtsLocale('pt-BR')).toBe('pt-BR');
  });

  it('invokes Speech.speak with mapped locale, rate and pitch', () => {
    const success = speakText('Buongiorno!', { language: 'it', rate: 0.9, pitch: 1.1 });
    expect(success).toBe(true);
    expect(Speech.stop).toHaveBeenCalledTimes(1);
    expect(Speech.speak).toHaveBeenCalledWith('Buongiorno!', {
      language: 'it-IT',
      rate: 0.9,
      pitch: 1.1,
    });
  });

  it('uses default rate (0.84) and default pitch (1.0) when not specified', () => {
    speakText('Danke schön', { language: 'de' });
    expect(Speech.speak).toHaveBeenCalledWith('Danke schön', {
      language: 'de-DE',
      rate: 0.84,
      pitch: 1.0,
    });
  });

  it('returns false and does not speak when text is empty or whitespace', () => {
    const res1 = speakText('');
    const res2 = speakText('   ');
    expect(res1).toBe(false);
    expect(res2).toBe(false);
    expect(Speech.speak).not.toHaveBeenCalled();
  });

  it('catches and handles exceptions gracefully without crashing', () => {
    vi.mocked(Speech.speak).mockImplementationOnce(() => {
      throw new Error('TTS engine unavailable');
    });

    const success = speakText('Hola mundo', { language: 'es' });
    expect(success).toBe(false);
  });

  it('stopSpeaking invokes Speech.stop safely', () => {
    stopSpeaking();
    expect(Speech.stop).toHaveBeenCalledTimes(1);
  });

  it('normalizes pronunciation text removing accents and non-alphanumeric chars', () => {
    expect(normalizePronunciation('  ¡Hola, Señor!  ')).toBe('hola senor');
    expect(normalizePronunciation('Auf Wiedersehen!')).toBe('auf wiedersehen');
    expect(normalizePronunciation('Água e Pão')).toBe('agua e pao');
  });

  it('matches pronunciation accurately after normalization', () => {
    expect(matchesPronunciation('Hello, World!', 'hello world')).toBe(true);
    expect(matchesPronunciation('¿Cómo estás?', 'como estas')).toBe(true);
    expect(matchesPronunciation('Bonjour', 'Bonsoir')).toBe(false);
  });
});
