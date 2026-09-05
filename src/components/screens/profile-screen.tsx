import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { levelFromXp, xpIntoLevel } from '@/utils/rewards';
import { ACHIEVEMENTS } from '@/data/achievements';
import { getLessonsByLanguage } from '@/data/lessons';

const LANGUAGE_LABELS: Record<string, string> = {
  en: '🇬🇧 Inglés',
  es: '🇪🇸 Español',
  fr: '🇫🇷 Francés',
  it: '🇮🇹 Italiano',
  de: '🇩🇪 Alemán',
  pt: '🇵🇹 Portugués',
  eu: '🟢 Euskera',
  ca: '🟡 Catalán',
};

export function ProfileScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated } = useProgress();

  const userLevel = levelFromXp(progress.experiencia);
  const currentXp = xpIntoLevel(progress.experiencia);
  const targetLessons = getLessonsByLanguage(progress.idiomaObjetivo);
  const completedCount = progress.leccionesCompletadas.filter((key) =>
    key.startsWith(`${progress.idiomaObjetivo}:`)
  ).length;

  const totalWordsLearned = targetLessons
    .filter((l) => progress.leccionesCompletadas.includes(`${progress.idiomaObjetivo}:${l.id}`))
    .reduce((acc, l) => acc + l.words.length, 0);

  const unlockedAchievementsCount = progress.logros.length;
  const srsCardsCount = Object.keys(progress.srs ?? {}).length;
  const trackedErrorsCount = progress.trackedErrors?.length ?? 0;

  // 7-day streak visualizer
  const past7Days = useMemo(() => {
    const today = new Date();
    const days = [];
    const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const isToday = i === 0;
      const isActive = i < progress.rachaActual;
      days.push({
        label: dayNames[d.getDay()],
        dateNum: d.getDate(),
        isToday,
        isActive,
      });
    }
    return days;
  }, [progress.rachaActual]);

  return (
    <ScreenContainer title="Mi Perfil" isLoading={!isHydrated}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🦊</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Niv. {userLevel}</Text>
            </View>
          </View>

          <Text style={styles.userName}>Estudiante de LinguaFox</Text>
          <Text style={styles.userSubtitle}>
            Aprendiendo {LANGUAGE_LABELS[progress.idiomaObjetivo] ?? 'Inglés'} · Nivel {progress.nivelObjetivo ?? 'A1'}
          </Text>

          {/* XP Progress */}
          <View style={styles.xpWrap}>
            <View style={styles.xpBarBackground}>
              <View style={[styles.xpBarFill, { width: `${Math.min(100, currentXp)}%` }]} />
            </View>
            <View style={styles.xpTextRow}>
              <Text style={styles.xpText}>{currentXp} / 100 XP</Text>
              <Text style={styles.totalXpText}>{progress.experiencia} XP Totales</Text>
            </View>
          </View>
        </View>

        {/* 7-Day Habit Tracker Card */}
        <View style={styles.streakHabitCard}>
          <View style={styles.streakHabitHeader}>
            <Text style={styles.streakHabitTitle}>🔥 Racha Semanal</Text>
            <Text style={styles.streakHabitCount}>{progress.rachaActual} {progress.rachaActual === 1 ? 'día' : 'días'} activos</Text>
          </View>
          <View style={styles.streakDaysRow}>
            {past7Days.map((d, index) => (
              <View
                key={index}
                style={[
                  styles.streakDayBox,
                  d.isActive && styles.streakDayBoxActive,
                  d.isToday && styles.streakDayBoxToday,
                ]}
              >
                <Text style={[styles.streakDayLabel, d.isActive && styles.streakDayLabelActive]}>
                  {d.label}
                </Text>
                <View
                  style={[
                    styles.streakDayCircle,
                    d.isActive && styles.streakDayCircleActive,
                  ]}
                >
                  <Text style={[styles.streakDayCircleText, d.isActive && styles.streakDayCircleTextActive]}>
                    {d.isActive ? '🔥' : d.dateNum}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Learning Stats Grid */}
        <Text style={styles.sectionTitle}>Estadísticas Académicas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{progress.rachaActual} días</Text>
            <Text style={styles.statLabel}>Racha Actual</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{progress.estrellas}</Text>
            <Text style={styles.statLabel}>Estrellas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statValue}>{completedCount} / {targetLessons.length}</Text>
            <Text style={styles.statLabel}>Lecciones</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🧠</Text>
            <Text style={styles.statValue}>{totalWordsLearned}</Text>
            <Text style={styles.statLabel}>Palabras</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statValue}>{progress.mensajesPersonajes}</Text>
            <Text style={styles.statLabel}>Mensajes IA</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{unlockedAchievementsCount} / {ACHIEVEMENTS.length}</Text>
            <Text style={styles.statLabel}>Logros</Text>
          </View>
        </View>

        {/* Memory & Errors Overview */}
        <Text style={styles.sectionTitle}>Memoria y Repaso</Text>
        <View style={styles.memoryCard}>
          <View style={styles.memoryItem}>
            <Text style={styles.memoryNumber}>{srsCardsCount}</Text>
            <Text style={styles.memoryText}>Tarjetas en Memoria SRS</Text>
          </View>
          <View style={styles.memoryDivider} />
          <View style={styles.memoryItem}>
            <Text style={styles.memoryNumber}>{trackedErrorsCount}</Text>
            <Text style={styles.memoryText}>Errores Registrados</Text>
          </View>
        </View>

        {/* Quick Nav Actions */}
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.actionsList}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => router.push('/language')}
          >
            <Text style={styles.actionIcon}>🌐</Text>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Cambiar Idioma de Estudio</Text>
              <Text style={styles.actionDesc}>{LANGUAGE_LABELS[progress.idiomaObjetivo] ?? 'Inglés'}</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => router.push('/progress')}
          >
            <Text style={styles.actionIcon}>📈</Text>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Hoja de Ruta CEFR</Text>
              <Text style={styles.actionDesc}>Progreso detallado por competencias</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => router.push('/achievements')}
          >
            <Text style={styles.actionIcon}>🏆</Text>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Sala de Trofeos</Text>
              <Text style={styles.actionDesc}>{unlockedAchievementsCount} logros completados</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => router.push('/kids')}
          >
            <Text style={styles.actionIcon}>🦊</Text>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Modo Infantil (LinguaFox Kids)</Text>
              <Text style={styles.actionDesc}>Tarjetas grandes, vocabulario visual y audio</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => router.push('/privacy')}
          >
            <Text style={styles.actionIcon}>🛡️</Text>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Privacidad y Transparencia</Text>
              <Text style={styles.actionDesc}>Datos locales, sin publicidad abusiva</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingBottom: 40, gap: 16 },
    profileHeaderCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 24,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 8,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      borderWidth: 2,
      borderColor: AppColors.primary,
    },
    avatarEmoji: { fontSize: 42 },
    levelBadge: {
      position: 'absolute',
      bottom: -6,
      backgroundColor: AppColors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    levelBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
    userName: { color: colors.text, fontSize: 20, fontWeight: '900' },
    userSubtitle: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
    xpWrap: { width: '100%', marginTop: 8, gap: 4 },
    xpBarBackground: {
      height: 8,
      backgroundColor: colors.surface,
      borderRadius: 99,
      overflow: 'hidden',
    },
    xpBarFill: {
      height: '100%',
      backgroundColor: AppColors.primary,
      borderRadius: 99,
    },
    xpTextRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 2,
    },
    xpText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
    totalXpText: { color: AppColors.accent, fontSize: 12, fontWeight: '800' },
    streakHabitCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 12,
    },
    streakHabitHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    streakHabitTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
    },
    streakHabitCount: {
      color: AppColors.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    streakDaysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 6,
    },
    streakDayBox: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    streakDayBoxActive: {
      borderColor: 'rgba(255, 122, 0, 0.4)',
      backgroundColor: 'rgba(255, 122, 0, 0.08)',
    },
    streakDayBoxToday: {
      borderColor: AppColors.primary,
    },
    streakDayLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    streakDayLabelActive: {
      color: AppColors.primary,
      fontWeight: '900',
    },
    streakDayCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakDayCircleActive: {
      backgroundColor: 'rgba(255, 122, 0, 0.2)',
    },
    streakDayCircleText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
    },
    streakDayCircleTextActive: {
      color: AppColors.primary,
      fontSize: 14,
      fontWeight: '900',
    },
    sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 8 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    statBox: {
      flex: 1,
      minWidth: '28%',
      backgroundColor: colors.surfaceRaised,
      borderRadius: 16,
      padding: 14,
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    statIcon: { fontSize: 24 },
    statValue: { color: colors.text, fontSize: 16, fontWeight: '900' },
    statLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600', textAlign: 'center' },
    memoryCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 18,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    memoryItem: { flex: 1, alignItems: 'center', gap: 2 },
    memoryNumber: { color: AppColors.primary, fontSize: 22, fontWeight: '900' },
    memoryText: { color: colors.textMuted, fontSize: 12, fontWeight: '600', textAlign: 'center' },
    memoryDivider: { width: 1, height: 36, backgroundColor: colors.surfaceBorder },
    actionsList: { gap: 10 },
    actionButton: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    actionIcon: { fontSize: 24 },
    actionCopy: { flex: 1, gap: 2 },
    actionTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
    actionDesc: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
    actionArrow: { color: colors.textMuted, fontSize: 20, fontWeight: '700' },
    pressed: { opacity: 0.8 },
  });
}
