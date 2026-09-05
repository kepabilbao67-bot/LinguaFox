export type AchievementCategory = 'streak' | 'learning' | 'chat' | 'travel' | 'speaking';

export interface Achievement {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  categoria: AchievementCategory;
  targetValue: number;
  xpReward: number;
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'primera-leccion',
    titulo: 'Primer paso',
    descripcion: 'Completa tu primera lección de vocabulario o gramática.',
    icono: '🌱',
    categoria: 'learning',
    targetValue: 1,
    xpReward: 50,
  },
  {
    id: 'maestro-lecciones',
    titulo: 'Estudiante Dedicado',
    descripcion: 'Completa 5 lecciones en el curso activo.',
    icono: '📚',
    categoria: 'learning',
    targetValue: 5,
    xpReward: 100,
  },
  {
    id: 'primera-charla',
    titulo: 'Primera charla',
    descripcion: 'Inicia una conversación guiada con un personaje nativo.',
    icono: '💬',
    categoria: 'chat',
    targetValue: 1,
    xpReward: 50,
  },
  {
    id: 'charlador',
    titulo: 'Conversador Nato',
    descripcion: 'Envía 5 o más mensajes a personajes o tutores IA.',
    icono: '🗣️',
    categoria: 'chat',
    targetValue: 5,
    xpReward: 100,
  },
  {
    id: 'maestro-dialogo',
    titulo: 'Tertuliano Experto',
    descripcion: 'Alcanza 15 mensajes en conversaciones de inmersión.',
    icono: '🎭',
    categoria: 'chat',
    targetValue: 15,
    xpReward: 200,
  },
  {
    id: 'racha-3',
    titulo: 'En llamas',
    descripcion: 'Mantén una racha de práctica de 3 días consecutivos.',
    icono: '🔥',
    categoria: 'streak',
    targetValue: 3,
    xpReward: 75,
  },
  {
    id: 'racha-7',
    titulo: 'Imparable',
    descripcion: 'Alcanza una racha legendaria de 7 días continuos.',
    icono: '⚡',
    categoria: 'streak',
    targetValue: 7,
    xpReward: 150,
  },
  {
    id: 'oido-fino',
    titulo: 'Oído y Articulación',
    descripcion: 'Practica ejercicios en el laboratorio de pronunciación.',
    icono: '🎧',
    categoria: 'speaking',
    targetValue: 3,
    xpReward: 100,
  },
  {
    id: 'viajero-culto',
    titulo: 'Trotamundos Cultural',
    descripcion: 'Explora situaciones y misiones en Ciudades del Mundo.',
    icono: '✈️',
    categoria: 'travel',
    targetValue: 1,
    xpReward: 120,
  },
] as const;

export interface AchievementEvaluationContext {
  lecciones: number;
  mensajes: number;
  personajes: number;
  racha: number;
  spokenPhrases?: number;
  unlockedCities?: number;
}

export function evaluateAchievements(context: AchievementEvaluationContext): string[] {
  const ids: string[] = [];
  if (context.lecciones >= 1) ids.push('primera-leccion');
  if (context.lecciones >= 5) ids.push('maestro-lecciones');
  if (context.mensajes >= 1 || context.personajes >= 1) ids.push('primera-charla');
  if (context.mensajes >= 5) ids.push('charlador');
  if (context.mensajes >= 15) ids.push('maestro-dialogo');
  if (context.racha >= 3) ids.push('racha-3');
  if (context.racha >= 7) ids.push('racha-7');
  if ((context.spokenPhrases ?? 0) >= 3) ids.push('oido-fino');
  if ((context.unlockedCities ?? 0) >= 1) ids.push('viajero-culto');
  return ids;
}
