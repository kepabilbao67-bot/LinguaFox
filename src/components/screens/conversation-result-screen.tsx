import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';

export function ConversationResultScreen() {
  const { addExperience } = useProgress();
  const params = useLocalSearchParams<{
    messagesCount?: string;
    errorsCount?: string;
    xpEarned?: string;
    characterName?: string;
  }>();

  const messagesCount = Number(params.messagesCount ?? 5);
  const errorsCount = Number(params.errorsCount ?? 0);
  const xpEarned = Number(params.xpEarned ?? 45);
  const characterName = params.characterName ?? 'Fox';

  useEffect(() => {
    addExperience(xpEarned);
  }, [addExperience, xpEarned]);

  const accuracy = Math.max(0, Math.min(100, Math.round(((messagesCount - errorsCount) / Math.max(1, messagesCount)) * 100)));
  const fluencyScore = accuracy >= 80 ? 'Excelente' : accuracy >= 60 ? 'Buena' : 'En progreso';

  return (
    <ScreenContainer title="Resumen de Conversación" scrollable={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.celebrationCard}>
          <Text style={styles.celebrationMascot}>🦊🎉</Text>
          <Text style={styles.celebrationTitle}>¡Gran conversación!</Text>
          <Text style={styles.celebrationSubtitle}>
            Has practicado con {characterName} y has ganado +{xpEarned} XP
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{messagesCount}</Text>
            <Text style={styles.statLabel}>Frases conversadas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: AppColors.success }]}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Precisión</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: AppColors.accentBright }]}>{fluencyScore}</Text>
            <Text style={styles.statLabel}>Fluidez</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: AppColors.primaryBright }]}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP Ganado</Text>
          </View>
        </View>

        {/* Pedagogical Feedback */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>💡 Feedback Pedagógico</Text>
          <Text style={styles.feedbackText}>
            {errorsCount === 0
              ? '¡Impresionante! Te has comunicado con claridad y sin errores notables. Sigue aumentando la complejidad de tus oraciones.'
              : `Has tenido ${errorsCount} ${errorsCount === 1 ? 'detalle corregido' : 'detalles corregidos'} durante la charla. Los hemos guardado en "Mis Errores" para que puedas repasarlos cuando quieras.`}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsCol}>
          <Pressable style={styles.primaryBtn} onPress={() => router.replace('/chat')}>
            <Text style={styles.primaryBtnText}>🔁 Repetir conversación</Text>
          </Pressable>

          <Pressable style={styles.secondaryActionBtn} onPress={() => router.push('/errors')}>
            <Text style={styles.secondaryActionText}>💡 Practicar mis errores ({errorsCount})</Text>
          </Pressable>

          <Pressable style={styles.tertiaryActionBtn} onPress={() => router.push('/scenarios')}>
            <Text style={styles.tertiaryActionText}>🎭 Siguiente escenario</Text>
          </Pressable>

          <Pressable style={styles.homeBtn} onPress={() => router.replace('/')}>
            <Text style={styles.homeBtnText}>🏠 Volver al inicio</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, gap: 16 },
  celebrationCard: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  celebrationMascot: { fontSize: 56 },
  celebrationTitle: { color: AppColors.text, fontSize: 24, fontWeight: '900' },
  celebrationSubtitle: { color: AppColors.textMuted, fontSize: 14, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: {
    backgroundColor: AppColors.surface,
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    gap: 4,
  },
  statNumber: { color: AppColors.text, fontSize: 28, fontWeight: '900' },
  statLabel: { color: AppColors.textMuted, fontSize: 12, fontWeight: '700' },
  feedbackCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  feedbackTitle: { color: AppColors.text, fontSize: 16, fontWeight: '800' },
  feedbackText: { color: AppColors.textMuted, fontSize: 14, lineHeight: 21 },
  actionButtonsCol: { gap: 10, marginTop: 4 },
  primaryBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: { color: AppColors.text, fontWeight: '900', fontSize: 16 },
  secondaryActionBtn: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  secondaryActionText: { color: AppColors.primaryBright, fontWeight: '800', fontSize: 14 },
  tertiaryActionBtn: {
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  tertiaryActionText: { color: AppColors.text, fontWeight: '800', fontSize: 14 },
  homeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  homeBtnText: { color: AppColors.textMuted, fontWeight: '700', fontSize: 14 },
});
