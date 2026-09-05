import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { speakText, stopSpeaking } from '@/services/speech';

interface PronunciationChallenge {
  id: string;
  phrase: string;
  ipa: string;
  translation: string;
  focusPhoneme: string;
  phonemeTip: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
}

const PRONUNCIATION_BANK: Record<string, readonly PronunciationChallenge[]> = {
  en: [
    {
      id: 'en-1',
      phrase: 'Would you like a cup of coffee?',
      ipa: '/wʊd juː laɪk ə kʌp əv ˈkɒfi/',
      translation: '¿Te gustaría una taza de café?',
      focusPhoneme: 'wʊd · ˈkɒfi',
      phonemeTip: 'Redondea los labios para el sonido /w/ sin tocar los dientes superiores.',
      difficulty: 'A1',
    },
    {
      id: 'en-2',
      phrase: 'Thinking through the third option',
      ipa: '/ˈθɪŋkɪŋ θruː ðə θɜːd ˈɒpʃn/',
      translation: 'Pensando en la tercera opción',
      focusPhoneme: 'θ · ð (th fricativo)',
      phonemeTip: 'Coloca la punta de la lengua suavemente entre los dientes para el sonido “th”.',
      difficulty: 'A2',
    },
    {
      id: 'en-3',
      phrase: 'Comfortable and affordable hotel',
      ipa: '/ˈkʌmftəbl ənd əˈfɔːdəbl həʊˈtɛl/',
      translation: 'Hotel cómodo y asequible',
      focusPhoneme: 'ˈkʌmftəbl',
      phonemeTip: 'Acentúa en la primera sílaba: “COMF-ter-bl”, sin pronunciar la “or” intermedia.',
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
      phonemeTip: 'Haz vibrar la punta de la lengua con firmeza contra los alvéolos superiores.',
      difficulty: 'A1',
    },
    {
      id: 'es-2',
      phrase: 'Ayer compramos fruta fresca en la plaza',
      ipa: '/aˈʝeɾ komˈpɾamos ˈfɾuta ˈfɾeska en la ˈplasa/',
      translation: 'Yesterday we bought fresh fruit in the square',
      focusPhoneme: 'fr · pl (grupos consonánticos)',
      phonemeTip: 'Mantén las vocales cerradas y nítidas, sin alargarlas innecesariamente.',
      difficulty: 'A2',
    },
  ],
  fr: [
    {
      id: 'fr-1',
      phrase: 'Bonjour, un café et un croissant, s’il vous plaît',
      ipa: '/bɔ̃.ʒuʁ œ̃ ka.fe e œ̃ kʁwa.sɑ̃ sil vu plɛ/',
      translation: 'Buenos días, un café y un cruasán, por favor',
      focusPhoneme: 'ʁ (r uvular) · œ̃ (nasal)',
      phonemeTip: 'La “r” francesa se articula suavemente en el velo del paladar, no en la punta de la lengua.',
      difficulty: 'A1',
    },
    {
      id: 'fr-2',
      phrase: 'Où se trouve la tour Eiffel ?',
      ipa: '/u sə tʁuv la tuʁ ɛ.fɛl/',
      translation: '¿Dónde se encuentra la torre Eiffel?',
      focusPhoneme: 'u vs y (vocales cerradas)',
      phonemeTip: 'Para /u/ redondea labios hacia adelante como al dar un beso.',
      difficulty: 'A2',
    },
  ],
  it: [
    {
      id: 'it-1',
      phrase: 'Buongiorno, vorrei un cappuccino e un cornetto',
      ipa: '/bwɔnˈdʒorno vorˈrɛi un kapputˈtʃino/',
      translation: 'Buenos días, quisiera un capuchino y un cruasán',
      focusPhoneme: 'gn · cc (dobles)',
      phonemeTip: 'Marca bien la doble consonante manteniendo una ligera tensión antes de soltar el sonido.',
      difficulty: 'A1',
    },
    {
      id: 'it-2',
      phrase: 'La piazza principale è bellissima di sera',
      ipa: '/la ˈpjattsa printʃiˈpale ɛ belˈlissima di ˈseɾa/',
      translation: 'La plaza principal es hermosísima por la tarde',
      focusPhoneme: 'zz (/tts/) · ll',
      phonemeTip: 'Articula la “zz” con fuerza explosiva similar a “ts”.',
      difficulty: 'A2',
    },
  ],
  de: [
    {
      id: 'de-1',
      phrase: 'Ich möchte bitte ein Glas Wasser',
      ipa: '/ɪç ˈmœçtə ˈbɪtə aɪn ɡlaːs ˈvasɐ/',
      translation: 'Quisiera un vaso de agua por favor',
      focusPhoneme: 'ç (ch suave) · œ (ö)',
      phonemeTip: 'Expulsa aire suave como el silbido de un gato para la “ch” después de vocal palatal.',
      difficulty: 'A1',
    },
    {
      id: 'de-2',
      phrase: 'Entschuldigung, wie viel Uhr ist es?',
      ipa: '/ɛntˈʃʊldɪɡʊŋ viː fiːl uːɐ̯ ɪst ɛs/',
      translation: 'Disculpe, ¿qué hora es?',
      focusPhoneme: 'sch (/ʃ/) · w (/v/)',
      phonemeTip: 'La “w” alemana se pronuncia como una “v” labiodental continua.',
      difficulty: 'A2',
    },
  ],
  pt: [
    {
      id: 'pt-1',
      phrase: 'Obrigado pelo café e pelo pão quente',
      ipa: '/oβɾiˈɣaðu ˈpelu kɐˈfɛ i ˈpelu ˈpɐ̃w̃/',
      translation: 'Gracias por el café y el pan caliente',
      focusPhoneme: 'ão (diptongo nasal)',
      phonemeTip: 'Deja escapar el aire simultáneamente por la boca y la nariz al pronunciar “ão”.',
      difficulty: 'A1',
    },
  ],
  eu: [
    {
      id: 'eu-1',
      phrase: 'Egun on, kafe bat esnearekin mesedez',
      ipa: '/eɣun on, kafe bat esne.a.rekin mesedes/',
      translation: 'Buenos días, un café con leche por favor',
      focusPhoneme: 'ts vs tz vs tx',
      phonemeTip: 'Diferencia el sonido africado /ts/ del dorsal /tz/ y el palatal /tx/.',
      difficulty: 'A1',
    },
  ],
  ca: [
    {
      id: 'ca-1',
      phrase: 'Bon dia, voldria un cafè amb llet, si us plau',
      ipa: '/bɔn ˈdi.ə, vulˈdɾi.ə uŋ kəˈfɛ əm ˈʎet, siws ˈplaw/',
      translation: 'Buenos días, querría un café con leche, por favor',
      focusPhoneme: 'll (/ʎ/) · vocal neutra (/ə/)',
      phonemeTip: 'La vocal neutra relajada /ə/ se articula en el centro de la boca.',
      difficulty: 'A1',
    },
  ],
};

export function PronunciationScreen() {
  const { progress, addExperience, recordSpeakingPractice, recordListeningPractice } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiced, setPracticed] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<0.5 | 0.85 | 1.2>(0.85);

  const challenges = PRONUNCIATION_BANK[progress.idiomaObjetivo] ?? PRONUNCIATION_BANK.en;
  const current = challenges[currentIndex % challenges.length];

  const handleListen = (speed: 0.5 | 0.85 | 1.2) => {
    setSelectedSpeed(speed);
    stopSpeaking();
    speakText(current.phrase, { language: progress.idiomaObjetivo, rate: speed });
    recordListeningPractice();
  };

  const handleRecordSelfPractice = () => {
    setPracticed(true);
    recordSpeakingPractice();
    addExperience(15);
  };

  const handleNext = () => {
    stopSpeaking();
    setPracticed(false);
    setCurrentIndex((prev) => (prev + 1) % challenges.length);
  };

  return (
    <ScreenContainer title="Estudio de Pronunciación">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Hero */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>🎙️</Text>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Laboratorio Fonético</Text>
            <Text style={styles.bannerSubtitle}>
              Entrena la colocación de la lengua, respiración y ritmo con transcripción fonética internacional (IPA).
            </Text>
          </View>
        </View>

        {/* Challenge Card */}
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
          <Text style={styles.translationText}>{`"${current.translation}"`}</Text>

          {/* Speed Selectors */}
          <Text style={styles.speedLabel}>Escucha con atención:</Text>
          <View style={styles.speedButtonsRow}>
            <Pressable
              style={[styles.speedButton, selectedSpeed === 0.5 && styles.speedButtonActive]}
              onPress={() => handleListen(0.5)}
            >
              <Text style={[styles.speedButtonText, selectedSpeed === 0.5 && styles.speedButtonTextActive]}>
                🐢 Lenta (0.5x)
              </Text>
            </Pressable>
            <Pressable
              style={[styles.speedButton, selectedSpeed === 0.85 && styles.speedButtonActive]}
              onPress={() => handleListen(0.85)}
            >
              <Text style={[styles.speedButtonText, selectedSpeed === 0.85 && styles.speedButtonTextActive]}>
                🦊 Normal (0.85x)
              </Text>
            </Pressable>
            <Pressable
              style={[styles.speedButton, selectedSpeed === 1.2 && styles.speedButtonActive]}
              onPress={() => handleListen(1.2)}
            >
              <Text style={[styles.speedButtonText, selectedSpeed === 1.2 && styles.speedButtonTextActive]}>
                ⚡ Natural (1.2x)
              </Text>
            </Pressable>
          </View>

          {/* Phonetic Tip Box */}
          <View style={styles.tipBox}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>👄</Text>
              <Text style={styles.tipTitle}>Clave Articulatoria: {current.focusPhoneme}</Text>
            </View>
            <Text style={styles.tipBody}>{current.phonemeTip}</Text>
          </View>

          {/* Practice Action */}
          <View style={styles.practiceSection}>
            <Pressable
              style={[styles.practiceButton, practiced && styles.practiceButtonDone]}
              onPress={handleRecordSelfPractice}
            >
              <Text style={styles.practiceButtonText}>
                {practiced ? '✅ ¡Frase practicada! (+15 XP)' : '🗣️ He practicado en voz alta'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable
            style={styles.navSecondaryButton}
            onPress={() => {
              stopSpeaking();
              setCurrentIndex((prev) => (prev > 0 ? prev - 1 : challenges.length - 1));
            }}
          >
            <Text style={styles.navSecondaryText}>‹ Anterior</Text>
          </Pressable>
          <Pressable style={styles.navPrimaryButton} onPress={handleNext}>
            <Text style={styles.navPrimaryText}>Siguiente Reto ›</Text>
          </Pressable>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    gap: 14,
  },
  bannerIcon: {
    fontSize: 28,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: AppColors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: AppColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    backgroundColor: '#3B82F620',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#3B82F6',
    fontWeight: '900',
    fontSize: 12,
  },
  counterText: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  phraseText: {
    color: AppColors.text,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginTop: 4,
  },
  ipaText: {
    color: AppColors.primary,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  translationText: {
    color: AppColors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  speedLabel: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  speedButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speedButton: {
    flex: 1,
    backgroundColor: AppColors.surfaceRaised,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  speedButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  speedButtonText: {
    color: AppColors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  tipBox: {
    backgroundColor: '#F59E0B15',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F59E0B30',
    marginTop: 6,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipIcon: {
    fontSize: 16,
  },
  tipTitle: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '900',
  },
  tipBody: {
    color: AppColors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  practiceSection: {
    marginTop: 10,
  },
  practiceButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceButtonDone: {
    backgroundColor: '#10B981',
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navSecondaryButton: {
    flex: 1,
    backgroundColor: AppColors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  navSecondaryText: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  navPrimaryButton: {
    flex: 2,
    backgroundColor: AppColors.surfaceRaised,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  navPrimaryText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '900',
  },
});
