import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { getLessonsByLanguage, getProgressKey } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';
import { levelFromXp, xpIntoLevel } from '@/utils/rewards';
import { ACHIEVEMENTS } from '@/data/achievements';
import { getCityForLanguage } from '@/data/cities';
import type { CEFRLevel } from '@/types/learning';

const ALL_CEFR_LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LANGUAGE_NAMES: Record<string, string> = {
  en: '🇬🇧 Inglés',
  es: '🇪🇸 Español',
  fr: '🇫🇷 Francés',
  it: '🇮🇹 Italiano',
  de: '🇩🇪 Alemán',
  pt: '🇵🇹 Portugués',
  eu: '🟢 Euskera',
  ca: '🟡 Catalán',
};

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated, latestAchievementId } = useProgress();
  const [toast, setToast] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');

  useEffect(() => {
    if (!latestAchievementId) return;
    const title = ACHIEVEMENTS.find((a) => a.id === latestAchievementId)?.titulo;
    const timer = setTimeout(() => {
      setToast(title ?? null);
      setTimeout(() => setToast(null), 3500);
    }, 0);
    return () => clearTimeout(timer);
  }, [latestAchievementId]);

  const lessons = getLessonsByLanguage(progress.idiomaObjetivo);
  const filteredLessons = lessons.filter((l) => (l.level ?? 'A1') === selectedLevel);
  const city = getCityForLanguage(progress.idiomaObjetivo);
  const userLevel = levelFromXp(progress.experiencia);
  const currentXp = xpIntoLevel(progress.experiencia);

  // Calculate Next Recommended Lesson
  const nextLesson = useMemo(() => {
    const uncompleted = lessons.find((l) => {
      const key = getProgressKey(l.language, l.id);
      return !progress.leccionesCompletadas.includes(key);
    });
    return uncompleted ?? lessons[0];
  }, [lessons, progress.leccionesCompletadas]);

  // Level Completion Progress
  const levelCompletedCount = useMemo(() => {
    return filteredLessons.filter((l) => {
      const key = getProgressKey(l.language, l.id);
      return progress.leccionesCompletadas.includes(key);
    }).length;
  }, [filteredLessons, progress.leccionesCompletadas]);

  const levelProgressPercent = filteredLessons.length > 0
    ? Math.round((levelCompletedCount / filteredLessons.length) * 100)
    : 0;

  // Pending Errors / SRS Count
  const pendingErrorsCount = progress.trackedErrors?.filter((e) => !e.reviewed).length ?? 0;
  const srsDueCardsCount = Object.keys(progress.srs ?? {}).length;

  return (
    <ScreenContainer title="LinguaFox" isLoading={!isHydrated}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar: Language, Stats, Profile */}
        <View style={styles.topStatusRow}>
          <Pressable style={styles.languageButton} onPress={() => router.push('/language')}>
            <Text style={styles.languageText}>
              {LANGUAGE_NAMES[progress.idiomaObjetivo] ?? '🇬🇧 Inglés'} ▾
            </Text>
          </Pressable>

          <View style={styles.statsBadges}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {progress.rachaActual}</Text>
            </View>
            <View style={styles.starsBadge} accessibilityLabel={`${progress.estrellas} estrellas totales`}>
              <Text style={styles.starsText}>⭐ {progress.estrellas}</Text>
            </View>
            <Pressable
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
              accessibilityLabel="Ir al perfil"
            >
              <Text style={styles.profileButtonIcon}>👤</Text>
            </Pressable>
          </View>
        </View>

        {toast && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>🏆 Logro desbloqueado: {toast}</Text>
          </View>
        )}

        {/* Hero Card: Continuar Aprendiendo */}
        {nextLesson && (
          <View style={styles.continueCard}>
            <View style={styles.continueHeader}>
              <View style={styles.continueBadge}>
                <Text style={styles.continueBadgeText}>SIGUIENTE LECCIÓN</Text>
              </View>
              <Text style={styles.continueLevelTag}>Nivel {nextLesson.level ?? 'A1'}</Text>
            </View>

            <View style={styles.continueBody}>
              <Text style={styles.continueIcon}>{nextLesson.icon ?? '📖'}</Text>
              <View style={styles.continueInfo}>
                <Text style={styles.continueTitle}>{nextLesson.title}</Text>
                <Text style={styles.continueDesc} numberOfLines={2}>
                  {nextLesson.description}
                </Text>
              </View>
            </View>

            <View style={styles.continueActionRow}>
              <Pressable
                style={({ pressed }) => [styles.primaryContinueBtn, pressed && styles.pressed]}
                onPress={() => router.push(`/lesson/${nextLesson.id}`)}
              >
                <Text style={styles.primaryContinueBtnText}>▶ Continuar Lección</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.secondaryQuizBtn, pressed && styles.pressed]}
                onPress={() => router.push(`/quiz/${nextLesson.id}`)}
              >
                <Text style={styles.secondaryQuizBtnText}>Quiz</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Daily Challenges Card (Reto Diario) */}
        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalHeader}>
            <View style={styles.dailyGoalTitleRow}>
              <Text style={styles.dailyGoalIcon}>🎯</Text>
              <Text style={styles.dailyGoalTitle}>Retos Diarios</Text>
            </View>
            <Text style={styles.dailyGoalXpReward}>+60 XP hoy</Text>
          </View>

          <View style={styles.challengeList}>
            {/* Mission 1: Lesson */}
            <View style={styles.challengeItem}>
              <Text style={styles.challengeCheck}>
                {levelCompletedCount > 0 ? '✅' : '⏳'}
              </Text>
              <View style={styles.challengeTextWrap}>
                <Text style={styles.challengeItemTitle}>Completar 1 lección</Text>
                <Text style={styles.challengeItemSub}>
                  {levelCompletedCount > 0 ? 'Completado (+20 XP)' : '0/1 lecciones hoy'}
                </Text>
              </View>
            </View>

            {/* Mission 2: Conversation */}
            <View style={styles.challengeItem}>
              <Text style={styles.challengeCheck}>
                {progress.mensajesPersonajes > 0 ? '✅' : '⏳'}
              </Text>
              <View style={styles.challengeTextWrap}>
                <Text style={styles.challengeItemTitle}>Mantener 1 charla con Fox</Text>
                <Text style={styles.challengeItemSub}>
                  {progress.mensajesPersonajes > 0 ? 'Completado (+20 XP)' : '0/1 conversaciones hoy'}
                </Text>
              </View>
            </View>

            {/* Mission 3: Pronunciation / SRS */}
            <View style={styles.challengeItem}>
              <Text style={styles.challengeCheck}>
                {(progress.spokenPhrasesCount ?? 0) > 0 ? '✅' : '⏳'}
              </Text>
              <View style={styles.challengeTextWrap}>
                <Text style={styles.challengeItemTitle}>Practicar fonética con audio</Text>
                <Text style={styles.challengeItemSub}>
                  {(progress.spokenPhrasesCount ?? 0) > 0 ? 'Completado (+20 XP)' : 'Estudio de pronunciación'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mascot & XP Progress Hero */}
        <View style={styles.mascotHero}>
          <View style={styles.mascotAvatarContainer}>
            <Text style={styles.mascotAvatar}>🦊</Text>
          </View>
          <View style={styles.mascotInfo}>
            <Text style={styles.mascotGreeting}>¡Hola, estudiante!</Text>
            <Text style={styles.mascotSubtitle}>
              Nivel {userLevel} · {currentXp}/100 XP para el próximo nivel
            </Text>
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBarFill, { width: `${Math.min(100, currentXp)}%` }]} />
            </View>
          </View>
        </View>

        {/* Live Conversation Hero CTA */}
        <Pressable
          style={({ pressed }) => [styles.heroCtaCard, pressed && styles.pressed]}
          onPress={() => router.push('/chat')}
        >
          <View style={styles.heroCtaLeft}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>CONVERSACIÓN IA & TUTOR</Text>
            </View>
            <Text style={styles.heroCtaTitle}>🎙️ Hablar en Vivo</Text>
            <Text style={styles.heroCtaDesc}>
              Conversa en {LANGUAGE_NAMES[progress.idiomaObjetivo]?.split(' ')[1] ?? 'inglés'}, recibe correcciones inmediatas y mejora tu fluidez.
            </Text>
          </View>
          <Text style={styles.heroCtaArrow}>➔</Text>
        </Pressable>

        {/* Feature Hub Grid */}
        <Text style={styles.sectionHeader}>Módulos y Práctica Activa</Text>
        <View style={styles.hubGrid}>
          {/* Pronunciación Studio */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/pronounce')}
          >
            <Text style={styles.hubCardIcon}>🗣️</Text>
            <Text style={styles.hubCardTitle}>Pronunciación</Text>
            <Text style={styles.hubCardDesc}>Estudio fonético con audio</Text>
          </Pressable>

          {/* Repaso SRS Inteligente */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/review')}
          >
            <View style={styles.hubBadgeRow}>
              <Text style={styles.hubCardIcon}>🧠</Text>
              {srsDueCardsCount > 0 && (
                <View style={[styles.miniBadge, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.miniBadgeText}>{srsDueCardsCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.hubCardTitle}>Repaso SRS</Text>
            <Text style={styles.hubCardDesc}>
              {srsDueCardsCount > 0 ? `${srsDueCardsCount} tarjetas SuperMemo-2` : 'Memoria espaciada'}
            </Text>
          </Pressable>

          {/* Mis Errores */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/errors')}
          >
            <View style={styles.hubBadgeRow}>
              <Text style={styles.hubCardIcon}>💡</Text>
              {pendingErrorsCount > 0 && (
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>{pendingErrorsCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.hubCardTitle}>Mis Errores</Text>
            <Text style={styles.hubCardDesc}>
              {pendingErrorsCount > 0 ? `${pendingErrorsCount} fallos a reforzar` : 'Banco de correcciones'}
            </Text>
          </Pressable>

          {/* Escenarios / Roleplays */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/scenarios')}
          >
            <Text style={styles.hubCardIcon}>🎭</Text>
            <Text style={styles.hubCardTitle}>Escenarios</Text>
            <Text style={styles.hubCardDesc}>Café, aeropuerto y hotel</Text>
          </Pressable>

          {/* Viaje por el Mundo */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/travel')}
          >
            <Text style={styles.hubCardIcon}>{city.flag}</Text>
            <Text style={styles.hubCardTitle}>Viaje: {city.name}</Text>
            <Text style={styles.hubCardDesc}>Misiones y cultura en vivo</Text>
          </Pressable>

          {/* Personajes Nativos */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/characters')}
          >
            <Text style={styles.hubCardIcon}>👥</Text>
            <Text style={styles.hubCardTitle}>Personajes</Text>
            <Text style={styles.hubCardDesc}>Nativos con voz real</Text>
          </Pressable>

          {/* Progreso CEFR */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/progress')}
          >
            <Text style={styles.hubCardIcon}>📈</Text>
            <Text style={styles.hubCardTitle}>Progreso CEFR</Text>
            <Text style={styles.hubCardDesc}>Ruta de dominio A1 → C2</Text>
          </Pressable>

          {/* Logros y Trofeos */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/achievements')}
          >
            <Text style={styles.hubCardIcon}>🏆</Text>
            <Text style={styles.hubCardTitle}>Logros</Text>
            <Text style={styles.hubCardDesc}>Trofeos e insignias</Text>
          </Pressable>

          {/* Modo Kids */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.pressed]}
            onPress={() => router.push('/kids')}
          >
            <Text style={styles.hubCardIcon}>🦊</Text>
            <Text style={styles.hubCardTitle}>LinguaFox Kids</Text>
            <Text style={styles.hubCardDesc}>Modo visual infantil</Text>
          </Pressable>
        </View>

        {/* Learning Path by Level (Camino de Aprendizaje) */}
        <View style={styles.learningPathHeader}>
          <Text style={styles.sectionHeader}>Camino de Aprendizaje</Text>
          <Text style={styles.levelProgressLabel}>{levelCompletedCount}/{filteredLessons.length} listos ({levelProgressPercent}%)</Text>
        </View>

        {/* Level Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelTabsRow}>
          {ALL_CEFR_LEVELS.map((lvl) => {
            const isSelected = lvl === selectedLevel;
            const count = lessons.filter((l) => (l.level ?? 'A1') === lvl).length;
            return (
              <Pressable
                key={lvl}
                style={[styles.levelTab, isSelected && styles.levelTabActive]}
                onPress={() => setSelectedLevel(lvl)}
              >
                <Text style={[styles.levelTabText, isSelected && styles.levelTabTextActive]}>
                  {lvl} {count > 0 ? `(${count})` : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {filteredLessons.length === 0 ? (
          <View style={styles.emptyLevelCard}>
            <Text style={styles.emptyLevelTitle}>Nivel {selectedLevel} (Próximamente)</Text>
            <Text style={styles.emptyLevelDesc}>
              El itinerario curricular para este nivel se activará conforme completes las unidades precedentes. Para el curso de Inglés, el nivel A1 cuenta con 12 unidades activas.
            </Text>
          </View>
        ) : (
          filteredLessons.map((lesson, index) => {
            const progressKey = getProgressKey(lesson.language, lesson.id);
            const isCompleted = progress.leccionesCompletadas.includes(progressKey);
            const isNext = !isCompleted && (index === 0 || progress.leccionesCompletadas.includes(getProgressKey(lesson.language, filteredLessons[index - 1]?.id ?? '')));
            const bestStars = progress.mejoresEstrellasPorLeccion[progressKey] ?? 0;
            const bestScore = progress.mejorPuntuacionPorLeccion[progressKey];

            return (
              <View
                key={lesson.id}
                style={[
                  styles.pathCard,
                  isCompleted && styles.pathCardCompleted,
                  isNext && styles.pathCardNext,
                ]}
              >
                <View style={styles.pathHeader}>
                  <View style={styles.pathTitleRow}>
                    <Text style={styles.pathLessonIcon}>{lesson.icon ?? '📚'}</Text>
                    <View style={styles.pathTitleWrap}>
                      <Text style={styles.pathCardTitle}>{lesson.title}</Text>
                      <Text style={styles.pathCardDesc} numberOfLines={2}>
                        {lesson.description}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.pathBadge,
                      isCompleted && styles.pathBadgeCompleted,
                      isNext && styles.pathBadgeNext,
                    ]}
                  >
                    <Text style={styles.pathBadgeText}>
                      {isCompleted ? '✓ Completada' : isNext ? '📍 Siguiente' : 'Pendiente'}
                    </Text>
                  </View>
                </View>

                {/* Score & Stars Stats */}
                <View style={styles.pathStatsRow}>
                  <Text style={styles.pathStars} accessibilityLabel={`${bestStars} de 3 estrellas`}>
                    {Array.from({ length: 3 }, (_, i) => (i < bestStars ? '★' : '☆')).join(' ')}
                  </Text>
                  <Text style={styles.pathScore}>
                    {bestScore === undefined
                      ? `${lesson.words.length} expresiones foco`
                      : `Mejor intento: ${bestScore}/${lesson.words.length}`}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.pathBtnRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.pathButton,
                      isNext && styles.pathButtonHighlighted,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => router.push(`/lesson/${lesson.id}`)}
                  >
                    <Text style={styles.pathButtonText}>Aprender</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.pathButton,
                      styles.pathQuizButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => router.push(`/quiz/${lesson.id}`)}
                  >
                    <Text style={styles.pathQuizButtonText}>Quiz</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: { paddingBottom: 40, gap: 14 },
    topStatusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    languageButton: {
      backgroundColor: colors.surfaceRaised,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    languageText: { color: colors.text, fontSize: 13, fontWeight: '800' },
    statsBadges: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    streakBadge: {
      backgroundColor: '#3B1E08',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: '#7C2D12',
    },
    streakText: { color: '#FF8A00', fontSize: 12, fontWeight: '900' },
    starsBadge: {
      backgroundColor: '#261F05',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: '#854D0E',
    },
    starsText: { color: '#FACC15', fontSize: 12, fontWeight: '900' },
    profileButton: {
      backgroundColor: colors.surfaceRaised,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    profileButtonIcon: { fontSize: 14 },
    toast: {
      backgroundColor: AppColors.primary,
      padding: 12,
      borderRadius: 14,
      alignItems: 'center',
    },
    toastText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
    continueCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 22,
      padding: 16,
      borderWidth: 2,
      borderColor: AppColors.primary,
      gap: 12,
    },
    continueHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    continueBadge: {
      backgroundColor: AppColors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    continueBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    continueLevelTag: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
    continueBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    continueIcon: { fontSize: 36 },
    continueInfo: { flex: 1, gap: 2 },
    continueTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
    continueDesc: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
    continueActionRow: { flexDirection: 'row', gap: 10 },
    primaryContinueBtn: {
      flex: 2,
      backgroundColor: AppColors.primary,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    primaryContinueBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    secondaryQuizBtn: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    secondaryQuizBtnText: { color: colors.text, fontSize: 14, fontWeight: '800' },
    dailyGoalCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    dailyGoalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dailyGoalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dailyGoalIcon: { fontSize: 20 },
    dailyGoalTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
    dailyGoalXpReward: { color: AppColors.accent, fontSize: 12, fontWeight: '800' },
    challengeList: { gap: 8 },
    challengeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 12,
      gap: 10,
    },
    challengeCheck: { fontSize: 16 },
    challengeTextWrap: { flex: 1 },
    challengeItemTitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
    challengeItemSub: { color: colors.textMuted, fontSize: 11, fontWeight: '500' },
    mascotHero: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 20,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    mascotAvatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    mascotAvatar: { fontSize: 28 },
    mascotInfo: { flex: 1, gap: 2 },
    mascotGreeting: { color: colors.text, fontSize: 15, fontWeight: '900' },
    mascotSubtitle: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
    xpBarContainer: {
      height: 6,
      backgroundColor: colors.surface,
      borderRadius: 99,
      overflow: 'hidden',
      marginTop: 4,
    },
    xpBarFill: {
      height: '100%',
      backgroundColor: AppColors.primary,
      borderRadius: 99,
    },
    heroCtaCard: {
      backgroundColor: '#1E1435',
      borderRadius: 22,
      padding: 16,
      borderWidth: 1.5,
      borderColor: '#6D28D9',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroCtaLeft: { flex: 1, gap: 4 },
    liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
    liveText: { color: '#A78BFA', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    heroCtaTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
    heroCtaDesc: { color: '#DDD6FE', fontSize: 12, fontWeight: '500', lineHeight: 16 },
    heroCtaArrow: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginLeft: 10 },
    sectionHeader: { color: colors.text, fontSize: 17, fontWeight: '900' },
    hubGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    hubCard: {
      flex: 1,
      minWidth: '47%',
      backgroundColor: colors.surfaceRaised,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 3,
    },
    hubBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    hubCardIcon: { fontSize: 26, marginBottom: 2 },
    miniBadge: {
      backgroundColor: AppColors.danger,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 10,
    },
    miniBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
    hubCardTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
    hubCardDesc: { color: colors.textMuted, fontSize: 11, fontWeight: '500' },
    learningPathHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
    },
    levelProgressLabel: { color: AppColors.primaryBright, fontSize: 12, fontWeight: '800' },
    levelTabsRow: { gap: 8, paddingVertical: 4 },
    levelTab: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 99,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    levelTabActive: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    levelTabText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
    levelTabTextActive: { color: '#FFFFFF' },
    emptyLevelCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 6,
    },
    emptyLevelTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
    emptyLevelDesc: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    pathCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    pathCardCompleted: {
      borderColor: '#059669',
      backgroundColor: '#062E24',
    },
    pathCardNext: {
      borderColor: AppColors.primary,
      borderWidth: 1.5,
    },
    pathHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 8,
    },
    pathTitleRow: { flexDirection: 'row', flex: 1, gap: 10, alignItems: 'flex-start' },
    pathLessonIcon: { fontSize: 26 },
    pathTitleWrap: { flex: 1, gap: 2 },
    pathCardTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
    pathCardDesc: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
    pathBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    pathBadgeCompleted: { backgroundColor: '#065F46' },
    pathBadgeNext: { backgroundColor: AppColors.primary },
    pathBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
    pathStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pathStars: { color: '#FACC15', fontSize: 13, letterSpacing: 2 },
    pathScore: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
    pathBtnRow: { flexDirection: 'row', gap: 8 },
    pathButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: 9,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    pathButtonHighlighted: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    pathButtonText: { color: colors.text, fontSize: 13, fontWeight: '800' },
    pathQuizButton: {
      backgroundColor: colors.surface,
      borderColor: colors.surfaceBorder,
    },
    pathQuizButtonText: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
    pressed: { opacity: 0.8 },
  });
}
