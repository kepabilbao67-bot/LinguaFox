import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { useProgress } from '@/hooks/use-progress';
import { levelFromXp, xpIntoLevel } from '@/utils/rewards';
import { getLessonsByLanguage, getProgressKey } from '@/data/lessons';
import type { CEFRLevel } from '@/types/learning';

import { calculateLevelCompetencies } from '@/utils/cefr-competencies';

interface LevelMetadata {
  level: CEFRLevel;
  title: string;
  description: string;
  targetXp: number;
}

const CEFR_LEVELS: readonly LevelMetadata[] = [
  { level: 'A1', title: 'Acceso / Principiante', description: 'Presentaciones, saludos, pedidos cotidianos y vocabulario inmediato.', targetXp: 500 },
  { level: 'A2', title: 'Plataforma / Elemental', description: 'Conversaciones de viajes, compras, anécdotas y rutinas diarias.', targetXp: 1200 },
  { level: 'B1', title: 'Umbral / Intermedio', description: 'Entrevistas, opiniones, viajes largos y proyectos personales.', targetXp: 2500 },
  { level: 'B2', title: 'Avanzado / Intermedio Alto', description: 'Debates fluidos, noticias, negociaciones y matices expresivos.', targetXp: 4500 },
  { level: 'C1', title: 'Dominio Operativo Eficaz', description: 'Expresión oral espontánea, flexibilidad temática y textos complejos.', targetXp: 7500 },
  { level: 'C2', title: 'Maestría / Nativo Culto', description: 'Dominio natural, giros lingüísticos, humor e inmersión total.', targetXp: 12000 },
];

export function ProgressScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated } = useProgress();
  const [expandedLevel, setExpandedLevel] = useState<CEFRLevel>('A1');

  const userLevel = levelFromXp(progress.experiencia);
  const currentXp = xpIntoLevel(progress.experiencia);
  const allCourseLessons = getLessonsByLanguage(progress.idiomaObjetivo);

  // Calculate stats for each CEFR Level
  const levelStats = useMemo(() => {
    return CEFR_LEVELS.map((meta) => {
      const levelLessons = allCourseLessons.filter((l) => (l.level ?? 'A1') === meta.level);
      const totalLessons = levelLessons.length;
      const completedLessons = levelLessons.filter((l) =>
        progress.leccionesCompletadas.includes(getProgressKey(l.language, l.id))
      ).length;

      const totalWords = levelLessons.reduce((acc, l) => acc + l.words.length, 0);
      const learnedWords = levelLessons
        .filter((l) => progress.leccionesCompletadas.includes(getProgressKey(l.language, l.id)))
        .reduce((acc, l) => acc + l.words.length, 0);

      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
      const isCurrent = (progress.nivelObjetivo ?? 'A1') === meta.level;

      // Real Competency Metrics via specific evidence engine
      const competencies = calculateLevelCompetencies({
        level: meta.level,
        levelLessons,
        progress,
      });

      return {
        ...meta,
        totalLessons,
        completedLessons,
        totalWords,
        learnedWords,
        progressPercent,
        isCompleted,
        isCurrent,
        competencies,
      };
    });
  }, [allCourseLessons, progress]);

  return (
    <ScreenContainer title="Progreso y Marco CEFR" isLoading={!isHydrated}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Global Progress Header Card */}
        <View style={styles.profileCard}>
          <Text style={styles.avatar}>🦊🎓</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Nivel {userLevel} · Estudiante Activo</Text>
            <Text style={styles.profileSubtitle}>{progress.experiencia} XP acumulados</Text>
            <View style={styles.xpBar}>
              <View style={[styles.xpBarFill, { width: `${Math.min(100, currentXp)}%` }]} />
            </View>
            <Text style={styles.xpText}>{currentXp}/100 XP para el próximo nivel</Text>
          </View>
        </View>

        {/* Global Summary Metrics */}
        <Text style={styles.sectionHeader}>Competencias Generales</Text>
        <View style={styles.skillsGrid}>
          <View style={styles.skillBox}>
            <Text style={styles.skillIcon}>📖</Text>
            <Text style={styles.skillValue}>
              {levelStats.find((l) => l.level === 'A1')?.learnedWords ?? 0}
            </Text>
            <Text style={styles.skillName}>Vocabulario</Text>
          </View>
          <View style={styles.skillBox}>
            <Text style={styles.skillIcon}>🎧</Text>
            <Text style={styles.skillValue}>
              {levelStats.find((l) => l.level === 'A1')?.completedLessons ?? 0}
            </Text>
            <Text style={styles.skillName}>Lecciones Audio</Text>
          </View>
          <View style={styles.skillBox}>
            <Text style={styles.skillIcon}>💬</Text>
            <Text style={styles.skillValue}>{progress.mensajesPersonajes}</Text>
            <Text style={styles.skillName}>Mensajes IA</Text>
          </View>
          <View style={styles.skillBox}>
            <Text style={styles.skillIcon}>🔥</Text>
            <Text style={styles.skillValue}>{progress.rachaActual} d</Text>
            <Text style={styles.skillName}>Racha Activa</Text>
          </View>
        </View>

        {/* CEFR Level Breakdown */}
        <Text style={styles.sectionHeader}>Hoja de Ruta de Niveles (A1 → C2)</Text>
        <View style={styles.roadmap}>
          {levelStats.map((item) => {
            const isExpanded = expandedLevel === item.level;

            return (
              <View
                key={item.level}
                style={[
                  styles.roadmapCard,
                  item.isCurrent && styles.roadmapCardCurrent,
                  item.isCompleted && styles.roadmapCardCompleted,
                ]}
              >
                <Pressable
                  style={styles.roadmapHeader}
                  onPress={() => setExpandedLevel(isExpanded ? ('' as any) : item.level)}
                >
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{item.level}</Text>
                  </View>
                  <View style={styles.levelTitleWrap}>
                    <Text style={styles.levelTitle}>{item.title}</Text>
                    <Text style={styles.levelSubProgress}>
                      {item.totalLessons > 0
                        ? `${item.completedLessons}/${item.totalLessons} lecciones (${item.progressPercent}%)`
                        : 'Próximamente'}
                    </Text>
                  </View>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>
                      {item.isCompleted ? '✓ Dominado' : item.isCurrent ? '📍 En curso' : '🔒'}
                    </Text>
                  </View>
                </Pressable>

                <Text style={styles.roadmapDesc}>{item.description}</Text>

                {/* Progress Bar for the level */}
                <View style={styles.levelProgressBar}>
                  <View style={[styles.levelProgressFill, { width: `${item.progressPercent}%` }]} />
                </View>

                {/* Competencies Breakdown when expanded */}
                {isExpanded && (
                  <View style={styles.expandedSection}>
                    <Text style={styles.expandedTitle}>Desglose de Competencias ({item.level}):</Text>
                    
                    <View style={styles.competencyRow}>
                      <Text style={styles.compLabel}>📖 Lectura (Reading):</Text>
                      <Text style={item.competencies.reading !== null ? styles.compVal : styles.compValNote}>
                        {item.competencies.reading !== null ? `${item.competencies.reading}%` : 'Sin datos suficientes'}
                      </Text>
                    </View>

                    <View style={styles.competencyRow}>
                      <Text style={styles.compLabel}>🎧 Escucha (Listening):</Text>
                      <Text style={item.competencies.listening !== null ? styles.compVal : styles.compValNote}>
                        {item.competencies.listening !== null ? `${item.competencies.listening}%` : 'Sin datos suficientes'}
                      </Text>
                    </View>

                    <View style={styles.competencyRow}>
                      <Text style={styles.compLabel}>🧠 Vocabulario ({item.learnedWords}/{item.totalWords}):</Text>
                      <Text style={item.competencies.vocabulary !== null ? styles.compVal : styles.compValNote}>
                        {item.competencies.vocabulary !== null ? `${item.competencies.vocabulary}%` : 'Sin datos suficientes'}
                      </Text>
                    </View>

                    <View style={styles.competencyRow}>
                      <Text style={styles.compLabel}>📐 Gramática aplicada:</Text>
                      <Text style={item.competencies.grammar !== null ? styles.compVal : styles.compValNote}>
                        {item.competencies.grammar !== null ? `${item.competencies.grammar}%` : 'Sin datos suficientes'}
                      </Text>
                    </View>

                    <View style={styles.competencyRow}>
                      <Text style={styles.compLabel}>✍️ Escritura (Writing):</Text>
                      <Text style={item.competencies.writing !== null ? styles.compVal : styles.compValNote}>
                        {item.competencies.writing !== null ? `${item.competencies.writing}%` : 'Sin datos suficientes'}
                      </Text>
                    </View>

                    <View style={styles.competencyRow}>
                      <Text style={styles.compLabel}>🗣️ Pronunciación con audio:</Text>
                      <Text style={styles.compValNote}>
                        {item.competencies.speakingRecorded > 0
                          ? `${item.competencies.speakingRecorded} frases practicadas`
                          : 'Sin prácticas registradas'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.chatButton, pressed && styles.pressed]}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.chatButtonText}>🎙️ Subir de nivel practicando</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingBottom: 40, gap: 16 },
    profileCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 22,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    avatar: { fontSize: 40 },
    profileInfo: { flex: 1, gap: 3 },
    profileTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
    profileSubtitle: { color: AppColors.primaryBright, fontSize: 13, fontWeight: '700' },
    xpBar: {
      height: 6,
      backgroundColor: colors.surface,
      borderRadius: 99,
      overflow: 'hidden',
      marginTop: 4,
    },
    xpBarFill: { height: '100%', backgroundColor: AppColors.primary, borderRadius: 99 },
    xpText: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 2 },
    sectionHeader: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 4 },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    skillBox: {
      flex: 1,
      minWidth: '22%',
      backgroundColor: colors.surfaceRaised,
      borderRadius: 16,
      padding: 12,
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    skillIcon: { fontSize: 22 },
    skillValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
    skillName: { color: colors.textMuted, fontSize: 10, fontWeight: '700', textAlign: 'center' },
    roadmap: { gap: 12 },
    roadmapCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    roadmapCardCurrent: {
      borderColor: AppColors.primary,
      borderWidth: 1.5,
    },
    roadmapCardCompleted: {
      borderColor: '#059669',
      backgroundColor: '#062E24',
    },
    roadmapHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    levelBadge: {
      backgroundColor: AppColors.primary,
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    levelTitleWrap: { flex: 1, gap: 1 },
    levelTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
    levelSubProgress: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
    statusPill: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusPillText: { color: colors.text, fontSize: 11, fontWeight: '800' },
    roadmapDesc: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    levelProgressBar: {
      height: 6,
      backgroundColor: colors.surface,
      borderRadius: 99,
      overflow: 'hidden',
    },
    levelProgressFill: {
      height: '100%',
      backgroundColor: AppColors.primary,
      borderRadius: 99,
    },
    expandedSection: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 14,
      gap: 6,
      marginTop: 4,
    },
    expandedTitle: { color: colors.text, fontSize: 13, fontWeight: '800', marginBottom: 4 },
    competencyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    compLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
    compVal: { color: AppColors.primaryBright, fontSize: 12, fontWeight: '800' },
    compValNote: { color: colors.textMuted, fontSize: 11, fontWeight: '500' },
    chatButton: {
      backgroundColor: AppColors.primary,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8,
    },
    chatButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
    pressed: { opacity: 0.8 },
  });
}
