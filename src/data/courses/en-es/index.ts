import type { CourseConfig } from '../types';
import type { Lesson, Unit } from '@/types/learning';
import { META_EN_ES } from './meta';
import { UNIT_1 } from './unit-1';
import { UNIT_2 } from './unit-2';
import { UNIT_3 } from './unit-3';
import { UNIT_4 } from './unit-4';
import { UNIT_5 } from './unit-5';
import { UNIT_6 } from './unit-6';
import { UNIT_7 } from './unit-7';
import { UNIT_8 } from './unit-8';
import { UNIT_9 } from './unit-9';
import { UNIT_10 } from './unit-10';

export const UNITS_EN_ES: readonly Unit[] = [
  UNIT_1,
  UNIT_2,
  UNIT_3,
  UNIT_4,
  UNIT_5,
  UNIT_6,
  UNIT_7,
  UNIT_8,
  UNIT_9,
  UNIT_10,
];

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
