import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { getScenariosForLanguage } from '@/data/scenarios';
import type { Scenario } from '@/types/learning';

type CategoryFilter = 'all' | 'daily' | 'travel' | 'social' | 'work';

export function ScenariosScreen() {
  const { progress } = useProgress();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const scenarios = getScenariosForLanguage(progress.idiomaObjetivo);

  const filtered = filter === 'all'
    ? scenarios
    : scenarios.filter((s) => s.category === filter);

  const categoryLabels: Record<CategoryFilter, string> = {
    all: 'Todos',
    daily: 'Cotidianos ☕',
    travel: 'Viajes ✈️',
    social: 'Social 🤝',
    work: 'Trabajo 💼',
  };

  const startScenario = (scenario: Scenario) => {
    router.push({
      pathname: '/chat',
      params: {
        characterId: scenario.characterId,
        scenarioId: scenario.id,
        initialGreeting: scenario.initialGreeting,
      },
    });
  };

  return (
    <ScreenContainer title="Escenarios y Roleplay">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>🎭</Text>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Conversaciones Guiadas</Text>
            <Text style={styles.bannerSubtitle}>
              Practica situaciones reales de viaje, trabajo y vida social con personajes nativos.
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {(['all', 'daily', 'travel', 'social', 'work'] as CategoryFilter[]).map((cat) => (
            <Pressable
              key={cat}
              style={[styles.pill, filter === cat && styles.pillActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.pillText, filter === cat && styles.pillTextActive]}>
                {categoryLabels[cat]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Scenarios Grid */}
        <View style={styles.grid}>
          {filtered.map((scenario) => {
            const isCompleted = progress.completedScenarios?.includes(scenario.id);
            return (
              <Pressable
                key={scenario.id}
                style={[styles.card, isCompleted && styles.cardCompleted]}
                onPress={() => startScenario(scenario)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{scenario.icon}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>{scenario.level}</Text>
                    </View>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓ Completado</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.cardTitle}>{scenario.title}</Text>
                <Text style={styles.cardDescription}>{scenario.description}</Text>

                {/* Goals */}
                <View style={styles.goalsBox}>
                  <Text style={styles.goalsTitle}>Objetivos:</Text>
                  {scenario.goals.map((g, idx) => (
                    <Text key={idx} style={styles.goalItem}>• {g}</Text>
                  ))}
                </View>

                {/* Action CTA */}
                <View style={styles.startBtn}>
                  <Text style={styles.startBtnText}>🎙️ Iniciar conversación</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, gap: 16 },
  banner: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  bannerIcon: { fontSize: 36 },
  bannerContent: { flex: 1 },
  bannerTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  bannerSubtitle: { color: AppColors.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  filterRow: { flexDirection: 'row', gap: 8 },
  pill: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  pillActive: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  pillText: { color: AppColors.textMuted, fontSize: 13, fontWeight: '700' },
  pillTextActive: { color: AppColors.text, fontWeight: '800' },
  grid: { gap: 14 },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  cardCompleted: { borderColor: AppColors.success },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIcon: { fontSize: 32 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  levelBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: { color: AppColors.blueLight, fontSize: 12, fontWeight: '800' },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: { color: AppColors.success, fontSize: 12, fontWeight: '800' },
  cardTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  cardDescription: { color: AppColors.textMuted, fontSize: 14, lineHeight: 20 },
  goalsBox: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  goalsTitle: { color: AppColors.text, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  goalItem: { color: AppColors.textMuted, fontSize: 13 },
  startBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  startBtnText: { color: AppColors.text, fontWeight: '900', fontSize: 15 },
});
