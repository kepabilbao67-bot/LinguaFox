import { describe, expect, it } from 'vitest';
import {
  CEFR_LEVELS,
  ACADEMIC_SKILLS,
  EVIDENCE_TYPES,
  ASSESSMENT_TASK_KINDS,
  type CefrLevel,
  type SkillScore,
  type LevelAssessment,
  type AssessmentDefinition,
  isCefrLevel,
  isAcademicSkill,
  isAssessmentTaskKind,
  isEvidenceType,
  getNextCefrLevel,
  isValidAcademicScore,
  calculateOverallScore,
  hasPassedAssessment,
  calculateAssessmentTotalPoints,
  validateAssessmentDefinition,
} from './academic-cefr';

describe('Academic CEFR - Strict Type & Scoring Contracts', () => {
  it('1. maintains the canonical CEFR progression order A1 -> C2', () => {
    expect(CEFR_LEVELS).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
  });

  it('2. isCefrLevel accepts all six official CEFR levels', () => {
    const validLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (const level of validLevels) {
      expect(isCefrLevel(level)).toBe(true);
    }
  });

  it('3. isCefrLevel rejects invalid, arbitrary or non-string values', () => {
    expect(isCefrLevel('')).toBe(false);
    expect(isCefrLevel('A0')).toBe(false);
    expect(isCefrLevel('B3')).toBe(false);
    expect(isCefrLevel('c1')).toBe(false);
    expect(isCefrLevel(null)).toBe(false);
    expect(isCefrLevel(undefined)).toBe(false);
    expect(isCefrLevel(100)).toBe(false);
    expect(isCefrLevel({})).toBe(false);
  });

  it('4. getNextCefrLevel returns the exact sequential CEFR level', () => {
    expect(getNextCefrLevel('A1')).toBe('A2');
    expect(getNextCefrLevel('A2')).toBe('B1');
    expect(getNextCefrLevel('B1')).toBe('B2');
    expect(getNextCefrLevel('B2')).toBe('C1');
    expect(getNextCefrLevel('C1')).toBe('C2');
  });

  it('5. getNextCefrLevel returns null at the mastery boundary (C2)', () => {
    expect(getNextCefrLevel('C2')).toBe(null);
  });

  it('6. isValidAcademicScore validates boundary limits 0 and 100 and valid decimals', () => {
    expect(isValidAcademicScore(0)).toBe(true);
    expect(isValidAcademicScore(100)).toBe(true);
    expect(isValidAcademicScore(70)).toBe(true);
    expect(isValidAcademicScore(85.5)).toBe(true);
  });

  it('7. isValidAcademicScore rejects negative numbers, scores > 100, NaN and Infinity', () => {
    expect(isValidAcademicScore(-1)).toBe(false);
    expect(isValidAcademicScore(-0.01)).toBe(false);
    expect(isValidAcademicScore(100.1)).toBe(false);
    expect(isValidAcademicScore(150)).toBe(false);
    expect(isValidAcademicScore(NaN)).toBe(false);
    expect(isValidAcademicScore(Infinity)).toBe(false);
    expect(isValidAcademicScore(-Infinity)).toBe(false);
  });

  it('8. calculateOverallScore computes the average solely from assessed skills', () => {
    const scores: SkillScore[] = [
      { skill: 'reading', score: 80, assessed: true, evidenceType: 'exercise' },
      { skill: 'listening', score: 90, assessed: true, evidenceType: 'exercise' },
      { skill: 'writing', score: 0, assessed: false, evidenceType: 'none' },
      { skill: 'grammar', score: 70, assessed: true, evidenceType: 'exercise' },
    ];
    expect(calculateOverallScore(scores)).toBe(80);
  });

  it('9. calculateOverallScore excludes pronunciation if evidenceType is not audio', () => {
    const scores: SkillScore[] = [
      { skill: 'reading', score: 80, assessed: true, evidenceType: 'exercise' },
      { skill: 'pronunciation', score: 100, assessed: true, evidenceType: 'text' },
    ];
    expect(calculateOverallScore(scores)).toBe(80);
  });

  it('10. calculateOverallScore includes pronunciation when real audio evidence is present', () => {
    const scores: SkillScore[] = [
      { skill: 'reading', score: 80, assessed: true, evidenceType: 'exercise' },
      { skill: 'pronunciation', score: 100, assessed: true, evidenceType: 'audio' },
    ];
    expect(calculateOverallScore(scores)).toBe(90);
  });

  it('11. calculateOverallScore returns null when no skills can be assessed', () => {
    expect(calculateOverallScore([])).toBe(null);

    const nonAssessed: SkillScore[] = [
      { skill: 'reading', score: 80, assessed: false, evidenceType: 'none' },
      { skill: 'pronunciation', score: 95, assessed: true, evidenceType: 'none' },
    ];
    expect(calculateOverallScore(nonAssessed)).toBe(null);
  });

  it('12. hasPassedAssessment accurately applies minimum passing threshold (70/100)', () => {
    const passingScores: SkillScore[] = [
      { skill: 'reading', score: 70, assessed: true, evidenceType: 'exercise' },
      { skill: 'listening', score: 75, assessed: true, evidenceType: 'exercise' },
      { skill: 'grammar', score: 72, assessed: true, evidenceType: 'exercise' },
    ];
    expect(hasPassedAssessment(passingScores, 70)).toBe(true);

    const failingScores: SkillScore[] = [
      { skill: 'reading', score: 60, assessed: true, evidenceType: 'exercise' },
      { skill: 'listening', score: 65, assessed: true, evidenceType: 'exercise' },
    ];
    expect(hasPassedAssessment(failingScores, 70)).toBe(false);
  });

  it('13. rejects evaluations containing invalid scores or invalid minimum thresholds', () => {
    const corruptedScores: SkillScore[] = [
      { skill: 'reading', score: 80, assessed: true, evidenceType: 'exercise' },
      { skill: 'listening', score: -10, assessed: true, evidenceType: 'exercise' },
    ];
    expect(calculateOverallScore(corruptedScores)).toBe(null);
    expect(hasPassedAssessment(corruptedScores, 70)).toBe(false);

    const validScores: SkillScore[] = [
      { skill: 'reading', score: 80, assessed: true, evidenceType: 'exercise' },
    ];
    expect(hasPassedAssessment(validScores, -5)).toBe(false);
    expect(hasPassedAssessment(validScores, 105)).toBe(false);
  });

  it('14. excludes non-audio pronunciation with invalid score without invalidating other valid skills', () => {
    const scores: SkillScore[] = [
      { skill: 'reading', score: 85, assessed: true, evidenceType: 'exercise' },
      { skill: 'listening', score: 95, assessed: true, evidenceType: 'exercise' },
      { skill: 'pronunciation', score: -999, assessed: true, evidenceType: 'text' },
    ];
    expect(calculateOverallScore(scores)).toBe(90);
    expect(hasPassedAssessment(scores, 70)).toBe(true);
  });

  it('15. returns null if only non-audio pronunciation exists even with invalid score', () => {
    const scores: SkillScore[] = [
      { skill: 'pronunciation', score: -50, assessed: true, evidenceType: 'conversation' },
    ];
    expect(calculateOverallScore(scores)).toBe(null);
    expect(hasPassedAssessment(scores, 70)).toBe(false);
  });

  it('16. invalidates assessment if pronunciation has audio evidence but an invalid score', () => {
    const scores: SkillScore[] = [
      { skill: 'reading', score: 90, assessed: true, evidenceType: 'exercise' },
      { skill: 'pronunciation', score: -10, assessed: true, evidenceType: 'audio' },
    ];
    expect(calculateOverallScore(scores)).toBe(null);
    expect(hasPassedAssessment(scores, 70)).toBe(false);
  });

  it('17. demonstrates that LevelAssessment contracts are strictly isolated from gamification', () => {
    const assessment: LevelAssessment = {
      id: 'assessment-a1',
      level: 'A1',
      title: 'Prueba de Nivel A1 — Acceso',
      objectives: [
        {
          id: 'obj-a1-1',
          level: 'A1',
          skill: 'reading',
          description: 'Comprender textos cotidianos elementales',
          required: true,
        },
      ],
      skillScores: [
        { skill: 'reading', score: 85, assessed: true, evidenceType: 'exercise' },
        { skill: 'listening', score: 78, assessed: true, evidenceType: 'exercise' },
      ],
      overallScore: 82,
      passed: true,
      completedAt: 1788100000000,
    };

    const assessmentKeys = Object.keys(assessment);
    expect(assessmentKeys).not.toContain('xp');
    expect(assessmentKeys).not.toContain('experiencia');
    expect(assessmentKeys).not.toContain('estrellas');
    expect(assessmentKeys).not.toContain('racha');
    expect(assessmentKeys).not.toContain('gems');
    expect(assessmentKeys).not.toContain('coins');
    expect(assessment.overallScore).toBe(82);
    expect(assessment.passed).toBe(true);
  });
});

describe('Academic CEFR - Assessment Type Guards Suite', () => {
  it('18. isAcademicSkill validates all canonical academic skills and rejects invalid values', () => {
    for (const skill of ACADEMIC_SKILLS) {
      expect(isAcademicSkill(skill)).toBe(true);
    }
    expect(isAcademicSkill('telepathy')).toBe(false);
    expect(isAcademicSkill('')).toBe(false);
    expect(isAcademicSkill(null)).toBe(false);
  });

  it('19. isAssessmentTaskKind validates all seven task kinds and rejects invalid ones', () => {
    for (const kind of ASSESSMENT_TASK_KINDS) {
      expect(isAssessmentTaskKind(kind)).toBe(true);
    }
    expect(isAssessmentTaskKind('essayWriting')).toBe(false);
    expect(isAssessmentTaskKind('')).toBe(false);
    expect(isAssessmentTaskKind(123)).toBe(false);
  });

  it('20. isEvidenceType validates all evidence types and rejects invalid values', () => {
    for (const evidence of EVIDENCE_TYPES) {
      expect(isEvidenceType(evidence)).toBe(true);
    }
    expect(isEvidenceType('video')).toBe(false);
    expect(isEvidenceType('guess')).toBe(false);
  });
});

describe('Academic CEFR - AssessmentDefinition & AssessmentTaskSpec Validation Suite', () => {
  const createValidDefinition = (): AssessmentDefinition => ({
    id: 'a1-assessment-def',
    level: 'A1',
    title: 'Evaluación Formativa Nivel A1',
    description: 'Prueba de suficiencia académica para el nivel A1 en comprensión y producción guiada.',
    disclaimer: 'Esta prueba tiene finalidad pedagógica formativa y no constituye titulación oficial.',
    minimumScore: 70,
    totalPoints: 100,
    requiredLessonIds: ['u1l1', 'u1l2', 'u2l1', 'u2l2'],
    unassessedSkills: ['speaking', 'pronunciation'],
    tasks: [
      {
        id: 'task-1',
        level: 'A1',
        skill: 'reading',
        kind: 'multipleChoice',
        prompt: 'Traduce hello',
        sourceLessonIds: ['u1l1'],
        assessed: true,
        autoGradable: true,
        evidenceType: 'exercise',
        maxPoints: 50,
        acceptedAnswers: ['hola'],
        instructions: 'Selecciona una respuesta',
      },
      {
        id: 'task-2',
        level: 'A1',
        skill: 'listening',
        kind: 'listen',
        prompt: 'Escucha mother',
        sourceLessonIds: ['u2l1'],
        assessed: true,
        autoGradable: true,
        evidenceType: 'exercise',
        maxPoints: 50,
        acceptedAnswers: ['mother'],
      },
      {
        id: 'task-3-unassessed',
        level: 'A1',
        skill: 'speaking',
        kind: 'speak',
        prompt: 'Práctica opcional de habla',
        sourceLessonIds: ['u1l1'],
        assessed: false,
        autoGradable: false,
        evidenceType: 'none',
        maxPoints: 0,
      },
    ],
  });

  it('21. validates a complete and compliant 100-point AssessmentDefinition', () => {
    const def = createValidDefinition();
    const result = validateAssessmentDefinition(def);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('22. rejects totalPoints when NaN, Infinity or differing from 100', () => {
    const defNaN = { ...createValidDefinition(), totalPoints: NaN };
    expect(validateAssessmentDefinition(defNaN).valid).toBe(false);

    const defInfinity = { ...createValidDefinition(), totalPoints: Infinity };
    expect(validateAssessmentDefinition(defInfinity).valid).toBe(false);

    const defSumMismatch: AssessmentDefinition = {
      ...createValidDefinition(),
      tasks: [
        {
          id: 'task-1',
          level: 'A1',
          skill: 'reading',
          kind: 'multipleChoice',
          prompt: 'P1',
          sourceLessonIds: ['u1l1'],
          assessed: true,
          autoGradable: true,
          evidenceType: 'exercise',
          maxPoints: 40,
          acceptedAnswers: ['a'],
        },
        createValidDefinition().tasks[1],
      ],
    };
    expect(validateAssessmentDefinition(defSumMismatch).valid).toBe(false);
  });

  it('23. rejects AssessmentDefinition with duplicate task IDs', () => {
    const base = createValidDefinition();
    const def: AssessmentDefinition = {
      ...base,
      tasks: [
        base.tasks[0],
        { ...base.tasks[1], id: 'task-1' },
      ],
    };
    const result = validateAssessmentDefinition(def);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('duplicado'))).toBe(true);
  });

  it('24. rejects AssessmentDefinition with tasks belonging to different CEFR levels or invalid level', () => {
    const base = createValidDefinition();
    const def: AssessmentDefinition = {
      ...base,
      tasks: [
        base.tasks[0],
        { ...base.tasks[1], level: 'B1' },
      ],
    };
    expect(validateAssessmentDefinition(def).valid).toBe(false);
  });

  it('25. rejects tasks with invented or invalid skills, kinds, or evidenceTypes', () => {
    const base = createValidDefinition();
    const defInventedSkill = {
      ...base,
      tasks: [{ ...base.tasks[0], skill: 'mindReading' as unknown as SkillScore['skill'] }],
    };
    expect(validateAssessmentDefinition(defInventedSkill).valid).toBe(false);

    const defInventedKind = {
      ...base,
      tasks: [{ ...base.tasks[0], kind: 'magicTrick' as unknown as AssessmentDefinition['tasks'][0]['kind'] }],
    };
    expect(validateAssessmentDefinition(defInventedKind).valid).toBe(false);

    const defInventedEvidence = {
      ...base,
      tasks: [{ ...base.tasks[0], evidenceType: 'hologram' as unknown as SkillScore['evidenceType'] }],
    };
    expect(validateAssessmentDefinition(defInventedEvidence).valid).toBe(false);
  });

  it('26. rejects tasks with missing or non-boolean assessed / autoGradable, or empty prompt', () => {
    const base = createValidDefinition();
    const defNonBoolAssessed = {
      ...base,
      tasks: [{ ...base.tasks[0], assessed: 'yes' as unknown as boolean }],
    };
    expect(validateAssessmentDefinition(defNonBoolAssessed).valid).toBe(false);

    const defNonBoolAutoGradable = {
      ...base,
      tasks: [{ ...base.tasks[0], autoGradable: null as unknown as boolean }],
    };
    expect(validateAssessmentDefinition(defNonBoolAutoGradable).valid).toBe(false);

    const defEmptyPrompt = {
      ...base,
      tasks: [{ ...base.tasks[0], prompt: '   ' }],
    };
    expect(validateAssessmentDefinition(defEmptyPrompt).valid).toBe(false);
  });

  it('27. rejects duplicate or empty requiredLessonIds, or sourceLessonId foreign to the exam', () => {
    const defDuplicateRequired = {
      ...createValidDefinition(),
      requiredLessonIds: ['u1l1', 'u1l1'],
    };
    expect(validateAssessmentDefinition(defDuplicateRequired).valid).toBe(false);

    const defForeignSource = {
      ...createValidDefinition(),
      tasks: [
        { ...createValidDefinition().tasks[0], sourceLessonIds: ['u99l99'] }, // Foreign
        createValidDefinition().tasks[1],
      ],
    };
    const resultForeign = validateAssessmentDefinition(defForeignSource);
    expect(resultForeign.valid).toBe(false);
    expect(resultForeign.errors.some((e) => e.includes('no pertenece a requiredLessonIds'))).toBe(true);
  });

  it('28. rejects acceptedAnswers with duplicates, non-strings, or empty entries', () => {
    const base = createValidDefinition();
    const defDuplicateAnswers = {
      ...base,
      tasks: [
        { ...base.tasks[0], acceptedAnswers: ['hola', 'hola'] },
        base.tasks[1],
      ],
    };
    expect(validateAssessmentDefinition(defDuplicateAnswers).valid).toBe(false);
  });

  it('29. rejects instructions when present but not a non-empty string', () => {
    const base = createValidDefinition();
    const defEmptyInstructions = {
      ...base,
      tasks: [
        { ...base.tasks[0], instructions: '   ' },
        base.tasks[1],
      ],
    };
    expect(validateAssessmentDefinition(defEmptyInstructions).valid).toBe(false);
  });

  it('30. rejects evidenceType="none" on an assessed task, and maxPoints > 0 on unassessed task', () => {
    const base = createValidDefinition();
    const defNoneOnAssessed = {
      ...base,
      tasks: [
        { ...base.tasks[0], evidenceType: 'none' as const },
        base.tasks[1],
      ],
    };
    expect(validateAssessmentDefinition(defNoneOnAssessed).valid).toBe(false);

    const defPointsOnUnassessed = {
      ...base,
      tasks: [
        base.tasks[0],
        base.tasks[1],
        { ...base.tasks[2], maxPoints: 10 },
      ],
    };
    expect(validateAssessmentDefinition(defPointsOnUnassessed).valid).toBe(false);
  });

  it('31. rejects invented skills or duplicate skills in unassessedSkills array', () => {
    const defInvented = {
      ...createValidDefinition(),
      unassessedSkills: ['alchemy' as unknown as SkillScore['skill']],
    };
    expect(validateAssessmentDefinition(defInvented).valid).toBe(false);

    const defDuplicate = {
      ...createValidDefinition(),
      unassessedSkills: ['speaking' as const, 'speaking' as const],
    };
    expect(validateAssessmentDefinition(defDuplicate).valid).toBe(false);
  });

  it('32. rejects assessed speak tasks without audio and conversation marked as autoGradable', () => {
    const base = createValidDefinition();
    const defSpeakText = {
      ...base,
      unassessedSkills: [],
      tasks: [
        { ...base.tasks[0], kind: 'speak' as const, skill: 'speaking' as const, evidenceType: 'text' as const },
        base.tasks[1],
      ],
    };
    expect(validateAssessmentDefinition(defSpeakText).valid).toBe(false);

    const defConvAuto = {
      ...base,
      unassessedSkills: [],
      tasks: [
        { ...base.tasks[0], kind: 'conversation' as const, autoGradable: true },
        base.tasks[1],
      ],
    };
    expect(validateAssessmentDefinition(defConvAuto).valid).toBe(false);
  });

  it('33. calculateAssessmentTotalPoints sums assessed tasks and excludes unassessed ones', () => {
    const def = createValidDefinition();
    expect(calculateAssessmentTotalPoints(def.tasks)).toBe(100);
    expect(calculateAssessmentTotalPoints([])).toBe(0);
  });

  it('34. guarantees purity, zero mutation and complete isolation from gamification', () => {
    const def = createValidDefinition();
    const originalSnapshot = JSON.stringify(def);
    validateAssessmentDefinition(def);
    expect(JSON.stringify(def)).toBe(originalSnapshot);

    const defWithGamification = { ...createValidDefinition(), xp: 100 };
    expect(validateAssessmentDefinition(defWithGamification).valid).toBe(false);
  });
});
