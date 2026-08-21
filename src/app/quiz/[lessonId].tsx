import { useLocalSearchParams } from 'expo-router';

import { QuizScreen } from '@/components/screens/quiz-screen';
import { getLessonById } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';

export default function QuizRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const { progress } = useProgress();
  return <QuizScreen lesson={getLessonById(lessonId, progress.idiomaObjetivo)} />;
}
