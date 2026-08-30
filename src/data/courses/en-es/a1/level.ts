/**
 * @file level.ts
 * Definición académica del Nivel A1 (Acceso) para el curso inglés-español en LinguaFox.
 *
 * Articulado sobre las unidades U1 (Saludos y Básico) y U2 (Familia y Personas).
 * Estructuras inmutables y congeladas en tiempo de ejecución (deep Object.freeze).
 */

import type { CefrLevel, CompletionCriteria, LearningObjective } from '../../../../types/academic-cefr';

export const A1_LEVEL: CefrLevel = 'A1';

export const A1_REQUIRED_LESSON_IDS: readonly string[] = Object.freeze([
  'u1l1', // Unidad 1, Lección 1: Saludos
  'u1l2', // Unidad 1, Lección 2: Presentarse
  'u2l1', // Unidad 2, Lección 1: La Familia
  'u2l2', // Unidad 2, Lección 2: Descripciones
]);

export const A1_LEARNING_OBJECTIVES: readonly LearningObjective[] = Object.freeze([
  Object.freeze({
    id: 'a1-obj-reading',
    level: A1_LEVEL,
    skill: 'reading',
    description:
      'Reconocer palabras familiares y frases elementales sobre saludos, presentaciones personales y miembros de la familia.',
    required: true,
  }),
  Object.freeze({
    id: 'a1-obj-listening',
    level: A1_LEVEL,
    skill: 'listening',
    description:
      'Comprender expresiones cotidianas muy básicas sobre uno mismo y su entorno familiar inmediato cuando se articula con claridad y lentitud.',
    required: true,
  }),
  Object.freeze({
    id: 'a1-obj-writing',
    level: A1_LEVEL,
    skill: 'writing',
    description:
      'Escribir frases aisladas y sencillas para presentarse y describir características básicas de personas.',
    required: true,
  }),
  Object.freeze({
    id: 'a1-obj-speaking',
    level: A1_LEVEL,
    skill: 'speaking',
    description:
      'Participar en intercambios comunicativos muy breves respondiendo a preguntas sencillas sobre nombre, estado y familia.',
    required: true,
  }),
  Object.freeze({
    id: 'a1-obj-grammar',
    level: A1_LEVEL,
    skill: 'grammar',
    description:
      'Aplicar la estructura básica de oraciones afirmativas e interrogativas elementales con pronombres y el verbo to be.',
    required: true,
  }),
  Object.freeze({
    id: 'a1-obj-vocabulary',
    level: A1_LEVEL,
    skill: 'vocabulary',
    description:
      'Reconocer y utilizar vocabulario nuclear de fórmulas de cortesía, parentesco familiar y adjetivos calificativos iniciales.',
    required: true,
  }),
  Object.freeze({
    id: 'a1-obj-pronunciation',
    level: A1_LEVEL,
    skill: 'pronunciation',
    description:
      'Reproducir con inteligibilidad fonemas vocálicos y consonánticos básicos del inglés en fórmulas de cortesía ante evidencia de audio.',
    required: false, // La pronunciación es opcional y nunca obligatoria sin audio real
  }),
]);

const requiredObjectiveIds: readonly string[] = Object.freeze(
  A1_LEARNING_OBJECTIVES.filter((obj) => obj.required).map((obj) => obj.id)
);

export const A1_COMPLETION_CRITERIA: CompletionCriteria = Object.freeze({
  minimumScore: 70,
  requiredLessonIds: A1_REQUIRED_LESSON_IDS,
  requiredObjectiveIds,
  requireAudioForPronunciation: true,
});
