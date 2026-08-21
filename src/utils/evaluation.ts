import type { DimensionScore } from '@/types/evaluation';

export const DIMENSION_WEIGHTS = {
  comprehension: 20,
  grammar: 20,
  vocabulary: 15,
  pronunciation: 20,
  fluency: 15,
  mission: 10,
} as const;

export type DimensionKey = keyof typeof DIMENSION_WEIGHTS;

/**
 * Recalcula la puntuación sobre 100 ignorando las dimensiones no evaluadas.
 * Si no hay dimensiones evaluadas, devuelve 0.
 */
export function calculateEducationalScore(
  dimensions: Partial<Record<DimensionKey, DimensionScore>>
): number {
  let totalValidWeight = 0;
  let totalWeightedScore = 0;

  for (const key of Object.keys(DIMENSION_WEIGHTS) as DimensionKey[]) {
    const dim = dimensions[key];
    if (
      dim &&
      dim.evaluated === true &&
      typeof dim.max === 'number' &&
      Number.isFinite(dim.max) &&
      dim.max > 0 &&
      typeof dim.earned === 'number' &&
      Number.isFinite(dim.earned)
    ) {
      const weight = DIMENSION_WEIGHTS[key];
      const ratio = dim.earned / dim.max;
      const clampedRatio = Math.min(1, Math.max(0, ratio));
      totalWeightedScore += clampedRatio * weight;
      totalValidWeight += weight;
    }
  }

  if (totalValidWeight === 0) return 0;
  const percentage = (totalWeightedScore / totalValidWeight) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}
