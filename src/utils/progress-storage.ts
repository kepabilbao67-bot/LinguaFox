import type { AppSettings, CrownLevel, LanguageCode, LessonCrown, ProgressState, SRSCard } from '@/types/learning';
import { sumBestStars } from './rewards';
import { getCalendarOrdinal } from './streak-logic';

export const STORAGE_KEY = '@linguafox/progress/v1';

export const DEFAULT_PROGRESS: ProgressState = {
  leccionesCompletadas: [],
  estrellas: 0,
  mejorPuntuacionPorLeccion: {},
  mejoresEstrellasPorLeccion: {},
  idiomaNativo: 'es',
  idiomaObjetivo: 'en',
  nivelObjetivo: 'A1',
  ajustes: {
    darkMode: false,
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
  ultimoTimestampActivo: null,
  logrosDesbloqueados: {},
  onboardingCompleto: false,
  hearts: 5,
  heartsRefillAt: null,
  gems: 100,
  coins: 0,
  crowns: {},
  srs: {},
};

export function getGlobalStars(
  lessonStars: Readonly<Record<string, number>>,
  characterStars: Readonly<Record<string, number>>
): number {
  return sumBestStars(lessonStars) + sumBestStars(characterStars);
}

function sanitizeNumberRecord(input: unknown): Record<string, number> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return {};
  return Object.entries(input).reduce<Record<string, number>>((acc, [k, v]) => {
    if (typeof v === 'number' && Number.isFinite(v)) acc[k] = Math.max(0, Math.floor(v));
    return acc;
  }, {});
}

function sanitizeStringRecord(input: unknown): Record<string, string> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return {};
  return Object.entries(input).reduce<Record<string, string>>((acc, [k, v]) => {
    if (typeof v === 'string') acc[k] = v;
    return acc;
  }, {});
}

function sanitizeStringList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const list = input.filter((item): item is string => typeof item === 'string');
  return Array.from(new Set(list));
}

export function validDay(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (getCalendarOrdinal(value) > 0) return value;
  return null;
}

function sanitizeCrowns(input: unknown): Record<string, LessonCrown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return {};
  const validLevels: Set<CrownLevel> = new Set(['none', 'bronze', 'silver', 'gold', 'diamond']);
  return Object.entries(input).reduce<Record<string, LessonCrown>>((acc, [k, v]) => {
    if (typeof v === 'object' && v !== null) {
      const obj = v as Partial<LessonCrown>;
      if (typeof obj.lessonId === 'string' && typeof obj.level === 'string' && validLevels.has(obj.level as CrownLevel)) {
        acc[k] = {
          lessonId: obj.lessonId,
          level: obj.level as CrownLevel,
          accuracy: typeof obj.accuracy === 'number' ? Math.max(0, Math.min(100, obj.accuracy)) : 0,
          perfectPronunciation: obj.perfectPronunciation === true,
          achievedAt: typeof obj.achievedAt === 'number' ? obj.achievedAt : Date.now(),
        };
      }
    }
    return acc;
  }, {});
}

function sanitizeSrs(input: unknown): Record<string, SRSCard> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return {};
  return Object.entries(input).reduce<Record<string, SRSCard>>((acc, [k, v]) => {
    if (typeof v === 'object' && v !== null) {
      const obj = v as Partial<SRSCard>;
      if (typeof obj.en === 'string' && typeof obj.es === 'string') {
        acc[k] = {
          en: obj.en,
          es: obj.es,
          ipa: typeof obj.ipa === 'string' ? obj.ipa : undefined,
          repetitions: typeof obj.repetitions === 'number' ? Math.max(0, Math.floor(obj.repetitions)) : 0,
          interval: typeof obj.interval === 'number' ? Math.max(0, Math.floor(obj.interval)) : 0,
          easeFactor: typeof obj.easeFactor === 'number' && obj.easeFactor >= 1.3 ? obj.easeFactor : 2.5,
          dueDate: typeof obj.dueDate === 'number' ? obj.dueDate : Date.now(),
          lastReviewed: typeof obj.lastReviewed === 'number' ? obj.lastReviewed : 0,
        };
      }
    }
    return acc;
  }, {});
}

export function sanitizeProgress(raw: unknown): ProgressState {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return DEFAULT_PROGRESS;

  const value = raw as Partial<ProgressState> & {
    idioma?: string;
    lecciones?: string[];
  };

  const completed = sanitizeStringList(value.leccionesCompletadas ?? value.lecciones);
  const characterStars = sanitizeNumberRecord(value.estrellasPersonajesPorId);
  const bestStars = sanitizeNumberRecord(value.mejoresEstrellasPorLeccion);
  const settings = (typeof value.ajustes === 'object' && value.ajustes !== null ? value.ajustes : {}) as Partial<AppSettings>;

  const VALID_LANGUAGES = new Set<LanguageCode>(['en', 'es', 'fr', 'it', 'de', 'pt', 'eu', 'ca']);

  let nativo = typeof value.idiomaNativo === 'string' && VALID_LANGUAGES.has(value.idiomaNativo as LanguageCode)
    ? (value.idiomaNativo as LanguageCode)
    : undefined;
  let objetivo = typeof value.idiomaObjetivo === 'string' && VALID_LANGUAGES.has(value.idiomaObjetivo as LanguageCode)
    ? (value.idiomaObjetivo as LanguageCode)
    : undefined;

  if (!nativo || !objetivo) {
    if (typeof value.idioma === 'string') {
      const oldIdioma = value.idioma as LanguageCode;
      nativo = 'es';
      objetivo = VALID_LANGUAGES.has(oldIdioma) ? oldIdioma : 'en';
    } else {
      nativo = nativo ?? DEFAULT_PROGRESS.idiomaNativo;
      objetivo = objetivo ?? DEFAULT_PROGRESS.idiomaObjetivo;
    }
  }

  const hearts = typeof value.hearts === 'number' && Number.isFinite(value.hearts)
    ? Math.max(0, Math.min(5, Math.floor(value.hearts)))
    : DEFAULT_PROGRESS.hearts;

  const gems = typeof value.gems === 'number' && Number.isFinite(value.gems)
    ? Math.max(0, Math.floor(value.gems))
    : DEFAULT_PROGRESS.gems;

  const coins = typeof value.coins === 'number' && Number.isFinite(value.coins)
    ? Math.max(0, Math.floor(value.coins))
    : DEFAULT_PROGRESS.coins;

  return {
    leccionesCompletadas: completed,
    estrellas: getGlobalStars(bestStars, characterStars),
    mejorPuntuacionPorLeccion: sanitizeNumberRecord(value.mejorPuntuacionPorLeccion),
    mejoresEstrellasPorLeccion: bestStars,
    idiomaNativo: nativo,
    idiomaObjetivo: objetivo,
    nivelObjetivo: typeof value.nivelObjetivo === 'string' ? (value.nivelObjetivo as any) : DEFAULT_PROGRESS.nivelObjetivo,
    ajustes: {
      darkMode: typeof settings.darkMode === 'boolean' ? settings.darkMode : DEFAULT_PROGRESS.ajustes.darkMode,
      soundEnabled: typeof settings.soundEnabled === 'boolean' ? settings.soundEnabled : DEFAULT_PROGRESS.ajustes.soundEnabled,
    },
    progresoPorLeccion: sanitizeNumberRecord(value.progresoPorLeccion),
    estrellasPersonajesPorId: characterStars,
    experiencia: typeof value.experiencia === 'number' && Number.isFinite(value.experiencia) ? Math.max(0, Math.floor(value.experiencia)) : 0,
    logros: sanitizeStringList(value.logros),
    mensajesPersonajes: typeof value.mensajesPersonajes === 'number' && Number.isFinite(value.mensajesPersonajes) ? Math.max(0, Math.floor(value.mensajesPersonajes)) : 0,
    personajesConCharla: sanitizeStringList(value.personajesConCharla),
    ultimoDiaActivo: validDay(value.ultimoDiaActivo),
    rachaActual: typeof value.rachaActual === 'number' && Number.isFinite(value.rachaActual) ? Math.max(0, Math.floor(value.rachaActual)) : 0,
    ultimoTimestampActivo: typeof value.ultimoTimestampActivo === 'number' && Number.isFinite(value.ultimoTimestampActivo) ? value.ultimoTimestampActivo : null,
    logrosDesbloqueados: sanitizeStringRecord(value.logrosDesbloqueados),
    onboardingCompleto: value.onboardingCompleto === true,
    hearts,
    heartsRefillAt: typeof value.heartsRefillAt === 'number' ? value.heartsRefillAt : null,
    gems,
    coins,
    crowns: sanitizeCrowns(value.crowns),
    srs: sanitizeSrs(value.srs),
  };
}

export async function safeLoadProgress(
  getItem: (key: string) => Promise<string | null>,
  setItem: (key: string, value: string) => Promise<void>,
  now: number
): Promise<{ rawData: string | null; isCorrupted: boolean }> {
  let stored: string | null = null;
  try {
    stored = await getItem(STORAGE_KEY);
    if (!stored) return { rawData: null, isCorrupted: false };

    JSON.parse(stored);
    return { rawData: stored, isCorrupted: false };
  } catch {
    if (stored) {
      try {
        await setItem(`${STORAGE_KEY}_corrupted_${now}`, stored);
      } catch (backupError) {
        console.error('Fallo al crear el respaldo.', backupError);
      }
    }
    return { rawData: null, isCorrupted: true };
  }
}
