import { useLocalSearchParams } from 'expo-router';

import { ResultScreen } from '@/components/screens/result-screen';
import { getLessonById } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';

function parseNonNegativeInteger(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

export default function ResultRoute() {
  const { lessonId, score, total } = useLocalSearchParams<{
    lessonId?: string;
    score?: string;
    total?: string;
  }>();
  const { progress } = useProgress();

  return (
    <ResultScreen
      lesson={getLessonById(lessonId, progress.idiomaObjetivo)}
      score={parseNonNegativeInteger(score)}
      total={parseNonNegativeInteger(total)}
    />
  );
}
