import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { KIDS_TOPICS, type KidsTopic } from '@/data/kids-content';
import { speakText } from '@/services/speech';
import { useProgress } from '@/hooks/use-progress';

export function KidsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, addExperience, incrementSpokenPhrases } = useProgress();

  const [selectedTopic, setSelectedTopic] = useState<KidsTopic>(KIDS_TOPICS[0]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeItem = selectedTopic.items[activeItemIndex] ?? selectedTopic.items[0];

  const playWordAudio = (word: string) => {
    speakText(word, { language: progress.idiomaObjetivo ?? 'en', rate: 0.75 });
    incrementSpokenPhrases();
  };

  const nextCard = () => {
    playWordAudio(activeItem.en);
    setStarsEarned((prev) => prev + 1);
    addExperience(5);
    setFeedback('¡Genial! ⭐ +5 XP');
    setTimeout(() => setFeedback(null), 2000);

    setActiveItemIndex((prev) => (prev + 1) % selectedTopic.items.length);
  };

  return (
    <ScreenContainer title="LinguaFox Kids 🦊">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Kids Banner */}
        <View style={styles.kidsHeaderCard}>
          <View style={styles.kidsHeaderLeft}>
            <Text style={styles.kidsMascot}>🦊✨</Text>
            <View style={styles.kidsHeaderText}>
              <Text style={styles.kidsTitle}>¡Aprende Jugando!</Text>
              <Text style={styles.kidsSubtitle}>Toca, escucha y repite</Text>
            </View>
          </View>
          <View style={styles.starsPill} accessibilityLabel={`${starsEarned} estrellas ganadas hoy`}>
            <Text style={styles.starsPillText}>⭐ {starsEarned}</Text>
          </View>
        </View>

        {/* Topic Selector Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicsRow}>
          {KIDS_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopic.id;
            return (
              <Pressable
                key={topic.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Tema infantil: ${topic.title}`}
                style={[
                  styles.topicButton,
                  { backgroundColor: isSelected ? topic.color : colors.surfaceRaised },
                ]}
                onPress={() => {
                  setSelectedTopic(topic);
                  setActiveItemIndex(0);
                }}
              >
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <Text style={[styles.topicText, isSelected && styles.topicTextActive]}>
                  {topic.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Big Interactive Kids Flashcard */}
        <View
          style={[styles.bigCard, { borderColor: selectedTopic.color }]}
          accessible={true}
          accessibilityLabel={`Palabra: ${activeItem.en}, significa ${activeItem.es}, pronunciación ${activeItem.phonetic}`}
        >
          <Text style={styles.cardEmoji}>{activeItem.emoji}</Text>
          <Text style={styles.cardWordEn}>{activeItem.en}</Text>
          <Text style={styles.cardPhonetic}>/{activeItem.phonetic}/</Text>
          <Text style={styles.cardWordEs}>{activeItem.es}</Text>

          {/* Audio & Repeat Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Escuchar pronunciación de ${activeItem.en}`}
            accessibilityHint="Reproduce la pronunciación nativa a velocidad adaptada para niños"
            style={[styles.bigAudioBtn, { backgroundColor: selectedTopic.color }]}
            onPress={() => playWordAudio(activeItem.en)}
          >
            <Text style={styles.bigAudioBtnText}>🔊 Escuchar Pronunciación</Text>
          </Pressable>
        </View>

        {feedback && (
          <View style={styles.feedbackBanner} accessibilityLiveRegion="polite">
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        {/* Big Next Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Siguiente palabra"
          style={({ pressed }) => [styles.nextCardBtn, pressed && styles.pressed]}
          onPress={nextCard}
        >
          <Text style={styles.nextCardBtnText}>Siguiente Palabra ➔</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver al menú principal"
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Volver al Menú Principal</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingBottom: 40, gap: 14 },
    kidsHeaderCard: {
      backgroundColor: '#3B1E08',
      borderRadius: 22,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 2,
      borderColor: AppColors.primary,
    },
    kidsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    kidsMascot: { fontSize: 36 },
    kidsHeaderText: { gap: 2 },
    kidsTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
    kidsSubtitle: { color: '#FED7AA', fontSize: 12, fontWeight: '700' },
    starsPill: {
      backgroundColor: '#7C2D12',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 99,
    },
    starsPillText: { color: '#FDE047', fontSize: 14, fontWeight: '900' },
    topicsRow: { gap: 10, paddingVertical: 4 },
    topicButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 99,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    topicIcon: { fontSize: 20 },
    topicText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
    topicTextActive: { color: '#FFFFFF' },
    bigCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 28,
      padding: 28,
      alignItems: 'center',
      borderWidth: 3,
      gap: 10,
      marginTop: 4,
    },
    cardEmoji: { fontSize: 80, marginVertical: 8 },
    cardWordEn: { color: colors.text, fontSize: 36, fontWeight: '900' },
    cardPhonetic: { color: AppColors.primaryBright, fontSize: 16, fontWeight: '700' },
    cardWordEs: { color: colors.textMuted, fontSize: 18, fontWeight: '700' },
    bigAudioBtn: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: 18,
      alignItems: 'center',
      marginTop: 10,
    },
    bigAudioBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
    feedbackBanner: {
      backgroundColor: '#065F46',
      padding: 12,
      borderRadius: 14,
      alignItems: 'center',
    },
    feedbackText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    nextCardBtn: {
      backgroundColor: AppColors.primary,
      paddingVertical: 16,
      borderRadius: 20,
      alignItems: 'center',
      marginTop: 4,
    },
    nextCardBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
    backButton: { alignItems: 'center', paddingVertical: 12 },
    backText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
    pressed: { opacity: 0.8 },
  });
}
