import type { Lesson, Unit } from '@/types/learning';

export interface CourseMeta {
  id: string;
  name: string;
  emoji: string;
  sourceLang: string;
  targetLang: string;
  ttsLang: string;
  direction: 'ltr' | 'rtl';
  available: boolean;
  description: string;
}

export interface CourseConfig {
  meta: CourseMeta;
  units: readonly Unit[];
  getLessonById: (id: string) => { lesson: Lesson; unit: Unit } | null;
  allLessonsFlat: () => readonly { lesson: Lesson; unit: Unit }[];
}
