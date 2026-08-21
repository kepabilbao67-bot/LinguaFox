import * as Speech from 'expo-speech';

export interface SpeechOptions {
  language?: string;
  rate?: number;
}

export interface RecognitionResult {
  available: boolean;
  transcript?: string;
  message: string;
}

/** Reproduce texto con una velocidad cómoda para estudiantes. */
export function speakText(text: string, options: SpeechOptions = {}): boolean {
  const cleanText = text.trim();
  if (!cleanText) return false;

  try {
    Speech.stop();
    Speech.speak(cleanText, {
      language: options.language ?? 'en-US',
      rate: options.rate ?? 0.84,
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
