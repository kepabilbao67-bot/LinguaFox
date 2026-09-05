import { describe, expect, it } from 'vitest';
import { COURSE_ES, UNITS_ES } from './es-en';
import { COURSE_IT, UNITS_IT } from './it-es';
import { COURSE_DE, UNITS_DE } from './de-es';
import { COURSE_PT, UNITS_PT } from './pt-es';
import { COURSE_EU, UNITS_EU } from './eu-es';
import { COURSE_CA, UNITS_CA } from './ca-es';
import { getLessonsByLanguage, getLessonById, LESSONS_BY_LANGUAGE } from '../lessons';
import type { LanguageCode } from '@/types/learning';

const MULTILINGUAL_COURSES = [
  { code: 'es' as LanguageCode, name: 'Español', config: COURSE_ES, units: UNITS_ES, count: 10 },
  { code: 'it' as LanguageCode, name: 'Italiano', config: COURSE_IT, units: UNITS_IT, count: 10 },
  { code: 'de' as LanguageCode, name: 'Alemán', config: COURSE_DE, units: UNITS_DE, count: 10 },
  { code: 'pt' as LanguageCode, name: 'Portugués', config: COURSE_PT, units: UNITS_PT, count: 10 },
  { code: 'eu' as LanguageCode, name: 'Euskera', config: COURSE_EU, units: UNITS_EU, count: 10 },
  { code: 'ca' as LanguageCode, name: 'Catalán', config: COURSE_CA, units: UNITS_CA, count: 10 },
] as const;

describe('Multilingual A1 Curriculum Suite (ES, IT, DE, PT, EU, CA)', () => {
  it.each(MULTILINGUAL_COURSES)(
    'ensures $name course has valid A1 units and lessons',
    ({ code, config, units, count }) => {
      expect(units.length).toBe(5);
      expect(config.units.length).toBe(5);

      const flat = config.allLessonsFlat();
      expect(flat.length).toBe(count);

      // Verify all units are strictly A1
      for (const unit of units) {
        expect(unit.level).toBe('A1');
        expect(unit.title.trim().length).toBeGreaterThan(0);
        expect(unit.description.trim().length).toBeGreaterThan(0);
        expect(unit.lessons.length).toBeGreaterThanOrEqual(1);

        for (const lesson of unit.lessons) {
          expect(lesson.language).toBe(code);
          expect(lesson.level).toBe('A1');
          expect(lesson.unitId).toBe(unit.id);
          expect(lesson.title.trim().length).toBeGreaterThan(0);
          expect(lesson.description.trim().length).toBeGreaterThan(0);
          expect(lesson.words.length).toBeGreaterThanOrEqual(5);

          // Word validation
          for (const word of lesson.words) {
            expect(word.id.trim().length).toBeGreaterThan(0);
            expect(word.source.trim().length).toBeGreaterThan(0);
            expect(word.translation.trim().length).toBeGreaterThan(0);
          }

          // Vocab with IPA if present
          if (lesson.vocab) {
            for (const item of lesson.vocab) {
              expect(item.en.trim().length).toBeGreaterThan(0);
              expect(item.es.trim().length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  );

  it('ensures all unit and lesson IDs are globally unique across all courses', () => {
    const globalUnitIds = new Set<string>();
    const globalLessonIds = new Set<string>();

    for (const { units } of MULTILINGUAL_COURSES) {
      for (const unit of units) {
        expect(globalUnitIds.has(unit.id)).toBe(false);
        globalUnitIds.add(unit.id);

        for (const lesson of unit.lessons) {
          expect(globalLessonIds.has(lesson.id)).toBe(false);
          globalLessonIds.add(lesson.id);
        }
      }
    }
  });

  it('ensures LESSONS_BY_LANGUAGE exposes all A1 lessons for es, it, de, pt', () => {
    for (const { code, count } of MULTILINGUAL_COURSES) {
      const lessons = getLessonsByLanguage(code);
      expect(lessons.length).toBe(count);
      expect(LESSONS_BY_LANGUAGE[code].length).toBe(count);

      for (const lesson of lessons) {
        expect(lesson.language).toBe(code);
        const retrieved = getLessonById(lesson.id, code);
        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe(lesson.id);
      }
    }
  });

  it('ensures getLessonById on CourseConfig finds every lesson correctly', () => {
    for (const { config } of MULTILINGUAL_COURSES) {
      for (const { lesson } of config.allLessonsFlat()) {
        const found = config.getLessonById(lesson.id);
        expect(found).not.toBeNull();
        expect(found?.lesson.id).toBe(lesson.id);
        expect(found?.unit.id).toBe(lesson.unitId);
      }
    }
  });

  it('validates exercises structure on newly created lessons where defined', () => {
    for (const { config } of MULTILINGUAL_COURSES) {
      for (const { lesson } of config.allLessonsFlat()) {
        if (!lesson.exercises) continue;
        for (const ex of lesson.exercises) {
          expect(ex.id.trim().length).toBeGreaterThan(0);
          expect(ex.prompt.trim().length).toBeGreaterThan(0);
          if (ex.type === 'multipleChoice') {
            expect(ex.options).toContain(ex.answer);
          }
        }
      }
    }
  });
});
