import { describe, expect, it } from 'vitest';
import {
  A1_LEVEL,
  A1_REQUIRED_LESSON_IDS,
  A1_LEARNING_OBJECTIVES,
  A1_COMPLETION_CRITERIA,
} from './level';
import { UNIT_1 } from '../unit-1';
import { UNIT_2 } from '../unit-2';
import { isValidAcademicScore, type AcademicSkill } from '../../../../types/academic-cefr';

describe('A1 CEFR Level - Academic Definition Suite', () => {
  it('1. verifies that the level is strictly A1', () => {
    expect(A1_LEVEL).toBe('A1');
  });

  it('2. contains exactly four required lessons for Level A1', () => {
    expect(A1_REQUIRED_LESSON_IDS).toHaveLength(4);
    expect(A1_REQUIRED_LESSON_IDS).toEqual(['u1l1', 'u1l2', 'u2l1', 'u2l2']);
  });

  it('3. confirms that all four lesson IDs exist in the real UNIT_1 and UNIT_2 data', () => {
    const unit1LessonIds = UNIT_1.lessons.map((l) => l.id);
    const unit2LessonIds = UNIT_2.lessons.map((l) => l.id);
    const allA1LessonIds = [...unit1LessonIds, ...unit2LessonIds];

    for (const id of A1_REQUIRED_LESSON_IDS) {
      expect(allA1LessonIds).toContain(id);
    }
  });

  it('4. ensures there are zero duplicate lesson IDs in A1 requirements', () => {
    const idSet = new Set(A1_REQUIRED_LESSON_IDS);
    expect(idSet.size).toBe(A1_REQUIRED_LESSON_IDS.length);
  });

  it('5. verifies that all learning objectives belong to CEFR level A1', () => {
    for (const obj of A1_LEARNING_OBJECTIVES) {
      expect(obj.level).toBe('A1');
      expect(obj.description.trim().length).toBeGreaterThan(10);
    }
  });

  it('6. ensures all objective IDs are unique and follow the stable a1- prefix convention', () => {
    const objIdSet = new Set<string>();
    for (const obj of A1_LEARNING_OBJECTIVES) {
      expect(obj.id.startsWith('a1-')).toBe(true);
      expect(objIdSet.has(obj.id)).toBe(false);
      objIdSet.add(obj.id);
    }
  });

  it('7. contains objectives for the six mandatory academic skills (reading, listening, writing, speaking, grammar, vocabulary)', () => {
    const mandatorySkills: AcademicSkill[] = [
      'reading',
      'listening',
      'writing',
      'speaking',
      'grammar',
      'vocabulary',
    ];
    const objectiveSkills = A1_LEARNING_OBJECTIVES.map((o) => o.skill);

    for (const skill of mandatorySkills) {
      expect(objectiveSkills).toContain(skill);
      const obj = A1_LEARNING_OBJECTIVES.find((o) => o.skill === skill);
      expect(obj?.required).toBe(true);
    }
  });

  it('8. ensures requiredObjectiveIds matches exactly all objectives marked with required=true', () => {
    const requiredInList = A1_LEARNING_OBJECTIVES.filter((o) => o.required).map((o) => o.id);
    expect(A1_COMPLETION_CRITERIA.requiredObjectiveIds).toEqual(requiredInList);
  });

  it('9. verifies that minimumScore is 70 and represents a valid academic score', () => {
    expect(A1_COMPLETION_CRITERIA.minimumScore).toBe(70);
    expect(isValidAcademicScore(A1_COMPLETION_CRITERIA.minimumScore)).toBe(true);
  });

  it('10. verifies that pronunciation is optional and not mandatory without audio evidence', () => {
    const pronunciationObj = A1_LEARNING_OBJECTIVES.find((o) => o.skill === 'pronunciation');
    expect(pronunciationObj).toBeDefined();
    expect(pronunciationObj?.required).toBe(false);
    expect(A1_COMPLETION_CRITERIA.requiredObjectiveIds).not.toContain(pronunciationObj?.id);
  });

  it('11. verifies that requireAudioForPronunciation is set to true in completion criteria', () => {
    expect(A1_COMPLETION_CRITERIA.requireAudioForPronunciation).toBe(true);
  });

  it('12. ensures zero gamification properties exist in level definitions and completion criteria', () => {
    const criteriaKeys = Object.keys(A1_COMPLETION_CRITERIA);
    expect(criteriaKeys).not.toContain('xp');
    expect(criteriaKeys).not.toContain('experiencia');
    expect(criteriaKeys).not.toContain('estrellas');
    expect(criteriaKeys).not.toContain('gemas');
    expect(criteriaKeys).not.toContain('racha');
  });

  it('13. guarantees real runtime deep immutability through Object.isFrozen', () => {
    expect(Object.isFrozen(A1_REQUIRED_LESSON_IDS)).toBe(true);
    expect(Object.isFrozen(A1_LEARNING_OBJECTIVES)).toBe(true);

    for (const obj of A1_LEARNING_OBJECTIVES) {
      expect(Object.isFrozen(obj)).toBe(true);
    }

    expect(Object.isFrozen(A1_COMPLETION_CRITERIA)).toBe(true);
    expect(Object.isFrozen(A1_COMPLETION_CRITERIA.requiredLessonIds)).toBe(true);
    expect(Object.isFrozen(A1_COMPLETION_CRITERIA.requiredObjectiveIds)).toBe(true);

    // Consecutive read consistency
    const read1 = JSON.stringify(A1_COMPLETION_CRITERIA);
    const read2 = JSON.stringify(A1_COMPLETION_CRITERIA);
    expect(read1).toBe(read2);
  });

  it('14. verifies that existing lesson IDs in UNIT_1 and UNIT_2 remain intact and unaltered', () => {
    expect(UNIT_1.lessons[0].id).toBe('u1l1');
    expect(UNIT_1.lessons[1].id).toBe('u1l2');
    expect(UNIT_2.lessons[0].id).toBe('u2l1');
    expect(UNIT_2.lessons[1].id).toBe('u2l2');
  });
});
