import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { CITIES } from '@/data/cities';
import type { CityAdventure } from '@/types/learning';

export function TravelScreen() {
  const { progress, unlockCity } = useProgress();

  const startCityTour = (city: CityAdventure) => {
    router.push({
      pathname: '/chat',
      params: {
        characterId: city.id === 'roma' ? 'luca' : city.id === 'madrid' ? 'sofia' : city.id === 'berlin' ? 'hans' : city.id === 'lisboa' ? 'ana' : 'emma',
        mode: 'travel',
        initialGreeting: `¡Bienvenido a ${city.name} ${city.flag}! Vamos a recorrer ${city.landmarks[0]} y hablar en su idioma.`,
      },
    });
  };

  return (
    <ScreenContainer title="Viaje por el Mundo" scrollable={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🌍</Text>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Aventura por Ciudades</Text>
            <Text style={styles.heroSubtitle}>
              Viaja por capitales del mundo, desbloquea misiones culturales y gana XP hablando con locales.
            </Text>
          </View>
        </View>

        {/* Cities List */}
        <View style={styles.citiesList}>
          {CITIES.map((city) => {
            const isUnlocked = progress.unlockedCities?.includes(city.id) || city.id === 'london' || city.id === 'madrid';
            const requiredXp = city.xpReward;
            const canUnlock = progress.experiencia >= requiredXp;

            return (
              <View key={city.id} style={[styles.cityCard, !isUnlocked && styles.cityCardLocked]}>
                <View style={styles.cityHeader}>
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagEmoji}>{city.flag}</Text>
                    <Text style={styles.cityName}>{city.name}</Text>
                  </View>
                  <View style={styles.xpBadge}>
                    <Text style={styles.xpText}>+{city.xpReward} XP</Text>
                  </View>
                </View>

                <Text style={styles.cityDescription}>{city.description}</Text>

                {/* Landmarks */}
                <View style={styles.landmarksContainer}>
                  <Text style={styles.landmarksLabel}>Lugares emblemáticos:</Text>
                  <View style={styles.landmarksTags}>
                    {city.landmarks.map((landmark, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>📍 {landmark}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Vocabulary Preview */}
                <View style={styles.vocabBox}>
                  <Text style={styles.vocabLabel}>Vocabulario clave:</Text>
                  <Text style={styles.vocabWords}>{city.vocabulary.join(' · ')}</Text>
                </View>

                {isUnlocked ? (
                  <Pressable
                    style={styles.exploreButton}
                    onPress={() => startCityTour(city)}
                    accessibilityRole="button"
                    accessibilityLabel={`Explorar ${city.name}`}
                  >
                    <Text style={styles.exploreText}>🚀 Explorar {city.name}</Text>
                  </Pressable>
                ) : canUnlock ? (
                  <Pressable
                    style={[styles.exploreButton, styles.unlockButton]}
                    onPress={() => unlockCity(city.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Desbloquear ${city.name}`}
                  >
                    <Text style={styles.exploreText}>🔓 Desbloquear Ciudad</Text>
                  </Pressable>
                ) : (
                  <View style={[styles.exploreButton, styles.lockedButton]}>
                    <Text style={styles.lockedText}>🔒 Requiere {requiredXp} XP ({progress.experiencia}/{requiredXp})</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, gap: 16 },
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
  citiesList: { gap: 16 },
  cityCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  cityCardLocked: { opacity: 0.8 },
  cityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flagBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flagEmoji: { fontSize: 28 },
  cityName: { color: AppColors.text, fontSize: 20, fontWeight: '900' },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: { color: AppColors.accentBright, fontSize: 12, fontWeight: '800' },
  cityDescription: { color: AppColors.textMuted, fontSize: 14, lineHeight: 20 },
  landmarksContainer: { gap: 6 },
  landmarksLabel: { color: AppColors.text, fontSize: 12, fontWeight: '800' },
  landmarksTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: AppColors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { color: AppColors.blueLight, fontSize: 12, fontWeight: '700' },
  vocabBox: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 12,
    padding: 10,
    gap: 2,
  },
  vocabLabel: { color: AppColors.textMuted, fontSize: 11, fontWeight: '800' },
  vocabWords: { color: AppColors.text, fontSize: 13, fontWeight: '600' },
  exploreButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  unlockButton: {
    backgroundColor: AppColors.blue,
  },
  lockedButton: {
    backgroundColor: AppColors.surfaceBorder,
  },
  exploreText: { color: AppColors.text, fontWeight: '900', fontSize: 15 },
  lockedText: { color: AppColors.textMuted, fontWeight: '700', fontSize: 13 },
});
