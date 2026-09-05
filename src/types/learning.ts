export type LanguageCode = 'en' | 'es' | 'fr' | 'it' | 'de' | 'pt' | 'eu' | 'ca';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Screen = 'home' | 'lesson' | 'quiz' | 'result';

export interface Word {
  id: string;
  source: string;
  translation: string;
}

export interface VocabItem {
  en: string;
  es: string;
  ipa?: string;
}

export type ExerciseType =
  | 'multipleChoice'
  | 'translate'
  | 'listen'
  | 'match'
  | 'speak'
  | 'fillBlank';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multipleChoice';
  question: string;
  audioText?: string;
  options: readonly string[];
  answer: string;
}

export interface TranslateExercise extends BaseExercise {
  type: 'translate';
  sourceText: string;
  audioText: string;
  wordBank: readonly string[];
  answerWords: readonly string[];
}

export interface ListenExercise extends BaseExercise {
  type: 'listen';
  audioText: string;
  options: readonly string[];
  answer: string;
}

export interface MatchPair {
  en: string;
  es: string;
}

export interface MatchExercise extends BaseExercise {
  type: 'match';
  pairs: readonly MatchPair[];
}

export interface SpeakExercise extends BaseExercise {
  type: 'speak';
  audioText: string;
  translation: string;
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fillBlank';
  sentence: string;
  audioText: string;
  options: readonly string[];
  answer: string;
  translation: string;
}

export type Exercise =
  | MultipleChoiceExercise
  | TranslateExercise
  | ListenExercise
  | MatchExercise
  | SpeakExercise
  | FillBlankExercise;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: LanguageCode;
  level?: CEFRLevel;
  words: readonly Word[];
  unitId?: string;
  icon?: string;
  vocab?: readonly VocabItem[];
  exercises?: readonly Exercise[];
}

export interface Unit {
  id: string;
  level: CEFRLevel;
  title: string;
  description: string;
  color: string;
  lessons: readonly Lesson[];
}

export interface Question extends Word {
  options: readonly string[];
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  modoTema?: 'claro' | 'oscuro' | 'sistema';
}

export type CrownLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface LessonCrown {
  lessonId: string;
  level: CrownLevel;
  accuracy: number;
  perfectPronunciation: boolean;
  achievedAt: number;
}

export interface SRSCard {
  en: string;
  es: string;
  ipa?: string;
  repetitions: number;
  interval: number;
  easeFactor: number;
  dueDate: number;
  lastReviewed: number;
}

export type ConversationMode = 'free' | 'scenario' | 'tutor' | 'exam' | 'travel';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'daily' | 'travel' | 'work' | 'social' | 'emergency';
  level: CEFRLevel;
  city?: string;
  characterId: string;
  initialGreeting: string;
  targetLanguage: LanguageCode;
  goals: readonly string[];
  vocabulary: readonly string[];
}

export interface CityAdventure {
  id: string;
  name: string;
  country: string;
  flag: string;
  emoji: string;
  level: CEFRLevel;
  description: string;
  landmarks: readonly string[];
  vocabulary: readonly string[];
  scenarios: readonly string[];
  xpReward: number;
}

export interface TrackedError {
  id: string;
  userText: string;
  correctedText: string;
  explanation: string;
  category: 'grammar' | 'vocabulary' | 'preposition' | 'verb-tense' | 'pronunciation';
  language: LanguageCode;
  timestamp: number;
  reviewed: boolean;
  mastered?: boolean;
  masteredAt?: string;
  masteryXpGranted?: boolean;
}

export interface DailyActivityMetrics {
  lessonsCompleted: number;
  chatMessages: number;
  spokenPhrases: number;
  reviewsCompleted: number;
  listeningActivities?: number;
}

export interface CompetencyCount {
  correct: number;
  total: number;
}

export interface CompetencyStatsByLevel {
  reading?: CompetencyCount;
  listening?: CompetencyCount;
  grammar?: CompetencyCount;
  writing?: CompetencyCount;
  speaking?: CompetencyCount;
}

export interface ProgressState {
  leccionesCompletadas: string[];
  estrellas: number;
  mejorPuntuacionPorLeccion: Record<string, number>;
  mejoresEstrellasPorLeccion: Record<string, number>;
  idiomaNativo: LanguageCode;
  idiomaObjetivo: LanguageCode;
  nivelObjetivo?: CEFRLevel;
  ajustes: AppSettings;
  progresoPorLeccion: Record<string, number>;
  estrellasPersonajesPorId: Record<string, number>;
  experiencia: number;
  logros: string[];
  mensajesPersonajes: number;
  personajesConCharla: string[];
  ultimoDiaActivo: string | null;
  rachaActual: number;
  ultimoTimestampActivo: number | null;
  logrosDesbloqueados: Record<string, string>;
  onboardingCompleto: boolean;
  hearts: number;
  heartsRefillAt: number | null;
  gems: number;
  coins: number;
  crowns: Record<string, LessonCrown>;
  srs: Record<string, SRSCard>;
  trackedErrors?: readonly TrackedError[];
  unlockedCities?: readonly string[];
  completedScenarios?: readonly string[];
  spokenPhrasesCount?: number;
  listeningActivitiesCount?: number;
  logrosXpOtorgados?: readonly string[];
  dailyChallengeClaims?: Record<string, string>;
  activityByDate?: Record<string, DailyActivityMetrics>;
  competencyStats?: Record<string, CompetencyStatsByLevel>;
}

export interface QuizReward {
  estrellasDelIntento: number;
  nuevasEstrellas: number;
  mejorPuntuacion: number;
  totalEstrellas: number;
}

export type ChatRole = 'tutor' | 'user';

export interface ChatCorrection {
  correctedText: string;
  explanation: string;
  category?: 'grammar' | 'vocabulary' | 'preposition' | 'verb-tense' | 'pronunciation';
  rule?: string;
  example?: string;
}

export interface Message {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  correction?: ChatCorrection;
  translation?: string;
  audioText?: string;
  pronunciationFeedback?: string;
}

export interface TutorReply {
  text: string;
  correction?: ChatCorrection;
  suggestions: readonly string[];
  translation?: string;
  hints?: readonly string[];
}

export type CharacterDifficulty = 'facil' | 'medio';

export interface Character {
  id: string;
  name: string;
  personality: string;
  difficulty: CharacterDifficulty;
  greeting: string;
  vocabularyFocus: string;
  avatar: string;
  replyStyle: string;
  roleTitle?: string;
  city?: string;
  language?: LanguageCode;
}

export interface CharacterMessage extends Message {
  characterId: string;
}

export interface CharacterReply extends TutorReply {
  levelHint: CharacterDifficulty;
}
