import type { ProgressState } from '@/types/learning';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  xpReward: number;
  icon: string;
}

export function getTodayDateString(now: number = Date.now()): string {
  const d = new Date(now);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyChallenges(progress: ProgressState, now: number = Date.now()): DailyChallenge[] {
  const today = getTodayDateString(now);
  const claims = progress.dailyChallengeClaims ?? {};

  // 1. Completed Lessons challenge
  const lessonCount = progress.leccionesCompletadas?.length ?? 0;
  const isLessonCompleted = lessonCount >= 1;
  const isLessonClaimed = claims['daily-lesson'] === today;

  // 2. Chat / Conversation challenge
  const chatMessages = progress.mensajesPersonajes ?? 0;
  const isChatCompleted = chatMessages >= 1;
  const isChatClaimed = claims['daily-chat'] === today;

  // 3. Phonetics / Speech practice challenge
  const spokenCount = progress.spokenPhrasesCount ?? 0;
  const isSpeechCompleted = spokenCount >= 1;
  const isSpeechClaimed = claims['daily-phonetics'] === today;

  return [
    {
      id: 'daily-lesson',
      title: 'Completar 1 lección',
      description: 'Supera una lección de vocabulario o gramática.',
      target: 1,
      current: Math.min(1, lessonCount),
      completed: isLessonCompleted,
      claimed: isLessonClaimed,
      xpReward: 20,
      icon: '📚',
    },
    {
      id: 'daily-chat',
      title: 'Charla en Vivo con Fox',
      description: 'Envía al menos un mensaje al tutor o personajes IA.',
      target: 1,
      current: Math.min(1, chatMessages),
      completed: isChatCompleted,
      claimed: isChatClaimed,
      xpReward: 20,
      icon: '💬',
    },
    {
      id: 'daily-phonetics',
      title: 'Laboratorio de Pronunciación',
      description: 'Practica la articulación de frases con audio.',
      target: 1,
      current: Math.min(1, spokenCount),
      completed: isSpeechCompleted,
      claimed: isSpeechClaimed,
      xpReward: 20,
      icon: '🎙️',
    },
  ];
}
