import type { ProgressState } from '@/types/learning';
import { getLocalDateKey } from './streak-logic';

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
  return getLocalDateKey(now);
}

export function getDailyChallenges(progress: ProgressState, now: number = Date.now()): DailyChallenge[] {
  const today = getLocalDateKey(now);
  const claims = progress.dailyChallengeClaims ?? {};
  const todayActivity = progress.activityByDate?.[today] ?? {
    lessonsCompleted: 0,
    chatMessages: 0,
    spokenPhrases: 0,
    reviewsCompleted: 0,
  };

  // 1. Completed Lessons challenge (ONLY today)
  const lessonCount = todayActivity.lessonsCompleted ?? 0;
  const isLessonCompleted = lessonCount >= 1;
  const isLessonClaimed = claims['daily-lesson'] === today;

  // 2. Chat / Conversation challenge (ONLY today)
  const chatMessages = todayActivity.chatMessages ?? 0;
  const isChatCompleted = chatMessages >= 1;
  const isChatClaimed = claims['daily-chat'] === today;

  // 3. Phonetics / Speech practice challenge (ONLY today)
  const spokenCount = todayActivity.spokenPhrases ?? 0;
  const isSpeechCompleted = spokenCount >= 1;
  const isSpeechClaimed = claims['daily-phonetics'] === today;

  return [
    {
      id: 'daily-lesson',
      title: 'Completar 1 lección',
      description: 'Supera una lección de vocabulario o gramática hoy.',
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
      description: 'Envía al menos un mensaje al tutor o personajes IA hoy.',
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
      description: 'Practica la articulación de frases con audio hoy.',
      target: 1,
      current: Math.min(1, spokenCount),
      completed: isSpeechCompleted,
      claimed: isSpeechClaimed,
      xpReward: 20,
      icon: '🎙️',
    },
  ];
}
