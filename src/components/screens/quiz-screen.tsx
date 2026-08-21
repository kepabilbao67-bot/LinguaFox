import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useQuiz } from '@/hooks/use-quiz';
import { speakText } from '@/services/speech';
import type { Lesson } from '@/types/learning';

interface QuizScreenProps {
  lesson: Lesson | undefined;
}

export function QuizScreen({ lesson }: QuizScreenProps) {
  const quiz = useQuiz(lesson);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!quiz.isFinished || !lesson) return;
    router.replace({
      pathname: '/result/[lessonId]',
      params: {
        lessonId: lesson.id,
        score: String(quiz.score),
        total: String(quiz.questions.length),
      },
    });
  }, [lesson, quiz.isFinished, quiz.questions.length, quiz.score]);

  if (!lesson) {
    return (
      <ScreenContainer title="Quiz">
        <EmptyState title="Quiz no encontrado" message="La lección solicitada no existe." />
      </ScreenContainer>
    );
  }

  if (quiz.questions.length === 0 || !quiz.currentQuestion) {
    return (
      <ScreenContainer title={`Quiz · ${lesson.title}`}>
        <EmptyState
          title="Quiz no disponible"
          message="Esta lección no contiene preguntas válidas."
        />
      </ScreenContainer>
    );
  }

  const question = quiz.currentQuestion;

  return (
    <ScreenContainer title={`Quiz · ${lesson.title}`}>
      <View style={styles.headerRow}>
        <Text style={styles.meta}>
          Pregunta {quiz.questionIndex + 1}/{quiz.questions.length}
        </Text>
        <Text style={styles.meta}>Aciertos: {quiz.score}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.prompt}>¿Qué significa?</Text>
        <Text style={styles.word}>{question.source}</Text>
        <Pressable
          style={styles.listenButton}
          onPress={() => setAudioFeedback(speakText(question.source, { language: lesson.language === 'fr' ? 'fr-FR' : 'en-US' }) ? 'Escuchando palabra.' : 'Audio no disponible ahora.') }>
          <Text style={styles.listenText}>🔊 Escuchar</Text>
        </Pressable>
      </View>
      {audioFeedback ? <Text style={styles.audioFeedback}>{audioFeedback}</Text> : null}
      {question.options.map((option) => {
        const isAnswered = quiz.selectedAnswer !== null;
        const isCorrect = option === question.translation;
        const isSelected = option === quiz.selectedAnswer;
        const backgroundColor = isAnswered
          ? isCorrect
            ? AppColors.success
            : isSelected
              ? AppColors.danger
              : AppColors.surfaceRaised
          : AppColors.surfaceRaised;

        return (
          <Pressable
            key={option}
            disabled={isAnswered}
            style={({ pressed }) => [
              styles.option,
              { backgroundColor },
              pressed && !isAnswered && styles.pressed,
            ]}
            onPress={() => quiz.answer(option)}>
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        );
      })}
      {quiz.selectedAnswer ? (
        <Pressable style={styles.nextButton} onPress={quiz.next}>
          <Text style={styles.nextText}>
            {quiz.questionIndex + 1 === quiz.questions.length ? 'Ver resultado' : 'Siguiente'}
          </Text>
        </Pressable>
      ) : null}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Abandonar quiz</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  meta: { color: AppColors.textMuted, fontWeight: '600' },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  prompt: { color: AppColors.textMuted, fontSize: 15 },
  word: { color: AppColors.text, fontSize: 32, fontWeight: '800', marginTop: 8 },
  listenButton: { backgroundColor: AppColors.primary, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14, marginTop: 16 },
  listenText: { color: AppColors.text, fontWeight: '800' },
  audioFeedback: { color: AppColors.textMuted, textAlign: 'center', fontSize: 13, marginTop: -8, marginBottom: 12 },
  option: { borderRadius: 12, padding: 15, marginBottom: 9 },
  optionText: { color: AppColors.text, fontSize: 16, fontWeight: '700' },
  nextButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  nextText: { color: AppColors.text, fontWeight: '800' },
  pressed: { opacity: 0.78 },
  backButton: { alignItems: 'center', paddingVertical: 16 },
  backText: { color: AppColors.textMuted, fontWeight: '600' },
});
