import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, AccessibilityInfo } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { getProgressKey } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';
import type { Lesson, QuizReward } from '@/types/learning';
import { calculateQuizStars } from '@/utils/rewards';
import { calculateEducationalScore } from '@/utils/evaluation';

interface ResultScreenProps {
  lesson: Lesson | undefined;
  score: number | undefined;
  total: number | undefined;
}

export function ResultScreen({ lesson, score, total }: ResultScreenProps) {
  const { isHydrated } = useProgress();
  const hasValidResult =
    lesson !== undefined &&
    score !== undefined &&
    total !== undefined &&
    total > 0 &&
    score >= 0 &&
    score <= total;

  if (!hasValidResult || !lesson || score === undefined || total === undefined) {
    return (
      <ScreenContainer title="Resultado">
        <EmptyState
          title="Resultado no disponible"
          message="No hemos podido recuperar un resultado válido para este quiz."
        />
      </ScreenContainer>
    );
  }

  if (!isHydrated) return <ScreenContainer title="Resultado" isLoading />;

  return <HydratedResult lesson={lesson} score={score} total={total} />;
}

interface HydratedResultProps {
  lesson: Lesson;
  score: number;
  total: number;
}

function HydratedResult({ lesson, score, total }: HydratedResultProps) {
  const { progress, recordQuizResult } = useProgress();
  const [reward] = useState<QuizReward>(() => {
    const attemptStars = calculateQuizStars(score, total);
    const progressKey = getProgressKey(lesson.language, lesson.id);
    const previousStars = progress.mejoresEstrellasPorLeccion[progressKey] ?? 0;
    const previousBestScore = progress.mejorPuntuacionPorLeccion[progressKey] ?? 0;
    const newStars = Math.max(0, attemptStars - previousStars);

    return {
      estrellasDelIntento: attemptStars,
      nuevasEstrellas: newStars,
      mejorPuntuacion: Math.max(previousBestScore, score),
      totalEstrellas: progress.estrellas + newStars,
    };
  });
  const [rewardAnimation] = useState(() => new Animated.Value(0));

  // Compute Educational Score
  const dimensions = {
    comprehension: { evaluated: true, earned: score, max: total },
    vocabulary: { evaluated: true, earned: score, max: total },
    pronunciation: { evaluated: false, earned: 0, max: 1 },
    fluency: { evaluated: false, earned: 0, max: 1 },
  };
  const eduScore = calculateEducationalScore(dimensions as any);

  useEffect(() => {
    // El registro es idempotente: solo conserva máximos por lección.
    recordQuizResult(getProgressKey(lesson.language, lesson.id), score, total);
    
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) {
        rewardAnimation.setValue(1);
      } else {
        Animated.spring(rewardAnimation, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [lesson.id, lesson.language, recordQuizResult, rewardAnimation, score, total]);

  const verdict =
    score === total ? '¡Perfecto!' : score >= total / 2 ? 'Bien, sigue así' : 'Repasa la lección';

  return (
    <ScreenContainer title="Resultado">
      <View style={styles.card}>
        <Text style={styles.lesson}>{lesson.title}</Text>
        <Text style={styles.score}>
          {score}/{total}
        </Text>
        <Text style={styles.verdict}>{verdict}</Text>

        <View style={styles.educationalBox}>
          <Text style={styles.educationalTitle}>Puntuación Educativa</Text>
          <Text style={styles.educationalScore}>{eduScore} / 100</Text>
          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Comprensión y Vocabulario:</Text>
            <Text style={styles.dimensionValue}>Evaluada</Text>
          </View>
          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Pronunciación y Fluidez:</Text>
            <Text style={styles.dimensionValueDimmed}>No evaluada</Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.rewardBox,
            {
              opacity: rewardAnimation,
              transform: [{ scale: rewardAnimation }],
            },
          ]}>
          <Text style={styles.rewardStars}>
            {Array.from({ length: 3 }, (_, index) =>
              index < reward.estrellasDelIntento ? '★' : '☆',
            ).join(' ')}
          </Text>
          <Text style={styles.rewardTitle}>
            {reward.nuevasEstrellas > 0
              ? `¡Has ganado ${reward.nuevasEstrellas} ${reward.nuevasEstrellas === 1 ? 'estrella' : 'estrellas'}!`
              : 'Mantienes tu mejor recompensa'}
          </Text>
          <Text style={styles.rewardDetail}>
            Mejor marca: {reward.mejorPuntuacion}/{total} · Total: {reward.totalEstrellas} ★
          </Text>
        </Animated.View>

        <Pressable style={styles.button} onPress={() => router.replace(`/quiz/${lesson.id}`)}>
          <Text style={styles.buttonText}>Repetir quiz</Text>
        </Pressable>
        <Pressable style={styles.homeButton} onPress={() => router.replace('/')}>
          <Text style={styles.homeText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: AppColors.surface, borderRadius: 20, padding: 24, alignItems: 'center' },
  lesson: { color: AppColors.textMuted, fontSize: 17, fontWeight: '700' },
  score: { color: AppColors.text, fontSize: 48, fontWeight: '900', marginTop: 12 },
  verdict: { color: AppColors.primaryBright, fontSize: 20, fontWeight: '800', marginBottom: 22 },
  educationalBox: {
    width: '100%',
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.surfaceRaised,
  },
  educationalTitle: { color: AppColors.text, fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  educationalScore: { color: AppColors.primary, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  dimensionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  dimensionLabel: { color: AppColors.text, fontSize: 14 },
  dimensionValue: { color: AppColors.success, fontSize: 14, fontWeight: '700' },
  dimensionValueDimmed: { color: AppColors.textMuted, fontSize: 14, fontStyle: 'italic' },
  rewardBox: {
    width: '100%',
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardStars: { color: AppColors.accent, fontSize: 29, letterSpacing: 3 },
  rewardTitle: { color: AppColors.text, fontSize: 17, fontWeight: '800', marginTop: 8 },
  rewardDetail: {
    color: AppColors.textMuted,
    marginTop: 6,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  button: {
    width: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  buttonText: { color: AppColors.text, fontWeight: '800' },
  homeButton: { paddingVertical: 16 },
  homeText: { color: AppColors.textMuted, fontWeight: '600' },
});
