import type { Unit } from '@/types/learning';
import type { CourseConfig, CourseMeta } from '../types';

export const META_EU_ES: CourseMeta = {
  id: 'eu-es',
  name: 'Euskara',
  emoji: '🟢',
  sourceLang: 'es',
  targetLang: 'eu',
  ttsLang: 'eu-ES',
  direction: 'ltr',
  available: true,
  description: 'Euskara hasierako maila (A1)',
};

export const UNITS_EU: readonly Unit[] = [
  {
    id: 'eu-u1',
    level: 'A1',
    title: 'Agurrak eta Aurkezpenak',
    description: 'Aprende a saludar y presentarte en euskera',
    color: '#27ae60',
    lessons: [
      {
        id: 'eu-u1l1',
        unitId: 'eu-u1',
        title: 'Hasierako Agurrak (Saludos)',
        description: 'Saludos esenciales y fórmulas de cortesía',
        icon: '👋',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-kaixo', source: 'Kaixo', translation: 'hola' },
          { id: 'eu-egun-on', source: 'Egun on', translation: 'buenos días' },
          { id: 'eu-arratsalde-on', source: 'Arratsalde on', translation: 'buenas tardes' },
          { id: 'eu-gabon', source: 'Gabon', translation: 'buenas noches' },
          { id: 'eu-eskerrik-asko', source: 'Eskerrik asko', translation: 'muchas gracias' },
          { id: 'eu-mesedez', source: 'Mesedez', translation: 'por favor' },
        ],
        vocab: [
          { en: 'Kaixo', es: 'hola', ipa: '/kaiʃo/' },
          { en: 'Egun on', es: 'buenos días', ipa: '/eɡun on/' },
          { en: 'Arratsalde on', es: 'buenas tardes', ipa: '/araʧalde on/' },
          { en: 'Gabon', es: 'buenas noches', ipa: '/ɡabon/' },
          { en: 'Eskerrik asko', es: 'muchas gracias', ipa: '/eskerik asko/' },
          { en: 'Mesedez', es: 'por favor', ipa: '/mesedes/' },
        ],
        exercises: [
          {
            id: 'eu-u1l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "hola" en euskera?',
            question: 'Elige la traducción correcta de "hola":',
            options: ['Kaixo', 'Agur', 'Egun on', 'Mesedez'],
            answer: 'Kaixo',
            audioText: 'Kaixo',
          },
          {
            id: 'eu-u1l1-ex2',
            type: 'translate',
            prompt: 'Traduce al español:',
            sourceText: 'Eskerrik asko',
            audioText: 'Eskerrik asko',
            wordBank: ['Muchas', 'gracias', 'Por', 'favor', 'Hola'],
            answerWords: ['Muchas', 'gracias'],
          },
          {
            id: 'eu-u1l1-ex3',
            type: 'match',
            prompt: 'Empareja los saludos básicos:',
            pairs: [
              { en: 'Kaixo', es: 'Hola' },
              { en: 'Egun on', es: 'Buenos días' },
              { en: 'Gabon', es: 'Buenas noches' },
            ],
          },
        ],
      },
      {
        id: 'eu-u1l2',
        unitId: 'eu-u1',
        title: 'Aurkezpenak (Presentaciones)',
        description: 'Cómo decir tu nombre y procedencia',
        icon: '🗣️',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-nire-izena', source: 'Nire izena', translation: 'mi nombre' },
          { id: 'eu-naiz', source: 'naiz', translation: 'soy' },
          { id: 'eu-nor-zara', source: 'Nor zara zu?', translation: '¿quién eres tú?' },
          { id: 'eu-nondik', source: 'Nondikoa zara?', translation: '¿de dónde eres?' },
          { id: 'eu-poztu-naiz', source: 'Poztu naiz', translation: 'encantado/a' },
          { id: 'eu-agur', source: 'Agur', translation: 'adiós' },
        ],
        vocab: [
          { en: 'Nire izena', es: 'mi nombre' },
          { en: 'naiz', es: 'soy' },
          { en: 'Poztu naiz', es: 'encantado/a' },
          { en: 'Agur', es: 'adiós' },
        ],
        exercises: [
          {
            id: 'eu-u1l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "adiós" en euskera?',
            question: 'Elige la opción correcta para despedirte:',
            options: ['Agur', 'Kaixo', 'Egun on', 'Mesedez'],
            answer: 'Agur',
            audioText: 'Agur',
          },
        ],
      },
    ],
  },
  {
    id: 'eu-u2',
    level: 'A1',
    title: 'Familia eta Pertsonak',
    description: 'Miembros de la familia y expresiones cercanas',
    color: '#2980b9',
    lessons: [
      {
        id: 'eu-u2l1',
        unitId: 'eu-u2',
        title: 'Familia (La Familia)',
        description: 'Vocabulario básico del entorno familiar',
        icon: '👨‍👩‍👧',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-aita', source: 'Aita', translation: 'padre' },
          { id: 'eu-ama', source: 'Ama', translation: 'madre' },
          { id: 'eu-anaia', source: 'Anaia', translation: 'hermano (de varón)' },
          { id: 'eu-arreba', source: 'Arreba', translation: 'hermana (de varón)' },
          { id: 'eu-semea', source: 'Semea', translation: 'hijo' },
          { id: 'eu-alaba', source: 'Alaba', translation: 'hija' },
        ],
        vocab: [
          { en: 'Aita', es: 'padre' },
          { en: 'Ama', es: 'madre' },
          { en: 'Semea', es: 'hijo' },
          { en: 'Alaba', es: 'hija' },
        ],
        exercises: [
          {
            id: 'eu-u2l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Ama" en euskera?',
            question: 'Selecciona el significado:',
            options: ['Madre', 'Padre', 'Hija', 'Hermana'],
            answer: 'Madre',
            audioText: 'Ama',
          },
        ],
      },
      {
        id: 'eu-u2l2',
        unitId: 'eu-u2',
        title: 'Lagunak eta Etxea (Amigos y Casa)',
        description: 'Describir a amigos y el hogar',
        icon: '🏡',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-laguna', source: 'Laguna', translation: 'amigo/a' },
          { id: 'eu-etxea', source: 'Etxea', translation: 'la casa' },
          { id: 'eu-handia', source: 'Handia', translation: 'grande' },
          { id: 'eu-txikia', source: 'Txikia', translation: 'pequeño/a' },
          { id: 'eu-ederra', source: 'Ederra', translation: 'bonito/a' },
          { id: 'eu-ona', source: 'Ona', translation: 'bueno/a' },
        ],
        vocab: [
          { en: 'Laguna', es: 'amigo/a' },
          { en: 'Etxea', es: 'la casa' },
        ],
        exercises: [
          {
            id: 'eu-u2l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "amigo" en euskera?',
            question: 'Selecciona la opción correcta:',
            options: ['Laguna', 'Etxea', 'Handia', 'Ederra'],
            answer: 'Laguna',
            audioText: 'Laguna',
          },
        ],
      },
    ],
  },
  {
    id: 'eu-u3',
    level: 'A1',
    title: 'Jana eta Edana (Comida y Bebida)',
    description: 'Expresiones elementales para pedir en tabernas y restaurantes',
    color: '#e67e22',
    lessons: [
      {
        id: 'eu-u3l1',
        unitId: 'eu-u3',
        title: 'Edariak eta Pintxoak (Bebidas y Pintxos)',
        description: 'Pedir bebidas y comida en euskera',
        icon: '🍷',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-ura', source: 'Ura', translation: 'agua' },
          { id: 'eu-ogia', source: 'Ogia', translation: 'pan' },
          { id: 'eu-gazta', source: 'Gazta', translation: 'queso' },
          { id: 'eu-ardoa', source: 'Ardoa', translation: 'vino' },
          { id: 'eu-garagardoa', source: 'Garagardoa', translation: 'cerveza' },
          { id: 'eu-pintxoa', source: 'Pintxoa', translation: 'el pintxo' },
        ],
        vocab: [
          { en: 'Ura', es: 'agua' },
          { en: 'Ogia', es: 'pan' },
          { en: 'Gazta', es: 'queso' },
        ],
        exercises: [
          {
            id: 'eu-u3l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Ura"?',
            question: 'Selecciona la opción correcta:',
            options: ['Agua', 'Vino', 'Pan', 'Queso'],
            answer: 'Agua',
            audioText: 'Ura',
          },
        ],
      },
      {
        id: 'eu-u3l2',
        unitId: 'eu-u3',
        title: 'Tabernan (En la Taberna)',
        description: 'Pedir la cuenta y dar las gracias',
        icon: '💶',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-kontua', source: 'Kontua, mesedez', translation: 'la cuenta, por favor' },
          { id: 'eu-zenbat', source: 'Zenbat da?', translation: '¿cuánto es?' },
          { id: 'eu-nahi-dut', source: 'Nahi dut', translation: 'quiero' },
          { id: 'eu-on-egin', source: 'On egin!', translation: '¡buen provecho!' },
          { id: 'eu-txokolatea', source: 'Txokolatea', translation: 'el chocolate' },
          { id: 'eu-kafeta', source: 'Kafea', translation: 'el café' },
        ],
        vocab: [
          { en: 'Kontua', es: 'la cuenta' },
          { en: 'On egin', es: 'buen provecho' },
        ],
        exercises: [
          {
            id: 'eu-u3l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo desear "buen provecho"?',
            question: 'Elige la expresión correcta:',
            options: ['On egin!', 'Kaixo!', 'Agur!', 'Egun on!'],
            answer: 'On egin!',
            audioText: 'On egin!',
          },
        ],
      },
    ],
  },
  {
    id: 'eu-u4',
    level: 'A1',
    title: 'Zenbakiak eta Denbora (Números y Tiempo)',
    description: 'Contar del 1 al 5 y expresiones de tiempo',
    color: '#8e44ad',
    lessons: [
      {
        id: 'eu-u4l1',
        unitId: 'eu-u4',
        title: 'Zenbakiak (Números 1-5)',
        description: 'Primeros números en euskera',
        icon: '🔢',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-bat', source: 'Bat', translation: 'uno' },
          { id: 'eu-bi', source: 'Bi', translation: 'dos' },
          { id: 'eu-hiru', source: 'Hiru', translation: 'tres' },
          { id: 'eu-lau', source: 'Lau', translation: 'cuatro' },
          { id: 'eu-bost', source: 'Bost', translation: 'cinco' },
          { id: 'eu-sei', source: 'Sei', translation: 'seis' },
        ],
        vocab: [
          { en: 'Bat', es: 'uno' },
          { en: 'Bi', es: 'dos' },
          { en: 'Hiru', es: 'tres' },
          { en: 'Lau', es: 'cuatro' },
          { en: 'Bost', es: 'cinco' },
        ],
        exercises: [
          {
            id: 'eu-u4l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "tres" en euskera?',
            question: 'Selecciona la opción correcta:',
            options: ['Hiru', 'Bat', 'Bi', 'Bost'],
            answer: 'Hiru',
            audioText: 'Hiru',
          },
        ],
      },
      {
        id: 'eu-u4l2',
        unitId: 'eu-u4',
        title: 'Denbora (El Tiempo)',
        description: 'Hoy, mañana y momentos del día',
        icon: '⏰',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-gaur', source: 'Gaur', translation: 'hoy' },
          { id: 'eu-bihar', source: 'Bihar', translation: 'mañana' },
          { id: 'eu-atzo', source: 'Atzo', translation: 'ayer' },
          { id: 'eu-orain', source: 'Orain', translation: 'ahora' },
          { id: 'eu-goizean', source: 'Goizean', translation: 'por la mañana' },
          { id: 'eu-gauean', source: 'Gauean', translation: 'por la noche' },
        ],
        vocab: [
          { en: 'Gaur', es: 'hoy' },
          { en: 'Bihar', es: 'mañana' },
        ],
        exercises: [
          {
            id: 'eu-u4l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Gaur"?',
            question: 'Selecciona el significado:',
            options: ['Hoy', 'Mañana', 'Ayer', 'Ahora'],
            answer: 'Hoy',
            audioText: 'Gaur',
          },
        ],
      },
    ],
  },
  {
    id: 'eu-u5',
    level: 'A1',
    title: 'Tokiak eta Galderak (Lugares y Preguntas)',
    description: 'Orientación básica y palabras interrogativas',
    color: '#d35400',
    lessons: [
      {
        id: 'eu-u5l1',
        unitId: 'eu-u5',
        title: 'Tokiak (Lugares)',
        description: 'La ciudad, la calle y la montaña',
        icon: '🗺️',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-hiria', source: 'Hiria', translation: 'la ciudad' },
          { id: 'eu-kalea', source: 'Kalea', translation: 'la calle' },
          { id: 'eu-mendia', source: 'Mendia', translation: 'la montaña' },
          { id: 'eu-itsasoa', source: 'Itsasoa', translation: 'el mar' },
          { id: 'eu-oihana', source: 'Oihana', translation: 'el bosque' },
          { id: 'eu-zubi', source: 'Zubia', translation: 'el puente' },
        ],
        vocab: [
          { en: 'Hiria', es: 'la ciudad' },
          { en: 'Mendia', es: 'la montaña' },
        ],
        exercises: [
          {
            id: 'eu-u5l1-ex1',
            type: 'multipleChoice',
            prompt: '¿Cómo se dice "la montaña" en euskera?',
            question: 'Selecciona la opción correcta:',
            options: ['Mendia', 'Hiria', 'Kalea', 'Itsasoa'],
            answer: 'Mendia',
            audioText: 'Mendia',
          },
        ],
      },
      {
        id: 'eu-u5l2',
        unitId: 'eu-u5',
        title: 'Galderak (Preguntas)',
        description: 'Zer, Nor y Nondik',
        icon: '❓',
        language: 'eu',
        level: 'A1',
        words: [
          { id: 'eu-zer', source: 'Zer?', translation: '¿qué?' },
          { id: 'eu-nor', source: 'Nor?', translation: '¿quién?' },
          { id: 'eu-non', source: 'Non?', translation: '¿dónde?' },
          { id: 'eu-nola', source: 'Nola?', translation: '¿cómo?' },
          { id: 'eu-zergatik', source: 'Zergatik?', translation: '¿por qué?' },
          { id: 'eu-noiz', source: 'Noiz?', translation: '¿cuándo?' },
        ],
        vocab: [
          { en: 'Zer', es: '¿qué?' },
          { en: 'Non', es: '¿dónde?' },
        ],
        exercises: [
          {
            id: 'eu-u5l2-ex1',
            type: 'multipleChoice',
            prompt: '¿Qué significa "Non?"?',
            question: 'Selecciona la opción correcta:',
            options: ['¿Dónde?', '¿Qué?', '¿Quién?', '¿Cómo?'],
            answer: '¿Dónde?',
            audioText: 'Non',
          },
        ],
      },
    ],
  },
];

export function getLessonById(id: string): { lesson: Unit['lessons'][number]; unit: Unit } | null {
  for (const unit of UNITS_EU) {
    const found = unit.lessons.find((l) => l.id === id);
    if (found) return { lesson: found, unit };
  }
  return null;
}

export function allLessonsFlat(): readonly { lesson: Unit['lessons'][number]; unit: Unit }[] {
  const result: { lesson: Unit['lessons'][number]; unit: Unit }[] = [];
  for (const unit of UNITS_EU) {
    for (const lesson of unit.lessons) {
      result.push({ lesson, unit });
    }
  }
  return result;
}

export const COURSE_EU: CourseConfig = {
  meta: META_EU_ES,
  units: UNITS_EU,
  getLessonById,
  allLessonsFlat,
};
