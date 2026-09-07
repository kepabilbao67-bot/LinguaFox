import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { webScrollStyle } from '@/constants/web-styles';
import { useProgress } from '@/hooks/use-progress';
import { getErrorsForLanguage } from '@/data/error-bank';
import { speakText } from '@/services/speech';
import type { TrackedError } from '@/types/learning';

type ErrorCategoryFilter = 'all' | 'grammar' | 'vocabulary' | 'preposition' | 'verb-tense';

export function MyErrorsScreen() {
  const { progress, masterTrackedError, dismissTrackedError } = useProgress();
  const [filter, setFilter] = useState<ErrorCategoryFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<Record<string, { status: 'correct' | 'incorrect'; msg: string }>>({});

  const errors = getErrorsForLanguage(progress.trackedErrors, progress.idiomaObjetivo);

  const filteredErrors = filter === 'all'
    ? errors
    : errors.filter((e) => e.category === filter);

  const categoryLabels: Record<ErrorCategoryFilter, string> = {
    all: 'Todos',
    grammar: 'Gramática',
    vocabulary: 'Vocabulario',
    preposition: 'Preposiciones',
    'verb-tense': 'Tiempos Verbales',
  };

  const handleSelectOption = (error: TrackedError, selectedText: string) => {
    if (selectedText === error.correctedText) {
      const awarded = masterTrackedError(error.id);
      setReviewFeedback((prev) => ({
        ...prev,
        [error.id]: {
          status: 'correct',
          msg: awarded
            ? '🎉 ¡Correcto! Has demostrado dominar este error (+10 XP otorgados).'
            : '✅ ¡Correcto! Este error ya figuraba como dominado.',
        },
      }));
    } else {
      setReviewFeedback((prev) => ({
        ...prev,
        [error.id]: {
          status: 'incorrect',
          msg: '❌ Incorrecto. Esa es la forma con error. Revisa la regla pedagógica antes de reintentar.',
        },
      }));
    }
  };

  return (
    <ScreenContainer title="Mis Errores" scrollable={false}>
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >
        {/* Header Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>💡</Text>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Aprende de tus errores</Text>
            <Text style={styles.heroSubtitle}>
              Revisa tus fallos registrados en conversaciones y supera la prueba de corrección para dominarlos (+10 XP).
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
          {(['all', 'grammar', 'verb-tense', 'preposition', 'vocabulary'] as ErrorCategoryFilter[]).map((cat) => (
            <Pressable
              key={cat}
              style={[styles.filterPill, filter === cat && styles.filterPillActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
                {categoryLabels[cat]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Errors List */}
        {filteredErrors.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>¡Sin errores pendientes!</Text>
            <Text style={styles.emptyText}>
              No tienes errores registrados en esta categoría. ¡Sigue conversando con Fox para ponerte a prueba!
            </Text>
            <Pressable style={styles.chatButton} onPress={() => router.push('/chat')}>
              <Text style={styles.chatButtonText}>🦊 Conversar ahora</Text>
            </Pressable>
          </View>
        ) : (
          filteredErrors.map((error: TrackedError) => {
            const isExpanded = expandedId === error.id;
            const isReviewing = reviewingId === error.id;
            const feedback = reviewFeedback[error.id];
            const isMastered = !!error.mastered;

            // Generate options deterministically
            const options = error.id.length % 2 === 0
              ? [error.correctedText, error.userText]
              : [error.userText, error.correctedText];

            return (
              <View key={error.id} style={[styles.errorCard, isMastered && styles.errorCardMastered]}>
                <View style={styles.errorHeader}>
                  <View style={styles.badgeRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{categoryLabels[error.category as ErrorCategoryFilter] ?? 'Gramática'}</Text>
                    </View>
                    {isMastered && (
                      <View style={styles.masteredBadge}>
                        <Text style={styles.masteredBadgeText}>✓ DOMINADO</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.audioButtonGroup}>
                    <Pressable
                      style={styles.audioButtonSmall}
                      onPress={() => speakText(error.correctedText, { language: error.language, rate: 0.6 })}
                    >
                      <Text style={styles.audioIcon}>🐢</Text>
                    </Pressable>
                    <Pressable
                      style={styles.audioButton}
                      onPress={() => speakText(error.correctedText, { language: error.language, rate: 0.85 })}
                    >
                      <Text style={styles.audioIcon}>🔊</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.phraseRow}>
                  <Text style={styles.wrongLabel}>❌ Dijiste:</Text>
                  <Text style={styles.wrongText}>{`"${error.userText}"`}</Text>
                </View>

                <View style={styles.phraseRow}>
                  <Text style={styles.correctLabel}>✅ Correcto:</Text>
                  <Text style={styles.correctText}>{`"${error.correctedText}"`}</Text>
                </View>

                <Pressable
                  style={styles.whyToggle}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => setExpandedId(isExpanded ? null : error.id)}
                >
                  <Text style={styles.whyToggleText}>
                    {isExpanded ? '▲ Ocultar desglose pedagógico' : '▼ ¿Por qué? Ver regla y desglose pedagógico'}
                  </Text>
                </Pressable>

                {isExpanded && (
                  <View style={styles.explanationBox}>
                    {error.rule ? (
                      <View style={styles.pedagogicalRuleBox}>
                        <Text style={styles.pedagogicalRuleLabel}>📏 REGLA CLAVE</Text>
                        <Text style={styles.pedagogicalRuleText}>{error.rule}</Text>
                      </View>
                    ) : null}

                    <View style={styles.pedagogicalSection}>
                      <Text style={styles.pedagogicalHeading}>❓ ¿Por qué sucede?</Text>
                      <Text style={styles.explanationText}>
                        {error.why || error.explanation}
                      </Text>
                    </View>

                    {error.how ? (
                      <View style={styles.pedagogicalSection}>
                        <Text style={styles.pedagogicalHeading}>🛠️ Cómo usarlo bien</Text>
                        <Text style={styles.explanationText}>{error.how}</Text>
                      </View>
                    ) : null}

                    {error.when ? (
                      <View style={styles.pedagogicalSection}>
                        <Text style={styles.pedagogicalHeading}>🕒 Cuándo usar</Text>
                        <Text style={styles.explanationText}>{error.when}</Text>
                      </View>
                    ) : null}

                    {error.whenNot ? (
                      <View style={styles.pedagogicalSection}>
                        <Text style={styles.pedagogicalHeading}>🚫 Cuándo NO usar</Text>
                        <Text style={styles.explanationText}>{error.whenNot}</Text>
                      </View>
                    ) : null}

                    {error.example ? (
                      <View style={styles.pedagogicalExampleBox}>
                        <Text style={styles.pedagogicalExampleLabel}>💡 Ejemplo en contexto:</Text>
                        <Text style={styles.pedagogicalExampleText}>{`"${error.example}"`}</Text>
                      </View>
                    ) : null}

                    {error.checkExercise ? (
                      <View style={styles.pedagogicalCheckExerciseBox}>
                        <Text style={styles.pedagogicalCheckExerciseLabel}>✏️ Ejercicio de comprobación:</Text>
                        <Text style={styles.pedagogicalCheckExerciseText}>{error.checkExercise}</Text>
                      </View>
                    ) : null}
                  </View>
                )}

                {/* Interactive Validation Flow */}
                {isReviewing && !isMastered && (
                  <View style={styles.reviewQuizBox}>
                    <Text style={styles.reviewQuizTitle}>🎯 Prueba de Validación: ¿Cuál es la forma correcta?</Text>
                    <View style={styles.reviewOptionsWrap}>
                      {options.map((opt, i) => (
                        <Pressable
                          key={i}
                          style={({ pressed }) => [styles.reviewOptionBtn, pressed && styles.pressed]}
                          onPress={() => handleSelectOption(error, opt)}
                        >
                          <Text style={styles.reviewOptionText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>

                    {feedback && (
                      <View style={[
                        styles.feedbackBox,
                        feedback.status === 'correct' ? styles.feedbackBoxCorrect : styles.feedbackBoxIncorrect
                      ]}>
                        <Text style={styles.feedbackText}>{feedback.msg}</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.cardActionRow}>
                  {!isMastered ? (
                    <Pressable
                      style={styles.reviewBtn}
                      onPress={() => setReviewingId(isReviewing ? null : error.id)}
                    >
                      <Text style={styles.reviewBtnText}>
                        {isReviewing ? 'Cerrar Prueba' : '🎯 Repasar y Validar (+10 XP)'}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.deleteBtn}
                      onPress={() => dismissTrackedError(error.id)}
                    >
                      <Text style={styles.deleteBtnText}>Eliminar de la lista</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })
        )}

        {/* Action Button */}
        <Pressable style={styles.practiceButton} onPress={() => router.push('/chat')}>
          <Text style={styles.practiceButtonText}>💬 Practicar en una conversación</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mainScrollView: {
    flex: 1,
    ...webScrollStyle,
  },
  container: { flexGrow: 1, paddingBottom: 40, gap: 14 },
  heroCard: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  heroIcon: { fontSize: 36 },
  heroContent: { flex: 1 },
  heroTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  heroSubtitle: { color: AppColors.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  filterScroll: { marginHorizontal: -4 },
  filterContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  filterPill: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  filterPillActive: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  filterText: { color: AppColors.textMuted, fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: AppColors.text, fontWeight: '800' },
  errorCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  errorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: {
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: { color: AppColors.primaryBright, fontSize: 12, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  masteredBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  masteredBadgeText: { color: AppColors.success, fontSize: 11, fontWeight: '900' },
  errorCardMastered: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
    backgroundColor: 'rgba(34, 197, 94, 0.04)',
  },
  audioButtonGroup: { flexDirection: 'row', gap: 8 },
  audioButtonSmall: {
    backgroundColor: AppColors.surfaceRaised,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioButton: {
    backgroundColor: AppColors.surfaceRaised,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: { fontSize: 18 },
  phraseRow: { gap: 2 },
  wrongLabel: { color: AppColors.danger, fontSize: 12, fontWeight: '800' },
  wrongText: { color: AppColors.textMuted, fontSize: 15, textDecorationLine: 'line-through' },
  correctLabel: { color: AppColors.success, fontSize: 12, fontWeight: '800', marginTop: 4 },
  correctText: { color: AppColors.text, fontSize: 16, fontWeight: '700' },
  whyToggle: {
    marginTop: 4,
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  whyToggleText: { color: AppColors.blueLight, fontSize: 13, fontWeight: '700' },
  explanationBox: {
    backgroundColor: AppColors.surfaceRaised,
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  pedagogicalRuleBox: {
    backgroundColor: 'rgba(255, 122, 0, 0.1)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: AppColors.primary,
  },
  pedagogicalRuleLabel: {
    color: AppColors.primaryBright,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  pedagogicalRuleText: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  pedagogicalSection: {
    gap: 3,
  },
  pedagogicalHeading: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  explanationText: { color: AppColors.text, fontSize: 13, lineHeight: 19 },
  pedagogicalExampleBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: AppColors.blueLight,
  },
  pedagogicalExampleLabel: {
    color: AppColors.blueLight,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  pedagogicalExampleText: {
    color: AppColors.text,
    fontSize: 13,
    fontStyle: 'italic',
  },
  pedagogicalCheckExerciseBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: AppColors.success,
  },
  pedagogicalCheckExerciseLabel: {
    color: AppColors.success,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  pedagogicalCheckExerciseText: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  reviewQuizBox: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 0, 0.3)',
  },
  reviewQuizTitle: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  reviewOptionsWrap: {
    gap: 8,
  },
  reviewOptionBtn: {
    backgroundColor: AppColors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  reviewOptionText: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  feedbackBoxCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  feedbackBoxIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  feedbackText: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  cardActionRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewBtn: {
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    borderWidth: 1,
    borderColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
  },
  reviewBtnText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  deleteBtn: {
    backgroundColor: AppColors.surfaceRaised,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
  },
  deleteBtnText: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  emptyText: { color: AppColors.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  chatButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  chatButtonText: { color: AppColors.text, fontWeight: '800', fontSize: 14 },
  practiceButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  practiceButtonText: { color: AppColors.text, fontWeight: '900', fontSize: 16 },
  pressed: { opacity: 0.8 },
});
