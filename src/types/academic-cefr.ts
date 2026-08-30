/**
 * @file academic-cefr.ts
 * Contratos estrictos y tipos puros para el Marco Común Europeo de Referencia (MCER / CEFR)
 * en LinguaFox.
 *
 * REGLAS FUNDAMENTALES:
 * 1. Independencia total de gamificación (sin XP, gemas, coronas, estrellas ni rachas).
 * 2. Criterios de evaluación académica objetivos en escala 0 a 100.
 * 3. Restricción estricta de evaluación de pronunciación únicamente ante evidencia de audio real.
 * 4. Funciones 100 % puras y deterministas, libres de dependencias de red, almacenamiento o UI.
 */

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const CEFR_LEVELS: readonly CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type AcademicSkill =
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation';

export interface LearningObjective {
  readonly id: string;
  readonly level: CefrLevel;
  readonly skill: AcademicSkill;
  readonly description: string;
  readonly required: boolean;
}

export interface CompletionCriteria {
  readonly minimumScore: number;
  readonly requiredLessonIds: readonly string[];
  readonly requiredObjectiveIds: readonly string[];
  readonly requireAudioForPronunciation: boolean;
}

export type EvidenceType = 'exercise' | 'text' | 'audio' | 'conversation' | 'none';

export interface SkillScore {
  readonly skill: AcademicSkill;
  readonly score: number;
  readonly assessed: boolean;
  readonly evidenceType: EvidenceType;
}

export interface LevelAssessment {
  readonly id: string;
  readonly level: CefrLevel;
  readonly title: string;
  readonly objectives: readonly LearningObjective[];
  readonly skillScores: readonly SkillScore[];
  readonly overallScore: number | null;
  readonly passed: boolean;
  readonly completedAt?: number;
}

export interface AcademicProgress {
  readonly courseId: string;
  readonly currentLevel: CefrLevel;
  readonly completedLessonIds: readonly string[];
  readonly completedUnitIds: readonly string[];
  readonly passedLevelIds: readonly CefrLevel[];
  readonly assessments: readonly LevelAssessment[];
  readonly updatedAt: number;
}

/**
 * Validador de tipo (Type Guard) para comprobar si un valor arbitrario es un nivel MCER válido.
 */
export function isCefrLevel(value: unknown): value is CefrLevel {
  return typeof value === 'string' && (CEFR_LEVELS as readonly string[]).includes(value);
}

/**
 * Devuelve el siguiente nivel en la escala canónica MCER A1 -> C2, o null si ya se alcanzó el nivel C2.
 */
export function getNextCefrLevel(level: CefrLevel): CefrLevel | null {
  const index = CEFR_LEVELS.indexOf(level);
  if (index === -1 || index === CEFR_LEVELS.length - 1) {
    return null;
  }
  return CEFR_LEVELS[index + 1];
}

/**
 * Comprueba si una puntuación académica es un número finito válido dentro del rango [0, 100].
 */
export function isValidAcademicScore(score: number): boolean {
  return typeof score === 'number' && Number.isFinite(score) && !Number.isNaN(score) && score >= 0 && score <= 100;
}

/**
 * Calcula la puntuación global académica promedio redondeada a partir de las destrezas evaluadas.
 *
 * Secuencia de evaluación estricta:
 * 1. Omite cualquier destreza con assessed = false.
 * 2. Omite la destreza de 'pronunciation' inmediatamente si evidenceType !== 'audio'.
 * 3. Valida que la puntuación de la destreza evaluada sea un valor académico válido. Si no lo es, devuelve null.
 * 4. Si no hay ninguna destreza válida evaluada, devuelve null.
 */
export function calculateOverallScore(scores: readonly SkillScore[]): number | null {
  if (!Array.isArray(scores) || scores.length === 0) {
    return null;
  }

  let totalScore = 0;
  let assessedCount = 0;

  for (const s of scores) {
    // 1. Exclusión de elementos no evaluados
    if (!s || !s.assessed) {
      continue;
    }

    // 2. Exclusión inmediata de pronunciación si no dispone de evidencia de audio real
    if (s.skill === 'pronunciation' && s.evidenceType !== 'audio') {
      continue;
    }

    // 3. Validación de integridad de la puntuación en la destreza evaluable
    if (!isValidAcademicScore(s.score)) {
      return null;
    }

    totalScore += s.score;
    assessedCount++;
  }

  if (assessedCount === 0) {
    return null;
  }

  return Math.round(totalScore / assessedCount);
}

/**
 * Determina si una evaluación académica ha sido superada.
 *
 * Devuelve false si:
 * - El umbral minimumScore no es válido (no está en [0, 100]).
 * - No existen puntuaciones o no hay destrezas evaluables.
 * - Alguna destreza evaluada contiene valores numéricos inválidos.
 * - La nota global calculada es inferior a minimumScore.
 */
export function hasPassedAssessment(
  scores: readonly SkillScore[],
  minimumScore: number
): boolean {
  if (!isValidAcademicScore(minimumScore)) {
    return false;
  }

  const overall = calculateOverallScore(scores);
  if (overall === null) {
    return false;
  }

  return overall >= minimumScore;
}
