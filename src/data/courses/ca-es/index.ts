import type { Unit } from '@/types/learning';
import type { CourseConfig, CourseMeta } from '../types';

export const META_CA_ES: CourseMeta = {
  id: 'ca-es',
  name: 'Català',
  emoji: '🟡',
  sourceLang: 'es',
  targetLang: 'ca',
  ttsLang: 'ca-ES',
  direction: 'ltr',
  available: true,
  description: 'Curs inicial de català nivell A1',
};

export const UNITS_CA: readonly Unit[] = [
  {
    id: 'ca-u1',
    level: 'A1',
    title: 'Saluts i Presentacions',
    description: 'Aprendre a saludar i presentar-se en català',
    color: '#f1c40f',
    lessons: [
      {
        id: 'ca-u1l1',
        unitId: 'ca-u1',
        title: 'Saluts Essencials (Saludos)',
        description: 'Saludos esenciales y fórmulas de cortesía',
        icon: '👋',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-hola', source: 'Hola', translation: 'hola' },
          { id: 'ca-bon-dia', source: 'Bon dia', translation: 'buenos días' },
          { id: 'ca-bona-tarda', source: 'Bona tarda', translation: 'buenas tardes' },
          { id: 'ca-bona-nit', source: 'Bona nit', translation: 'buenas noches' },
          { id: 'ca-gracies', source: 'Gràcies', translation: 'gracias' },
          { id: 'ca-si-us-plau', source: 'Si us plau', translation: 'por favor' },
        ],
        vocab: [
          { en: 'Hola', es: 'hola', ipa: '/ˈɔ.lə/' },
          { en: 'Bon dia', es: 'buenos días', ipa: '/ˈbɔn ˈdi.ə/' },
          { en: 'Bona tarda', es: 'buenas tardes', ipa: '/ˈbɔ.nə ˈtaɾ.ðə/' },
          { en: 'Bona nit', es: 'buenas noches', ipa: '/ˈbɔ.nə ˈnit/' },
          { en: 'Gràcies', es: 'gracias', ipa: '/ˈɡɾa.si.əs/' },
          { en: 'Si us plau', es: 'por favor', ipa: '/si us ˈplaw/' },
        ],
        exercises: [
          {
            id: 'ca-u1l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "por favor" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['Si us plau', 'Gràcies', 'Bon dia', 'Adéu'],
            answer: 'Si us plau',
            audioText: 'Si us plau',
          },
          {
            id: 'ca-u1l1-ex2',
            type: 'translate',
            prompt: 'Traduce al español:',
            sourceText: 'Bon dia i gràcies',
            audioText: 'Bon dia i gràcies',
            wordBank: ['Buenos', 'días', 'y', 'gracias', 'Hola'],
            answerWords: ['Buenos', 'días', 'y', 'gracias'],
          },
          {
            id: 'ca-u1l1-ex3',
            type: 'match',
            prompt: 'Empareja las expresiones:',
            pairs: [
              { en: 'Hola', es: 'Hola' },
              { en: 'Bon dia', es: 'Buenos días' },
              { en: 'Gràcies', es: 'Gracias' },
            ],
          },
        ],
      },
      {
        id: 'ca-u1l2',
        unitId: 'ca-u1',
        title: 'Presentacions (Presentaciones)',
        description: 'Cómo decir tu nombre y origen',
        icon: '🗣️',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-em-dico', source: 'Em dico...', translation: 'me llamo...' },
          { id: 'ca-soc', source: 'Sóc de...', translation: 'soy de...' },
          { id: 'ca-com-et-dius', source: 'Com et dius?', translation: '¿cómo te llamas?' },
          { id: 'ca-molt-de-gust', source: 'Molt de gust', translation: 'mucho gusto' },
          { id: 'ca-adeu', source: 'Adéu', translation: 'adiós' },
          { id: 'ca-fins-aviat', source: 'Fins aviat', translation: 'hasta pronto' },
        ],
        vocab: [
          { en: 'Em dico', es: 'me llamo' },
          { en: 'Molt de gust', es: 'mucho gusto' },
          { en: 'Adéu', es: 'adiós' },
        ],
        exercises: [
          {
            id: 'ca-u1l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "adiós" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['Adéu', 'Hola', 'Bon dia', 'Si us plau'],
            answer: 'Adéu',
            audioText: 'Adéu',
          },
        ],
      },
    ],
  },
  {
    id: 'ca-u2',
    level: 'A1',
    title: 'Família i Persones',
    description: 'La família i el cercle proper',
    color: '#e74c3c',
    lessons: [
      {
        id: 'ca-u2l1',
        unitId: 'ca-u2',
        title: 'La Família (La Familia)',
        description: 'Vocabulario básico de la familia',
        icon: '👨‍👩‍👧',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-pare', source: 'Pare', translation: 'padre' },
          { id: 'ca-mare', source: 'Mare', translation: 'madre' },
          { id: 'ca-germa', source: 'Germà', translation: 'hermano' },
          { id: 'ca-germana', source: 'Germana', translation: 'hermana' },
          { id: 'ca-fill', source: 'Fill', translation: 'hijo' },
          { id: 'ca-filla', source: 'Filla', translation: 'hija' },
        ],
        vocab: [
          { en: 'Pare', es: 'padre' },
          { en: 'Mare', es: 'madre' },
          { en: 'Germà', es: 'hermano' },
        ],
        exercises: [
          {
            id: 'ca-u2l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Mare"?',
            question: 'Selecciona la opción correcta:',
            options: ['Madre', 'Padre', 'Hijo', 'Hermana'],
            answer: 'Madre',
            audioText: 'Mare',
          },
        ],
      },
      {
        id: 'ca-u2l2',
        unitId: 'ca-u2',
        title: 'Amics i Casa (Amigos y Casa)',
        description: 'Describir la casa y los amigos',
        icon: '🏡',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-amic', source: 'Amic', translation: 'amigo' },
          { id: 'ca-amiga', source: 'Amiga', translation: 'amiga' },
          { id: 'ca-casa', source: 'Casa', translation: 'casa' },
          { id: 'ca-gran', source: 'Gran', translation: 'grande' },
          { id: 'ca-petita', source: 'Petita', translation: 'pequeña' },
          { id: 'ca-bonica', source: 'Bonica', translation: 'bonita' },
        ],
        vocab: [
          { en: 'Amic', es: 'amigo' },
          { en: 'Casa', es: 'casa' },
        ],
        exercises: [
          {
            id: 'ca-u2l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "amigo" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['Amic', 'Casa', 'Gran', 'Bonica'],
            answer: 'Amic',
            audioText: 'Amic',
          },
        ],
      },
    ],
  },
  {
    id: 'ca-u3',
    level: 'A1',
    title: 'Menjar i Beguda',
    description: 'Demanar al restaurant i cafeteria',
    color: '#16a085',
    lessons: [
      {
        id: 'ca-u3l1',
        unitId: 'ca-u3',
        title: 'Menjar i Begudes (Comida y Bebidas)',
        description: 'Vocabulario esencial en la mesa',
        icon: '🍷',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-aigua', source: 'Aigua', translation: 'agua' },
          { id: 'ca-pa', source: 'Pa', translation: 'pan' },
          { id: 'ca-formatge', source: 'Formatge', translation: 'queso' },
          { id: 'ca-vi', source: 'Vi', translation: 'vino' },
          { id: 'ca-cervesa', source: 'Cervesa', translation: 'cerveza' },
          { id: 'ca-cafe', source: 'Cafè', translation: 'café' },
        ],
        vocab: [
          { en: 'Aigua', es: 'agua' },
          { en: 'Pa', es: 'pan' },
          { en: 'Formatge', es: 'queso' },
        ],
        exercises: [
          {
            id: 'ca-u3l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Aigua"?',
            question: 'Selecciona la opción correcta:',
            options: ['Agua', 'Vino', 'Pan', 'Café'],
            answer: 'Agua',
            audioText: 'Aigua',
          },
        ],
      },
      {
        id: 'ca-u3l2',
        unitId: 'ca-u3',
        title: 'Al Restaurant (En el Restaurante)',
        description: 'Pedir la cuenta y hacer solicitudes',
        icon: '💶',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-el-compte', source: 'El compte, si us plau', translation: 'la cuenta, por favor' },
          { id: 'ca-quant-es', source: 'Quant és?', translation: '¿cuánto es?' },
          { id: 'ca-voldria', source: 'Voldria...', translation: 'querría...' },
          { id: 'ca-bon-profit', source: 'Bon profit!', translation: '¡buen provecho!' },
          { id: 'ca-xocolata', source: 'Xocolata', translation: 'chocolate' },
          { id: 'ca-te', source: 'Te', translation: 'té' },
        ],
        vocab: [
          { en: 'El compte', es: 'la cuenta' },
          { en: 'Bon profit', es: 'buen provecho' },
        ],
        exercises: [
          {
            id: 'ca-u3l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo desear "buen provecho" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['Bon profit!', 'Bon dia!', 'Adéu!', 'Gràcies!'],
            answer: 'Bon profit!',
            audioText: 'Bon profit!',
          },
        ],
      },
    ],
  },
  {
    id: 'ca-u4',
    level: 'A1',
    title: 'Nombres i Temps (Números y Tiempo)',
    description: 'Comptar de l\'1 al 5 i moments del dia',
    color: '#9b59b6',
    lessons: [
      {
        id: 'ca-u4l1',
        unitId: 'ca-u4',
        title: 'Nombres 1-5 (Números 1-5)',
        description: 'Primeros números en catalán',
        icon: '🔢',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-un', source: 'Un', translation: 'uno' },
          { id: 'ca-dos', source: 'Dos', translation: 'dos' },
          { id: 'ca-tres', source: 'Tres', translation: 'tres' },
          { id: 'ca-quatre', source: 'Quatre', translation: 'cuatro' },
          { id: 'ca-cinc', source: 'Cinc', translation: 'cinco' },
          { id: 'ca-sis', source: 'Sis', translation: 'seis' },
        ],
        vocab: [
          { en: 'Un', es: 'uno' },
          { en: 'Dos', es: 'dos' },
          { en: 'Tres', es: 'tres' },
          { en: 'Quatre', es: 'cuatro' },
          { en: 'Cinc', es: 'cinco' },
        ],
        exercises: [
          {
            id: 'ca-u4l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "cinco" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['Cinc', 'Un', 'Tres', 'Quatre'],
            answer: 'Cinc',
            audioText: 'Cinc',
          },
        ],
      },
      {
        id: 'ca-u4l2',
        unitId: 'ca-u4',
        title: 'Temps (El Tiempo)',
        description: 'Hoy, mañana y momentos del día',
        icon: '⏰',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-avui', source: 'Avui', translation: 'hoy' },
          { id: 'ca-dema', source: 'Demà', translation: 'mañana' },
          { id: 'ca-ahir', source: 'Ahir', translation: 'ayer' },
          { id: 'ca-ara', source: 'Ara', translation: 'ahora' },
          { id: 'ca-mati', source: 'Al matí', translation: 'por la mañana' },
          { id: 'ca-nit', source: 'A la nit', translation: 'por la noche' },
        ],
        vocab: [
          { en: 'Avui', es: 'hoy' },
          { en: 'Demà', es: 'mañana' },
        ],
        exercises: [
          {
            id: 'ca-u4l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Avui"?',
            question: 'Selecciona la opción correcta:',
            options: ['Hoy', 'Mañana', 'Ayer', 'Ahora'],
            answer: 'Hoy',
            audioText: 'Avui',
          },
        ],
      },
    ],
  },
  {
    id: 'ca-u5',
    level: 'A1',
    title: 'Llocs i Preguntes (Lugares y Preguntas)',
    description: 'Orientació bàsica i paraules interrogatives',
    color: '#34495e',
    lessons: [
      {
        id: 'ca-u5l1',
        unitId: 'ca-u5',
        title: 'Llocs (Lugares)',
        description: 'La ciudad, la calle y la playa',
        icon: '🗺️',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-ciutat', source: 'La ciutat', translation: 'la ciudad' },
          { id: 'ca-carrer', source: 'El carrer', translation: 'la calle' },
          { id: 'ca-platja', source: 'La platja', translation: 'la playa' },
          { id: 'ca-muntanya', source: 'La muntanya', translation: 'la montaña' },
          { id: 'ca-bosc', source: 'El bosc', translation: 'el bosque' },
          { id: 'ca-pont', source: 'El pont', translation: 'el puente' },
        ],
        vocab: [
          { en: 'La ciutat', es: 'la ciudad' },
          { en: 'La platja', es: 'la playa' },
        ],
        exercises: [
          {
            id: 'ca-u5l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "la playa" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['La platja', 'La ciutat', 'El carrer', 'La muntanya'],
            answer: 'La platja',
            audioText: 'La platja',
          },
        ],
      },
      {
        id: 'ca-u5l2',
        unitId: 'ca-u5',
        title: 'Preguntes (Preguntas)',
        description: 'On, Què y Qui',
        icon: '❓',
        language: 'ca',
        level: 'A1',
        words: [
          { id: 'ca-que', source: 'Què?', translation: '¿qué?' },
          { id: 'ca-qui', source: 'Qui?', translation: '¿quién?' },
          { id: 'ca-on', source: 'On?', translation: '¿dónde?' },
          { id: 'ca-com', source: 'Com?', translation: '¿cómo?' },
          { id: 'ca-per-que', source: 'Per què?', translation: '¿por qué?' },
          { id: 'ca-quan', source: 'Quan?', translation: '¿cuándo?' },
        ],
        vocab: [
          { en: 'Què', es: '¿qué?' },
          { en: 'On', es: '¿dónde?' },
        ],
        exercises: [
          {
            id: 'ca-u5l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "On?" en catalán?',
            question: 'Selecciona la opción correcta:',
            options: ['¿Dónde?', '¿Qué?', '¿Quién?', '¿Cómo?'],
            answer: '¿Dónde?',
            audioText: 'On',
          },
        ],
      },
    ],
  },
];

export function getLessonById(id: string): { lesson: Unit['lessons'][number]; unit: Unit } | null {
  for (const unit of UNITS_CA) {
    const found = unit.lessons.find((l) => l.id === id);
    if (found) return { lesson: found, unit };
  }
  return null;
}

export function allLessonsFlat(): readonly { lesson: Unit['lessons'][number]; unit: Unit }[] {
  const result: { lesson: Unit['lessons'][number]; unit: Unit }[] = [];
  for (const unit of UNITS_CA) {
    for (const lesson of unit.lessons) {
      result.push({ lesson, unit });
    }
  }
  return result;
}

export const COURSE_CA: CourseConfig = {
  meta: META_CA_ES,
  units: UNITS_CA,
  getLessonById,
  allLessonsFlat,
};
