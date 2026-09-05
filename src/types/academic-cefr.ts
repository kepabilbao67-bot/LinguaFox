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
 * 5. Separación nítida entre la plantilla/especificación de la prueba (AssessmentDefinition)
 *    y el resultado obtenido por el estudiante (LevelAssessment).
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

export const ACADEMIC_SKILLS: readonly AcademicSkill[] = [
  'reading',
  'listening',
  'writing',
  'speaking',
  'grammar',
  'vocabulary',
  'pronunciation',
] as const;

export type EvidenceType = 'exercise' | 'text' | 'audio' | 'conversation' | 'none';

export const EVIDENCE_TYPES: readonly EvidenceType[] = [
  'exercise',
  'text',
  'audio',
  'conversation',
  'none',
] as const;

export type AssessmentTaskKind =
  | 'multipleChoice'
  | 'listen'
  | 'translate'
  | 'match'
  | 'fillBlank'
  | 'speak'
  | 'conversation';

export const ASSESSMENT_TASK_KINDS: readonly AssessmentTaskKind[] = [
  'multipleChoice',
  'listen',
  'translate',
  'match',
  'fillBlank',
  'speak',
  'conversation',
] as const;

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

export interface AssessmentTaskSpec {
  readonly id: string;
  readonly level: CefrLevel;
  readonly skill: AcademicSkill;
  readonly kind: AssessmentTaskKind;
  readonly prompt: string;
  readonly sourceLessonIds: readonly string[];
  readonly assessed: boolean;
  readonly autoGradable: boolean;
  readonly evidenceType: EvidenceType;
  readonly maxPoints: number;
  readonly acceptedAnswers?: readonly string[];
  readonly instructions?: string;
}

export interface AssessmentDefinition {
  readonly id: string;
  readonly level: CefrLevel;
  readonly title: string;
  readonly description: string;
  readonly disclaimer: string;
  readonly minimumScore: number;
  readonly totalPoints: number;
  readonly requiredLessonIds: readonly string[];
  readonly tasks: readonly AssessmentTaskSpec[];
  readonly unassessedSkills: readonly AcademicSkill[];
}

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

export interface AssessmentValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

/**
 * Validador de tipo (Type Guard) para comprobar si un valor arbitrario es un nivel MCER válido.
 */
export function isCefrLevel(value: unknown): value is CefrLevel {
  return typeof value === 'string' && (CEFR_LEVELS as readonly string[]).includes(value);
}

/**
 * Validador de tipo (Type Guard) para comprobar si un valor arbitrario es una destreza académica válida.
 */
export function isAcademicSkill(value: unknown): value is AcademicSkill {
  return typeof value === 'string' && (ACADEMIC_SKILLS as readonly string[]).includes(value);
}

/**
 * Validador de tipo (Type Guard) para comprobar si un valor arbitrario es una tipología de tarea de examen válida.
 */
export function isAssessmentTaskKind(value: unknown): value is AssessmentTaskKind {
  return typeof value === 'string' && (ASSESSMENT_TASK_KINDS as readonly string[]).includes(value);
}

/**
 * Validador de tipo (Type Guard) para comprobar si un valor arbitrario es un tipo de evidencia válido.
 */
export function isEvidenceType(value: unknown): value is EvidenceType {
  return typeof value === 'string' && (EVIDENCE_TYPES as readonly string[]).includes(value);
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

/**
 * Calcula la suma total de puntos correspondientes exclusivamente a tareas evaluadas (assessed = true).
 */
export function calculateAssessmentTotalPoints(tasks: readonly AssessmentTaskSpec[]): number {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }

  let total = 0;
  for (const task of tasks) {
    if (
      task &&
      task.assessed &&
      typeof task.maxPoints === 'number' &&
      Number.isFinite(task.maxPoints) &&
      task.maxPoints > 0
    ) {
      total += task.maxPoints;
    }
  }
  return total;
}

/**
 * Validador formal y puro de una plantilla de examen (AssessmentDefinition).
 * Aplica validaciones exhaustivas de tipos en tiempo de ejecución, integridad referencial y exclusión de destrezas no evaluadas.
 */
export function validateAssessmentDefinition(definition: unknown): AssessmentValidationResult {
  const errors: string[] = [];

  if (!definition || typeof definition !== 'object') {
    return { valid: false, errors: ['La definición de evaluación debe ser un objeto no nulo.'] };
  }

  const def = definition as Record<string, unknown>;

  // 1. Strings identificativos no vacíos
  if (typeof def.id !== 'string' || def.id.trim().length === 0) {
    errors.push('El identificador (id) es obligatorio y no puede estar vacío.');
  }
  if (!isCefrLevel(def.level)) {
    errors.push('El nivel MCER (level) no es válido.');
  }
  if (typeof def.title !== 'string' || def.title.trim().length === 0) {
    errors.push('El título (title) es obligatorio y no puede estar vacío.');
  }
  if (typeof def.description !== 'string' || def.description.trim().length === 0) {
    errors.push('La descripción (description) es obligatoria y no puede estar vacía.');
  }
  if (typeof def.disclaimer !== 'string' || def.disclaimer.trim().length === 0) {
    errors.push('El aviso formativo (disclaimer) es obligatorio y no puede estar vacío.');
  }

  // 2. minimumScore en rango [0, 100]
  if (typeof def.minimumScore !== 'number' || !isValidAcademicScore(def.minimumScore)) {
    errors.push('minimumScore debe ser una puntuación académica válida entre 0 y 100.');
  }

  // 3 y 8. totalPoints número finito exactamente 100
  if (typeof def.totalPoints !== 'number' || !Number.isFinite(def.totalPoints) || def.totalPoints !== 100) {
    errors.push('totalPoints debe ser un número finito exactamente igual a 100.');
  }

  // requiredLessonIds: no vacío, solo strings no vacíos y sin duplicados
  const requiredLessonIdsSet = new Set<string>();
  if (!Array.isArray(def.requiredLessonIds) || def.requiredLessonIds.length === 0) {
    errors.push('requiredLessonIds debe ser un array no vacío.');
  } else {
    for (let i = 0; i < def.requiredLessonIds.length; i++) {
      const lessonId = def.requiredLessonIds[i];
      if (typeof lessonId !== 'string' || lessonId.trim().length === 0) {
        errors.push(`requiredLessonIds contiene un valor no válido o vacío en el índice ${i}.`);
      } else {
        if (requiredLessonIdsSet.has(lessonId)) {
          errors.push(`requiredLessonIds contiene el ID duplicado: '${lessonId}'.`);
        }
        requiredLessonIdsSet.add(lessonId);
      }
    }
  }

  // unassessedSkills: solo destrezas válidas y sin duplicados
  const unassessedSkillsSet = new Set<string>();
  if (!Array.isArray(def.unassessedSkills)) {
    errors.push('unassessedSkills debe ser un array.');
  } else {
    for (const skill of def.unassessedSkills) {
      if (!isAcademicSkill(skill)) {
        errors.push(`unassessedSkills contiene un valor que no es una AcademicSkill válida: '${String(skill)}'.`);
        continue;
      }
      if (unassessedSkillsSet.has(skill)) {
        errors.push(`unassessedSkills contiene la destreza duplicada: '${skill}'.`);
      }
      unassessedSkillsSet.add(skill);
    }
  }

  // Validación de tareas
  if (!Array.isArray(def.tasks) || def.tasks.length === 0) {
    errors.push('tasks debe ser un array de tareas no vacío.');
  } else {
    const taskIds = new Set<string>();
    let totalAssessedPoints = 0;

    for (let i = 0; i < def.tasks.length; i++) {
      const task = def.tasks[i] as AssessmentTaskSpec;
      if (!task || typeof task !== 'object') {
        errors.push(`La tarea en el índice ${i} no es un objeto válido.`);
        continue;
      }

      // IDs únicos de tareas
      if (typeof task.id !== 'string' || task.id.trim().length === 0) {
        errors.push(`La tarea en el índice ${i} no tiene un id válido.`);
      } else {
        if (taskIds.has(task.id)) {
          errors.push(`ID de tarea duplicado: '${task.id}'.`);
        }
        taskIds.add(task.id);
      }

      // Nivel válido y homogéneo con el examen
      if (!isCefrLevel(task.level)) {
        errors.push(`La tarea ${task.id || i} tiene un nivel MCER no válido.`);
      } else if (task.level !== def.level) {
        errors.push(`La tarea ${task.id || i} tiene un nivel (${task.level}) distinto al examen (${def.level}).`);
      }

      // Skill válida
      if (!isAcademicSkill(task.skill)) {
        errors.push(`La tarea ${task.id || i} tiene una destreza no válida: '${String(task.skill)}'.`);
      }

      // Kind válido
      if (!isAssessmentTaskKind(task.kind)) {
        errors.push(`La tarea ${task.id || i} tiene un tipo (kind) no válido: '${String(task.kind)}'.`);
      }

      // Prompt no vacío
      if (typeof task.prompt !== 'string' || task.prompt.trim().length === 0) {
        errors.push(`La tarea ${task.id || i} debe tener un prompt no vacío.`);
      }

      // assessed boolean
      if (typeof task.assessed !== 'boolean') {
        errors.push(`La tarea ${task.id || i} debe tener una propiedad 'assessed' de tipo boolean.`);
      }

      // autoGradable boolean
      if (typeof task.autoGradable !== 'boolean') {
        errors.push(`La tarea ${task.id || i} debe tener una propiedad 'autoGradable' de tipo boolean.`);
      }

      // evidenceType válido
      if (!isEvidenceType(task.evidenceType)) {
        errors.push(`La tarea ${task.id || i} tiene un evidenceType no válido: '${String(task.evidenceType)}'.`);
      }

      // maxPoints debe ser número finito
      if (typeof task.maxPoints !== 'number' || !Number.isFinite(task.maxPoints)) {
        errors.push(`La tarea ${task.id || i} debe tener maxPoints numérico y finito.`);
      }

      // sourceLessonIds no vacío, strings válidos, sin duplicados y pertenecientes a requiredLessonIds
      if (!Array.isArray(task.sourceLessonIds) || task.sourceLessonIds.length === 0) {
        errors.push(`La tarea ${task.id || i} debe tener al menos un sourceLessonId.`);
      } else {
        const taskSourceSet = new Set<string>();
        for (const sId of task.sourceLessonIds) {
          if (typeof sId !== 'string' || sId.trim().length === 0) {
            errors.push(`La tarea ${task.id || i} contiene un sourceLessonId no válido o vacío.`);
          } else {
            if (taskSourceSet.has(sId)) {
              errors.push(`La tarea ${task.id || i} contiene el sourceLessonId duplicado: '${sId}'.`);
            }
            taskSourceSet.add(sId);
            if (requiredLessonIdsSet.size > 0 && !requiredLessonIdsSet.has(sId)) {
              errors.push(
                `La tarea ${task.id || i} referencia sourceLessonId '${sId}' que no pertenece a requiredLessonIds del examen.`
              );
            }
          }
        }
      }

      // Destrezas declaradas como no evaluadas no pueden evaluarse
      if (task.assessed && isAcademicSkill(task.skill) && unassessedSkillsSet.has(task.skill)) {
        errors.push(
          `La tarea ${task.id || i} evalúa la destreza '${task.skill}', que fue declarada como no evaluada en unassessedSkills.`
        );
      }

      // Puntuación y evidencia según assessed
      if (task.assessed === true) {
        if (typeof task.maxPoints === 'number' && Number.isFinite(task.maxPoints)) {
          if (task.maxPoints <= 0) {
            errors.push(`La tarea evaluada ${task.id || i} debe tener maxPoints > 0.`);
          } else {
            totalAssessedPoints += task.maxPoints;
          }
        }
        if (task.evidenceType === 'none') {
          errors.push(`La tarea evaluada ${task.id || i} no puede tener evidenceType='none'.`);
        }
      } else if (task.assessed === false) {
        if (task.maxPoints !== 0) {
          errors.push(`La tarea no evaluada ${task.id || i} debe tener maxPoints = 0.`);
        }
      }

      // acceptedAnswers opcional
      if (task.acceptedAnswers !== undefined) {
        if (!Array.isArray(task.acceptedAnswers)) {
          errors.push(`La tarea ${task.id || i} tiene acceptedAnswers pero no es un array.`);
        } else {
          const ansSet = new Set<string>();
          for (let aIdx = 0; aIdx < task.acceptedAnswers.length; aIdx++) {
            const ans = task.acceptedAnswers[aIdx];
            if (typeof ans !== 'string' || ans.trim().length === 0) {
              errors.push(`La tarea ${task.id || i} contiene una respuesta no válida o vacía en el índice ${aIdx}.`);
            } else {
              if (ansSet.has(ans)) {
                errors.push(`La tarea ${task.id || i} contiene la respuesta aceptada duplicada: '${ans}'.`);
              }
              ansSet.add(ans);
            }
          }
        }
      }

      // instructions opcional
      if (task.instructions !== undefined) {
        if (typeof task.instructions !== 'string' || task.instructions.trim().length === 0) {
          errors.push(`La tarea ${task.id || i} contiene 'instructions' pero no es un string no vacío.`);
        }
      }

      // autoGradable
      if (task.autoGradable === true) {
        if (task.assessed !== true) {
          errors.push(`La tarea ${task.id || i} no puede ser autoGradable si assessed=false.`);
        }
        if (
          !Array.isArray(task.acceptedAnswers) ||
          task.acceptedAnswers.length === 0 ||
          task.acceptedAnswers.some((a) => typeof a !== 'string' || a.trim().length === 0)
        ) {
          errors.push(`La tarea autoGradable ${task.id || i} debe contener al menos una respuesta aceptada no vacía.`);
        }
      }

      // speak / pronunciation sin audio
      if (
        (task.kind === 'speak' || task.skill === 'pronunciation') &&
        task.assessed === true &&
        task.evidenceType !== 'audio'
      ) {
        errors.push(
          `La tarea ${task.id || i} (${task.kind}/${task.skill}) no puede evaluarse (assessed=true) sin evidenceType='audio'.`
        );
      }

      // conversation autoGradable
      if (task.kind === 'conversation' && task.autoGradable === true) {
        errors.push(
          `La tarea ${task.id || i} de tipo conversation no puede ser autoGradable sin un evaluador verificable.`
        );
      }
    }

    // Suma de puntos evaluados = 100
    if (totalAssessedPoints !== 100) {
      errors.push(`La suma de puntos de las tareas evaluadas es ${totalAssessedPoints}, pero debe ser exactamente 100.`);
    }
  }

  // Cero gamificación
  const gamificationKeys = ['xp', 'gemas', 'estrellas', 'coronas', 'racha', 'coins', 'experiencia'];
  for (const key of gamificationKeys) {
    if (key in def) {
      errors.push(`Propiedad de gamificación no permitida en definición de evaluación: '${key}'.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  };
}
