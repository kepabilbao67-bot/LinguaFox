import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { getDueCards, masteryLevel } from '@/utils/srs';
import { speakText, stopSpeaking } from '@/services/speech';
import { getLessonsByLanguage } from '@/data/lessons';
import type { SRSCard } from '@/types/learning';

export function SRSReviewScreen() {
  const { progress, recordSRSReview } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionStartTime] = useState(() => Date.now());

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // 1. Due cards in SRS storage
  const activeSrsCards = useMemo(
    () => getDueCards(progress.srs ?? {}, sessionStartTime),
    [progress.srs, sessionStartTime],
  );

  // 2. If no due cards in SRS yet, build cards from completed lessons to practice
  const reviewDeck = useMemo<SRSCard[]>(() => {
    if (activeSrsCards.length > 0) return activeSrsCards;

    // Build fallback queue from user's completed lessons or available lessons
    const completedLessonIds = progress.leccionesCompletadas ?? [];
    const lessons = getLessonsByLanguage(progress.idiomaObjetivo);
    const relevantLessons = lessons.filter((l) => completedLessonIds.includes(l.id));
    const poolLessons = relevantLessons.length > 0 ? relevantLessons : lessons.slice(0, 3);

    const cards: SRSCard[] = [];
    poolLessons.forEach((lesson) => {
      lesson.words.forEach((w) => {
        const key = `${progress.idiomaObjetivo}:${w.source}`;
        const existing = progress.srs?.[key];
        if (existing) {
          cards.push(existing);
        } else {
          cards.push({
            en: w.source,
            es: w.translation,
            ipa: (w as { ipa?: string }).ipa,
            repetitions: 0,
            interval: 0,
            easeFactor: 2.5,
            dueDate: sessionStartTime,
            lastReviewed: 0,
          });
        }
      });
    });

    return cards;
  }, [activeSrsCards, progress.idiomaObjetivo, progress.leccionesCompletadas, progress.srs, sessionStartTime]);

  const currentCard = reviewDeck[currentIndex];
  const isFinished = currentIndex >= reviewDeck.length || reviewDeck.length === 0;

  const handleAudio = (rate: 0.5 | 0.85 | 1.2 = 0.85) => {
    if (!currentCard) return;
    stopSpeaking();
    speakText(currentCard.en, { language: progress.idiomaObjetivo, rate });
  };

  const handleGrade = (grade: number) => {
    if (!currentCard) return;
    stopSpeaking();
    const key = `${progress.idiomaObjetivo}:${currentCard.en}`;
    recordSRSReview(key, grade, {
      en: currentCard.en,
      es: currentCard.es,
      ipa: currentCard.ipa,
    });
    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (isFinished) {
    return (
      <ScreenContainer title="Repaso Inteligente">
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedEmoji}>🎉</Text>
          <Text style={styles.finishedTitle}>¡Repaso Completado!</Text>
          <Text style={styles.finishedSubtitle}>
            {reviewedCount > 0
              ? `Has repasado ${reviewedCount} tarjetas con el algoritmo SuperMemo-2.`
              : 'No tienes tarjetas pendientes de repaso en este momento.'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{reviewedCount}</Text>
              <Text style={styles.statLabel}>Tarjetas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>+{reviewedCount * 10} XP</Text>
              <Text style={styles.statLabel}>Ganados</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const mastery = currentCard ? masteryLevel(currentCard) : 'new';
  const masteryLabel = mastery === 'mastered' ? '💎 Dominada' : mastery === 'learning' ? '⚡ En Aprendizaje' : '🌱 Nueva';

  return (
    <ScreenContainer title="Repaso Inteligente" scrollable={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Progress */}
        <View style={styles.headerRow}>
          <Text style={styles.counterText}>
            Tarjeta {currentIndex + 1} de {reviewDeck.length}
          </Text>
          <View style={styles.masteryBadge}>
            <Text style={styles.masteryText}>{masteryLabel}</Text>
          </View>
        </View>

        {/* Card Frame */}
        <Pressable style={styles.flashcard} onPress={() => setIsFlipped((prev) => !prev)}>
          <View style={styles.cardHeader}>
            <Text style={styles.langTag}>{progress.idiomaObjetivo.toUpperCase()}</Text>
            <Pressable style={styles.audioIconBtn} onPress={() => handleAudio(0.85)}>
              <Text style={styles.audioIcon}>🔊</Text>
            </Pressable>
          </View>

          <Text style={styles.cardWord}>{currentCard.en}</Text>
          {currentCard.ipa && <Text style={styles.cardIpa}>{currentCard.ipa}</Text>}

          {/* Audio Speeds */}
          <View style={styles.speedRow}>
            <Pressable style={styles.speedPill} onPress={() => handleAudio(0.5)}>
              <Text style={styles.speedPillText}>🐢 0.5x</Text>
            </Pressable>
            <Pressable style={styles.speedPill} onPress={() => handleAudio(0.85)}>
              <Text style={styles.speedPillText}>🦊 0.85x</Text>
            </Pressable>
            <Pressable style={styles.speedPill} onPress={() => handleAudio(1.2)}>
              <Text style={styles.speedPillText}>⚡ 1.2x</Text>
            </Pressable>
          </View>

          {/* Back side or tap to flip */}
          {isFlipped ? (
            <View style={styles.backSide}>
              <View style={styles.divider} />
              <Text style={styles.translationLabel}>Traducción:</Text>
              <Text style={styles.translationText}>{currentCard.es}</Text>
              <Text style={styles.intervalHint}>
                Intervalo actual: {currentCard.interval} días · Repeticiones: {currentCard.repetitions}
              </Text>
            </View>
          ) : (
            <View style={styles.flipPrompt}>
              <Text style={styles.flipPromptText}>👆 Toca para ver la respuesta</Text>
            </View>
          )}
        </Pressable>

        {/* Grading Buttons (only visible when flipped) */}
        {isFlipped && (
          <View style={styles.gradingSection}>
            <Text style={styles.gradingTitle}>¿Cómo de bien la recordaste?</Text>
            <View style={styles.gradingGrid}>
              <Pressable style={[styles.gradeBtn, styles.gradeHard]} onPress={() => handleGrade(1)}>
                <Text style={styles.gradeEmoji}>🔴</Text>
                <Text style={styles.gradeBtnText}>Olvidada</Text>
                <Text style={styles.gradeSubText}>Repetir hoy</Text>
              </Pressable>
              <Pressable style={[styles.gradeBtn, styles.gradeModerate]} onPress={() => handleGrade(3)}>
                <Text style={styles.gradeEmoji}>🟡</Text>
                <Text style={styles.gradeBtnText}>Difícil</Text>
                <Text style={styles.gradeSubText}>+1 día</Text>
              </Pressable>
              <Pressable style={[styles.gradeBtn, styles.gradeGood]} onPress={() => handleGrade(4)}>
                <Text style={styles.gradeEmoji}>🟢</Text>
                <Text style={styles.gradeBtnText}>Bien</Text>
                <Text style={styles.gradeSubText}>Normal</Text>
              </Pressable>
              <Pressable style={[styles.gradeBtn, styles.gradeEasy]} onPress={() => handleGrade(5)}>
                <Text style={styles.gradeEmoji}>💎</Text>
                <Text style={styles.gradeBtnText}>Perfecto</Text>
                <Text style={styles.gradeSubText}>Intervalo ++</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    color: AppColors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  masteryBadge: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  masteryText: {
    color: AppColors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  flashcard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langTag: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  audioIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: {
    fontSize: 18,
  },
  cardWord: {
    color: AppColors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 12,
  },
  cardIpa: {
    color: AppColors.primary,
    fontSize: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 8,
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  speedPill: {
    backgroundColor: AppColors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  speedPillText: {
    color: AppColors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  flipPrompt: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  flipPromptText: {
    color: AppColors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  backSide: {
    alignItems: 'center',
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.surfaceBorder,
    width: '100%',
    marginBottom: 12,
  },
  translationLabel: {
    color: AppColors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  translationText: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
  },
  intervalHint: {
    color: AppColors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  gradingSection: {
    gap: 12,
  },
  gradingTitle: {
    color: AppColors.text,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
  gradingGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  gradeBtn: {
    flex: 1,
    backgroundColor: AppColors.surface,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    gap: 2,
  },
  gradeHard: {
    borderColor: '#EF444440',
  },
  gradeModerate: {
    borderColor: '#F59E0B40',
  },
  gradeGood: {
    borderColor: '#10B98140',
  },
  gradeEasy: {
    borderColor: '#3B82F640',
  },
  gradeEmoji: {
    fontSize: 18,
  },
  gradeBtnText: {
    color: AppColors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  gradeSubText: {
    color: AppColors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  finishedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  finishedEmoji: {
    fontSize: 54,
  },
  finishedTitle: {
    color: AppColors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  finishedSubtitle: {
    color: AppColors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 10,
  },
  statBox: {
    backgroundColor: AppColors.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  statValue: {
    color: AppColors.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
