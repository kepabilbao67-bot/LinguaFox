import { router } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
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
    setLessonProgress(getProgressKey(lesson.language, lesson.id), boundedIndex);
  };

  const isFirst = safeIndex === 0;
  const isLast = safeIndex === lesson.words.length - 1;
  const listenToWord = (): void => {
    const rate = speechSpeed === 'lenta' ? 0.5 : speechSpeed === 'rápida' ? 1.2 : 0.85;
    setAudioFeedback(
      speakText(word.source, { language: lesson.language === 'fr' ? 'fr-FR' : 'en-US', rate }) 
        ? `Escuchando a velocidad ${speechSpeed}.` 
        : 'Audio no disponible ahora.',
    );
  };
  const practicePronunciation = async (): Promise<void> => {
    if (!isSpeechRecognitionAvailable()) {
      setAudioFeedback('Reconocimiento de voz no disponible aún en esta plataforma.');
      return;
    }
    const result = await startRecognition();
    setAudioFeedback(result.message);
  };

  return (
    <ScreenContainer title={lesson.title} isLoading={!isHydrated}>
      <Text style={styles.progress}>
        Tarjeta {safeIndex + 1} de {lesson.words.length}
      </Text>
      <Pressable style={styles.flashcard} onPress={() => setIsFlipped((current) => !current)}>
        <Text style={styles.word}>{isFlipped ? word.translation : word.source}</Text>
        <Text style={styles.hint}>
          {isFlipped ? `inglés: ${word.source}` : 'Toca para ver la traducción'}
        </Text>
      </Pressable>

      <View style={styles.speedRow}>
        {(['lenta', 'normal', 'rápida'] as SpeechSpeed[]).map((speed) => (
          <Pressable 
            key={speed} 
            style={[styles.speedButton, speechSpeed === speed && styles.speedButtonActive]}
            onPress={() => setSpeechSpeed(speed)}
          >
            <Text style={[styles.speedText, speechSpeed === speed && styles.speedTextActive]}>
              {speed === 'lenta' ? '🐢 Lenta' : speed === 'normal' ? '🦊 Normal' : '⚡ Rápida'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.audioRow}>
        <Pressable style={styles.audioButton} onPress={listenToWord}>
          <Text style={styles.audioButtonText}>🔊 Escuchar</Text>
        </Pressable>
        <Pressable style={[styles.audioButton, styles.practiceButton]} onPress={() => void practicePronunciation()}>
          <Text style={styles.audioButtonText}>🎤 Pronunciar</Text>
        </Pressable>
      </View>
      {audioFeedback ? <Text style={styles.audioFeedback}>{audioFeedback}</Text> : null}

      <View style={styles.row}>
        <Pressable
          disabled={isFirst}
          style={({ pressed }) => [
            styles.button,
            isFirst && styles.disabled,
            pressed && !isFirst && styles.pressed,
          ]}
          onPress={() => goToCard(safeIndex - 1)}>
          <Text style={styles.buttonText}>Anterior</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() =>
            isLast ? router.push(`/quiz/${lesson.id}`) : goToCard(safeIndex + 1)
          }>
          <Text style={styles.buttonText}>{isLast ? 'Ir al quiz' : 'Siguiente'}</Text>
        </Pressable>
      </View>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) { return StyleSheet.create({
  progress: { color: colors.textMuted, textAlign: 'center', marginBottom: 14 },
  flashcard: {
    minHeight: 240,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  word: { color: colors.text, fontSize: 34, fontWeight: '800', textAlign: 'center' },
  hint: { color: colors.textMuted, marginTop: 12, textAlign: 'center' },
  speedRow: { flexDirection: 'row', gap: 6, marginBottom: 12, justifyContent: 'center' },
  speedButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 99, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.surfaceRaised },
  speedButtonActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  speedText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  speedTextActive: { color: colors.primaryBright, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 10 },
  audioRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  audioButton: { flex: 1, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  practiceButton: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.primary },
  audioButtonText: { color: colors.text, fontWeight: '800' },
  audioFeedback: { color: colors.textMuted, textAlign: 'center', marginBottom: 12, fontSize: 13 },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  disabled: { backgroundColor: colors.disabled, opacity: 0.65 },
  pressed: { opacity: 0.78 },
  buttonText: { color: colors.text, fontWeight: '800' },
  backButton: { alignItems: 'center', paddingVertical: 16 },
  backText: { color: colors.textMuted, fontWeight: '600' },
}); }
