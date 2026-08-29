import { describe, it, expect } from 'vitest';
import { UNIT_1 } from './unit-1';
import type {
  FillBlankExercise,
  ListenExercise,
  MatchExercise,
  MultipleChoiceExercise,
  SpeakExercise,
  TranslateExercise,
} from '@/types/learning';

describe('Unit 1 (EN-ES) Integrity and Structure', () => {
  it('tiene metadatos de unidad válidos y nivel A1', () => {
    expect(UNIT_1.id).toBe('u1');
    expect(UNIT_1.level).toBe('A1');
    expect(UNIT_1.title).toBe('Saludos y Básico');
    expect(UNIT_1.description.trim().length).toBeGreaterThan(0);
    expect(UNIT_1.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('contiene exactamente 2 lecciones y 11 ejercicios en total', () => {
    expect(UNIT_1.lessons).toHaveLength(2);
    const totalExercises = UNIT_1.lessons.reduce((acc, l) => acc + (l.exercises?.length ?? 0), 0);
    expect(totalExercises).toBe(11);
  });

  it('todos los IDs de lecciones y ejercicios son únicos', () => {
    const ids = new Set<string>();
    ids.add(UNIT_1.id);

    UNIT_1.lessons.forEach((lesson) => {
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);

      lesson.exercises?.forEach((exercise) => {
        expect(ids.has(exercise.id)).toBe(false);
        ids.add(exercise.id);
      });
    });
  });

  it('cada lección está vinculada correctamente a u1 y tiene nivel A1 e idioma en', () => {
    UNIT_1.lessons.forEach((lesson) => {
      expect(lesson.unitId).toBe('u1');
      expect(lesson.level).toBe('A1');
      expect(lesson.language).toBe('en');
      expect(lesson.title.trim().length).toBeGreaterThan(0);
      expect(lesson.description.trim().length).toBeGreaterThan(0);
      expect(lesson.icon?.trim().length).toBeGreaterThan(0);
      expect(lesson.words?.length).toBeGreaterThan(0);
      expect(lesson.vocab?.length).toBeGreaterThan(0);
    });
  });

  it('todo el vocabulario tiene transcripción fonética IPA válida y no vacía', () => {
    UNIT_1.lessons.forEach((lesson) => {
      lesson.vocab?.forEach((item) => {
        expect(item.en.trim().length).toBeGreaterThan(0);
        expect(item.es.trim().length).toBeGreaterThan(0);
        expect(item.ipa).toBeDefined();
        expect(typeof item.ipa).toBe('string');
        expect(item.ipa?.trim().length).toBeGreaterThan(0);
        expect(item.ipa).toMatch(/^\/.*\/$/);
      });
    });
  });

  it('existen los 6 tipos de ejercicios en el conjunto de la Unidad 1', () => {
    const types = new Set<string>();
    UNIT_1.lessons.forEach((lesson) => {
      lesson.exercises?.forEach((exercise) => {
        types.add(exercise.type);
      });
    });

    expect(types.has('multipleChoice')).toBe(true);
    expect(types.has('listen')).toBe(true);
    expect(types.has('translate')).toBe(true);
    expect(types.has('speak')).toBe(true);
    expect(types.has('match')).toBe(true);
    expect(types.has('fillBlank')).toBe(true);
    expect(types.size).toBe(6);
  });

  it('valida la corrección interna de los ejercicios de opción múltiple, listening y fillBlank', () => {
    UNIT_1.lessons.forEach((lesson) => {
      lesson.exercises?.forEach((exercise) => {
        if (exercise.type === 'multipleChoice') {
          const ex = exercise as MultipleChoiceExercise;
          expect(ex.options).toContain(ex.answer);
          expect(ex.question.trim().length).toBeGreaterThan(0);
          expect(ex.prompt.trim().length).toBeGreaterThan(0);
        }
        if (exercise.type === 'listen') {
          const ex = exercise as ListenExercise;
          expect(ex.options).toContain(ex.answer);
          expect(ex.audioText.trim().length).toBeGreaterThan(0);
          expect(ex.prompt.trim().length).toBeGreaterThan(0);
        }
        if (exercise.type === 'fillBlank') {
          const ex = exercise as FillBlankExercise;
          expect(ex.options).toContain(ex.answer);
          expect(ex.sentence).toContain('___');
          expect(ex.audioText.trim().length).toBeGreaterThan(0);
          expect(ex.translation.trim().length).toBeGreaterThan(0);
        }
      });
    });
  });

  it('valida la corrección interna de los ejercicios de traducción (wordBank)', () => {
    UNIT_1.lessons.forEach((lesson) => {
      lesson.exercises?.forEach((exercise) => {
        if (exercise.type === 'translate') {
          const ex = exercise as TranslateExercise;
          expect(ex.sourceText.trim().length).toBeGreaterThan(0);
          expect(ex.audioText.trim().length).toBeGreaterThan(0);
          expect(ex.answerWords.length).toBeGreaterThan(0);
          expect(ex.wordBank.length).toBeGreaterThanOrEqual(ex.answerWords.length);
          ex.answerWords.forEach((word) => {
            expect(ex.wordBank).toContain(word);
          });
        }
      });
    });
  });

  it('valida la corrección interna de los ejercicios de emparejamiento (match)', () => {
    UNIT_1.lessons.forEach((lesson) => {
      lesson.exercises?.forEach((exercise) => {
        if (exercise.type === 'match') {
          const ex = exercise as MatchExercise;
          expect(ex.pairs.length).toBeGreaterThanOrEqual(3);
          const enSet = new Set<string>();
          const esSet = new Set<string>();
          ex.pairs.forEach((pair) => {
            expect(pair.en.trim().length).toBeGreaterThan(0);
            expect(pair.es.trim().length).toBeGreaterThan(0);
            expect(enSet.has(pair.en)).toBe(false);
            expect(esSet.has(pair.es)).toBe(false);
            enSet.add(pair.en);
            esSet.add(pair.es);
          });
        }
      });
    });
  });

  it('valida la corrección interna de los ejercicios de pronunciación (speak)', () => {
    UNIT_1.lessons.forEach((lesson) => {
      lesson.exercises?.forEach((exercise) => {
        if (exercise.type === 'speak') {
          const ex = exercise as SpeakExercise;
          expect(ex.audioText.trim().length).toBeGreaterThan(0);
          expect(ex.translation.trim().length).toBeGreaterThan(0);
        }
      });
    });
  });
});
