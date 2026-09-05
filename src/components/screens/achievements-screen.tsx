import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { ACHIEVEMENTS, resolveMetricValue, type AchievementCategory, type AchievementMetric } from '@/data/achievements';
import { useProgress } from '@/hooks/use-progress';
import { AppColors } from '@/constants/app-theme';

export function AchievementsScreen() {
  const { progress } = useProgress();
  const [selectedCat, setSelectedCat] = useState<AchievementCategory | 'all'>('all');

  const categories: { key: AchievementCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'learning', label: 'Estudio 📚' },
    { key: 'streak', label: 'Racha 🔥' },
    { key: 'chat', label: 'IA & Diálogos 🦊' },
    { key: 'speaking', label: 'Pronunciación 🎧' },
    { key: 'travel', label: 'Viajes ✈️' },
  ];

  const unlockedCount = Object.keys(progress.logrosDesbloqueados ?? {}).length;
  const totalAchievements = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / Math.max(1, totalAchievements)) * 100);

  const evalContext = {
    lecciones: progress.leccionesCompletadas?.length ?? 0,
    racha: progress.rachaActual ?? 0,
    mensajes: progress.mensajesPersonajes ?? 0,
    personajes: progress.personajesConCharla?.length ?? 0,
    spokenPhrases: progress.spokenPhrasesCount ?? 0,
    unlockedCities: progress.unlockedCities?.length ?? 0,
    scenariosCompleted: progress.completedScenarios?.length ?? 0,
    reviewsCompleted: Object.keys(progress.srs ?? {}).length,
  };

  const getMetricValue = (metric: AchievementMetric): number => {
    return resolveMetricValue(metric, evalContext);
  };

  const filteredAchievements = selectedCat === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter((a) => a.categoria === selectedCat);

  return (
    <ScreenContainer title="Logros y Trofeos" scrollable={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Summary */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroSubtitle}>TU COLECCIÓN DE ÉXITOS</Text>
              <Text style={styles.heroTitle}>
                {unlockedCount} de {totalAchievements} Desbloqueados
              </Text>
            </View>
            <View style={styles.trophyBadge}>
              <Text style={styles.trophyEmoji}>🏆</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressPercentText}>{progressPercent}% Completado</Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat.key}
              style={[styles.filterPill, selectedCat === cat.key && styles.filterPillActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[styles.filterPillText, selectedCat === cat.key && styles.filterPillTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Achievements Grid */}
        <View style={styles.list}>
          {filteredAchievements.map((item) => {
            const unlockIso = progress.logrosDesbloqueados?.[item.id];
            const isUnlocked = Boolean(unlockIso) || progress.logros?.includes(item.id);
            const currentVal = getMetricValue(item.metric);
            const targetVal = item.targetValue;
            const itemPercent = Math.min(100, Math.round((currentVal / Math.max(1, targetVal)) * 100));

            return (
              <View key={item.id} style={[styles.card, !isUnlocked && styles.cardLocked]}>
                <View style={[styles.iconContainer, isUnlocked && styles.iconContainerUnlocked]}>
                  <Text style={styles.icon}>{item.icono}</Text>
                  {!isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockText}>🔒</Text>
                    </View>
                  )}
                </View>

                <View style={styles.copy}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.name, !isUnlocked && styles.nameLocked]}>{item.titulo}</Text>
                    <View style={styles.xpTag}>
                      <Text style={styles.xpText}>+{item.xpReward} XP</Text>
                    </View>
                  </View>

                  <Text style={styles.description}>{item.descripcion}</Text>

                  {/* Progress or unlocked date */}
                  {isUnlocked ? (
                    <View style={styles.unlockedRow}>
                      <Text style={styles.unlockedCheck}>✓</Text>
                      <Text style={styles.unlockedDate}>
                        Desbloqueado {unlockIso ? new Date(unlockIso).toLocaleDateString('es-ES') : '¡Conseguido!'}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.progressRow}>
                      <View style={styles.itemProgressBg}>
                        <View style={[styles.itemProgressFill, { width: `${itemPercent}%` }]} />
                      </View>
                      <Text style={styles.itemProgressText}>
                        {Math.min(currentVal, targetVal)}/{targetVal}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroSubtitle: {
    color: AppColors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  trophyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  trophyEmoji: {
    fontSize: 24,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  progressPercentText: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 6,
  },
  filterScroll: {
    marginHorizontal: -16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  filterPillActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterPillText: {
    color: AppColors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    alignItems: 'center',
  },
  cardLocked: {
    opacity: 0.75,
    backgroundColor: AppColors.surfaceRaised,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainerUnlocked: {
    backgroundColor: '#3B82F620',
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  icon: {
    fontSize: 26,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: AppColors.surface,
    borderRadius: 10,
    padding: 2,
  },
  lockText: {
    fontSize: 10,
  },
  copy: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: AppColors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  nameLocked: {
    color: AppColors.text,
  },
  xpTag: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  xpText: {
    color: '#10B981',
    fontWeight: '900',
    fontSize: 11,
  },
  description: {
    color: AppColors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  unlockedCheck: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
  },
  unlockedDate: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  itemProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: AppColors.surfaceBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemProgressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 3,
  },
  itemProgressText: {
    color: AppColors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
});
