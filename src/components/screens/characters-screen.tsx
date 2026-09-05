import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { CHARACTERS } from '@/data/characters';
import type { Character } from '@/types/learning';

type FilterTab = 'all' | 'nativ' | 'roleplay' | 'classic';

export function CharactersScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredCharacters = CHARACTERS.filter((c: Character) => {
    if (activeTab === 'nativ') return ['emma', 'luca', 'sofia', 'hans', 'ana'].includes(c.id);
    if (activeTab === 'roleplay') return ['camarero', 'recepcionista', 'entrevistador'].includes(c.id);
    if (activeTab === 'classic') return ['buho-sabio', 'leyenda-balon', 'chef-viajero', 'astronauta', 'pirata', 'detective'].includes(c.id);
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹ Volver</Text>
          </Pressable>
          <Text style={styles.title}>Personajes de Práctica</Text>
          <Text style={styles.subtitle}>
            Conversa con nativos, profesionales y profesores IA para mejorar tu expresión oral.
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.tabRow}>
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'nativ', label: 'Amigos Nativos 🌍' },
              { id: 'roleplay', label: 'Roleplay 💼' },
              { id: 'classic', label: 'Aventuras 🚀' },
            ] as { id: FilterTab; label: string }[]
          ).map((tab) => (
            <Pressable
              key={tab.id}
              style={[styles.tabPill, activeTab === tab.id && styles.tabPillActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Character Grid */}
        <View style={styles.grid}>
          {filteredCharacters.map((character) => (
            <Pressable
              key={character.id}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => router.push(`/character/${character.id}`)}
            >
              <View style={styles.cardTop}>
                <Text style={styles.avatar}>{character.avatar}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {character.difficulty === 'facil' ? 'A1 Fácil' : 'A2/B1 Medio'}
                  </Text>
                </View>
              </View>

              <Text style={styles.name}>{character.name}</Text>
              {character.roleTitle && (
                <Text style={styles.roleTitle}>{character.roleTitle}</Text>
              )}
              <Text style={styles.topic}>{character.vocabularyFocus}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.chatLink}>💬 Charlar ›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  content: { padding: 20, paddingBottom: 48, maxWidth: 720, width: '100%', alignSelf: 'center', gap: 16 },
  header: { gap: 6 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  backText: { color: AppColors.primaryBright, fontWeight: '800', fontSize: 15 },
  title: { color: AppColors.text, fontSize: 26, fontWeight: '900' },
  subtitle: { color: AppColors.textMuted, fontSize: 13, lineHeight: 18 },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tabPill: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  tabPillActive: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  tabText: { color: AppColors.textMuted, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: AppColors.text, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    gap: 4,
    justifyContent: 'space-between',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  avatar: { fontSize: 38 },
  badge: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: AppColors.blueLight, fontSize: 10, fontWeight: '800' },
  name: { color: AppColors.text, fontSize: 16, fontWeight: '900', marginTop: 4 },
  roleTitle: { color: AppColors.primaryBright, fontSize: 11, fontWeight: '700' },
  topic: { color: AppColors.textMuted, fontSize: 12, lineHeight: 16, flex: 1, marginTop: 2 },
  cardFooter: { marginTop: 8 },
  chatLink: { color: AppColors.primaryBright, fontSize: 13, fontWeight: '800' },
  pressed: { opacity: 0.8 },
});
