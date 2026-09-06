/**
 * Pure domain logic for city adventure completion.
 * No React dependencies. Uses CITIES data from src/data/cities.ts.
 */

import { getCityById } from '../data/cities';

export interface CityCompletionResult {
  allowed: boolean;
  firstCompletion: boolean;
  xpAwarded: number;
  completedCities: string[];
}

/**
 * Evaluates whether a city adventure completion is allowed and calculates rewards.
 * 
 * Rules:
 * - Invalid cityId → allowed=false, 0 XP
 * - London/Madrid → initial access (unlockXp=0)
 * - Other cities → allowed if in unlockedCities OR experience >= city.unlockXp
 * - Already completed → 0 XP (no duplicate rewards)
 * - First valid completion → xpAwarded = city.xpReward
 * - Protect URL access: blocked cities grant 0 XP even if route reached manually
 * 
 * @param cityId - The city to complete
 * @param experience - Current user experience points
 * @param unlockedCities - List of explicitly unlocked city IDs
 * @param completedCities - List of cities already completed (rewards collected)
 * @returns Result with access permission, completion status, XP, and updated completedCities
 */
export function evaluateCityCompletion(
  cityId: string | undefined,
  experience: number,
  unlockedCities: string[],
  completedCities: string[]
): CityCompletionResult {
  // Validate city exists
  const city = getCityById(cityId);
  if (!city) {
    return {
      allowed: false,
      firstCompletion: false,
      xpAwarded: 0,
      completedCities,
    };
  }

  // Check if already completed
  const isRepeated = completedCities.includes(city.id);
  if (isRepeated) {
    return {
      allowed: true,
      firstCompletion: false,
      xpAwarded: 0,
      completedCities,
    };
  }

  // Check unlock requirements
  const isInitialAccess = city.unlockXp === 0; // London, Madrid
  const isExplicitlyUnlocked = unlockedCities.includes(city.id);
  const hasEnoughXp = experience >= city.unlockXp;

  const isAllowed = isInitialAccess || isExplicitlyUnlocked || hasEnoughXp;

  if (!isAllowed) {
    return {
      allowed: false,
      firstCompletion: false,
      xpAwarded: 0,
      completedCities,
    };
  }

  // First completion: award XP
  return {
    allowed: true,
    firstCompletion: true,
    xpAwarded: city.xpReward,
    completedCities: [...completedCities, city.id],
  };
}
