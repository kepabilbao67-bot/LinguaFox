import type { LanguageCode, Lesson } from '@/types/learning';

const ENGLISH_LESSONS: readonly Lesson[] = [
  {
    id: 'basico-1',
    title: 'Básico 1',
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
    title: 'Básico 2',
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
    title: 'Viajes',
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
] as const;

const FRENCH_LESSONS: readonly Lesson[] = [
  { id: 'basico-1', title: 'Bases 1', description: 'Saludos y expresiones esenciales', language: 'fr', words: [{ id:'bonjour',source:'bonjour',translation:'hola'},{id:'aurevoir',source:'au revoir',translation:'adiós'},{id:'silvousplait',source:"s'il vous plaît",translation:'por favor'},{id:'merci',source:'merci',translation:'gracias'},{id:'oui',source:'oui',translation:'sí'},{id:'non',source:'non',translation:'no'}] },
  { id: 'basico-2', title: 'Bases 2', description: 'Objetos y palabras cotidianas', language: 'fr', words: [{id:'eau',source:'eau',translation:'agua'},{id:'pain',source:'pain',translation:'pan'},{id:'maison',source:'maison',translation:'casa'},{id:'chien',source:'chien',translation:'perro'},{id:'chat',source:'chat',translation:'gato'},{id:'livre',source:'livre',translation:'libro'}] },
  { id: 'viajes', title: 'Viajes', description: 'Vocabulario para moverte por el mundo', language: 'fr', words: [{id:'aeroport',source:'aéroport',translation:'aeropuerto'},{id:'billet',source:'billet',translation:'billete'},{id:'train',source:'train',translation:'tren'},{id:'plage',source:'plage',translation:'playa'},{id:'carte',source:'carte',translation:'mapa'},{id:'valise',source:'valise',translation:'maleta'}] },
] as const;

export const LESSONS_BY_LANGUAGE: Readonly<Record<LanguageCode, readonly Lesson[]>> = { en: ENGLISH_LESSONS, fr: FRENCH_LESSONS, es: [], it: [], de: [], pt: [] };
export const LESSONS: readonly Lesson[] = [...ENGLISH_LESSONS, ...FRENCH_LESSONS];

export function getLessonById(id: string | undefined, language: LanguageCode = 'en'): Lesson | undefined {
  return id ? LESSONS_BY_LANGUAGE[language].find((lesson) => lesson.id === id) : undefined;
}

export function getLessonsByLanguage(language: LanguageCode): readonly Lesson[] {
  return LESSONS_BY_LANGUAGE[language] ?? [];
}

export function getProgressKey(language: LanguageCode, lessonId: string): string { return `${language}:${lessonId}`; }
