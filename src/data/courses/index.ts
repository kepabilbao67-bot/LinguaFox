import type { CourseConfig } from './types';
import { COURSE_EN_ES } from './en-es';
import { COURSE_ES } from './es-en';
import { COURSE_IT } from './it-es';
import { COURSE_DE } from './de-es';
import { COURSE_PT } from './pt-es';
import { COURSE_EU } from './eu-es';
import { COURSE_CA } from './ca-es';

export * from './types';
export { COURSE_EN_ES } from './en-es';
export { COURSE_ES } from './es-en';
export { COURSE_IT } from './it-es';
export { COURSE_DE } from './de-es';
export { COURSE_PT } from './pt-es';
export { COURSE_EU } from './eu-es';
export { COURSE_CA } from './ca-es';

export const COURSES: Readonly<Record<string, CourseConfig>> = {
  'en-es': COURSE_EN_ES,
  'es-en': COURSE_ES,
  'it-es': COURSE_IT,
  'de-es': COURSE_DE,
  'pt-es': COURSE_PT,
  'eu-es': COURSE_EU,
  'ca-es': COURSE_CA,
};

export function getCourse(id: string = 'en-es'): CourseConfig | undefined {
  return COURSES[id];
}
