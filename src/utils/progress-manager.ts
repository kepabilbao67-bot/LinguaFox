import type { LanguageCode, ProgressState } from '@/types/learning';
import { calculateQuizStars } from './rewards';
import { calculateNewStreak } from './streak-logic';
import { DEFAULT_PROGRESS, getGlobalStars, STORAGE_KEY, safeLoadProgress, sanitizeProgress } from './progress-storage';

export class ProgressManager {
  private _progress: ProgressState;
  private _isBlockedFromSaving: boolean;
  private _isHydrated: boolean;

  constructor() {
    this._progress = DEFAULT_PROGRESS;
    this._isBlockedFromSaving = false;
    this._isHydrated = false;
  }

  get progress() { return this._progress; }
  get isBlockedFromSaving() { return this._isBlockedFromSaving; }
  get isHydrated() { return this._isHydrated; }

  async loadProgress(
    getItem: (key: string) => Promise<string | null>,
    setItem: (key: string, value: string) => Promise<void>,
    now: number
  ) {
    try {
      const { rawData, isCorrupted } = await safeLoadProgress(getItem, setItem, now);
      if (isCorrupted) {
        this._isBlockedFromSaving = true;
      }
      if (rawData) {
        this._progress = sanitizeProgress(JSON.parse(rawData) as unknown);
      }
    } catch {
      this._isBlockedFromSaving = true;
    } finally {
      this._isHydrated = true;
    }
  }

  async saveProgress(setItem: (key: string, value: string) => Promise<void>) {
    if (!this._isHydrated || this._isBlockedFromSaving) return;
    await setItem(STORAGE_KEY, JSON.stringify(this._progress));
  }

  setLessonProgress(lessonId: string, cardIndex: number) {
    if (!lessonId || !Number.isFinite(cardIndex)) return;
    this._progress = {
      ...this._progress,
      progresoPorLeccion: {
        ...this._progress.progresoPorLeccion,
        [lessonId]: Math.max(0, Math.floor(cardIndex)),
      },
    };
  }

  recordQuizResult(lessonId: string, score: number, total: number, now: number) {
    if (!lessonId || !Number.isInteger(score) || !Number.isInteger(total) || total <= 0 || score < 0 || score > total) return;
    const attemptStars = calculateQuizStars(score, total);
    const previousBestScore = this._progress.mejorPuntuacionPorLeccion[lessonId] ?? 0;
    const previousBestStars = this._progress.mejoresEstrellasPorLeccion[lessonId] ?? 0;
    const bestStarsByLesson = {
      ...this._progress.mejoresEstrellasPorLeccion,
      [lessonId]: Math.max(previousBestStars, attemptStars),
    };

    this._progress = {
      ...this._progress,
      ...calculateNewStreak(this._progress, now),
      experiencia: this._progress.experiencia + 10 + (score === total ? 15 : 0),
      leccionesCompletadas: this._progress.leccionesCompletadas.includes(lessonId)
        ? this._progress.leccionesCompletadas
        : [...this._progress.leccionesCompletadas, lessonId],
      estrellas: getGlobalStars(bestStarsByLesson, this._progress.estrellasPersonajesPorId),
      mejorPuntuacionPorLeccion: {
        ...this._progress.mejorPuntuacionPorLeccion,
        [lessonId]: Math.max(previousBestScore, score),
      },
      mejoresEstrellasPorLeccion: bestStarsByLesson,
      progresoPorLeccion: {
        ...this._progress.progresoPorLeccion,
        [lessonId]: Math.max(this._progress.progresoPorLeccion[lessonId] ?? 0, total - 1),
      },
    };
  }

  registerCharacterInteraction(characterId: string, type: 'chat' | 'call', now: number) {
    if (!characterId) return;
    const isFirstChatWithCharacter = !this._progress.personajesConCharla.includes(characterId);
    const characterStars = isFirstChatWithCharacter
      ? { ...this._progress.estrellasPersonajesPorId, [characterId]: 1 }
      : this._progress.estrellasPersonajesPorId;
    const messages = this._progress.mensajesPersonajes + (type === 'chat' ? 1 : 0);
    const achievements = new Set(this._progress.logros);
    if (this._progress.personajesConCharla.length === 0) achievements.add('primera-charla');
    if (messages >= 5) achievements.add('charlador');

    this._progress = {
      ...this._progress,
      ...calculateNewStreak(this._progress, now),
      estrellasPersonajesPorId: characterStars,
      estrellas: getGlobalStars(this._progress.mejoresEstrellasPorLeccion, characterStars),
      experiencia: this._progress.experiencia + (type === 'call' ? 10 : 5),
      logros: [...achievements],
      mensajesPersonajes: messages,
      personajesConCharla: isFirstChatWithCharacter
        ? [...this._progress.personajesConCharla, characterId]
        : this._progress.personajesConCharla,
    };
  }

  setLanguages(nativo: LanguageCode, objetivo: LanguageCode) {
    this._progress = { ...this._progress, idiomaNativo: nativo, idiomaObjetivo: objetivo };
  }

  completeOnboarding() {
    this._progress = { ...this._progress, onboardingCompleto: true };
  }

  resetProgress() {
    this._isBlockedFromSaving = false;
    this._progress = DEFAULT_PROGRESS;
  }

  triggerAchievements(nowIso: string): string | null {
    // simplified for tests
    return null; 
  }
}
