import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { ErrorExplanationCard } from '@/components/ErrorExplanationCard';
import { AppColors } from '@/constants/app-theme';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { useQuiz } from '@/hooks/use-quiz';
import { useProgress } from '@/hooks/use-progress';
import { speakText, stopSpeaking } from '@/services/speech';
import type { Lesson } from '@/types/learning';
import type { PedagogicalCorrection } from '@/types/pedagogical-correction';

interface QuizScreenProps {
  lesson: Lesson | undefined;
}

type SpeechSpeed = 'lenta' | 'normal' | 'rápida';

const POSITIVE_FEEDBACKS = [
  '¡Excelente trabajo! 🎉',
  '¡Muy bien hecho! 👏',
  '¡Exacto! Sigue así 🦊',
  '¡Perfecto! +1 acierto ✨',
];

export function QuizScreen({ lesson }: QuizScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { recordCompetencyResult } = useProgress();
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

  // Generate positive feedback or pedagogical correction
  const positiveMessage = isCorrect
    ? POSITIVE_FEEDBACKS[(quiz.questionIndex) % POSITIVE_FEEDBACKS.length]
    : null;

  const correction: PedagogicalCorrection | null = isAnswered && !isCorrect ? {
    errorDetectado: quiz.selectedAnswer!,
    tipoError: 'vocabulario',
    correccion: question.translation,
    explicacionPorQue: `Has seleccionado "${quiz.selectedAnswer}", pero la respuesta correcta para "${question.source}" es "${question.translation}".`,
    explicacionComo: `Asocia el enunciado "${question.source}" con "${question.translation}".`,
    explicacionCuando: `Utiliza esta estructura en tus respuestas.`,
    ejemplos: [
      `Respuesta correcta: ${question.translation}`,
    ],
    ejercicioComprobacion: `Intenta recordar que la opción adecuada es "${question.translation}".`,
    idiomaExplicacion: 'es',
    gravedad: 'menor',
    confianza: 'high',
    debeInterrumpir: true,
    textoParaVoz: `La respuesta adecuada es: ${question.translation}.`,
  } : null;

  const listenToAudio = () => {
    const textToSpeak = question.audioText ?? question.source;
    const rate = speechSpeed === 'lenta' ? 0.5 : speechSpeed === 'rápida' ? 1.2 : 0.85;
    const ok = speakText(textToSpeak, { language: lesson.language, rate });
    setAudioFeedback(ok ? `🔊 Escuchando a velocidad ${speechSpeed}` : 'Audio no disponible');
  };

  const handleAnswer = (option: string) => {
    if (isAnswered || !question) return;
    quiz.answer(option);
    const compType: 'listening' | 'writing' | 'grammar' | 'reading' =
      question.type === 'listen'
        ? 'listening'
        : question.type === 'translate'
          ? 'writing'
          : question.type === 'fillBlank'
            ? 'grammar'
            : 'reading';

    recordCompetencyResult(
      lesson.language,
      lesson.level ?? 'A1',
      compType,
      option === question.translation
    );
  };

  return (
    <ScreenContainer title={`Quiz · ${lesson.title}`} scrollable={false}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress header */}
        <View style={styles.headerRow}>
          <Text style={styles.meta}>
            Pregunta {quiz.questionIndex + 1} de {quiz.questions.length}
          </Text>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillText}>⭐ {quiz.score} Aciertos</Text>
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.card}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {question.type === 'listen' ? '🎧 ESCUCHA' : question.type === 'fillBlank' ? '✏️ COMPLETAR' : '❓ PREGUNTA'}
            </Text>
          </View>

          <Text style={styles.prompt}>{question.prompt}</Text>
          <Text style={styles.word}>{question.source}</Text>

          {question.explanation && (
            <Text style={styles.explanationSub}>{question.explanation}</Text>
          )}

          {/* Speed selector & audio button */}
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

          <Pressable style={styles.listenButton} onPress={listenToAudio}>
            <Text style={styles.listenText}>🔊 Escuchar Audio</Text>
          </Pressable>
        </View>

        {audioFeedback ? <Text style={styles.audioFeedback}>{audioFeedback}</Text> : null}

        {/* Options List */}
        <View style={styles.optionsWrap}>
          {question.options.map((option) => {
            const isOptionCorrect = option === question.translation;
            const isSelected = option === quiz.selectedAnswer;
            const backgroundColor = isAnswered
              ? isOptionCorrect
                ? AppColors.success
                : isSelected
                  ? AppColors.danger
                  : colors.surfaceRaised
              : colors.surfaceRaised;

            return (
              <Pressable
                key={option}
                disabled={isAnswered}
                style={({ pressed }) => [
                  styles.option,
                  { backgroundColor },
                  pressed && !isAnswered && styles.pressed,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Positive feedback banner */}
        {isCorrect && positiveMessage && (
          <View style={styles.positiveBanner}>
            <Text style={styles.positiveText}>{positiveMessage}</Text>
          </View>
        )}

        {/* Error explanation card */}
        {correction && (
          <ErrorExplanationCard
            correction={correction}
            onPlayAudio={() => speakText(correction.textoParaVoz, { language: 'es-ES' })}
          />
        )}

        {/* Next / Finish Button */}
        {isAnswered ? (
          <Pressable style={styles.nextButton} onPress={quiz.next}>
            <Text style={styles.nextText}>
              {quiz.questionIndex + 1 === quiz.questions.length ? 'Ver Resultado Final ➔' : 'Continuar ➔'}
            </Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Salir del Quiz</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: { paddingBottom: 40, gap: 12 },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    meta: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
    scorePill: {
      backgroundColor: colors.surfaceRaised,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    scorePillText: { color: AppColors.accent, fontSize: 12, fontWeight: '900' },
    card: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 22,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    typeBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 6,
    },
    typeBadgeText: { color: colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    prompt: { color: colors.textMuted, fontSize: 14, fontWeight: '600', textAlign: 'center' },
    word: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
    explanationSub: { color: AppColors.primaryBright, fontSize: 12, fontWeight: '700', textAlign: 'center' },
    speedRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
    speedButton: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 99,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    speedButtonActive: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    speedText: { fontSize: 12 },
    speedTextActive: { color: '#FFFFFF' },
    listenButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    listenText: { color: colors.text, fontSize: 13, fontWeight: '800' },
    audioFeedback: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
    optionsWrap: { gap: 10 },
    option: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    optionText: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
    positiveBanner: {
      backgroundColor: '#065F46',
      padding: 14,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#10B981',
    },
    positiveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    nextButton: {
      backgroundColor: AppColors.primary,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 6,
    },
    nextText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
    backButton: { alignItems: 'center', paddingVertical: 10 },
    backText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
    pressed: { opacity: 0.8 },
  });
}
