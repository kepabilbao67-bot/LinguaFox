import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { getLessonsByLanguage } from '@/data/lessons';
import type { LanguageCode } from '@/types/learning';

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

export function LanguageScreen() {
  const { progress, setLanguages } = useProgress();
  const [nativo, setNativo] = useState<LanguageCode>(progress.idiomaNativo);
  const [objetivo, setObjetivo] = useState<LanguageCode>(progress.idiomaObjetivo);

  const save = () => {
    const lessons = getLessonsByLanguage(objetivo);
    if (!lessons || lessons.length === 0) return;
    setLanguages(nativo, objetivo);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>
        <Text style={styles.title}>Idiomas</Text>
        <Text style={styles.subtitle}>Tu progreso se guarda por separado para cada idioma.</Text>

        <Text style={styles.sectionTitle}>Hablo (Nativo):</Text>
        <View style={styles.grid}>
          {OPTIONS.map(option => (
            <Pressable
              key={`nativo-${option.code}`}
              style={[styles.option, nativo === option.code && styles.selected]}
              onPress={() => setNativo(option.code)}
              accessibilityRole="button"
              accessibilityLabel={`Idioma nativo: ${option.label}${nativo === option.code ? ', seleccionado' : ''}`}
            >
              <Text style={styles.flag}>{option.flag}</Text>
              <Text style={styles.label}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quiero aprender:</Text>
        <View style={styles.grid}>
          {OPTIONS.map(option => {
            const hasContent = getLessonsByLanguage(option.code).length > 0;
            return (
              <Pressable
                key={`objetivo-${option.code}`}
                style={[styles.option, objetivo === option.code && styles.selected, !hasContent && styles.disabledOption]}
                onPress={() => hasContent && setObjetivo(option.code)}
                accessibilityRole="button"
                accessibilityLabel={`Aprender: ${option.label}${objetivo === option.code ? ', seleccionado' : ''}${!hasContent ? ', próximamente' : ''}`}
                disabled={!hasContent}
              >
                <Text style={[styles.flag, !hasContent && styles.disabledText]}>{option.flag}</Text>
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, !hasContent && styles.disabledText]}>{option.label}</Text>
                  {!hasContent && <Text style={styles.comingSoon}>Próximamente</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  page: { padding: 20, gap: 14, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  back: { color: AppColors.primaryBright, fontWeight: '800' },
  title: { color: AppColors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: AppColors.textMuted, marginBottom: 12 },
  sectionTitle: { color: AppColors.text, fontSize: 20, fontWeight: '800', marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { backgroundColor: AppColors.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, width: '48%' },
  selected: { borderWidth: 2, borderColor: AppColors.primary },
  disabledOption: { opacity: 0.6 },
  flag: { fontSize: 24 },
  labelContainer: { flex: 1 },
  label: { color: AppColors.text, fontSize: 16, fontWeight: '800' },
  disabledText: { opacity: 0.7 },
  comingSoon: { color: AppColors.primaryBright, fontSize: 11, fontWeight: '800', marginTop: 2 },
  saveButton: { backgroundColor: AppColors.primary, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: AppColors.text, fontWeight: '900', fontSize: 18 }
});
