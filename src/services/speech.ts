import * as Speech from 'expo-speech';
import type { LanguageCode } from '@/types/learning';

export const LANGUAGE_LOCALE_MAP: Readonly<Record<LanguageCode, string>> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  de: 'de-DE',
  pt: 'pt-PT',
  eu: 'eu-ES',
  ca: 'ca-ES',
};

export function resolveTtsLocale(language?: LanguageCode | string): string {
  if (!language) return 'en-US';
  if (language in LANGUAGE_LOCALE_MAP) {
    return LANGUAGE_LOCALE_MAP[language as LanguageCode];
  }
  return language;
}

export interface SpeechOptions {
  language?: LanguageCode | string;
  rate?: number;
  pitch?: number;
}

export interface RecognitionResult {
  available: boolean;
  transcript?: string;
  message: string;
}

/** Reproduce texto con una velocidad cómoda para estudiantes y el locale correcto según el idioma. */
export function speakText(text: string, options: SpeechOptions = {}): boolean {
  const cleanText = text.trim();
  if (!cleanText) return false;

  const targetLocale = resolveTtsLocale(options.language);

  try {
    Speech.stop();
    Speech.speak(cleanText, {
      language: targetLocale,
      rate: options.rate ?? 0.84,
      pitch: options.pitch ?? 1.0,
    });
    return true;
  } catch (error: unknown) {
    console.warn('No se pudo iniciar la síntesis de voz.', error);
    return false;
  }
}

export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch (error: unknown) {
    console.warn('No se pudo detener la síntesis de voz.', error);
  }
}

export function normalizePronunciation(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesPronunciation(expected: string, transcript: string): boolean {
  return normalizePronunciation(expected) === normalizePronunciation(transcript);
}

// Preparado para integrar un módulo de reconocimiento tras aprobación del usuario.
export function isSpeechRecognitionAvailable(): boolean {
  return false;
}

export async function startRecognition(): Promise<RecognitionResult> {
  return {
    available: false,
    message: 'Reconocimiento de voz no disponible aún en esta plataforma.',
  };
}
