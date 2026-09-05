import type { LanguageCode, TrackedError } from '@/types/learning';

export const COMMON_ERROR_TEMPLATES: readonly TrackedError[] = [
  {
    id: 'err-past-irregular-go',
    userText: 'Yesterday I goed to the park',
    correctedText: 'Yesterday I went to the park',
    explanation: '“Go” es irregular en pasado simple: go → went.',
    category: 'verb-tense',
    language: 'en',
    timestamp: Date.now() - 86400000 * 2,
    reviewed: false,
  },
  {
    id: 'err-prep-depend-on',
    userText: 'It depend of my time',
    correctedText: 'It depends on my time',
    explanation: 'En inglés la colocación correcta es “depend on”, no “depend of”.',
    category: 'preposition',
    language: 'en',
    timestamp: Date.now() - 86400000,
    reviewed: false,
  },
  {
    id: 'err-grammar-people-are',
    userText: 'People is very nice here',
    correctedText: 'People are very nice here',
    explanation: '“People” es un sustantivo plural en inglés, por lo que requiere el verbo “are”.',
    category: 'grammar',
    language: 'en',
    timestamp: Date.now() - 3600000 * 5,
    reviewed: false,
  },
  {
    id: 'err-vocab-ask-question',
    userText: 'Can I make a question?',
    correctedText: 'Can I ask a question?',
    explanation: 'En inglés se “ask a question” (se pregunta), no “make a question”.',
    category: 'vocabulary',
    language: 'en',
    timestamp: Date.now() - 3600000 * 2,
    reviewed: false,
  },
  {
    id: 'err-listen-to-music',
    userText: 'I love to listen music in the morning',
    correctedText: 'I love to listen to music in the morning',
    explanation: 'El verbo “listen” siempre exige la preposición “to” antes de su objeto: “listen to”.',
    category: 'preposition',
    language: 'en',
    timestamp: Date.now() - 3600000,
    reviewed: false,
  },
];

export function getErrorsForLanguage(
  errors: readonly TrackedError[] = [],
  language: LanguageCode
): readonly TrackedError[] {
  const custom = errors.filter((e) => e.language === language);
  if (custom.length > 0) return custom;
  return COMMON_ERROR_TEMPLATES.filter((e) => e.language === language || language === 'en');
}
