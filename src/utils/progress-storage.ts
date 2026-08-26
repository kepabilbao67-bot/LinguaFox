import type { LanguageCode, ProgressState } from '../types/learning';
import { getCalendarOrdinal } from './streak-logic';
import { sumBestStars } from './rewards';

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
  ultimoTimestampActivo: null,
  logrosDesbloqueados: {},
  onboardingCompleto: false,
};

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

function sanitizeStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

export function getGlobalStars(lessonStars: Record<string, number>, characterStars: Record<string, number>): number {
  return sumBestStars(lessonStars) + sumBestStars(characterStars);
}

export function validDay(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  // Usamos getCalendarOrdinal porque rechaza meses fuera de 1-12, días inexistentes y normalizaciones (30 feb).
  // getCalendarOrdinal devuelve > 0 si es válida.
  if (getCalendarOrdinal(value) > 0) return value;
  return null;
}

export function sanitizeProgress(value: unknown): ProgressState {
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

    // Validar parseo
    JSON.parse(stored);
    return { rawData: stored, isCorrupted: false };
  } catch {
    // Si llegamos aquí, el JSON falló al parsear, o hubo error de lectura (menos probable si stored existe)
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
