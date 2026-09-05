import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { getLessonsByLanguage } from '@/data/lessons';
import type { LanguageCode } from '@/types/learning';

const COVER_IMAGE = require('../../../assets/images/linguafox-official-cover.png');

const STEPS = [
  'Bienvenido a LinguaFox 🦊',
  'Practica con lecciones, audio y quizzes',
  'Habla con Fox y personajes originales',
  'Elige tu idioma'
];

const OPTIONS: readonly { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'Inglés', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Francés', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Alemán', flag: '🇩🇪' },
  { code: 'pt', label: 'Portugués', flag: '🇵🇹' },
  { code: 'eu', label: 'Euskera', flag: '🟢' },
  { code: 'ca', label: 'Catalán', flag: '🟡' },
];

export function OnboardingScreen() {
  const { completeOnboarding, setLanguages } = useProgress();
  const [step, setStep] = useState(0);
  const [nativo, setNativo] = useState<LanguageCode>('es');
  const [objetivo, setObjetivo] = useState<LanguageCode>('en');

  const finish = (): void => {
    const availableLessons = getLessonsByLanguage(objetivo);
    if (!availableLessons || availableLessons.length === 0) return;
    setLanguages(nativo, objetivo);
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.coverContainer}>
          <Image source={COVER_IMAGE} style={s.coverBanner} contentFit="contain" />
        </View>
        <Text style={s.title}>{STEPS[step]}</Text>

        {step === 3 ? (
          <View style={s.optionsContainer}>
            <Text style={s.sectionTitle}>Mi idioma nativo es:</Text>
            <View style={s.grid}>
              {OPTIONS.map(option => (
                <Pressable
                  key={`nativo-${option.code}`}
                  style={[s.option, s.optionNative, nativo === option.code && s.selected]}
                  onPress={() => setNativo(option.code)}
                >
                  <Text style={s.flag}>{option.flag}</Text>
                  <Text style={s.label}>{option.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.sectionTitle}>Quiero aprender:</Text>
            <View style={s.grid}>
              {OPTIONS.map(option => {
                const hasContent = getLessonsByLanguage(option.code).length > 0;
                return (
                  <Pressable
                    key={`objetivo-${option.code}`}
                    style={[s.option, s.optionObjective, objetivo === option.code && s.selected, !hasContent && s.disabledOption]}
                    onPress={() => hasContent && setObjetivo(option.code)}
                  >
                    <Text style={[s.flag, !hasContent && s.disabledText]}>{option.flag}</Text>
                    <View style={s.labelContainer}>
                      <Text style={[s.label, !hasContent && s.disabledText]}>{option.label}</Text>
                      {!hasContent && <Text style={s.comingSoon}>Próximamente</Text>}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : (
          <Text style={s.copy}>
            {step === 0 ? 'Aprende a tu ritmo, gana estrellas y mantén tu racha.'
              : step === 1 ? 'Escucha la pronunciación y repasa con feedback inmediato.'
              : 'Conversaciones guiadas y divertidas, sin presión.'}
          </Text>
        )}

        <Pressable style={s.button} onPress={step === 3 ? finish : () => setStep(value => value + 1)}>
          <Text style={s.buttonText}>{step === 3 ? 'Empezar' : 'Siguiente'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  page: { padding: 28, alignItems: 'center', justifyContent: 'center', gap: 20, maxWidth: 600, width: '100%', alignSelf: 'center', minHeight: '100%' },
  coverContainer: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', backgroundColor: AppColors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  coverBanner: { width: '100%', height: '100%' },
  title: { color: AppColors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  copy: { color: AppColors.textMuted, fontSize: 17, textAlign: 'center', lineHeight: 25 },
  optionsContainer: { width: '100%', gap: 15 },
  sectionTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  option: { backgroundColor: AppColors.surface, borderRadius: 14, padding: 12, alignItems: 'center', flexDirection: 'row', gap: 6 },
  optionNative: { width: '45%' },
  optionObjective: { width: '45%' },
  selected: { borderColor: AppColors.primary, borderWidth: 2 },
  disabledOption: { opacity: 0.6 },
  flag: { fontSize: 24 },
  labelContainer: { flex: 1 },
  label: { color: AppColors.text, fontWeight: '800', fontSize: 16 },
  disabledText: { opacity: 0.7 },
  comingSoon: { color: AppColors.primaryBright, fontSize: 11, fontWeight: '800', marginTop: 2 },
  button: { backgroundColor: AppColors.primary, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', marginTop: 12 },
  buttonText: { color: AppColors.text, fontWeight: '900', fontSize: 16 }
});
