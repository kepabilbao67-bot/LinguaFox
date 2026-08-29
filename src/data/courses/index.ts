import type { CourseConfig } from './types';
import { COURSE_EN_ES } from './en-es';

export * from './types';
export { COURSE_EN_ES } from './en-es';

export const COURSES: Readonly<Record<string, CourseConfig>> = {
  'en-es': COURSE_EN_ES,
};

export function getCourse(id: string = 'en-es'): CourseConfig | undefined {
  return COURSES[id];
}
