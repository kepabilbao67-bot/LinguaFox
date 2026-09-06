import type { ChatCorrection, TutorReply } from '../types/learning';
import type { PedagogicalCorrection } from '../types/pedagogical-correction';

export const INITIAL_TUTOR_SUGGESTIONS: readonly string[] = [
  'Hello! How are you?',
  'My name is...',
  'I want to practice English.',
];

const DEFAULT_SUGGESTIONS = ['I like learning English.', 'Can you help me?', 'Tell me about your day.'];

interface CorrectionRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  explanation: string;
  category?: 'grammar' | 'vocabulary' | 'preposition' | 'verb-tense' | 'pronunciation';
  rule?: string;
  example?: string;
  why?: string;
  how?: string;
  when?: string;
  whenNot?: string;
  checkExercise?: string;
}

const CORRECTION_RULES: readonly CorrectionRule[] = [
  {
    pattern: /\bi goed\b/i,
    replacement: 'I went',
    explanation: '"Go" is irregular in the past: go -> went. / "Go" es irregular en pasado.',
    category: 'verb-tense',
    rule: 'Past irregular forms',
    example: 'I went to the store yesterday.',
    why: 'El verbo "go" no sigue la regla regular "-ed"; tiene su propia forma irregular "went" para el pasado simple.',
    how: 'Usa "went" para cualquier sujeto en pasado simple: I went, you went, she went.',
    when: 'Al relatar eventos finalizados en un momento específico del pasado.',
    whenNot: 'No uses "goed" nunca; tampoco uses "went" tras auxiliares como "did" (ej. "Did you go?", no "Did you went?").',
    checkExercise: 'Completa: Yesterday, she ____ (go) to the library.',
  },
  {
    pattern: /\bi am agree\b/i,
    replacement: 'I agree',
    explanation: 'We say "I agree", without "am". / Decimos "I agree", sin "am".',
    category: 'grammar',
    rule: 'Stative verbs',
    example: 'I agree with your proposal.',
    why: 'En inglés, "agree" es un verbo de estado, no un adjetivo. No requiere el verbo auxiliar "to be".',
    how: 'Conjuga directamente: "I agree", "she agrees", "they agree".',
    when: 'Para expresar conformidad con una opinión o propuesta.',
    whenNot: 'No digas "I am agree" ni "I am agreeing" para estados permanentes de opinión.',
    checkExercise: 'Corrige la frase: "I am totally agree with that idea."',
  },
  {
    pattern: /\bi have (\d+) years\b/i,
    replacement: (_match, age) => `I am ${age} years old`,
    explanation: 'For age, English uses "I am ... years old". / Para la edad usamos "I am".',
    category: 'grammar',
    rule: 'Age expression with "to be"',
    example: 'I am 25 years old.',
    why: 'En inglés la edad se considera un estado del ser ("to be"), no una posesión ("to have").',
    how: 'Usa la estructura: sujeto + to be + número + (years old opcional).',
    when: 'Al presentarte o decir la edad de personas, animales u objetos.',
    whenNot: 'No uses "I have ... years" por traducción literal del español.',
    checkExercise: 'Traduce: "Mi hermano tiene 18 años."',
  },
  {
    pattern: /\bi no understand\b/i,
    replacement: "I don't understand",
    explanation: 'Use "don\'t" to make a negative sentence. / Usa "don\'t" para negar.',
    category: 'grammar',
    rule: 'Negative auxiliary with do/does',
    example: "I don't understand this word.",
    why: 'Los verbos léxicos en presente simple necesitan el auxiliar "do not" (don\'t) para formar la negación.',
    how: 'Sujeto + don\'t / doesn\'t + verbo en infinitivo sin "to".',
    when: 'Al negar acciones o estados habituales en presente simple.',
    whenNot: 'No coloques "no" directamente antes de un verbo principal.',
    checkExercise: 'Transforma a negativo: "I speak French."',
  },
  {
    pattern: /\bshe have\b/i,
    replacement: 'She has',
    explanation: 'With "she", "have" changes to "has". / Con "she", "have" cambia a "has".',
    category: 'grammar',
    rule: 'Third person singular',
    example: 'She has a blue umbrella.',
    why: 'La tercera persona del singular (he, she, it) requiere la forma irregular "has" en presente simple afirmativo.',
    how: 'He/She/It + has + sustantivo / participio.',
    when: 'Al describir posesiones o características de una tercera persona.',
    whenNot: 'En oraciones negativas o preguntas con "does", el verbo vuelve a "have": "Does she have a car?".',
    checkExercise: 'Elige: She (have / has) three meetings today.',
  },
  {
    pattern: /\bhe have\b/i,
    replacement: 'He has',
    explanation: 'With "he", "have" changes to "has". / Con "he", "have" cambia a "has".',
    category: 'grammar',
    rule: 'Third person singular',
    example: 'He has an appointment today.',
    why: 'Con "he", el verbo tener en presente adopta la forma "has".',
    how: 'He + has.',
    when: 'Al hablar de un sujeto masculino singular.',
    whenNot: 'No uses "have" en afirmativas de presente con "he".',
    checkExercise: 'Completa: He ____ (have) a new apartment.',
  },
  {
    pattern: /\bdepend of\b/i,
    replacement: 'depend on',
    explanation: 'We say "depend on", not "depend of". / En inglés se usa "depend on".',
    category: 'preposition',
    rule: 'Dependent prepositions',
    example: 'It will depend on the weather.',
    why: 'El verbo "depend" rige obligatoriamente la preposición "on" (o formalmente "upon"), nunca "of".',
    how: 'Usa "depend on + objeto/pronombre/cláusula".',
    when: 'Al indicar que algo está sujeto a una condición.',
    whenNot: 'No traduzcas literalmente "depender de" como "depend of".',
    checkExercise: 'Corrige: "Our success depends of our daily practice."',
  },
  {
    pattern: /\blisten music\b/i,
    replacement: 'listen to music',
    explanation: 'The verb "listen" requires "to": "listen to music". / El verbo "listen" lleva la preposición "to".',
    category: 'preposition',
    rule: 'Dependent prepositions',
    example: 'I like to listen to music while running.',
    why: 'Cuando "listen" tiene un objeto directo, requiere la preposición "to" para dirigir la atención auditiva.',
    how: 'Usa "listen to + objeto" (listen to music, listen to me, listen to the teacher).',
    when: 'Siempre que menciones lo que estás escuchando conscientemente.',
    whenNot: 'Si no hay objeto, "to" se omite: "Listen carefully!". Tampoco confundas con "hear" (hear music sin "to").',
    checkExercise: 'Completa: Please listen ____ the instructions.',
  },
  {
    pattern: /\bpeople is\b/i,
    replacement: 'people are',
    explanation: '"People" is plural in English: "people are". / "People" es un sustantivo plural.',
    category: 'grammar',
    rule: 'Collective plural nouns',
    example: 'The people are very friendly here.',
    why: 'En inglés, "people" es el plural habitual de "person" y concuerda siempre en plural.',
    how: 'People + verbo en plural (are, have, were, like).',
    when: 'Al referirte a grupos de personas o habitantes.',
    whenNot: 'No uses "people is", salvo en el sentido antropológico especializado de "un pueblo/nación" ("a people").',
    checkExercise: 'Corrige: "Many people is waiting outside."',
  },
  {
    pattern: /\bexplain me\b/i,
    replacement: 'explain to me',
    explanation: 'In English we say "explain to me", not "explain me". / Decimos "explain to me".',
    category: 'preposition',
    rule: 'Ditransitive verbs',
    example: 'Can you explain to me how this works?',
    why: 'El verbo "explain" no admite doble objeto directo; la persona a quien se explica requiere la preposición "to".',
    how: 'Explain + algo + TO alguien (o "explain to me + cláusula").',
    when: 'Al pedir o describir explicaciones.',
    whenNot: 'No digas "explain me the problem"; di "explain the problem to me".',
    checkExercise: 'Ordena: can / to me / the rules / you / explain ?',
  },
  {
    pattern: /\bprefer ([a-z]+) than ([a-z]+)\b/i,
    replacement: (_match, item1, item2) => `prefer ${item1} to ${item2}`,
    explanation: 'We say "prefer X to Y", not "than". / Decimos "prefer to", no "prefer than".',
    category: 'grammar',
    rule: 'Comparative preferences',
    example: 'I prefer tea to coffee.',
    why: 'El verbo "prefer" compara dos sustantivos o gerundios mediante la preposición "to", no con la conjunción "than".',
    how: 'Prefer + A + to + B (ej. "I prefer walking to driving").',
    when: 'Al comparar dos preferencias generales.',
    whenNot: '"Than" se usa con "would rather": "I would rather walk than drive".',
    checkExercise: 'Corrige: "I prefer reading than watching TV."',
  },
  {
    pattern: /\bdo a mistake\b/i,
    replacement: 'make a mistake',
    explanation: 'We say "make a mistake", not "do a mistake". / Decimos "make a mistake".',
    category: 'vocabulary',
    rule: 'Collocations with Make vs Do',
    example: 'Everyone makes mistakes when learning a new language.',
    why: '"Make" se asocia con crear o producir resultados, mientras que "do" se asocia con tareas o acciones generales.',
    how: 'Usa siempre la colocación fija: "make a mistake / make an error".',
    when: 'Al cometer un fallo o equivocación.',
    whenNot: 'No uses "do" con "mistake", "decision", "progress" o "effort".',
    checkExercise: 'Elige: Did you (do / make) any mistakes in the test?',
  },
  {
    pattern: /\barrive to (london|paris|rome|berlin|madrid|the airport|the station|the hotel)\b/i,
    replacement: (_match, destination) => {
      const isLargeCity = ['london', 'paris', 'rome', 'berlin', 'madrid'].includes(destination.toLowerCase());
      return `arrive ${isLargeCity ? 'in' : 'at'} ${destination}`;
    },
    explanation: 'Use "arrive in" for cities/countries and "arrive at" for specific places, not "arrive to".',
    category: 'preposition',
    rule: 'Prepositions of arrival',
    example: 'We arrived in London at 8 PM, then arrived at the hotel.',
    why: 'El verbo "arrive" no indica movimiento en dirección (a diferencia de "go to"), sino el hecho de estar dentro o en el lugar.',
    how: 'Arrive IN + ciudades/países; Arrive AT + edificios/estaciones/lugares concretos.',
    when: 'Al describir la llegada a un destino.',
    whenNot: 'Nunca uses "arrive to".',
    checkExercise: 'Completa: What time will we arrive ____ Madrid?',
  },
  {
    pattern: /\bsince (\d+|two|three|four|five|six|several) (days|weeks|months|years)\b/i,
    replacement: (_match, num, unit) => `for ${num} ${unit}`,
    explanation: 'Use "for" with a duration/period of time, and "since" with a specific starting point.',
    category: 'grammar',
    rule: 'For vs Since in perfect tenses',
    example: 'I have lived here for 3 years, since 2021.',
    why: '"For" mide la duración total de un periodo (for 3 years), mientras que "since" marca el punto de origen (since Monday, since 2020).',
    how: 'For + periodo de tiempo; Since + punto específico en el tiempo.',
    when: 'Al expresar la duración de una acción continuada con el Present Perfect.',
    whenNot: 'No uses "since" con cantidades de tiempo transcurridas ("since 2 months" es incorrecto).',
    checkExercise: 'Elige: I have studied English (for / since) six months.',
  },
  {
    pattern: /\blose the (bus|train|flight|plane)\b/i,
    replacement: (_match, transport) => `miss the ${transport}`,
    explanation: 'We say "miss the bus/train", not "lose". / Decimos "miss the bus", no "lose".',
    category: 'vocabulary',
    rule: 'Collocations with Miss vs Lose',
    example: 'Hurry up or we will miss the train!',
    why: '"Lose" significa extraviar un objeto físico; "miss" significa llegar tarde y no alcanzar un transporte o evento.',
    how: 'Usa "miss the train/bus/flight".',
    when: 'Al llegar tarde a un medio de transporte o espectáculo.',
    whenNot: 'No uses "lose" para transportes o citas ("I lost the flight" significa que lo extraviaste).',
    checkExercise: 'Traduce: "Si no corremos, perderemos el autobús."',
  },
  {
    pattern: /\blook forward to hear\b/i,
    replacement: 'look forward to hearing',
    explanation: '"Look forward to" is followed by a gerund (-ing): "look forward to hearing".',
    category: 'grammar',
    rule: 'Preposition "to" followed by gerund',
    example: 'I look forward to hearing from you soon.',
    why: 'En la expresión "look forward to", la palabra "to" es una preposición, no parte de un infinitivo, por lo que exige gerundio (-ing) o sustantivo.',
    how: 'Look forward to + verbo-ing / sustantivo (ej. "look forward to your reply").',
    when: 'Al despedirte formal o amablemente en cartas, correos o conversaciones.',
    whenNot: 'No uses infinitivo sin -ing tras "look forward to".',
    checkExercise: 'Corrige: "I look forward to see you tomorrow."',
  },
  {
    pattern: /\b(many|several|a lot of) informations\b/i,
    replacement: 'a lot of information',
    explanation: '"Information" is uncountable in English; it has no plural form "informations".',
    category: 'vocabulary',
    rule: 'Uncountable nouns',
    example: 'Can you give me some information about the course?',
    why: '"Information" es un sustantivo incontable; no se pluraliza añadiendo "-s".',
    how: 'Usa "information", "some information" o "a piece of information".',
    when: 'Al referirte a datos, noticias o detalles.',
    whenNot: 'Nunca agregues "-s" a "information", "advice", "furniture" o "luggage".',
    checkExercise: 'Corrige: "The guide gave us many useful informations."',
  },
];

export function createPedagogicalCorrection(userText: string): ChatCorrection | undefined {
  let corrected = userText;
  let explanation: string | undefined;
  let category: ChatCorrection['category'];
  let ruleName: string | undefined;
  let example: string | undefined;
  let why: string | undefined;
  let how: string | undefined;
  let when: string | undefined;
  let whenNot: string | undefined;
  let checkExercise: string | undefined;

  for (const rule of CORRECTION_RULES) {
    if (rule.pattern.test(corrected)) {
      corrected = typeof rule.replacement === 'function'
        ? corrected.replace(rule.pattern, rule.replacement as any)
        : corrected.replace(rule.pattern, rule.replacement);
      if (!explanation) {
        explanation = rule.explanation;
        category = rule.category;
        ruleName = rule.rule;
        example = rule.example;
        why = rule.why;
        how = rule.how;
        when = rule.when;
        whenNot = rule.whenNot;
        checkExercise = rule.checkExercise;
      }
    }
  }

  // Capitalize lone "i" if needed
  if (/^i\b/.test(corrected.trim())) {
    const trimmed = corrected.trim();
    corrected = `I${trimmed.slice(1)}`;
    if (!explanation) {
      explanation = 'Remember to capitalize "I". / Recuerda escribir "I" con mayúscula.';
      category = 'grammar';
      ruleName = 'Capitalization';
      example = 'I am practicing my languages.';
      why = 'En inglés, el pronombre de primera persona "I" siempre se escribe con mayúscula, sin importar su posición.';
      how = 'Escribe siempre "I", nunca "i" aislada.';
      when = 'Siempre que uses el pronombre personal de primera persona singular.';
      checkExercise = 'Escribe correctamente: "yesterday i saw a movie."';
    }
  } else if (/\bi\b/.test(corrected)) {
    corrected = corrected.replace(/\bi\b/g, 'I');
  }

  if (corrected !== userText && explanation) {
    return {
      correctedText: corrected,
      explanation,
      category,
      rule: ruleName,
      example,
      why,
      how,
      when,
      whenNot,
      checkExercise,
    } as any;
  }

  return undefined;
}

export function createFullPedagogicalCorrection(userText: string): PedagogicalCorrection | undefined {
  const correction = createPedagogicalCorrection(userText);
  if (!correction) return undefined;

  const tipoErrorMap: Record<string, PedagogicalCorrection['tipoError']> = {
    grammar: 'gramatica',
    preposition: 'gramatica',
    'verb-tense': 'gramatica',
    vocabulary: 'vocabulario',
    pronunciation: 'pronunciacion',
  };

  const tipo = tipoErrorMap[correction.category || 'grammar'] || 'gramatica';

  return {
    errorDetectado: userText,
    tipoError: tipo,
    correccion: correction.correctedText,
    explicacionPorQue: correction.why || correction.explanation,
    explicacionComo: correction.how || `Usa en su lugar: "${correction.correctedText}"`,
    explicacionCuando: correction.when || 'En situaciones cotidianas y formales equivalentes.',
    explicacionCuandoNo: correction.whenNot,
    ejemplos: correction.example ? [correction.example] : [],
    ejercicioComprobacion: correction.checkExercise || `Practica escribiendo: "${correction.correctedText}"`,
    idiomaExplicacion: 'es',
    gravedad: 'menor',
    confianza: 'high',
    debeInterrumpir: false,
    textoParaVoz: `${correction.explanation}. Forma correcta: ${correction.correctedText}`,
  };
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