import type { Lesson, ProgressState } from '@/types/learning';

export type AdaptiveActionKind = 'continue' | 'review' | 'conversation' | 'characters';

export interface AdaptiveAction {
  id: string;
  kind: AdaptiveActionKind;
  title: string;
  description: string;
  href: string;
  priority: number;
}

function scoreLesson(progress: ProgressState, lesson: Lesson): number {
  const progressKey = `${lesson.language}:${lesson.id}`;
  const completed = progress.leccionesCompletadas.includes(progressKey);
  const bestStars = progress.mejoresEstrellasPorLeccion[progressKey] ?? 0;
  const bestScore = progress.mejorPuntuacionPorLeccion[progressKey] ?? 0;

  if (!completed) return 100;
  if (bestStars < 2) return 80;
  if (bestScore < lesson.words.length) return 70;
  return 20;
}

export function buildAdaptiveActions(
  progress: ProgressState,
  lessons: readonly Lesson[],
  now: number = Date.now(),
): readonly AdaptiveAction[] {
  const rankedLessons = lessons
    .map((lesson) => ({ lesson, score: scoreLesson(progress, lesson) }))
    .sort((a, b) => b.score - a.score);

  const actions: AdaptiveAction[] = [];

  const primary = rankedLessons[0];
  if (primary) {
    const progressKey = `${primary.lesson.language}:${primary.lesson.id}`;
    const completed = progress.leccionesCompletadas.includes(progressKey);
    actions.push({
      id: `lesson-${primary.lesson.id}`,
      kind: completed ? 'review' : 'continue',
      title: completed ? 'Repasa lo que más te conviene' : 'Sigue por aquí',
      description: primary.lesson.title,
      href: `/lesson/${primary.lesson.id}`,
      priority: primary.score,
    });
  }

  const dueCards = Object.values(progress.srs).filter((card) => card.dueDate <= now).length;
  if (dueCards > 0) {
    actions.push({
      id: 'srs-review',
      kind: 'review',
      title: 'Tienes vocabulario para repasar',
      description: `${dueCards} ${dueCards === 1 ? 'palabra pendiente' : 'palabras pendientes'}`,
      href: primary ? `/quiz/${primary.lesson.id}` : '/chat',
      priority: 95,
    });
  }

  actions.push({
    id: 'conversation',
    kind: 'conversation',
    title: 'Practica una conversación real',
    description: 'Habla con Fox y recibe correcciones al momento.',
    href: '/chat',
    priority: progress.mensajesPersonajes < 5 ? 75 : 45,
  });

  actions.push({
    id: 'characters',
    kind: 'characters',
    title: 'Cambia de situación',
    description: 'Practica con personajes y contextos distintos.',
    href: '/characters',
    priority: progress.personajesConCharla.length === 0 ? 65 : 35,
  });

  return actions.sort((a, b) => b.priority - a.priority).slice(0, 3);
}
