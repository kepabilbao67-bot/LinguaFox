import type { ChatCorrection, TutorReply } from '@/types/learning';

export const INITIAL_TUTOR_SUGGESTIONS: readonly string[] = [
  'Hello! How are you?',
  'My name is…',
  'I want to practice English.',
];

const DEFAULT_SUGGESTIONS = ['I like learning English.', 'Can you help me?', 'Tell me about your day.'];

interface CorrectionRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  explanation: string;
}

const CORRECTION_RULES: readonly CorrectionRule[] = [
  {
    pattern: /\bi goed\b/i,
    replacement: 'I went',
    explanation: '“Go” is irregular in the past: go → went. / “Go” es irregular en pasado.',
  },
  {
    pattern: /\bi am agree\b/i,
    replacement: 'I agree',
    explanation: 'We say “I agree”, without “am”. / Decimos “I agree”, sin “am”.',
  },
  {
    pattern: /\bi have (\d+) years\b/i,
    replacement: (_match, age) => `I am ${age} years old`,
    explanation: 'For age, English uses “I am … years old”. / Para la edad usamos “I am”.',
  },
  {
    pattern: /\bi no understand\b/i,
    replacement: "I don't understand",
    explanation: 'Use “don’t” to make a negative sentence. / Usa “don’t” para negar.',
  },
  {
    pattern: /\bshe have\b/i,
    replacement: 'She has',
    explanation: 'With “she”, “have” changes to “has”. / Con “she”, “have” cambia a “has”.',
  },
  {
    pattern: /\bdepend of\b/i,
    replacement: 'depend on',
    explanation: 'We say “depend on”, not “depend of”. / En inglés se usa “depend on”.',
  },
  {
    pattern: /\blisten music\b/i,
    replacement: 'listen to music',
    explanation: 'The verb “listen” requires “to”: “listen to music”. / El verbo “listen” lleva la preposición “to”.',
  },
  {
    pattern: /\bpeople is\b/i,
    replacement: 'people are',
    explanation: '“People” is plural in English: “people are”. / “People” es un sustantivo plural.',
  },
];

export function createPedagogicalCorrection(userText: string): ChatCorrection | undefined {
  let corrected = userText;
  let explanation: string | undefined;

  for (const rule of CORRECTION_RULES) {
    if (rule.pattern.test(corrected)) {
      corrected = typeof rule.replacement === 'function'
        ? corrected.replace(rule.pattern, rule.replacement as any)
        : corrected.replace(rule.pattern, rule.replacement);
      if (!explanation) {
        explanation = rule.explanation;
      }
    }
  }

  // Capitalize lone "i" if needed
  if (/^i\b/.test(corrected.trim())) {
    const trimmed = corrected.trim();
    corrected = `I${trimmed.slice(1)}`;
    if (!explanation) {
      explanation = 'Remember to capitalize “I”. / Recuerda escribir “I” con mayúscula.';
    }
  } else if (/\bi\b/.test(corrected)) {
    corrected = corrected.replace(/\bi\b/g, 'I');
  }

  if (corrected !== userText && explanation) {
    return {
      correctedText: corrected,
      explanation,
    };
  }

  return undefined;
}

export interface TutorReplyOptions {
  level?: string;
  targetLanguage?: string;
  mode?: string;
  scenarioId?: string;
  [key: string]: any;
}

function getSimulatedReply(
  userText: string,
  correction?: ChatCorrection,
  options?: TutorReplyOptions
): TutorReply {
  const normalized = userText.toLowerCase();
  let text = 'Nice! Tell me one more thing about yourself. What do you enjoy doing?';
  let suggestions = DEFAULT_SUGGESTIONS;

  if (/(más despacio|despacio|slowly|slow)/i.test(normalized)) {
    text = 'Of course! I will speak more slowly for you. Take your time!';
    suggestions = ['Thank you!', 'Can we try again?', 'I understand better now.'];
  } else if (/(qué significa|que significa|significa|meaning|explain)/i.test(normalized)) {
    text = 'I would love to explain! Which word or sentence would you like me to explain?';
    suggestions = ['This whole phrase.', 'The last word.', 'Can you give an example?'];
  } else if (/(pista|hint)/i.test(normalized)) {
    text = 'Here is a small hint: think about the subject and verb in simple present.';
    suggestions = ['Let me try again.', 'Give me one more hint.', 'Show me the answer.'];
  } else if (/\b(hello|hi|hey)\b/.test(normalized)) {
    text = options?.level === 'A1'
      ? 'Hello! I’m Fox, your English tutor. Take your time and reply in a simple sentence.'
      : 'Hello! I’m Fox, your English tutor. How are you feeling today?';
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

export async function fetchTutorReply(
  userText: string,
  options?: TutorReplyOptions
): Promise<TutorReply | undefined> {
  const cleanText = userText.trim();
  if (!cleanText) return undefined;

  const correction = createPedagogicalCorrection(cleanText);
  return getSimulatedReply(cleanText, correction, options);
}