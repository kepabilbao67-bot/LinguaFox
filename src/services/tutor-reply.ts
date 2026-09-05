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

export const MULTILINGUAL_TUTOR_SUGGESTIONS: Record<string, readonly string[]> = {
  en: ['Hello! How are you?', 'My name is…', 'I want to practice English.'],
  es: ['¡Hola! ¿Cómo estás?', 'Me llamo…', 'Quiero practicar español.'],
  fr: ['Bonjour ! Comment vas-tu ?', 'Je m’appelle…', 'Je veux pratiquer le français.'],
  de: ['Hallo! Wie geht es dir?', 'Ich heiße…', 'Ich möchte Deutsch üben.'],
  it: ['Ciao! Come stai?', 'Mi chiamo…', 'Voglio fare pratica in italiano.'],
  pt: ['Olá! Como vai você?', 'Meu nome é…', 'Quero praticar português.'],
  eu: ['Kaixo! Zer moduz?', 'Nire izena … da.', 'Euskara landu nahi dut.'],
  ca: ['Hola! Com estàs?', 'Em dic…', 'Vull practicar català.'],
};

function getSimulatedReply(
  userText: string,
  correction?: ChatCorrection,
  options?: TutorReplyOptions
): TutorReply {
  const normalized = userText.toLowerCase();
  const lang = options?.targetLanguage ?? 'en';

  // Base fallback responses per language
  const defaultResponsesByLang: Record<string, string> = {
    en: 'Nice! Tell me one more thing about yourself. What do you enjoy doing?',
    es: '¡Genial! Cuéntame una cosa más sobre ti. ¿Qué te gusta hacer en tu tiempo libre?',
    fr: 'Très bien ! Raconte-moi une chose de plus sur toi. Qu’aimes-tu faire ?',
    de: 'Schön! Erzähl mir noch etwas über dich. Was machst du gerne?',
    it: 'Bello! Dimmi un’altra cosa su di te. Cosa ti piace fare?',
    pt: 'Que legal! Conte-me mais uma coisa sobre você. O que gosta de fazer?',
    eu: 'Bikain! Kontaidazu gauza bat gehiago zuri buruz. Zer gustatzen zaizu egitea?',
    ca: 'Molt bé! Explica’m una cosa més sobre tu. Què t’agrada fer?',
  };

  let text = defaultResponsesByLang[lang] ?? defaultResponsesByLang.en;
  let suggestions = (MULTILINGUAL_TUTOR_SUGGESTIONS[lang] ?? DEFAULT_SUGGESTIONS) as readonly string[];

  if (/(más despacio|despacio|slowly|slow|plus lentement|langsamer|piano)/i.test(normalized)) {
    if (lang === 'fr') {
      text = 'Bien sûr ! Je vais parler plus lentement pour toi. Prends ton temps !';
      suggestions = ['Merci beaucoup !', 'Pouvons-nous réessayer ?', 'Je comprends mieux maintenant.'];
    } else if (lang === 'de') {
      text = 'Natürlich! Ich spreche jetzt langsamer für dich. Nimm dir Zeit!';
      suggestions = ['Vielen Dank!', 'Können wir das wiederholen?', 'Jetzt verstehe ich es besser.'];
    } else if (lang === 'it') {
      text = 'Certamente! Parlerò più lentamente per te. Fai con calma!';
      suggestions = ['Grazie mille!', 'Possiamo riprovare?', 'Ora capisco meglio.'];
    } else if (lang === 'es') {
      text = '¡Por supuesto! Hablaré más despacio para ti. ¡Tómate tu tiempo!';
      suggestions = ['¡Muchas gracias!', '¿Podemos repetir?', 'Ahora lo entiendo mejor.'];
    } else {
      text = 'Of course! I will speak more slowly for you. Take your time!';
      suggestions = ['Thank you!', 'Can we try again?', 'I understand better now.'];
    }
  } else if (/(qué significa|que significa|significa|meaning|explain|qu'est-ce que|was bedeutet)/i.test(normalized)) {
    if (lang === 'fr') {
      text = 'J’aimerais beaucoup t’expliquer ! Quel mot ou quelle phrase souhaites-tu éclaircir ?';
      suggestions = ['Toute cette phrase.', 'Le dernier mot.', 'Peux-tu donner un exemple ?'];
    } else if (lang === 'de') {
      text = 'Ich erkläre es dir gerne! Welches Wort oder welchen Satz möchtest du verstehen?';
      suggestions = ['Diesen ganzen Satz.', 'Das letzte Wort.', 'Kannst du ein Beispiel geben?'];
    } else if (lang === 'it') {
      text = 'Mi piacerebbe spiegartelo! Quale parola o frase vorresti approfondire?';
      suggestions = ['Tutta questa frase.', 'L’ultima parola.', 'Puoi fare un esempio?'];
    } else if (lang === 'es') {
      text = '¡Me encantará explicártelo! ¿Qué palabra o frase te gustaría aclarar?';
      suggestions = ['Toda esta frase.', 'La última palabra.', '¿Puedes darme un ejemplo?'];
    } else {
      text = 'I would love to explain! Which word or sentence would you like me to explain?';
      suggestions = ['This whole phrase.', 'The last word.', 'Can you give an example?'];
    }
  } else if (/(pista|hint|indice|tipp)/i.test(normalized)) {
    if (lang === 'fr') {
      text = 'Voici un petit indice : pense au sujet et au verbe au présent simple.';
      suggestions = ['Laisse-moi réessayer.', 'Donne-moi un autre indice.', 'Montre-moi la solution.'];
    } else if (lang === 'de') {
      text = 'Hier ist ein kleiner Tipp: Achte auf das Subjekt und die Verbendung im Präsens.';
      suggestions = ['Ich versuche es noch einmal.', 'Gib mir noch einen Tipp.', 'Zeig mir die Antwort.'];
    } else if (lang === 'it') {
      text = 'Ecco un piccolo suggerimento: pensa al soggetto e al verbo nel presente indicativo.';
      suggestions = ['Fammi riprovare.', 'Dammi un altro suggerimento.', 'Mostrami la soluzione.'];
    } else if (lang === 'es') {
      text = 'Aquí tienes una pequeña pista: fíjate en la concordancia del sujeto y el verbo.';
      suggestions = ['Déjame intentarlo de nuevo.', 'Dame otra pista.', 'Muéstrame la respuesta.'];
    } else {
      text = 'Here is a small hint: think about the subject and verb in simple present.';
      suggestions = ['Let me try again.', 'Give me one more hint.', 'Show me the answer.'];
    }
  } else if (/\b(hello|hi|hey|bonjour|salut|hallo|ciao|olá|kaixo|hola)\b/.test(normalized)) {
    if (lang === 'fr') {
      text = options?.level === 'A1'
        ? 'Bonjour ! Je suis Fox, ton tuteur de français. Prends ton temps et réponds simplement.'
        : 'Bonjour ! Je suis Fox, ton tuteur de français. Comment vas-tu aujourd’hui ?';
      suggestions = ['Je vais très bien, merci !', 'Un peu fatigué.', 'Heureux d’être ici.'];
    } else if (lang === 'de') {
      text = options?.level === 'A1'
        ? 'Hallo! Ich bin Fox, dein Deutschlehrer. Nimm dir Zeit und antworte in einem einfachen Satz.'
        : 'Hallo! Ich bin Fox, dein Deutschlehrer. Wie geht es dir heute?';
      suggestions = ['Mir geht es sehr gut, danke!', 'Ein bisschen müde.', 'Ich freue mich aufs Lernen.'];
    } else if (lang === 'it') {
      text = options?.level === 'A1'
        ? 'Ciao! Sono Fox, il tuo tutor di italiano. Fai con calma e rispondi con una frase semplice.'
        : 'Ciao! Sono Fox, il tuo tutor di italiano. Come stai oggi?';
      suggestions = ['Sto molto bene, grazie!', 'Un po’ stanco.', 'Pronto per imparare.'];
    } else if (lang === 'pt') {
      text = options?.level === 'A1'
        ? 'Olá! Sou o Fox, seu tutor de português. Responda com uma frase simples.'
        : 'Olá! Sou o Fox, seu tutor de português. Como você está hoje?';
      suggestions = ['Estou muito bem, obrigado!', 'Um pouco cansado.', 'Animado para praticar.'];
    } else if (lang === 'es') {
      text = options?.level === 'A1'
        ? '¡Hola! Soy Fox, tu tutor de español. Tómate tu tiempo y responde con una frase sencilla.'
        : '¡Hola! Soy Fox, tu tutor de español. ¿Cómo te sientes hoy?';
      suggestions = ['¡Estoy genial, gracias!', 'Un poco cansado.', 'Listo para conversar.'];
    } else if (lang === 'eu') {
      text = 'Kaixo! Fox naiz, zure euskara tutorea. Zer moduz zabiltza gaur?';
      suggestions = ['Oso ondo, eskerrik asko!', 'Nekatuta nago.', 'Ikasteko prest!'];
    } else if (lang === 'ca') {
      text = 'Hola! Sóc el Fox, el teu tutor de català. Com estàs avui?';
      suggestions = ['Molt bé, gràcies!', 'Una mica cansat.', 'A punt per practicar.'];
    } else {
      text = options?.level === 'A1'
        ? 'Hello! I’m Fox, your English tutor. Take your time and reply in a simple sentence.'
        : 'Hello! I’m Fox, your English tutor. How are you feeling today?';
      suggestions = ['I am great, thanks!', 'I am a little tired.', 'I am happy today.'];
    }
  } else if (/\b(thank|thanks|merci|danke|grazie|obrigado|eskerrik|gràcies|gracias)\b/.test(normalized)) {
    if (lang === 'fr') {
      text = 'De rien ! Tu fais de remarquables progrès. Que souhaites-tu pratiquer ensuite ?';
      suggestions = ['La nourriture.', 'Les voyages.', 'La conversation libre.'];
    } else if (lang === 'de') {
      text = 'Gern geschehen! Du machst tolle Fortschritte. Was möchtest du als Nächstes üben?';
      suggestions = ['Essen und Getränke.', 'Reisen.', 'Freie Konversation.'];
    } else if (lang === 'it') {
      text = 'Prego! Stai facendo un ottimo lavoro. Cosa vorresti praticare adesso?';
      suggestions = ['Il cibo.', 'I viaggi.', 'Conversazione libera.'];
    } else if (lang === 'es') {
      text = '¡De nada! Lo estás haciendo genial. ¿Qué te gustaría practicar ahora?';
      suggestions = ['Comida y restaurantes.', 'Viajes y hoteles.', 'Conversación libre.'];
    } else {
      text = 'You’re welcome! You are doing a great job. What would you like to practice next?';
      suggestions = ['I want to practice food.', 'Let’s practice travel.', 'I want free conversation.'];
    }
  } else if (/\b(name|called|m'appelle|heisse|heiße|chiamo|nome|deixo)\b/.test(normalized)) {
    if (lang === 'fr') {
      text = 'Enchanté ! D’où viens-tu ?';
      suggestions = ['Je viens d’Espagne.', 'Je viens de France.', 'Je viens du Mexique.'];
    } else if (lang === 'de') {
      text = 'Freut mich! Woher kommst du?';
      suggestions = ['Ich komme aus Spanien.', 'Ich komme aus Deutschland.', 'Ich komme aus Mexiko.'];
    } else if (lang === 'it') {
      text = 'Piacere di conoscerti! Di dove sei?';
      suggestions = ['Vengo dalla Spagna.', 'Vengo dall’Italia.', 'Vengo dal Messico.'];
    } else if (lang === 'es') {
      text = '¡Encantado de conocerte! ¿De dónde eres?';
      suggestions = ['Soy de España.', 'Soy de México.', 'Soy de Argentina.'];
    } else {
      text = 'Lovely to meet you! Where are you from?';
      suggestions = ['I am from Spain.', 'I am from Mexico.', 'I am from Argentina.'];
    }
  } else if (/\b(i like|i love|j'aime|ich mag|mi piace|gosto de|gustatzen)\b/.test(normalized)) {
    if (lang === 'fr') {
      text = 'Ça a l’air passionnant ! Pourquoi aimes-tu cela ?';
      suggestions = ['Parce que c’est relaxant.', 'Parce que c’est captivant.', 'Je le fais avec mes amis.'];
    } else if (lang === 'de') {
      text = 'Das klingt super! Warum gefällt dir das?';
      suggestions = ['Weil es entspannend ist.', 'Weil es aufregend ist.', 'Ich mache es mit Freunden.'];
    } else if (lang === 'it') {
      text = 'Sembra molto divertente! Perché ti piace?';
      suggestions = ['Perché è rilassante.', 'Perché è stimolante.', 'Lo faccio con amici.'];
    } else if (lang === 'es') {
      text = '¡Suena muy divertido! ¿Por qué te gusta tanto?';
      suggestions = ['Porque es relajante.', 'Porque es emocionante.', 'Lo practico con amigos.'];
    } else {
      text = 'That sounds fun! Why do you like it?';
      suggestions = ['Because it is relaxing.', 'Because it is exciting.', 'I do it with my friends.'];
    }
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