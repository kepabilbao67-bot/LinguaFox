import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { getLessonsByLanguage, getProgressKey } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';
import { levelFromXp, xpIntoLevel } from '@/utils/rewards';
import { ACHIEVEMENTS } from '@/data/achievements';

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated, latestAchievementId } = useProgress();
  const [toast, setToast] = useState<string | null>(null);
  useEffect(()=>{if(!latestAchievementId)return;const title=ACHIEVEMENTS.find(a=>a.id===latestAchievementId)?.titulo;const timer=setTimeout(()=>{setToast(title ?? null);setTimeout(()=>setToast(null),3500);},0);return()=>clearTimeout(timer);},[latestAchievementId]);
  const lessons = getLessonsByLanguage(progress.idioma);

  return (
    <ScreenContainer title="LinguaFox" isLoading={!isHydrated}>
      <Text style={styles.subtitle}>Aprende inglés paso a paso</Text>
      <Pressable style={styles.languageButton} onPress={() => router.push('/language')}><Text style={styles.languageText}>{progress.idioma === 'fr' ? '🇫🇷 Francés' : '🇬🇧 Inglés'} · Cambiar</Text></Pressable>
      <View style={styles.starsSummary} accessibilityLabel={`${progress.estrellas} estrellas totales`}>
        <Text style={styles.starsIcon}>★</Text>
        <View>
          <Text style={styles.starsTotal}>{progress.estrellas}</Text>
          <Text style={styles.starsLabel}>estrellas conseguidas</Text>
        </View>
      </View>
      {toast?<View style={styles.toast}><Text style={styles.toastText}>🏆 Logro desbloqueado: {toast}</Text></View>:null}
      <Pressable style={styles.achievementsButton} onPress={()=>router.push('/achievements')}><Text style={styles.languageText}>🏆 Ver logros</Text></Pressable>
      <View style={styles.gameRow}><Text style={styles.gameText}>🔥 {progress.rachaActual} días</Text><Text style={styles.gameText}>Nivel {levelFromXp(progress.experiencia)} · {xpIntoLevel(progress.experiencia)}/100 XP</Text></View>
      <Pressable
        style={({ pressed }) => [styles.tutorCard, pressed && styles.pressed]}
        onPress={() => router.push('/chat')}>
        <Text style={styles.tutorAvatar}>🦊</Text>
        <View style={styles.tutorCopy}>
          <Text style={styles.tutorTitle}>Charlar con el tutor</Text>
          <Text style={styles.tutorDescription}>Practica inglés con Fox en una conversación guiada.</Text>
        </View>
        <Text style={styles.tutorArrow}>›</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.charactersCard, pressed && styles.pressed]}
        onPress={() => router.push('/characters')}>
        <Text style={styles.tutorAvatar}>🦸</Text>
        <View style={styles.tutorCopy}>
          <Text style={styles.tutorTitle}>Charlar con personajes</Text>
          <Text style={styles.tutorDescription}>Practica con aventuras, comida, deporte y más.</Text>
        </View>
        <Text style={styles.tutorArrow}>›</Text>
      </Pressable>
      {lessons.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No hay lecciones disponibles</Text>
          <Text style={styles.description}>Prueba de nuevo más tarde.</Text>
        </View>
      ) : (
        lessons.map((lesson) => {
          const progressKey = getProgressKey(lesson.language, lesson.id);
          const isCompleted = progress.leccionesCompletadas.includes(progressKey);
          const bestStars = progress.mejoresEstrellasPorLeccion[progressKey] ?? 0;
          const bestScore = progress.mejorPuntuacionPorLeccion[progressKey];

          return (
          <View key={lesson.id} style={[styles.card, isCompleted && styles.completedCard]}>
            <View style={styles.lessonHeader}>
              <Text style={styles.cardTitle}>{lesson.title}</Text>
              <View style={[styles.statusBadge, isCompleted && styles.completedBadge]}>
                <Text style={styles.statusText}>{isCompleted ? '✓ Completada' : 'Pendiente'}</Text>
              </View>
            </View>
            <Text style={styles.description}>{lesson.description}</Text>
            <View style={styles.lessonStats}>
              <Text style={styles.lessonStars} accessibilityLabel={`${bestStars} de 3 estrellas`}>
                {Array.from({ length: 3 }, (_, index) => (index < bestStars ? '★' : '☆')).join(' ')}
              </Text>
              <Text style={styles.bestScore}>
                {bestScore === undefined
                  ? 'Sin intentos'
                  : `Mejor: ${bestScore}/${lesson.words.length}`}
              </Text>
            </View>
            <View style={styles.row}>
              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={() => router.push(`/lesson/${lesson.id}`)}>
                <Text style={styles.buttonText}>Aprender</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.quizButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => router.push(`/quiz/${lesson.id}`)}>
                <Text style={styles.buttonText}>Quiz</Text>
              </Pressable>
            </View>
          </View>
          );
        })
      )}
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) { return StyleSheet.create({
  subtitle: { color: colors.textMuted, textAlign: 'center', marginBottom: 22, fontSize: 16 },
  languageButton:{alignSelf:'center',backgroundColor:colors.surfaceRaised,borderRadius:999,paddingHorizontal:14,paddingVertical:8,marginTop:-12,marginBottom:14},
  languageText:{color:colors.primaryBright,fontWeight:'800'},
  achievementsButton:{alignSelf:'center',paddingHorizontal:14,paddingVertical:8,marginBottom:12},
  toast:{backgroundColor:colors.primary,borderRadius:12,padding:12,marginBottom:12},toastText:{color:colors.text,fontWeight:'800',textAlign:'center'},
  starsSummary: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  starsIcon: { color: colors.accent, fontSize: 36 },
  starsTotal: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  starsLabel: { color: colors.textMuted, fontSize: 13 },
  gameRow:{backgroundColor:colors.surface,borderRadius:14,padding:12,marginBottom:14,flexDirection:'row',justifyContent:'space-between'},
  gameText:{color:colors.primaryBright,fontWeight:'800',fontSize:13},
  tutorCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tutorAvatar: { fontSize: 34 },
  tutorCopy: { flex: 1 },
  tutorTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  tutorDescription: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  tutorArrow: { color: colors.primaryBright, fontSize: 32, lineHeight: 32 },
  charactersCard: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, marginBottom: 14 },
  completedCard: { borderColor: colors.primary, borderWidth: 1 },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { color: colors.text, fontSize: 19, fontWeight: '800' },
  statusBadge: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  completedBadge: { backgroundColor: colors.success },
  statusText: { color: colors.text, fontSize: 11, fontWeight: '800' },
  description: { color: colors.textMuted, marginTop: 8, marginBottom: 12 },
  lessonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  lessonStars: { color: colors.accent, fontSize: 18, letterSpacing: 1 },
  bestScore: { color: colors.textMuted, fontSize: 13, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quizButton: { backgroundColor: colors.accent },
  buttonText: { color: colors.text, fontWeight: '800' },
  pressed: { opacity: 0.78 },
}); }
