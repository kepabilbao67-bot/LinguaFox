import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { LanguageCode, ProgressState } from '@/types/learning';
import { calculateQuizStars, sumBestStars } from '@/utils/rewards';
import { evaluateAchievements } from '@/data/achievements';

const STORAGE_KEY = '@linguafox/progress/v1';

const DEFAULT_PROGRESS: ProgressState = {
  leccionesCompletadas: [],
  estrellas: 0,
  mejorPuntuacionPorLeccion: {},
  mejoresEstrellasPorLeccion: {},
  idiomaNativo: 'es',
  idiomaObjetivo: 'en',
  nivelObjetivo: 'A1',
  ajustes: {
    darkMode: true,
    soundEnabled: true,
  },
  progresoPorLeccion: {},
  estrellasPersonajesPorId: {},
  experiencia: 0,
  logros: [],
  mensajesPersonajes: 0,
  personajesConCharla: [],
  ultimoDiaActivo: null,
  rachaActual: 0,
  logrosDesbloqueados: {},
  onboardingCompleto: false,
};

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeNumberRecord(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] >= 0,
    ),
  );
}

function sanitizeStarsRecord(value: unknown): Record<string, number> {
  const record = sanitizeNumberRecord(value);
  return Object.fromEntries(
    Object.entries(record).map(([lessonId, stars]) => [
      lessonId,
      Math.min(3, Math.max(0, Math.floor(stars))),
    ]),
  );
}

function sanitizeStringList(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string'))] : [];
}
function sanitizeStringRecord(value: unknown): Record<string,string> { if(!isRecord(value)) return {}; return Object.fromEntries(Object.entries(value).filter((entry): entry is [string,string]=>typeof entry[1]==='string')); }

function getGlobalStars(lessonStars: Record<string, number>, characterStars: Record<string, number>): number {
  return sumBestStars(lessonStars) + sumBestStars(characterStars);
}
function today(): string { return new Date().toISOString().slice(0,10); }
function validDay(value: unknown): string | null { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null; }
function awardActivity(current: ProgressState): Pick<ProgressState,'ultimoDiaActivo'|'rachaActual'> { const now=today(); if(current.ultimoDiaActivo===now) return {ultimoDiaActivo:now,rachaActual:current.rachaActual}; const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10); return {ultimoDiaActivo:now,rachaActual:current.ultimoDiaActivo===yesterday?current.rachaActual+1:1}; }

// Recupera solo campos válidos para que un almacenamiento corrupto no bloquee la app.
function sanitizeProgress(value: unknown): ProgressState {
  if (!isRecord(value)) return DEFAULT_PROGRESS;

  const settings = isRecord(value.ajustes) ? value.ajustes : {};
  const completed = sanitizeStringList(value.leccionesCompletadas);

  const bestStars = sanitizeStarsRecord(value.mejoresEstrellasPorLeccion);
  const characterStars = sanitizeStarsRecord(value.estrellasPersonajesPorId);

  let nativo = typeof value.idiomaNativo === 'string' ? (value.idiomaNativo as LanguageCode) : undefined;
  let objetivo = typeof value.idiomaObjetivo === 'string' ? (value.idiomaObjetivo as LanguageCode) : undefined;

  if (!nativo || !objetivo) {
    if (typeof value.idioma === 'string') {
      const oldIdioma = value.idioma as LanguageCode;
      nativo = 'es';
      objetivo = (oldIdioma === 'en' || oldIdioma === 'fr') ? oldIdioma : 'en';
    } else {
      nativo = nativo ?? DEFAULT_PROGRESS.idiomaNativo;
      objetivo = objetivo ?? DEFAULT_PROGRESS.idiomaObjetivo;
    }
  }

  return {
    leccionesCompletadas: completed,
    // El total se deriva de los máximos por lección para impedir duplicados.
    estrellas: getGlobalStars(bestStars, characterStars),
    mejorPuntuacionPorLeccion: sanitizeNumberRecord(value.mejorPuntuacionPorLeccion),
    mejoresEstrellasPorLeccion: bestStars,
    idiomaNativo: nativo,
    idiomaObjetivo: objetivo,
    nivelObjetivo: typeof value.nivelObjetivo === 'string' ? (value.nivelObjetivo as any) : DEFAULT_PROGRESS.nivelObjetivo,
    ajustes: {
      darkMode:
        typeof settings.darkMode === 'boolean'
          ? settings.darkMode
          : DEFAULT_PROGRESS.ajustes.darkMode,
      soundEnabled:
        typeof settings.soundEnabled === 'boolean'
          ? settings.soundEnabled
          : DEFAULT_PROGRESS.ajustes.soundEnabled,
    },
    progresoPorLeccion: sanitizeNumberRecord(value.progresoPorLeccion),
    estrellasPersonajesPorId: characterStars,
    experiencia:
      typeof value.experiencia === 'number' && Number.isFinite(value.experiencia)
        ? Math.max(0, Math.floor(value.experiencia))
        : 0,
    logros: sanitizeStringList(value.logros),
    mensajesPersonajes:
      typeof value.mensajesPersonajes === 'number' && Number.isFinite(value.mensajesPersonajes)
        ? Math.max(0, Math.floor(value.mensajesPersonajes))
        : 0,
    personajesConCharla: sanitizeStringList(value.personajesConCharla),
    ultimoDiaActivo: validDay(value.ultimoDiaActivo),
    rachaActual: typeof value.rachaActual === 'number' && Number.isFinite(value.rachaActual) ? Math.max(0,Math.floor(value.rachaActual)) : 0,
    logrosDesbloqueados: sanitizeStringRecord(value.logrosDesbloqueados),
    onboardingCompleto: value.onboardingCompleto === true,
  };
}

export function ProgressProvider({ children }: React.PropsWithChildren) {
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [latestAchievementId, setLatestAchievementId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProgress(): Promise<void> {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (isMounted && stored) setProgress(sanitizeProgress(JSON.parse(stored) as unknown));
      } catch (error: unknown) {
        // La app continúa con valores seguros aunque falle o esté corrupto el almacenamiento.
        console.warn('No se pudo cargar el progreso de LinguaFox.', error);
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
    if (!isHydrated) return;

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
        ...awardActivity(current),
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
          ...awardActivity(current),
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

  const resetProgress = useCallback(() => setProgress(DEFAULT_PROGRESS), []);
  const completeOnboarding = useCallback(() => setProgress((current) => ({ ...current, onboardingCompleto: true })), []);

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
