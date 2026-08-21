import type { ChatCorrection, TutorReply } from '@/types/learning';

const DEFAULT_SUGGESTIONS = ['I like learning English.', 'Can you help me?', 'Tell me about your day.'];

interface CorrectionRule {
  pattern: RegExp;
  correctedText: string;
  explanation: string;
}

const CORRECTION_RULES: readonly CorrectionRule[] = [
  {
    pattern: /\bi goed\b/i,
    correctedText: 'I went',
    explanation: '“Go” is irregular in the past: go → went. / “Go” es irregular en pasado.',
  },
  {
    pattern: /\bi am agree\b/i,
    correctedText: 'I agree',
    explanation: 'We say “I agree”, without “am”. / Decimos “I agree”, sin “am”.',
  },
  {
    pattern: /\bi have (\d+) years\b/i,
    correctedText: 'I am $1 years old',
    explanation: 'For age, English uses “I am … years old”. / Para la edad usamos “I am”.',
  },
  {
    pattern: /\bi no understand\b/i,
    correctedText: "I don't understand",
    explanation: 'Use “don’t” to make a negative sentence. / Usa “don’t” para negar.',
  },
  {
    pattern: /\bshe have\b/i,
    correctedText: 'She has',
    explanation: 'With “she”, “have” changes to “has”. / Con “she”, “have” cambia a “has”.',
  },
];

function createCorrection(userText: string): ChatCorrection | undefined {
  for (const rule of CORRECTION_RULES) {
    if (!rule.pattern.test(userText)) continue;
    return {
      correctedText: userText.replace(rule.pattern, rule.correctedText),
      explanation: rule.explanation,
    };
  }

  if (/^i\b/.test(userText.trim())) {
    return {
      correctedText: `I${userText.trim().slice(1)}`,
      explanation: 'Remember to capitalize “I”. / Recuerda escribir “I” con mayúscula.',
    };
  }

  return undefined;
}

function getSimulatedReply(userText: string, correction?: ChatCorrection): TutorReply {
  const normalized = userText.toLowerCase();
  let text = 'Nice! Tell me one more thing about yourself. What do you enjoy doing?';
  let suggestions = DEFAULT_SUGGESTIONS;

  if (/\b(hello|hi|hey)\b/.test(normalized)) {
    text = 'Hello! I’m Fox, your English tutor. How are you feeling today?';
    suggestions = ['I am great, thanks!', 'I am a little tired.', 'I am happy today.'];
  } else if (/\b(thank|thanks)\b/.test(normalized)) {
    text = 'You’re welcome! You are doing a great job. What would you like to practice next?';
    suggestions = ['I want to practice food.', 'Let’s practice travel.', 'I want free conversation.'];
  } else if (/\b(name|called)\b/.test(normalized)) {
    text = 'Lovely to meet you! Where are you from?';
    suggestions = ['I am from Spain.', 'I am from Mexico.', 'I am from Argentina.'];
  } else if (/\b(i like|i love)\b/.test(normalized)) {
    text = 'That sounds fun! Why do you like it?';
    suggestions = ['Because it is relaxing.', 'Because it is exciting.', 'I do it with my friends.'];
  }

  if (correction) {
    text = `Good try! ${text}`;
  }

  return { text, correction, suggestions };
}

/**
 * Punto de integración para una API real: sustituye el retorno simulado por un fetch
 * autenticado al backend, manteniendo el contrato TutorReply para la interfaz.
 */
export async function fetchTutorReply(userText: string): Promise<TutorReply | undefined> {
  const cleanText = userText.trim();
  if (!cleanText) return undefined;

  const correction = createCorrection(cleanText);
  return getSimulatedReply(cleanText, correction);
}

export const INITIAL_TUTOR_SUGGESTIONS: readonly string[] = [
  'Hello! How are you?',
  'My name is…',
  'I want to practice English.',
];
