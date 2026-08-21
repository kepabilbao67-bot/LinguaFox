import { useLocalSearchParams } from 'expo-router';

import { LessonScreen } from '@/components/screens/lesson-screen';
import { getLessonById } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';

export default function LessonRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const { progress } = useProgress();
  return <LessonScreen lesson={getLessonById(lessonId, progress.idioma)} />;
}
