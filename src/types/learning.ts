export type LanguageCode = 'en' | 'fr';

export type Screen = 'home' | 'lesson' | 'quiz' | 'result';

export interface Word {
  id: string;
  source: string;
  translation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: LanguageCode;
  words: readonly Word[];
}

export interface Question extends Word {
  options: readonly string[];
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  modoTema?: 'claro' | 'oscuro' | 'sistema';
}

export interface ProgressState {
  leccionesCompletadas: string[];
  estrellas: number;
  mejorPuntuacionPorLeccion: Record<string, number>;
  mejoresEstrellasPorLeccion: Record<string, number>;
  idioma: LanguageCode;
  ajustes: AppSettings;
  progresoPorLeccion: Record<string, number>;
  estrellasPersonajesPorId: Record<string, number>;
  experiencia: number;
  logros: string[];
  mensajesPersonajes: number;
  personajesConCharla: string[];
  ultimoDiaActivo: string | null;
  rachaActual: number;
  logrosDesbloqueados: Record<string, string>;
  onboardingCompleto: boolean;
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
}

export interface Message {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  correction?: ChatCorrection;
}

export interface TutorReply {
  text: string;
  correction?: ChatCorrection;
  suggestions: readonly string[];
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
}

export interface CharacterMessage extends Message {
  characterId: string;
}

export interface CharacterReply extends TutorReply {
  levelHint: CharacterDifficulty;
}
