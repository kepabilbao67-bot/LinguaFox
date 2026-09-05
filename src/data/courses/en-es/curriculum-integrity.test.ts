import { describe, expect, it } from 'vitest';
import { COURSE_EN_ES, UNITS_EN_ES, getLessonById, allLessonsFlat } from './index';
import { getLessonById as getLessonFromData, getLessonsByLanguage } from '../../lessons';

describe('English Course (en-es) - Curriculum Integrity Suite A1-C2', () => {
  it('contains exactly 12 units spanning all CEFR levels from A1 to C2', () => {
    expect(UNITS_EN_ES.length).toBe(12);
    expect(COURSE_EN_ES.units.length).toBe(12);

    const levels = UNITS_EN_ES.map((u) => u.level);
    expect(levels).toEqual(['A1', 'A1', 'A2', 'A2', 'B1', 'B1', 'B2', 'B2', 'C1', 'C1', 'C2', 'C2']);
  });

  it('contains exactly 24 real lessons with 4 real lessons per CEFR level (A1-C2)', () => {
    const flat = allLessonsFlat();
    expect(flat.length).toBe(24);

    const lessonsByLevel: Record<string, number> = {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
      C1: 0,
      C2: 0,
    };

    for (const { lesson } of flat) {
      expect(lesson.level).toBeDefined();
      lessonsByLevel[lesson.level!] = (lessonsByLevel[lesson.level!] || 0) + 1;
    }

    expect(lessonsByLevel.A1).toBe(4);
    expect(lessonsByLevel.A2).toBe(4);
    expect(lessonsByLevel.B1).toBe(4);
    expect(lessonsByLevel.B2).toBe(4);
    expect(lessonsByLevel.C1).toBe(4);
    expect(lessonsByLevel.C2).toBe(4);
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

  it('ensures all C2 exercises are valid with prompt, options and answers', () => {
    const c2Lessons = allLessonsFlat().filter(({ lesson }) => lesson.level === 'C2');
    expect(c2Lessons.length).toBe(4);

    for (const { lesson } of c2Lessons) {
      expect(lesson.exercises).toBeDefined();
      expect(lesson.exercises!.length).toBeGreaterThanOrEqual(3);

      for (const ex of lesson.exercises!) {
        expect(ex.id.trim().length).toBeGreaterThan(0);
        expect(ex.prompt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('retrieves every lesson by ID through getLessonById including C2 lessons', () => {
    for (const { lesson } of allLessonsFlat()) {
      const result = getLessonById(lesson.id);
      expect(result).not.toBeNull();
      expect(result?.lesson.id).toBe(lesson.id);
      expect(result?.unit.id).toBe(lesson.unitId);

      const fromData = getLessonFromData(lesson.id, 'en');
      expect(fromData).toBeDefined();
      expect(fromData?.id).toBe(lesson.id);
    }
  });

  it('makes all 24 English lessons visible to getLessonsByLanguage', () => {
    const lessons = getLessonsByLanguage('en');
    expect(lessons.length).toBe(24);
  });

  it('correctly identifies secondary courses as initial A1 content', () => {
    const spanish = getLessonsByLanguage('es');
    const german = getLessonsByLanguage('de');
    const italian = getLessonsByLanguage('it');
    const portuguese = getLessonsByLanguage('pt');

    expect(spanish.length).toBe(10);
    expect(german.length).toBe(10);
    expect(italian.length).toBe(10);
    expect(portuguese.length).toBe(10);

    // All secondary course lessons are A1
    expect(spanish.every((l) => (l.level ?? 'A1') === 'A1')).toBe(true);
    expect(german.every((l) => (l.level ?? 'A1') === 'A1')).toBe(true);
  });
});
