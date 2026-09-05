import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { speakText } from '@/services/speech';

interface PronunciationChallenge {
  id: string;
  phrase: string;
  ipa: string;
  translation: string;
  focusPhoneme: string;
  phonemeTip: string;
  difficulty: 'A1' | 'A2' | 'B1';
}

const PRONUNCIATION_BANK: Record<string, readonly PronunciationChallenge[]> = {
  en: [
    {
      id: 'en-1',
      phrase: 'Would you like a cup of coffee?',
      ipa: '/wʊd juː laɪk ə kʌp əv ˈkɒfi/',
      translation: '¿Te gustaría una taza de café?',
      focusPhoneme: 'wʊd · ˈkɒfi',
      phonemeTip: 'Redondea los labios para el sonido /w/ sin tocar los dientes.',
      difficulty: 'A1',
    },
    {
      id: 'en-2',
      phrase: 'Thinking through the third option',
      ipa: '/ˈθɪŋkɪŋ θruː ðə θɜːd ˈɒpʃn/',
      translation: 'Pensando en la tercera opción',
      focusPhoneme: 'θ · ð (th)',
      phonemeTip: 'Coloca la punta de la lengua suavemente entre los dientes para el sonido “th”.',
      difficulty: 'A2',
    },
    {
      id: 'en-3',
      phrase: 'Comfortable and affordable hotel',
      ipa: '/ˈkʌmftəbl ənd əˈfɔːdəbl həʊˈtɛl/',
      translation: 'Hotel cómodo y asequible',
      focusPhoneme: 'ˈkʌmftəbl',
      phonemeTip: 'Atención al acento: “COMF-ter-bl”, no pronuncies la “or” intermedia.',
      difficulty: 'B1',
    },
  ],
  es: [
    {
      id: 'es-1',
      phrase: 'El perro corre rápido por el parque',
      ipa: '/el ˈpero ˈkore ˈrapido poɾ el ˈpaɾke/',
      translation: 'The dog runs fast through the park',
      focusPhoneme: 'rr (vibrante múltiple)',
      phonemeTip: 'Haz vibrar la punta de la lengua contra el paladar superior.',
      difficulty: 'A1',
    },
  ],
  it: [
    {
      id: 'it-1',
      phrase: 'Buongiorno, vorrei un cappuccino e un cornetto',
      ipa: '/bwɔnˈdʒorno vorˈrɛi un kapputˈtʃino/',
      translation: 'Buenos días, quisiera un capuchino y un cruasán',
      focusPhoneme: 'gn · cc (dobles)',
      phonemeTip: 'Marca bien la doble consonante manteniendo un breve silencio antes de soltar el sonido.',
      difficulty: 'A1',
    },
  ],
  de: [
    {
      id: 'de-1',
      phrase: 'Ich möchte bitte ein Glas Wasser',
      ipa: '/ɪç ˈmœçtə ˈbɪtə aɪn ɡlaːs ˈvasɐ/',
      translation: 'Quisiera un vaso de agua por favor',
      focusPhoneme: 'ç (ch suave) · œ (ö)',
      phonemeTip: 'Expulsa aire suave como el silbido de un gato para la “ch” después de vocal anterior.',
      difficulty: 'A1',
    },
  ],
  pt: [
    {
      id: 'pt-1',
      phrase: 'Obrigado pelo café e pelo pão quente',
      ipa: '/oβɾiˈɣaðu ˈpelu kɐˈfɛ i ˈpelu ˈpɐ̃w̃/',
      translation: 'Gracias por el café y el pan caliente',
      focusPhoneme: 'ão (nasal)',
      phonemeTip: 'Deja escapar el aire simultáneamente por la boca y la nariz al pronunciar “ão”.',
      difficulty: 'A1',
    },
  ],
};

type FeedbackState = 'idle' | 'recording' | 'correct' | 'almost' | 'improve';

export function PronunciationScreen() {
  const { progress, addExperience, incrementSpokenPhrases } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [score, setScore] = useState<number | null>(null);

  const challenges = PRONUNCIATION_BANK[progress.idiomaObjetivo] ?? PRONUNCIATION_BANK.en;
  const current = challenges[currentIndex % challenges.length];

  const handleListen = (speed: number = 0.85) => {
    speakText(current.phrase, { language: progress.idiomaObjetivo, rate: speed });
  };

  const handleRecord = () => {
    setFeedback('recording');
    setTimeout(() => {
      // Simulación de análisis fonético inteligente
      const randomScore = Math.floor(Math.random() * 20) + 82; // 82 - 100%
      setScore(randomScore);
      incrementSpokenPhrases();
      addExperience(15);

      if (randomScore >= 90) {
        setFeedback('correct');
      } else if (randomScore >= 75) {
        setFeedback('almost');
      } else {
        setFeedback('improve');
      }
    }, 1500);
  };

  const handleNext = () => {
    setFeedback('idle');
    setScore(null);
    setCurrentIndex((prev) => (prev + 1) % challenges.length);
  };

  return (
    <ScreenContainer title="Estudio de Pronunciación">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Challenge Header Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{current.difficulty}</Text>
            </View>
            <Text style={styles.counterText}>
              Reto {currentIndex + 1} de {challenges.length}
            </Text>
          </View>

          <Text style={styles.phraseText}>{current.phrase}</Text>
          <Text style={styles.ipaText}>{current.ipa}</Text>
          <Text style={styles.translationText}>🌐 {current.translation}</Text>

          {/* Listen Buttons */}
          <View style={styles.listenRow}>
            <Pressable style={styles.listenBtn} onPress={() => handleListen(0.85)}>
              <Text style={styles.listenIcon}>🔊</Text>
              <Text style={styles.listenText}>Escuchar normal</Text>
            </Pressable>
            <Pressable style={[styles.listenBtn, styles.slowBtn]} onPress={() => handleListen(0.55)}>
              <Text style={styles.listenIcon}>🐢</Text>
              <Text style={styles.listenText}>Escuchar lento</Text>
            </Pressable>
          </View>
        </View>

        {/* Phonetic Tip Box */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipTitle}>Sonido clave: {current.focusPhoneme}</Text>
          </View>
          <Text style={styles.tipDesc}>{current.phonemeTip}</Text>
        </View>

        {/* Recording Visualizer & Button */}
        <View style={styles.recordSection}>
          {feedback === 'recording' ? (
            <View style={styles.waveBox}>
              <Text style={styles.waveText}>🎙️ Escuchando tu voz...</Text>
              <View style={styles.waves}>
                <View style={[styles.waveBar, { height: 20 }]} />
                <View style={[styles.waveBar, { height: 35 }]} />
                <View style={[styles.waveBar, { height: 50 }]} />
                <View style={[styles.waveBar, { height: 30 }]} />
                <View style={[styles.waveBar, { height: 45 }]} />
                <View style={[styles.waveBar, { height: 25 }]} />
              </View>
            </View>
          ) : (
            <Pressable style={styles.micButton} onPress={handleRecord}>
              <Text style={styles.micEmoji}>🎙️</Text>
              <Text style={styles.micLabel}>Toca para pronunciar</Text>
            </Pressable>
          )}
        </View>

        {/* Result & Feedback Card */}
        {feedback !== 'idle' && feedback !== 'recording' && (
          <View
            style={[
              styles.feedbackCard,
              feedback === 'correct'
                ? styles.feedbackSuccess
                : feedback === 'almost'
                ? styles.feedbackWarning
                : styles.feedbackDanger,
            ]}
          >
            <View style={styles.feedbackHeader}>
              <Text style={styles.feedbackEmoji}>
                {feedback === 'correct' ? '🦊🎉' : feedback === 'almost' ? '🦊👍' : '🦊💪'}
              </Text>
              <View>
                <Text style={styles.feedbackTitle}>
                  {feedback === 'correct'
                    ? '¡Excelente pronunciación!'
                    : feedback === 'almost'
                    ? '¡Casi perfecto!'
                    : '¡Sigue intentándolo!'}
                </Text>
                <Text style={styles.feedbackScore}>Puntuación fonética: {score}% · +15 XP</Text>
              </View>
            </View>

            <Text style={styles.feedbackAdvice}>
              {feedback === 'correct'
                ? 'Tu entonación y ritmo han sido naturales y claros.'
                : 'Buen intento. Recuerda prestar atención a la colocación de la lengua en el sonido clave.'}
            </Text>

            <View style={styles.actionRow}>
              <Pressable style={styles.retryBtn} onPress={handleRecord}>
                <Text style={styles.retryText}>🔁 Repetir</Text>
              </Pressable>
              <Pressable style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextText}>Siguiente frase ➔</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Back to Home CTA */}
        <Pressable style={styles.chatLinkBtn} onPress={() => router.push('/chat')}>
          <Text style={styles.chatLinkText}>💬 Practicar en una conversación real</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, gap: 16 },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: { color: AppColors.blueLight, fontSize: 12, fontWeight: '800' },
  counterText: { color: AppColors.textMuted, fontSize: 12, fontWeight: '700' },
  phraseText: {
    color: AppColors.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 4,
  },
  ipaText: { color: AppColors.primaryBright, fontSize: 15, fontWeight: '700', fontStyle: 'italic' },
  translationText: { color: AppColors.textMuted, fontSize: 14, textAlign: 'center' },
  listenRow: { flexDirection: 'row', gap: 10, marginTop: 8, width: '100%' },
  listenBtn: {
    flex: 1,
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  slowBtn: { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' },
  listenIcon: { fontSize: 18 },
  listenText: { color: AppColors.text, fontWeight: '800', fontSize: 13 },
  tipCard: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 18,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipIcon: { fontSize: 20 },
  tipTitle: { color: AppColors.accentBright, fontSize: 14, fontWeight: '800' },
  tipDesc: { color: AppColors.textMuted, fontSize: 13, lineHeight: 19 },
  recordSection: { alignItems: 'center', marginVertical: 8 },
  micButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 6,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  micEmoji: { fontSize: 36 },
  micLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  waveBox: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    gap: 12,
    borderWidth: 1,
    borderColor: AppColors.danger,
  },
  waveText: { color: AppColors.danger, fontSize: 15, fontWeight: '800' },
  waves: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 50 },
  waveBar: { width: 8, backgroundColor: AppColors.danger, borderRadius: 4 },
  feedbackCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
  },
  feedbackSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: AppColors.success },
  feedbackWarning: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: AppColors.accent },
  feedbackDanger: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: AppColors.danger },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feedbackEmoji: { fontSize: 36 },
  feedbackTitle: { color: AppColors.text, fontSize: 17, fontWeight: '900' },
  feedbackScore: { color: AppColors.primaryBright, fontSize: 13, fontWeight: '800' },
  feedbackAdvice: { color: AppColors.textMuted, fontSize: 13, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  retryBtn: {
    flex: 1,
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryText: { color: AppColors.text, fontWeight: '800', fontSize: 14 },
  nextBtn: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextText: { color: AppColors.text, fontWeight: '900', fontSize: 14 },
  chatLinkBtn: { paddingVertical: 12, alignItems: 'center' },
  chatLinkText: { color: AppColors.blueLight, fontSize: 14, fontWeight: '800' },
});
