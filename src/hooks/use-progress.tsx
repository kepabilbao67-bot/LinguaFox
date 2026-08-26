import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { LanguageCode, ProgressState } from '@/types/learning';
import { calculateQuizStars } from '@/utils/rewards';
import { evaluateAchievements } from '@/data/achievements';
import { calculateNewStreak } from '@/utils/streak-logic';
import { safeLoadProgress, sanitizeProgress, DEFAULT_PROGRESS, STORAGE_KEY, getGlobalStars } from '@/utils/progress-storage';

interface ProgressContextValue {
  progress: ProgressState;
  isHydrated: boolean;
  setLessonProgress: (lessonId: string, cardIndex: number) => void;
  recordQuizResult: (lessonId: string, score: number, total: number) => void;
  registerCharacterInteraction: (characterId: string, type: 'chat' | 'call') => void;
  setLanguages: (nativo: LanguageCode, objetivo: LanguageCode) => void;
  resetProgress: () => void;
  latestAchievementId: string | null;
  completeOnboarding: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: React.PropsWithChildren) {
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [latestAchievementId, setLatestAchievementId] = useState<string | null>(null);

  // Bloqueo explícito para evitar sobreescribir datos corruptos con DEFAULT_PROGRESS
  const isBlockedFromSaving = React.useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProgress(): Promise<void> {
      try {
        const { rawData, isCorrupted } = await safeLoadProgress(
          AsyncStorage.getItem,
          AsyncStorage.setItem,
          Date.now()
        );

        if (isCorrupted) {
          isBlockedFromSaving.current = true;
        }

        if (isMounted && rawData) {
          setProgress(sanitizeProgress(JSON.parse(rawData) as unknown));
        }
      } catch (error: unknown) {
        isBlockedFromSaving.current = true;
        console.warn('Error crítico inesperado al cargar progreso.', error);
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    }

    void loadProgress();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || isBlockedFromSaving.current) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch((error: unknown) => {
      console.warn('No se pudo guardar el progreso de LinguaFox.', error);
    });
  }, [isHydrated, progress]);

  useEffect(() => {
    if (!isHydrated) return;
    const eligible = evaluateAchievements({ lecciones: progress.leccionesCompletadas.length, mensajes: progress.mensajesPersonajes, personajes: progress.personajesConCharla.length, racha: progress.rachaActual });
    const missing = eligible.filter((id) => !progress.logrosDesbloqueados[id]);
    if (!missing.length) return;
    const now = new Date().toISOString();
    // Se difiere tras el ciclo de efectos para cumplir React 19 sin perder idempotencia.
    const timer = setTimeout(() => {
      setProgress((current) => ({ ...current, logrosDesbloqueados: { ...current.logrosDesbloqueados, ...Object.fromEntries(missing.map((id) => [id, now])) }, logros: [...new Set([...current.logros, ...missing])]}));
      setLatestAchievementId(missing[0] ?? null);
    }, 0);
    return () => clearTimeout(timer);
  }, [isHydrated, progress.leccionesCompletadas.length, progress.logrosDesbloqueados, progress.mensajesPersonajes, progress.personajesConCharla.length, progress.rachaActual]);

  const setLessonProgress = useCallback((lessonId: string, cardIndex: number) => {
    if (!lessonId || !Number.isFinite(cardIndex)) return;
    setProgress((current) => ({
      ...current,
      progresoPorLeccion: {
        ...current.progresoPorLeccion,
        [lessonId]: Math.max(0, Math.floor(cardIndex)),
      },
    }));
  }, []);

  const recordQuizResult = useCallback((lessonId: string, score: number, total: number) => {
    if (
      !lessonId ||
      !Number.isInteger(score) ||
      !Number.isInteger(total) ||
      total <= 0 ||
      score < 0 ||
      score > total
    ) {
      return;
    }

    setProgress((current) => {
      const attemptStars = calculateQuizStars(score, total);
      const previousBestScore = current.mejorPuntuacionPorLeccion[lessonId] ?? 0;
      const previousBestStars = current.mejoresEstrellasPorLeccion[lessonId] ?? 0;
      const bestStarsByLesson = {
        ...current.mejoresEstrellasPorLeccion,
        [lessonId]: Math.max(previousBestStars, attemptStars),
      };

      return {
        ...current,
        ...calculateNewStreak(current, Date.now()),
        experiencia: current.experiencia + 10 + (score === total ? 15 : 0),
        leccionesCompletadas: current.leccionesCompletadas.includes(lessonId)
          ? current.leccionesCompletadas
          : [...current.leccionesCompletadas, lessonId],
        estrellas: getGlobalStars(bestStarsByLesson, current.estrellasPersonajesPorId),
        mejorPuntuacionPorLeccion: {
          ...current.mejorPuntuacionPorLeccion,
          [lessonId]: Math.max(previousBestScore, score),
        },
        mejoresEstrellasPorLeccion: bestStarsByLesson,
        progresoPorLeccion: {
          ...current.progresoPorLeccion,
          [lessonId]: Math.max(current.progresoPorLeccion[lessonId] ?? 0, total - 1),
        },
      };
    });
  }, []);

  const registerCharacterInteraction = useCallback(
    (characterId: string, type: 'chat' | 'call') => {
      if (!characterId) return;

      setProgress((current) => {
        const isFirstChatWithCharacter = !current.personajesConCharla.includes(characterId);
        const characterStars = isFirstChatWithCharacter
          ? { ...current.estrellasPersonajesPorId, [characterId]: 1 }
          : current.estrellasPersonajesPorId;
        const messages = current.mensajesPersonajes + (type === 'chat' ? 1 : 0);
        const achievements = new Set(current.logros);
        if (current.personajesConCharla.length === 0) achievements.add('primera-charla');
        if (messages >= 5) achievements.add('charlador');

        return {
          ...current,
          ...calculateNewStreak(current, Date.now()),
          estrellasPersonajesPorId: characterStars,
          estrellas: getGlobalStars(current.mejoresEstrellasPorLeccion, characterStars),
          experiencia: current.experiencia + (type === 'call' ? 10 : 5),
          logros: [...achievements],
          mensajesPersonajes: messages,
          personajesConCharla: isFirstChatWithCharacter
            ? [...current.personajesConCharla, characterId]
            : current.personajesConCharla,
        };
      });
    },
    [],
  );

  const setLanguages = useCallback((nativo: LanguageCode, objetivo: LanguageCode) => {
    setProgress((current) => ({ ...current, idiomaNativo: nativo, idiomaObjetivo: objetivo }));
  }, []);

  const resetProgress = useCallback(() => {
    isBlockedFromSaving.current = false;
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const completeOnboarding = useCallback(() => {
    setProgress((current) => ({ ...current, onboardingCompleto: true }));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress, latestAchievementId, completeOnboarding,
      isHydrated,
      setLessonProgress,
      recordQuizResult,
      registerCharacterInteraction,
      setLanguages,
      resetProgress,
    }),
    [
      isHydrated,
      progress,
      latestAchievementId,
      completeOnboarding,
      recordQuizResult,
      registerCharacterInteraction,
      resetProgress,
      setLanguages,
      setLessonProgress,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress debe usarse dentro de ProgressProvider.');
  return context;
}
