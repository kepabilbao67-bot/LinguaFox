import { describe, it, expect, vi } from 'vitest';
import { safeLoadProgress, sanitizeProgress, STORAGE_KEY } from '../progress-storage';

describe('Progress Storage (JSON Corruption Handling)', () => {
  it('Carga correctamente un JSON válido sin corromper', async () => {
    const getItem = vi.fn().mockResolvedValue('{"leccionesCompletadas":[]}');
    const setItem = vi.fn().mockResolvedValue(undefined);
    
    const result = await safeLoadProgress(getItem, setItem, 1000);
    
    expect(result.isCorrupted).toBe(false);
    expect(result.rawData).toBe('{"leccionesCompletadas":[]}');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('Detecta JSON corrupto respaldado y NO devuelve rawData (JSON corrupto respaldado)', async () => {
    const getItem = vi.fn().mockResolvedValue('{ json corrupto');
    const setItem = vi.fn().mockResolvedValue(undefined);
    
    const result = await safeLoadProgress(getItem, setItem, 12345);
    
    expect(result.isCorrupted).toBe(true);
    expect(result.rawData).toBeNull();
    // JSON corrupto respaldado
    expect(setItem).toHaveBeenCalledWith(`${STORAGE_KEY}_corrupted_12345`, '{ json corrupto');
  });

  it('Fallo al crear el respaldo no crashea (captura error y marca isCorrupted)', async () => {
    const getItem = vi.fn().mockResolvedValue('{ json corrupto');
    const setItem = vi.fn().mockRejectedValue(new Error('Storage full'));
    
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    const result = await safeLoadProgress(getItem, setItem, 999);
    
    expect(result.isCorrupted).toBe(true);
    expect(result.rawData).toBeNull();
    expect(console.error).toHaveBeenCalled();
    
    console.error = originalConsoleError;
  });
});

describe('Pronunciation Challenge ID Migration in sanitizeProgress', () => {
  it('en-1 migra a en-w-coffee', () => {
    const raw = {
      completedPronunciationChallenges: {
        'en-1': '2026-09-01T10:00:00.000Z',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.completedPronunciationChallenges).toEqual({
      'en-w-coffee': '2026-09-01T10:00:00.000Z',
    });
    expect(sanitized.completedPronunciationChallenges?.['en-1']).toBeUndefined();
  });

  it('en-2 migra a en-th-third', () => {
    const raw = {
      completedPronunciationChallenges: {
        'en-2': '2026-09-02T12:00:00.000Z',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.completedPronunciationChallenges).toEqual({
      'en-th-third': '2026-09-02T12:00:00.000Z',
    });
  });

  it('es-1 migra a es-rr-perro', () => {
    const raw = {
      completedPronunciationChallenges: {
        'es-1': '2026-09-03',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.completedPronunciationChallenges).toEqual({
      'es-rr-perro': '2026-09-03',
    });
  });

  it('múltiples legacy IDs migran correctamente', () => {
    const raw = {
      completedPronunciationChallenges: {
        'en-1': '2026-09-01',
        'en-2': '2026-09-02',
        'en-3': '2026-09-03',
        'es-1': '2026-09-04',
        'es-2': '2026-09-05',
        'fr-1': '2026-09-06',
        'fr-2': '2026-09-07',
        'it-1': '2026-09-08',
        'it-2': '2026-09-09',
        'de-1': '2026-09-10',
        'de-2': '2026-09-11',
        'pt-1': '2026-09-12',
        'eu-1': '2026-09-13',
        'ca-1': '2026-09-14',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.completedPronunciationChallenges).toEqual({
      'en-w-coffee': '2026-09-01',
      'en-th-third': '2026-09-02',
      'en-stress-hotel': '2026-09-03',
      'es-rr-perro': '2026-09-04',
      'es-clusters-fruta': '2026-09-05',
      'fr-r-croissant': '2026-09-06',
      'fr-vowels-tour': '2026-09-07',
      'it-double-cappuccino': '2026-09-08',
      'it-zz-piazza': '2026-09-09',
      'de-ch-wasser': '2026-09-10',
      'de-sch-entschuldigung': '2026-09-11',
      'pt-nasal-pao': '2026-09-12',
      'eu-affricates-kafe': '2026-09-13',
      'ca-neutral-cafe': '2026-09-14',
    });
  });

  it('legacy + nuevo no duplica entrada', () => {
    const raw = {
      completedPronunciationChallenges: {
        'en-1': '2026-09-01T08:00:00.000Z',
        'en-w-coffee': '2026-09-01T12:00:00.000Z',
      },
    };
    const sanitized = sanitizeProgress(raw);
    const keys = Object.keys(sanitized.completedPronunciationChallenges ?? {});
    expect(keys).toEqual(['en-w-coffee']);
    expect(keys.length).toBe(1);
    expect(sanitized.completedPronunciationChallenges?.['en-w-coffee']).toBeDefined();
  });

  it('migración no modifica experiencia', () => {
    const raw = {
      experiencia: 140,
      completedPronunciationChallenges: {
        'en-1': '2026-09-01',
        'fr-1': '2026-09-02',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.experiencia).toBe(140);
  });

  it('migración no incrementa spokenPhrases', () => {
    const raw = {
      spokenPhrasesCount: 5,
      completedPronunciationChallenges: {
        'en-1': '2026-09-01',
        'de-1': '2026-09-02',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.spokenPhrasesCount).toBe(5);
  });

  it('datos sin legacy permanecen iguales', () => {
    const raw = {
      completedPronunciationChallenges: {
        'en-w-coffee': '2026-09-05',
        'es-rr-perro': '2026-09-05',
      },
    };
    const sanitized = sanitizeProgress(raw);
    expect(sanitized.completedPronunciationChallenges).toEqual({
      'en-w-coffee': '2026-09-05',
      'es-rr-perro': '2026-09-05',
    });
  });
});
