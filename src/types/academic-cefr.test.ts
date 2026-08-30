import { describe, expect, it } from 'vitest';
import {
  CEFR_LEVELS,
  type CefrLevel,
  type SkillScore,
  type LevelAssessment,
  isCefrLevel,
  getNextCefrLevel,
  isValidAcademicScore,
  calculateOverallScore,
  hasPassedAssessment,
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
      { skill: 'pronunciation', score: -999, assessed: true, evidenceType: 'text' }, // Non-audio -> Excluded early
    ];
    // (85 + 95) / 2 = 90
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
      { skill: 'pronunciation', score: -10, assessed: true, evidenceType: 'audio' }, // Audio but corrupted score -> Fails
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
