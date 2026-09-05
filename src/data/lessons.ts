import type { LanguageCode, Lesson } from '@/types/learning';
import { COURSE_EN_ES } from './courses/en-es';
import { COURSE_ES } from './courses/es-en';
import { COURSE_IT } from './courses/it-es';
import { COURSE_DE } from './courses/de-es';
import { COURSE_PT } from './courses/pt-es';
import { COURSE_EU } from './courses/eu-es';
import { COURSE_CA } from './courses/ca-es';

// Lecciones oficiales de cada curso
const ENGLISH_COURSE_LESSONS: readonly Lesson[] = COURSE_EN_ES.allLessonsFlat().map(({ lesson }) => lesson);
const SPANISH_COURSE_LESSONS: readonly Lesson[] = COURSE_ES.allLessonsFlat().map(({ lesson }) => lesson);
const ITALIAN_COURSE_LESSONS: readonly Lesson[] = COURSE_IT.allLessonsFlat().map(({ lesson }) => lesson);
const GERMAN_COURSE_LESSONS: readonly Lesson[] = COURSE_DE.allLessonsFlat().map(({ lesson }) => lesson);
const PORTUGUESE_COURSE_LESSONS: readonly Lesson[] = COURSE_PT.allLessonsFlat().map(({ lesson }) => lesson);
const BASQUE_COURSE_LESSONS: readonly Lesson[] = COURSE_EU.allLessonsFlat().map(({ lesson }) => lesson);
const CATALAN_COURSE_LESSONS: readonly Lesson[] = COURSE_CA.allLessonsFlat().map(({ lesson }) => lesson);

// Fallbacks de compatibilidad para IDs antiguos
const LEGACY_ENGLISH_LESSONS: readonly Lesson[] = [
  {
    id: 'basico-1',
    title: 'Básico 1 (Legacy)',
    description: 'Saludos y expresiones esenciales',
    language: 'en',
    words: [
      { id: 'hello', source: 'hello', translation: 'hola' },
      { id: 'goodbye', source: 'goodbye', translation: 'adiós' },
      { id: 'please', source: 'please', translation: 'por favor' },
      { id: 'thank-you', source: 'thank you', translation: 'gracias' },
      { id: 'yes', source: 'yes', translation: 'sí' },
      { id: 'no', source: 'no', translation: 'no' },
    ],
  },
  {
    id: 'basico-2',
    title: 'Básico 2 (Legacy)',
    description: 'Objetos y palabras cotidianas',
    language: 'en',
    words: [
      { id: 'water', source: 'water', translation: 'agua' },
      { id: 'bread', source: 'bread', translation: 'pan' },
      { id: 'house', source: 'house', translation: 'casa' },
      { id: 'dog', source: 'dog', translation: 'perro' },
      { id: 'cat', source: 'cat', translation: 'gato' },
      { id: 'book', source: 'book', translation: 'libro' },
    ],
  },
  {
    id: 'viajes',
    title: 'Viajes (Legacy)',
    description: 'Vocabulario para moverte por el mundo',
    language: 'en',
    words: [
      { id: 'airport', source: 'airport', translation: 'aeropuerto' },
      { id: 'ticket', source: 'ticket', translation: 'billete' },
      { id: 'train', source: 'train', translation: 'tren' },
      { id: 'beach', source: 'beach', translation: 'playa' },
      { id: 'map', source: 'map', translation: 'mapa' },
      { id: 'suitcase', source: 'suitcase', translation: 'maleta' },
    ],
  },
];

export const ENGLISH_LESSONS: readonly Lesson[] = ENGLISH_COURSE_LESSONS;
export const SPANISH_LESSONS: readonly Lesson[] = SPANISH_COURSE_LESSONS;
export const ITALIAN_LESSONS: readonly Lesson[] = ITALIAN_COURSE_LESSONS;
export const GERMAN_LESSONS: readonly Lesson[] = GERMAN_COURSE_LESSONS;
export const PORTUGUESE_LESSONS: readonly Lesson[] = PORTUGUESE_COURSE_LESSONS;
export const BASQUE_LESSONS: readonly Lesson[] = BASQUE_COURSE_LESSONS;
export const CATALAN_LESSONS: readonly Lesson[] = CATALAN_COURSE_LESSONS;

const FRENCH_LESSONS: readonly Lesson[] = [
  { id: 'basico-1', title: 'Bases 1', description: 'Saludos y expresiones esenciales', language: 'fr', words: [{ id:'bonjour',source:'bonjour',translation:'hola'},{id:'aurevoir',source:'au revoir',translation:'adiós'},{id:'silvousplait',source:"s'il vous plaît",translation:'por favor'},{id:'merci',source:'merci',translation:'gracias'},{id:'oui',source:'oui',translation:'sí'},{id:'non',source:'non',translation:'no'}] },
  { id: 'basico-2', title: 'Bases 2', description: 'Objetos y palabras cotidianas', language: 'fr', words: [{id:'eau',source:'eau',translation:'agua'},{id:'pain',source:'pain',translation:'pan'},{id:'maison',source:'maison',translation:'casa'},{id:'chien',source:'chien',translation:'perro'},{id:'chat',source:'chat',translation:'gato'},{id:'livre',source:'livre',translation:'libro'}] },
  { id: 'viajes', title: 'Viajes', description: 'Vocabulario para moverte por el mundo', language: 'fr', words: [{id:'aeroport',source:'aéroport',translation:'aeropuerto'},{id:'billet',source:'billet',translation:'billete'},{id:'train',source:'train',translation:'tren'},{id:'plage',source:'plage',translation:'playa'},{id:'carte',source:'carte',translation:'mapa'},{id:'valise',source:'valise',translation:'maleta'}] },
] as const;

export const LESSONS_BY_LANGUAGE: Readonly<Record<LanguageCode, readonly Lesson[]>> = {
  en: ENGLISH_LESSONS,
  fr: FRENCH_LESSONS,
  es: SPANISH_LESSONS,
  it: ITALIAN_LESSONS,
  de: GERMAN_LESSONS,
  pt: PORTUGUESE_LESSONS,
  eu: BASQUE_LESSONS,
  ca: CATALAN_LESSONS,
};

export const LESSONS: readonly Lesson[] = [
  ...ENGLISH_LESSONS,
  ...FRENCH_LESSONS,
  ...SPANISH_LESSONS,
  ...ITALIAN_LESSONS,
  ...GERMAN_LESSONS,
  ...PORTUGUESE_LESSONS,
  ...BASQUE_LESSONS,
  ...CATALAN_LESSONS,
];


export function getLessonById(id: string | undefined, language: LanguageCode = 'en'): Lesson | undefined {
  if (!id) return undefined;
  const found = LESSONS_BY_LANGUAGE[language]?.find((lesson) => lesson.id === id);
  if (found) return found;
  if (language === 'en') {
    return LEGACY_ENGLISH_LESSONS.find((l) => l.id === id);
  }
  return undefined;
}

export function getLessonsByLanguage(language: LanguageCode): readonly Lesson[] {
  return LESSONS_BY_LANGUAGE[language] ?? [];
}

export function getProgressKey(language: LanguageCode, lessonId: string): string {
  return `${language}:${lessonId}`;
}
