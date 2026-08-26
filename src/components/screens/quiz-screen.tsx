import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { ErrorExplanationCard } from '@/components/ErrorExplanationCard';
import { AppColors } from '@/constants/app-theme';
import { useQuiz } from '@/hooks/use-quiz';
import { speakText, stopSpeaking } from '@/services/speech';
import type { Lesson } from '@/types/learning';
import type { PedagogicalCorrection } from '@/types/pedagogical-correction';

interface QuizScreenProps {
  lesson: Lesson | undefined;
}

type SpeechSpeed = 'lenta' | 'normal' | 'rápida';

export function QuizScreen({ lesson }: QuizScreenProps) {
  const quiz = useQuiz(lesson);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>('normal');

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

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
  const isAnswered = quiz.selectedAnswer !== null;
  const isCorrect = isAnswered && quiz.selectedAnswer === question.translation;

  // Generate correction if answered wrongly
  const correction: PedagogicalCorrection | null = isAnswered && !isCorrect ? {
    errorDetectado: quiz.selectedAnswer!,
    tipoError: 'vocabulario',
    correccion: question.translation,
    explicacionPorQue: `Has seleccionado "${quiz.selectedAnswer}", pero la palabra para "${question.source}" es "${question.translation}".`,
    explicacionComo: `Asocia "${question.source}" directamente con "${question.translation}".`,
    explicacionCuando: `Utiliza esta palabra cuando te refieras a "${question.translation}" en conversaciones.`,
    ejemplos: [
      `La palabra correcta es: ${question.translation}`,
    ],
    ejercicioComprobacion: `Intenta recordar que ${question.source} = ${question.translation}.`,
    idiomaExplicacion: 'es',
    gravedad: 'menor',
    confianza: 'high',
    debeInterrumpir: true,
    textoParaVoz: `Recuerda, ${question.source} significa ${question.translation}.`,
  } : null;

  const listenToWord = () => {
    const rate = speechSpeed === 'lenta' ? 0.5 : speechSpeed === 'rápida' ? 1.2 : 0.85;
    setAudioFeedback(speakText(question.source, { language: lesson.language === 'fr' ? 'fr-FR' : 'en-US', rate }) ? `Escuchando a velocidad ${speechSpeed}.` : 'Audio no disponible ahora.');
  };

  return (
    <ScreenContainer title={`Quiz · ${lesson.title}`}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.meta}>
            Pregunta {quiz.questionIndex + 1}/{quiz.questions.length}
          </Text>
          <Text style={styles.meta}>Aciertos: {quiz.score}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.prompt}>¿Qué significa?</Text>
          <Text style={styles.word}>{question.source}</Text>
          
          <View style={styles.speedRow}>
            {(['lenta', 'normal', 'rápida'] as SpeechSpeed[]).map((speed) => (
              <Pressable 
                key={speed} 
                style={[styles.speedButton, speechSpeed === speed && styles.speedButtonActive]}
                onPress={() => setSpeechSpeed(speed)}
              >
                <Text style={[styles.speedText, speechSpeed === speed && styles.speedTextActive]}>
                  {speed === 'lenta' ? '🐢' : speed === 'normal' ? '🦊' : '⚡'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.listenButton}
            onPress={listenToWord}>
            <Text style={styles.listenText}>🔊 Escuchar</Text>
          </Pressable>
        </View>
        {audioFeedback ? <Text style={styles.audioFeedback}>{audioFeedback}</Text> : null}

        {question.options.map((option) => {
          const isOptionCorrect = option === question.translation;
          const isSelected = option === quiz.selectedAnswer;
          const backgroundColor = isAnswered
            ? isOptionCorrect
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

        {correction && (
          <ErrorExplanationCard 
            correction={correction} 
            onPlayAudio={() => speakText(correction.textoParaVoz, { language: 'es-ES' })}
          />
        )}

        {isAnswered ? (
          <Pressable style={styles.nextButton} onPress={quiz.next}>
            <Text style={styles.nextText}>
              {quiz.questionIndex + 1 === quiz.questions.length ? 'Ver resultado' : 'Siguiente'}
            </Text>
          </Pressable>
        ) : null}
        
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Abandonar quiz</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },
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
  speedRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 4 },
  speedButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: AppColors.surfaceRaised, borderWidth: 1, borderColor: AppColors.surfaceRaised },
  speedButtonActive: { borderColor: AppColors.primary, backgroundColor: AppColors.background },
  speedText: { color: AppColors.textMuted, fontSize: 16 },
  speedTextActive: { color: AppColors.text, fontWeight: '800' },
  listenButton: { backgroundColor: AppColors.primary, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14, marginTop: 12 },
  listenText: { color: AppColors.text, fontWeight: '800' },
  audioFeedback: { color: AppColors.textMuted, textAlign: 'center', fontSize: 13, marginTop: -8, marginBottom: 12 },
  option: { borderRadius: 12, padding: 15, marginBottom: 9 },
  optionText: { color: AppColors.text, fontSize: 16, fontWeight: '700' },
  nextButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  nextText: { color: AppColors.text, fontWeight: '800' },
  pressed: { opacity: 0.78 },
  backButton: { alignItems: 'center', paddingVertical: 16, marginTop: 8 },
  backText: { color: AppColors.textMuted, fontWeight: '600' },
});
