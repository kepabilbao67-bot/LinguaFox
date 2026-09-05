import { router } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { getProgressKey } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';
import { isSpeechRecognitionAvailable, speakText, startRecognition, stopSpeaking } from '@/services/speech';
import type { Lesson } from '@/types/learning';
import { useTheme, type ThemeColors } from '@/theme/theme-context';

interface LessonScreenProps {
  lesson: Lesson | undefined;
}

type SpeechSpeed = 'lenta' | 'normal' | 'rápida';

export function LessonScreen({ lesson }: LessonScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated, setLessonProgress } = useProgress();
  const savedIndex = lesson ? progress.progresoPorLeccion[getProgressKey(lesson.language, lesson.id)] ?? 0 : 0;
  const [cardIndex, setCardIndex] = useState(savedIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>('normal');

  const safeIndex = lesson?.words.length
    ? Math.min(Math.max(0, cardIndex), lesson.words.length - 1)
    : 0;
  const word = lesson?.words[safeIndex];
  const vocabItem = lesson?.vocab?.find((v) => v.en.toLowerCase() === word?.source.toLowerCase());

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!lesson) {
    return (
      <ScreenContainer title="Lección">
        <EmptyState title="Lección no encontrada" message="La lección solicitada no existe." />
      </ScreenContainer>
    );
  }

  if (lesson.words.length === 0 || !word) {
    return (
      <ScreenContainer title={lesson.title}>
        <EmptyState
          title="Lección vacía"
          message="Esta lección todavía no tiene vocabulario disponible."
        />
      </ScreenContainer>
    );
  }

  const goToCard = (nextIndex: number): void => {
    const boundedIndex = Math.min(Math.max(0, nextIndex), lesson.words.length - 1);
    setCardIndex(boundedIndex);
    setIsFlipped(false);
    setAudioFeedback(null);
    setLessonProgress(getProgressKey(lesson.language, lesson.id), boundedIndex);
  };

  const isFirst = safeIndex === 0;
  const isLast = safeIndex === lesson.words.length - 1;

  const listenToWord = (): void => {
    const rate = speechSpeed === 'lenta' ? 0.5 : speechSpeed === 'rápida' ? 1.2 : 0.85;
    const ok = speakText(word.source, { language: lesson.language, rate });
    setAudioFeedback(ok ? `🔊 Escuchando a velocidad ${speechSpeed}` : 'Audio no disponible');
  };

  const practicePronunciation = async (): Promise<void> => {
    if (!isSpeechRecognitionAvailable()) {
      listenToWord();
      setAudioFeedback('🗣️ Escucha la pronunciación nativa y repite en voz alta');
      return;
    }
    const result = await startRecognition();
    setAudioFeedback(result.message);
  };

  return (
    <ScreenContainer title={lesson.title} isLoading={!isHydrated} scrollable={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Progress Bar Header */}
        <View style={styles.headerProgressRow}>
          <Text style={styles.progressText}>
            Palabra {safeIndex + 1} de {lesson.words.length}
          </Text>
          <View style={styles.headerDots}>
            {lesson.words.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === safeIndex && styles.dotActive,
                  i < safeIndex && styles.dotCompleted,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Main Interactive Flashcard */}
        <Pressable
          style={({ pressed }) => [styles.flashcard, pressed && styles.cardPressed]}
          onPress={() => setIsFlipped((current) => !current)}
        >
          <View style={styles.cardHeaderTag}>
            <Text style={styles.cardHeaderTagText}>
              {isFlipped ? '🇪🇸 TRADUCCIÓN' : '🎯 EXPRESIÓN OBJETIVO'}
            </Text>
          </View>

          <Text style={styles.wordMain}>{isFlipped ? word.translation : word.source}</Text>

          {vocabItem?.ipa && !isFlipped ? (
            <Text style={styles.ipaText}>{vocabItem.ipa}</Text>
          ) : null}

          <Text style={styles.hintText}>
            {isFlipped
              ? `Original: "${word.source}"`
              : 'Toca para descubrir la traducción'}
          </Text>
        </Pressable>

        {/* Speech Speed Controls */}
        <View style={styles.speedRow}>
          <Text style={styles.speedLabel}>Velocidad:</Text>
          {(['lenta', 'normal', 'rápida'] as SpeechSpeed[]).map((speed) => (
            <Pressable
              key={speed}
              style={[styles.speedButton, speechSpeed === speed && styles.speedButtonActive]}
              onPress={() => setSpeechSpeed(speed)}
            >
              <Text style={[styles.speedText, speechSpeed === speed && styles.speedTextActive]}>
                {speed === 'lenta' ? '🐢 Lenta' : speed === 'normal' ? '🦊 Normal' : '⚡ Natural'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Audio Action Buttons */}
        <View style={styles.audioActionRow}>
          <Pressable style={styles.audioBtn} onPress={listenToWord}>
            <Text style={styles.audioBtnText}>🔊 Escuchar</Text>
          </Pressable>
          <Pressable style={styles.practiceBtn} onPress={() => void practicePronunciation()}>
            <Text style={styles.practiceBtnText}>🗣️ Practicar</Text>
          </Pressable>
        </View>

        {audioFeedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{audioFeedback}</Text>
          </View>
        ) : null}

        {/* Navigation Step Buttons */}
        <View style={styles.navRow}>
          <Pressable
            disabled={isFirst}
            style={({ pressed }) => [
              styles.navBtn,
              isFirst && styles.navBtnDisabled,
              pressed && !isFirst && styles.pressed,
            ]}
            onPress={() => goToCard(safeIndex - 1)}
          >
            <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>Anterior</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.navBtn, styles.navBtnPrimary, pressed && styles.pressed]}
            onPress={() =>
              isLast ? router.push(`/quiz/${lesson.id}`) : goToCard(safeIndex + 1)
            }
          >
            <Text style={styles.navBtnPrimaryText}>
              {isLast ? 'Ir a la Práctica Quiz ➔' : 'Siguiente'}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver al Inicio</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingBottom: 40, gap: 14 },
    headerProgressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    progressText: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
    headerDots: { flexDirection: 'row', gap: 5 },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    dotActive: { backgroundColor: AppColors.primary, width: 18 },
    dotCompleted: { backgroundColor: AppColors.success },
    flashcard: {
      minHeight: 220,
      backgroundColor: colors.surfaceRaised,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.surfaceBorder,
      gap: 8,
    },
    cardPressed: { opacity: 0.9 },
    cardHeaderTag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 6,
      marginBottom: 6,
    },
    cardHeaderTagText: { color: colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    wordMain: { color: colors.text, fontSize: 32, fontWeight: '900', textAlign: 'center' },
    ipaText: { color: AppColors.accent, fontSize: 15, fontWeight: '700' },
    hintText: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 8, textAlign: 'center' },
    speedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    speedLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginRight: 2 },
    speedButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 99,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    speedButtonActive: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    speedText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
    speedTextActive: { color: '#FFFFFF', fontWeight: '900' },
    audioActionRow: { flexDirection: 'row', gap: 10 },
    audioBtn: {
      flex: 1,
      backgroundColor: AppColors.primary,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    audioBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    practiceBtn: {
      flex: 1,
      backgroundColor: colors.surfaceRaised,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    practiceBtnText: { color: colors.text, fontSize: 14, fontWeight: '800' },
    feedbackBox: {
      backgroundColor: colors.surfaceRaised,
      padding: 10,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    feedbackText: { color: colors.text, fontSize: 12, fontWeight: '600' },
    navRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
    navBtn: {
      flex: 1,
      backgroundColor: colors.surfaceRaised,
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    navBtnDisabled: { opacity: 0.4 },
    navBtnText: { color: colors.text, fontSize: 14, fontWeight: '800' },
    navBtnTextDisabled: { color: colors.textMuted },
    navBtnPrimary: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    navBtnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    backButton: { alignItems: 'center', paddingVertical: 12 },
    backText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
    pressed: { opacity: 0.8 },
  });
}
