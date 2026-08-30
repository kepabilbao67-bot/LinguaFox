import { describe, expect, it } from 'vitest';
import { COURSE_EN_ES, UNITS_EN_ES, getLessonById, allLessonsFlat } from './index';
import { getLessonById as getLessonFromData, getLessonsByLanguage } from '../../lessons';

describe('English Course (en-es) - Curriculum Integrity Suite', () => {
  it('contains exactly 10 units spanning CEFR levels A1 to C1', () => {
    expect(UNITS_EN_ES.length).toBe(10);
    expect(COURSE_EN_ES.units.length).toBe(10);

    const levels = UNITS_EN_ES.map((u) => u.level);
    expect(levels).toEqual(['A1', 'A1', 'A2', 'A2', 'B1', 'B1', 'B2', 'B2', 'C1', 'C1']);
  });

  it('contains exactly 20 lessons across all 10 units', () => {
    const flat = allLessonsFlat();
    expect(flat.length).toBe(20);

    for (const unit of UNITS_EN_ES) {
      expect(unit.lessons.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('ensures all unit IDs and lesson IDs are unique and well-formatted', () => {
    const unitIds = new Set<string>();
    const lessonIds = new Set<string>();

    for (const unit of UNITS_EN_ES) {
      expect(unitIds.has(unit.id)).toBe(false);
      unitIds.add(unit.id);
      expect(unit.title.trim().length).toBeGreaterThan(0);
      expect(unit.description.trim().length).toBeGreaterThan(0);

      for (const lesson of unit.lessons) {
        expect(lessonIds.has(lesson.id)).toBe(false);
        lessonIds.add(lesson.id);
        expect(lesson.unitId).toBe(unit.id);
        expect(lesson.title.trim().length).toBeGreaterThan(0);
        expect(lesson.words.length).toBeGreaterThan(0);
      }
    }
  });

  it('ensures all 111 exercises are strictly valid with no missing or corrupted fields', () => {
    const exerciseIds = new Set<string>();
    let totalExercises = 0;

    for (const { lesson } of allLessonsFlat()) {
      expect(lesson.exercises).toBeDefined();
      expect(lesson.exercises!.length).toBeGreaterThan(0);

      for (const ex of lesson.exercises!) {
        totalExercises++;
        expect(exerciseIds.has(ex.id)).toBe(false);
        exerciseIds.add(ex.id);
        expect(ex.prompt.trim().length).toBeGreaterThan(0);

        switch (ex.type) {
          case 'multipleChoice':
            expect(ex.question.trim().length).toBeGreaterThan(0);
            expect(ex.options.length).toBeGreaterThanOrEqual(2);
            expect(ex.options).toContain(ex.answer);
            break;

          case 'listen':
            expect(ex.audioText.trim().length).toBeGreaterThan(0);
            expect(ex.options.length).toBeGreaterThanOrEqual(2);
            expect(ex.options).toContain(ex.answer);
            break;

          case 'translate':
            expect(ex.sourceText.trim().length).toBeGreaterThan(0);
            expect(ex.audioText.trim().length).toBeGreaterThan(0);
            expect(ex.wordBank.length).toBeGreaterThanOrEqual(ex.answerWords.length);
            for (const word of ex.answerWords) {
              expect(ex.wordBank).toContain(word);
            }
            break;

          case 'speak':
            expect(ex.audioText.trim().length).toBeGreaterThan(0);
            expect(ex.translation.trim().length).toBeGreaterThan(0);
            break;

          case 'match':
            expect(ex.pairs.length).toBeGreaterThanOrEqual(2);
            for (const pair of ex.pairs) {
              expect(pair.en.trim().length).toBeGreaterThan(0);
              expect(pair.es.trim().length).toBeGreaterThan(0);
            }
            break;

          case 'fillBlank':
            expect(ex.sentence.trim().length).toBeGreaterThan(0);
            expect(ex.options.length).toBeGreaterThanOrEqual(2);
            expect(ex.options).toContain(ex.answer);
            expect(ex.translation.trim().length).toBeGreaterThan(0);
            break;
        }
      }
    }

    expect(totalExercises).toBe(111);
  });

  it('retrieves every lesson by ID through getLessonById', () => {
    for (const { lesson } of allLessonsFlat()) {
      const result = getLessonById(lesson.id);
      expect(result).not.toBeNull();
      expect(result?.lesson.id).toBe(lesson.id);
      expect(result?.unit.id).toBe(lesson.unitId);

      // Also via main data provider
      const fromData = getLessonFromData(lesson.id, 'en');
      expect(fromData).toBeDefined();
      expect(fromData?.id).toBe(lesson.id);
    }
  });

  it('makes all 20 English lessons visible to getLessonsByLanguage', () => {
    const lessons = getLessonsByLanguage('en');
    expect(lessons.length).toBe(20);
  });

  it('preserves legacy lesson IDs for backwards compatibility', () => {
    expect(getLessonFromData('basico-1', 'en')).toBeDefined();
    expect(getLessonFromData('basico-2', 'en')).toBeDefined();
    expect(getLessonFromData('viajes', 'en')).toBeDefined();
  });
});
