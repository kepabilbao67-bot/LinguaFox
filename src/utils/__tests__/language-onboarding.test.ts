import { describe, expect, it } from 'vitest';
import { sanitizeProgress, DEFAULT_PROGRESS } from '../progress-storage';
import { getLessonsByLanguage } from '../../data/lessons';
import type { LanguageCode } from '@/types/learning';

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'es', 'fr', 'it', 'de', 'pt', 'eu', 'ca'];

describe('Multilingual Onboarding and Language Selection Suite', () => {
  it.each(SUPPORTED_LANGUAGES)('allows selecting and persisting %s as target language', (lang) => {
    // 1. Must have lessons in curriculum
    const lessons = getLessonsByLanguage(lang);
    expect(lessons).toBeDefined();
    expect(lessons.length).toBeGreaterThan(0);

    // 2. sanitizeProgress accepts and preserves it
    const state = sanitizeProgress({
      idiomaNativo: 'es',
      idiomaObjetivo: lang,
      onboardingCompleto: true,
    });

    expect(state.idiomaNativo).toBe('es');
    expect(state.idiomaObjetivo).toBe(lang);
    expect(state.onboardingCompleto).toBe(true);
  });

  it.each(SUPPORTED_LANGUAGES)('allows selecting and persisting %s as native language', (lang) => {
    const state = sanitizeProgress({
      idiomaNativo: lang,
      idiomaObjetivo: 'en',
    });

    expect(state.idiomaNativo).toBe(lang);
    expect(state.idiomaObjetivo).toBe('en');
  });

  it('rejects invalid or unsupported language codes and falls back to default', () => {
    const state = sanitizeProgress({
      idiomaNativo: 'klingon' as any,
      idiomaObjetivo: 'valyrian' as any,
    });

    expect(state.idiomaNativo).toBe(DEFAULT_PROGRESS.idiomaNativo);
    expect(state.idiomaObjetivo).toBe(DEFAULT_PROGRESS.idiomaObjetivo);
  });

  it('migrates legacy single "idioma" field properly when valid', () => {
    const state = sanitizeProgress({
      idioma: 'it',
    });

    expect(state.idiomaNativo).toBe('es');
    expect(state.idiomaObjetivo).toBe('it');
  });

  it('migrates legacy single "idioma" field to default when invalid', () => {
    const state = sanitizeProgress({
      idioma: 'invalid_code',
    });

    expect(state.idiomaNativo).toBe('es');
    expect(state.idiomaObjetivo).toBe('en');
  });
});
