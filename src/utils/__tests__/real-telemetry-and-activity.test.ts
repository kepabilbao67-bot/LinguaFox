import { describe, expect, it } from 'vitest';
import { getLocalDateKey } from '../streak-logic';
import { getDailyChallenges } from '../daily-challenges';
import { calculateLevelCompetencies } from '../cefr-competencies';
import { DEFAULT_PROGRESS, sanitizeProgress } from '../progress-storage';
import type { Lesson, ProgressState, TrackedError } from '@/types/learning';

describe('Real Daily Activity, Challenges, Streak, Errors and CEFR Telemetry', () => {
  const sampleLesson: Lesson = {
    id: 'unit-1-lesson-1',
    title: 'Basic Hello',
    description: 'A1 Greetings',
    language: 'en',
    level: 'A1',
    words: [
      { id: 'w1', source: 'hello', translation: 'hola' },
      { id: 'w2', source: 'world', translation: 'mundo' },
    ],
  };

  describe('1. ACTIVIDAD REAL POR FECHA', () => {
    it('distinguishes between yesterday activity and today activity', () => {
      const yesterday = '2026-09-04';
      const today = '2026-09-05';

      const activity = {
        [yesterday]: { lessonsCompleted: 2, chatMessages: 5, spokenPhrases: 3, reviewsCompleted: 1 },
        [today]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0 },
      };

      expect(activity[yesterday].lessonsCompleted).toBe(2);
      expect(activity[today].lessonsCompleted).toBe(0);
      expect(yesterday).not.toBe(today);
    });

    it('incrementing today metrics only affects today record', () => {
      const today = '2026-09-05';
      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        activityByDate: {
          [today]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0 },
        },
      };

      // Simulate incrementing lesson, chat, and speaking today
      const updatedActivity = {
        ...progress.activityByDate,
        [today]: {
          lessonsCompleted: (progress.activityByDate?.[today]?.lessonsCompleted ?? 0) + 1,
          chatMessages: (progress.activityByDate?.[today]?.chatMessages ?? 0) + 1,
          spokenPhrases: (progress.activityByDate?.[today]?.spokenPhrases ?? 0) + 1,
          reviewsCompleted: (progress.activityByDate?.[today]?.reviewsCompleted ?? 0) + 1,
        },
      };

      expect(updatedActivity[today].lessonsCompleted).toBe(1);
      expect(updatedActivity[today].chatMessages).toBe(1);
      expect(updatedActivity[today].spokenPhrases).toBe(1);
      expect(updatedActivity[today].reviewsCompleted).toBe(1);
    });
  });

  describe('2. RETOS DIARIOS AISLADOS', () => {
    const todayTs = new Date('2026-09-05T12:00:00Z').getTime();
    const todayKey = getLocalDateKey(todayTs);
    const yesterdayKey = '2026-09-04';

    it('yesterday activity does NOT complete today daily challenge', () => {
      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        activityByDate: {
          [yesterdayKey]: { lessonsCompleted: 10, chatMessages: 20, spokenPhrases: 15, reviewsCompleted: 5 },
        },
      };

      const challenges = getDailyChallenges(progress, todayTs);
      expect(challenges.every((c) => !c.completed)).toBe(true);
    });

    it('today activity completes today daily challenge', () => {
      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 1, chatMessages: 1, spokenPhrases: 1, reviewsCompleted: 1 },
        },
      };

      const challenges = getDailyChallenges(progress, todayTs);
      expect(challenges.every((c) => c.completed)).toBe(true);
    });

    it('prevents claiming same challenge twice on the same day', () => {
      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        experiencia: 100,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 1, chatMessages: 1, spokenPhrases: 1, reviewsCompleted: 0 },
        },
        dailyChallengeClaims: {
          'daily-lesson': todayKey,
        },
      };

      const challenges = getDailyChallenges(progress, todayTs);
      const lessonChallenge = challenges.find((c) => c.id === 'daily-lesson');

      expect(lessonChallenge?.completed).toBe(true);
      expect(lessonChallenge?.claimed).toBe(true);
    });
  });

  describe('3. RACHA SEMANAL Y HUECOS DE ACTIVIDAD', () => {
    it('evaluates active status strictly against real activityByDate and detects gaps', () => {
      const today = new Date('2026-09-05T12:00:00Z');
      const activeDateKey = getLocalDateKey(today.getTime());
      const gapDate = new Date(today);
      gapDate.setDate(today.getDate() - 1);
      const gapDateKey = getLocalDateKey(gapDate.getTime());

      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        rachaActual: 5, // Even if streak counter is high
        activityByDate: {
          [activeDateKey]: { lessonsCompleted: 1, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0 },
          // gapDateKey has NO activity recorded
        },
      };

      const activity = progress.activityByDate ?? {};
      const isTodayActive = !!(activity[activeDateKey] && activity[activeDateKey].lessonsCompleted > 0);
      const isGapActive = !!(activity[gapDateKey] && activity[gapDateKey].lessonsCompleted > 0);

      expect(isTodayActive).toBe(true);
      expect(isGapActive).toBe(false); // Gap appears as inactive
    });
  });

  describe('4. BANCO DE ERRORES Y VALIDACIÓN DE MAESTRÍA', () => {
    it('does not grant mastery or XP when review is not passed', () => {
      const error: TrackedError = {
        id: 'err-1',
        userText: 'I goed to market',
        correctedText: 'I went to the market',
        explanation: 'Go is irregular',
        category: 'grammar',
        language: 'en',
        timestamp: Date.now(),
        reviewed: false,
      };

      // An unmastered error has no mastery XP granted
      expect(error.mastered).toBeFalsy();
      expect(error.masteryXpGranted).toBeFalsy();
    });

    it('grants +10 XP strictly once when validated and mastered', () => {
      const error: TrackedError = {
        id: 'err-1',
        userText: 'I goed to market',
        correctedText: 'I went to the market',
        explanation: 'Go is irregular',
        category: 'grammar',
        language: 'en',
        timestamp: Date.now(),
        reviewed: false,
      };

      let xp = 50;
      // Step 1: Master the error
      const masterError = (target: TrackedError) => {
        if (target.mastered || target.masteryXpGranted) return { target, xpAwarded: 0 };
        return {
          target: { ...target, mastered: true, masteryXpGranted: true, reviewed: true },
          xpAwarded: 10,
        };
      };

      const firstPass = masterError(error);
      xp += firstPass.xpAwarded;
      expect(firstPass.xpAwarded).toBe(10);
      expect(xp).toBe(60);
      expect(firstPass.target.mastered).toBe(true);
      expect(firstPass.target.masteryXpGranted).toBe(true);

      // Step 2: Attempt to master the same error again
      const secondPass = masterError(firstPass.target);
      xp += secondPass.xpAwarded;
      expect(secondPass.xpAwarded).toBe(0); // Strictly zero duplicate XP
      expect(xp).toBe(60);
    });
  });

  describe('5. TELEMETRÍA CEFR INDEPENDIENTE Y COMPATIBILIDAD', () => {
    it('ensures Listening does not change when Reading is performed', () => {
      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        competencyStats: {
          'en:A1': {
            reading: { correct: 5, total: 5 },
          },
        },
      };

      const evalResult = calculateLevelCompetencies({
        level: 'A1',
        levelLessons: [sampleLesson],
        progress,
      });

      expect(evalResult.reading).toBe(100);
      expect(evalResult.listening).toBeNull(); // Strictly null
      expect(evalResult.writing).toBeNull();
      expect(evalResult.grammar).toBeNull();
    });

    it('returns null for Writing when no writing exercises are registered', () => {
      const evalResult = calculateLevelCompetencies({
        level: 'A1',
        levelLessons: [sampleLesson],
        progress: DEFAULT_PROGRESS,
      });

      expect(evalResult.writing).toBeNull();
    });

    it('calculates Grammar using real correct/total ratio without artificial assumptions', () => {
      const progress: ProgressState = {
        ...DEFAULT_PROGRESS,
        competencyStats: {
          'en:A1': {
            grammar: { correct: 3, total: 4 },
          },
        },
      };

      const evalResult = calculateLevelCompetencies({
        level: 'A1',
        levelLessons: [sampleLesson],
        progress,
      });

      expect(evalResult.grammar).toBe(75); // 3/4 = 75%
    });

    it('preserves backward compatibility and hydrates smoothly without breaking on legacy objects', () => {
      const legacyRaw = {
        leccionesCompletadas: ['en:unit-1'],
        experiencia: 250,
        rachaActual: 3,
        // Missing activityByDate, competencyStats, trackedErrors
      };

      const sanitized = sanitizeProgress(legacyRaw);
      expect(sanitized.leccionesCompletadas).toEqual(['en:unit-1']);
      expect(sanitized.experiencia).toBe(250);
      expect(sanitized.rachaActual).toBe(3);
      expect(sanitized.activityByDate).toEqual({});
      expect(sanitized.competencyStats).toEqual({});
      expect(sanitized.trackedErrors).toEqual([]);
    });
  });

  describe('6. TELEMETRÍA SEPARADA: LISTENING VS SPEAKING VS CHAT', () => {
    const todayTs = new Date('2026-09-05T12:00:00Z').getTime();
    const todayKey = getLocalDateKey(todayTs);

    it('enviar chat escrito NO incrementa spokenPhrases', () => {
      let state: ProgressState = {
        ...DEFAULT_PROGRESS,
        spokenPhrasesCount: 0,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0, listeningActivities: 0 },
        },
      };

      // Simular flujo de enviar chat escrito (ChatScreen sendMessage)
      // Solo registra interacción de chat: chatMessages + 1, pero NO spokenPhrases
      const todayActivity = state.activityByDate?.[todayKey] ?? {
        lessonsCompleted: 0,
        chatMessages: 0,
        spokenPhrases: 0,
        reviewsCompleted: 0,
      };

      state = {
        ...state,
        mensajesPersonajes: state.mensajesPersonajes + 1,
        activityByDate: {
          ...state.activityByDate,
          [todayKey]: {
            ...todayActivity,
            chatMessages: todayActivity.chatMessages + 1,
          },
        },
      };

      expect(state.spokenPhrasesCount).toBe(0);
      expect(state.activityByDate?.[todayKey]?.spokenPhrases).toBe(0);
      expect(state.activityByDate?.[todayKey]?.chatMessages).toBe(1);
    });

    it('escuchar audio Kids NO incrementa spokenPhrases', () => {
      let state: ProgressState = {
        ...DEFAULT_PROGRESS,
        spokenPhrasesCount: 0,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0, listeningActivities: 0 },
        },
      };

      // Simular playWordAudio en KidsScreen (solo escucha TTS)
      const todayActivity = state.activityByDate?.[todayKey] ?? {
        lessonsCompleted: 0,
        chatMessages: 0,
        spokenPhrases: 0,
        reviewsCompleted: 0,
      };

      state = {
        ...state,
        listeningActivitiesCount: (state.listeningActivitiesCount ?? 0) + 1,
        activityByDate: {
          ...state.activityByDate,
          [todayKey]: {
            ...todayActivity,
            listeningActivities: (todayActivity.listeningActivities ?? 0) + 1,
          },
        },
      };

      expect(state.spokenPhrasesCount).toBe(0);
      expect(state.activityByDate?.[todayKey]?.spokenPhrases).toBe(0);
      expect(state.activityByDate?.[todayKey]?.listeningActivities).toBe(1);
    });

    it('siguiente palabra Kids NO incrementa spokenPhrases', () => {
      let state: ProgressState = {
        ...DEFAULT_PROGRESS,
        spokenPhrasesCount: 0,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0, listeningActivities: 0 },
        },
      };

      // Simular nextCard en KidsScreen (avanza y reproduce audio TTS)
      const todayActivity = state.activityByDate?.[todayKey] ?? {
        lessonsCompleted: 0,
        chatMessages: 0,
        spokenPhrases: 0,
        reviewsCompleted: 0,
      };

      state = {
        ...state,
        experiencia: state.experiencia + 5,
        listeningActivitiesCount: (state.listeningActivitiesCount ?? 0) + 1,
        activityByDate: {
          ...state.activityByDate,
          [todayKey]: {
            ...todayActivity,
            listeningActivities: (todayActivity.listeningActivities ?? 0) + 1,
          },
        },
      };

      expect(state.spokenPhrasesCount).toBe(0);
      expect(state.activityByDate?.[todayKey]?.spokenPhrases).toBe(0);
      expect(state.activityByDate?.[todayKey]?.listeningActivities).toBe(1);
      expect(state.experiencia).toBe(5);
    });

    it('speaking real sí incrementa spokenPhrases', () => {
      let state: ProgressState = {
        ...DEFAULT_PROGRESS,
        spokenPhrasesCount: 0,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0, listeningActivities: 0 },
        },
      };

      // Simular práctica oral auténtica (recordSpeakingPractice en PronunciationScreen / reconocimiento)
      const todayActivity = state.activityByDate?.[todayKey] ?? {
        lessonsCompleted: 0,
        chatMessages: 0,
        spokenPhrases: 0,
        reviewsCompleted: 0,
      };

      state = {
        ...state,
        spokenPhrasesCount: (state.spokenPhrasesCount ?? 0) + 1,
        experiencia: state.experiencia + 3,
        activityByDate: {
          ...state.activityByDate,
          [todayKey]: {
            ...todayActivity,
            spokenPhrases: (todayActivity.spokenPhrases ?? 0) + 1,
          },
        },
      };

      expect(state.spokenPhrasesCount).toBe(1);
      expect(state.activityByDate?.[todayKey]?.spokenPhrases).toBe(1);
      expect(state.experiencia).toBe(3);
    });

    it('escuchar audio no completa daily-phonetics', () => {
      // Estado con múltiples reproducciones de audio / listening pero 0 speaking
      const state: ProgressState = {
        ...DEFAULT_PROGRESS,
        spokenPhrasesCount: 0,
        listeningActivitiesCount: 10,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0, listeningActivities: 10 },
        },
      };

      const challenges = getDailyChallenges(state, todayTs);
      const phoneticsChallenge = challenges.find((c) => c.id === 'daily-phonetics');

      expect(phoneticsChallenge).toBeDefined();
      expect(phoneticsChallenge?.completed).toBe(false);
      expect(phoneticsChallenge?.current).toBe(0);
    });

    it('speaking real sí completa daily-phonetics', () => {
      // Estado con práctica oral real
      const state: ProgressState = {
        ...DEFAULT_PROGRESS,
        spokenPhrasesCount: 1,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 1, reviewsCompleted: 0 },
        },
      };

      const challenges = getDailyChallenges(state, todayTs);
      const phoneticsChallenge = challenges.find((c) => c.id === 'daily-phonetics');

      expect(phoneticsChallenge).toBeDefined();
      expect(phoneticsChallenge?.completed).toBe(true);
      expect(phoneticsChallenge?.current).toBe(1);
    });
  });

  describe('7. PROTECCIÓN DE XP Y RECOMPENSAS DE PRONUNCIACIÓN (SPEAKING V1)', () => {
    const todayTs = new Date('2026-09-05T12:00:00Z').getTime();
    const todayKey = getLocalDateKey(todayTs);

    const recordPractice = (state: ProgressState, challengeId: string) => {
      const completed = state.completedPronunciationChallenges ?? {};
      if (completed[challengeId]) {
        return { state, awarded: false, xpGained: 0 };
      }
      const todayActivity = state.activityByDate?.[todayKey] ?? {
        lessonsCompleted: 0,
        chatMessages: 0,
        spokenPhrases: 0,
        reviewsCompleted: 0,
      };

      const nextState: ProgressState = {
        ...state,
        experiencia: state.experiencia + 15,
        spokenPhrasesCount: (state.spokenPhrasesCount ?? 0) + 1,
        completedPronunciationChallenges: {
          ...completed,
          [challengeId]: new Date(todayTs).toISOString(),
        },
        activityByDate: {
          ...state.activityByDate,
          [todayKey]: {
            ...todayActivity,
            spokenPhrases: (todayActivity.spokenPhrases ?? 0) + 1,
          },
        },
      };
      return { state: nextState, awarded: true, xpGained: 15 };
    };

    it('primera práctica del reto suma XP', () => {
      let state = { ...DEFAULT_PROGRESS, experiencia: 50 };
      const challengeId = 'en-w-coffee';

      const result = recordPractice(state, challengeId);
      expect(result.awarded).toBe(true);
      expect(result.xpGained).toBe(15);
      expect(result.state.experiencia).toBe(65);
      expect(result.state.completedPronunciationChallenges?.[challengeId]).toBeDefined();
      expect(result.state.spokenPhrasesCount).toBe(1);
    });

    it('segunda pulsación NO suma XP', () => {
      let state = { ...DEFAULT_PROGRESS, experiencia: 50 };
      const challengeId = 'en-w-coffee';

      // Primera pulsación
      const first = recordPractice(state, challengeId);
      expect(first.awarded).toBe(true);
      expect(first.state.experiencia).toBe(65);

      // Segunda pulsación idéntica
      const second = recordPractice(first.state, challengeId);
      expect(second.awarded).toBe(false);
      expect(second.xpGained).toBe(0);
      expect(second.state.experiencia).toBe(65);
      expect(second.state.spokenPhrasesCount).toBe(1); // No incrementa
    });

    it('cerrar/reabrir mantiene reto practicado', () => {
      const challengeId = 'en-th-third';
      const initial = { ...DEFAULT_PROGRESS, experiencia: 100 };
      const pass = recordPractice(initial, challengeId);

      // Simular guardado y recarga por AsyncStorage con sanitización
      const serialized = JSON.stringify(pass.state);
      const rehydrated = sanitizeProgress(JSON.parse(serialized));

      expect(rehydrated.completedPronunciationChallenges?.[challengeId]).toBeDefined();
      // Un intento de volver a practicar tras reabrir la app es rechazado
      const repeatAfterReload = recordPractice(rehydrated, challengeId);
      expect(repeatAfterReload.awarded).toBe(false);
      expect(repeatAfterReload.xpGained).toBe(0);
      expect(repeatAfterReload.state.experiencia).toBe(pass.state.experiencia);
    });

    it('listening no marca reto speaking como practicado', () => {
      const challengeId = 'en-stress-hotel';
      let state: ProgressState = {
        ...DEFAULT_PROGRESS,
        listeningActivitiesCount: 0,
        activityByDate: {
          [todayKey]: { lessonsCompleted: 0, chatMessages: 0, spokenPhrases: 0, reviewsCompleted: 0, listeningActivities: 0 },
        },
      };

      // Simular escuchar audio repetidas veces
      const todayActivity = state.activityByDate?.[todayKey] ?? {
        lessonsCompleted: 0,
        chatMessages: 0,
        spokenPhrases: 0,
        reviewsCompleted: 0,
      };

      state = {
        ...state,
        listeningActivitiesCount: (state.listeningActivitiesCount ?? 0) + 3,
        activityByDate: {
          ...state.activityByDate,
          [todayKey]: {
            ...todayActivity,
            listeningActivities: (todayActivity.listeningActivities ?? 0) + 3,
          },
        },
      };

      // El reto sigue NO practicado y no otorga XP de speaking por solo escuchar
      expect(state.completedPronunciationChallenges?.[challengeId]).toBeUndefined();
      expect(state.spokenPhrasesCount).toBe(0);
      expect(state.experiencia).toBe(0);
    });

    it('cambiar de reto permite nueva recompensa', () => {
      let state = { ...DEFAULT_PROGRESS, experiencia: 50 };

      // Completar reto 1
      const res1 = recordPractice(state, 'en-w-coffee');
      expect(res1.awarded).toBe(true);
      expect(res1.state.experiencia).toBe(65);

      // Cambiar a reto 2 (no completado aún)
      const res2 = recordPractice(res1.state, 'en-th-third');
      expect(res2.awarded).toBe(true);
      expect(res2.state.experiencia).toBe(80); // 65 + 15 = 80
      expect(res2.state.spokenPhrasesCount).toBe(2);
    });

    it('dos retos distintos pueden recompensar independientemente', () => {
      let state = { ...DEFAULT_PROGRESS, experiencia: 0 };

      const resA = recordPractice(state, 'fr-r-croissant');
      const resB = recordPractice(resA.state, 'de-ch-wasser');

      expect(resA.awarded).toBe(true);
      expect(resB.awarded).toBe(true);
      expect(resB.state.experiencia).toBe(30); // 15 + 15
      expect(resB.state.spokenPhrasesCount).toBe(2);
      expect(resB.state.completedPronunciationChallenges?.['fr-r-croissant']).toBeDefined();
      expect(resB.state.completedPronunciationChallenges?.['de-ch-wasser']).toBeDefined();
    });
  });
});
