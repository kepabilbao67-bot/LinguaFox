export type AchievementCategory = 'streak' | 'learning' | 'chat' | 'travel' | 'speaking';

export type AchievementMetric =
  | 'lessonsCompleted'
  | 'streakDays'
  | 'chatMessages'
  | 'spokenPhrases'
  | 'citiesUnlocked'
  | 'wordsLearned'
  | 'reviewsCompleted'
  | 'scenariosCompleted';

export interface Achievement {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  categoria: AchievementCategory;
  metric: AchievementMetric;
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
    metric: 'lessonsCompleted',
    targetValue: 1,
    xpReward: 50,
  },
  {
    id: 'maestro-lecciones',
    titulo: 'Estudiante Dedicado',
    descripcion: 'Completa 5 lecciones en tu curso activo.',
    icono: '📚',
    categoria: 'learning',
    metric: 'lessonsCompleted',
    targetValue: 5,
    xpReward: 100,
  },
  {
    id: 'primera-charla',
    titulo: 'Primera charla',
    descripcion: 'Inicia una conversación guiada con un personaje o tutor IA.',
    icono: '💬',
    categoria: 'chat',
    metric: 'chatMessages',
    targetValue: 1,
    xpReward: 50,
  },
  {
    id: 'charlador',
    titulo: 'Conversador Nato',
    descripcion: 'Envía 5 o más mensajes a personajes o tutores IA.',
    icono: '🗣️',
    categoria: 'chat',
    metric: 'chatMessages',
    targetValue: 5,
    xpReward: 100,
  },
  {
    id: 'maestro-dialogo',
    titulo: 'Tertuliano Experto',
    descripcion: 'Alcanza 15 mensajes en conversaciones de inmersión.',
    icono: '🎭',
    categoria: 'chat',
    metric: 'chatMessages',
    targetValue: 15,
    xpReward: 200,
  },
  {
    id: 'racha-3',
    titulo: 'En llamas',
    descripcion: 'Mantén una racha de práctica de 3 días consecutivos.',
    icono: '🔥',
    categoria: 'streak',
    metric: 'streakDays',
    targetValue: 3,
    xpReward: 75,
  },
  {
    id: 'racha-7',
    titulo: 'Imparable',
    descripcion: 'Alcanza una racha legendaria de 7 días continuos.',
    icono: '⚡',
    categoria: 'streak',
    metric: 'streakDays',
    targetValue: 7,
    xpReward: 150,
  },
  {
    id: 'oido-fino',
    titulo: 'Oído y Articulación',
    descripcion: 'Practica frases en voz alta en el laboratorio de pronunciación.',
    icono: '🎧',
    categoria: 'speaking',
    metric: 'spokenPhrases',
    targetValue: 3,
    xpReward: 100,
  },
  {
    id: 'viajero-culto',
    titulo: 'Trotamundos Cultural',
    descripcion: 'Explora situaciones y misiones en Ciudades del Mundo.',
    icono: '✈️',
    categoria: 'travel',
    metric: 'citiesUnlocked',
    targetValue: 1,
    xpReward: 120,
  },
  {
    id: 'maestro-escenarios',
    titulo: 'Actor de Situaciones',
    descripcion: 'Supera con éxito un escenario guiado de roleplay.',
    icono: '🎬',
    categoria: 'chat',
    metric: 'scenariosCompleted',
    targetValue: 1,
    xpReward: 80,
  },
  {
    id: 'memoria-srs',
    titulo: 'Memoria de Elefante',
    descripcion: 'Repasa al menos 5 tarjetas con el algoritmo SuperMemo-2.',
    icono: '🧠',
    categoria: 'learning',
    metric: 'reviewsCompleted',
    targetValue: 5,
    xpReward: 100,
  },
] as const;

export interface AchievementEvaluationContext {
  lecciones?: number;
  mensajes?: number;
  personajes?: number;
  racha?: number;
  spokenPhrases?: number;
  unlockedCities?: number;
  wordsLearned?: number;
  reviewsCompleted?: number;
  scenariosCompleted?: number;
}

export function resolveMetricValue(
  metric: AchievementMetric,
  context: AchievementEvaluationContext,
): number {
  switch (metric) {
    case 'lessonsCompleted':
      return context.lecciones ?? 0;
    case 'streakDays':
      return context.racha ?? 0;
    case 'chatMessages':
      return context.mensajes ?? (context.personajes ? context.personajes : 0);
    case 'spokenPhrases':
      return context.spokenPhrases ?? 0;
    case 'citiesUnlocked':
      return context.unlockedCities ?? 0;
    case 'wordsLearned':
      return context.wordsLearned ?? 0;
    case 'reviewsCompleted':
      return context.reviewsCompleted ?? 0;
    case 'scenariosCompleted':
      return context.scenariosCompleted ?? 0;
    default:
      return 0;
  }
}

export function evaluateAchievements(context: AchievementEvaluationContext): string[] {
  const unlockedIds: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    const value = resolveMetricValue(achievement.metric, context);
    if (value >= achievement.targetValue) {
      unlockedIds.push(achievement.id);
    }
  }

  return unlockedIds;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
