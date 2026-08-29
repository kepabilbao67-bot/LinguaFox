import type { CourseConfig } from '../types';
import type { Lesson, Unit } from '@/types/learning';
import { META_EN_ES } from './meta';
import { UNIT_1 } from './unit-1';

export const UNITS_EN_ES: readonly Unit[] = [UNIT_1];

export function getLessonById(id: string): { lesson: Lesson; unit: Unit } | null {
  for (const unit of UNITS_EN_ES) {
    const found = unit.lessons.find((l) => l.id === id);
    if (found) return { lesson: found, unit };
  }
  return null;
}

export function allLessonsFlat(): readonly { lesson: Lesson; unit: Unit }[] {
  const result: { lesson: Lesson; unit: Unit }[] = [];
  for (const unit of UNITS_EN_ES) {
    for (const lesson of unit.lessons) {
      result.push({ lesson, unit });
    }
  }
  return result;
}

export const COURSE_EN_ES: CourseConfig = {
  meta: META_EN_ES,
  units: UNITS_EN_ES,
  getLessonById,
  allLessonsFlat,
};
