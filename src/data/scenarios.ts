import type { Scenario, LanguageCode } from '@/types/learning';

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'cafe-order',
    title: 'Pedir un café y desayuno',
    description: 'Pide tu café favorito, pregunta por la carta y paga la cuenta.',
    icon: '☕',
    category: 'daily',
    level: 'A1',
    city: 'Roma',
    characterId: 'camarero',
    initialGreeting: 'Welcome to the café! What can I get started for you today?',
    targetLanguage: 'en',
    goals: [
      'Saluda y pide una bebida',
      'Pregunta por algo de comer',
      'Pide la cuenta amablemente',
    ],
    vocabulary: ['coffee', 'croissant', 'water', 'menu', 'bill', 'please', 'thank you'],
  },
  {
    id: 'airport-checkin',
    title: 'En el aeropuerto',
    description: 'Factura tu equipaje, muestra tu billete y encuentra tu puerta de embarque.',
    icon: '✈️',
    category: 'travel',
    level: 'A2',
    city: 'London',
    characterId: 'recepcionista',
    initialGreeting: 'Good day! May I see your passport and flight booking, please?',
    targetLanguage: 'en',
    goals: [
      'Muestra tu pasaporte y billete',
      'Informa sobre tu equipaje',
      'Pregunta la puerta de embarque',
    ],
    vocabulary: ['passport', 'boarding pass', 'luggage', 'gate', 'terminal', 'flight'],
  },
  {
    id: 'hotel-reservation',
    title: 'Registro en el hotel',
    description: 'Haz el check-in en recepción, pide la clave del Wi-Fi y horarios de desayuno.',
    icon: '🏨',
    category: 'travel',
    level: 'A2',
    city: 'Paris',
    characterId: 'recepcionista',
    initialGreeting: 'Good evening! Welcome to the Grand Hotel. Do you have a reservation under your name?',
    targetLanguage: 'en',
    goals: [
      'Confirma tu reserva de habitación',
      'Pregunta la contraseña de Wi-Fi',
      'Consulta la hora del desayuno',
    ],
    vocabulary: ['reservation', 'key card', 'Wi-Fi password', 'breakfast', 'elevator', 'room'],
  },
  {
    id: 'restaurant-dinner',
    title: 'Cena en el restaurante',
    description: 'Elige un plato tradicional, pide recomendaciones y postre.',
    icon: '🍝',
    category: 'social',
    level: 'A1',
    city: 'Roma',
    characterId: 'luca',
    initialGreeting: 'Buonasera! Welcome to our restaurant. Would you like to hear today’s special recommendations?',
    targetLanguage: 'it',
    goals: [
      'Pide una mesa para dos',
      'Pregunta por el plato del día',
      'Agradece y pide la cuenta',
    ],
    vocabulary: ['tavolo', 'pasta', 'acqua', 'vino', 'dolce', 'conto', 'grazie'],
  },
  {
    id: 'meet-friend',
    title: 'Conocer a un nuevo amigo',
    description: 'Preséntate, habla de tus aficiones, tu ciudad y haz planes.',
    icon: '🤝',
    category: 'social',
    level: 'A1',
    city: 'Madrid',
    characterId: 'sofia',
    initialGreeting: '¡Hola! Qué alegría conocerte. ¿De dónde eres y qué te gusta hacer en tu tiempo libre?',
    targetLanguage: 'es',
    goals: [
      'Preséntate y di de dónde eres',
      'Comparte dos aficiones que te gusten',
      'Propón una actividad para el fin de semana',
    ],
    vocabulary: ['nombre', 'soy de', 'música', 'viajar', 'amigos', 'café', 'planes'],
  },
  {
    id: 'job-interview',
    title: 'Entrevista de trabajo',
    description: 'Explica tu experiencia laboral, tus habilidades y motivación.',
    icon: '💼',
    category: 'work',
    level: 'B1',
    city: 'Berlin',
    characterId: 'entrevistador',
    initialGreeting: 'Good morning. Thank you for coming. Could you start by introducing yourself and your professional experience?',
    targetLanguage: 'en',
    goals: [
      'Describe tu perfil profesional',
      'Menciona una fortaleza clave',
      'Explica por qué te interesa el puesto',
    ],
    vocabulary: ['experience', 'skills', 'teamwork', 'motivation', 'strengths', 'projects'],
  },
  {
    id: 'supermarket',
    title: 'En el supermercado',
    description: 'Busca productos frescos, pregunta precios y pide en caja.',
    icon: '🛒',
    category: 'daily',
    level: 'A1',
    city: 'Lisboa',
    characterId: 'ana',
    initialGreeting: 'Olá! Posso ajudar a encontrar algum produto no supermercado hoje?',
    targetLanguage: 'pt',
    goals: [
      'Pregunta por la sección de frutas',
      'Pregunta el precio de un artículo',
      'Paga con tarjeta o efectivo',
    ],
    vocabulary: ['fruta', 'pão', 'leite', 'quanto custa', 'cartão', 'dinheiro', 'obrigado'],
  },
  {
    id: 'taxi-directions',
    title: 'En el taxi / Preguntar direcciones',
    description: 'Indica tu destino al conductor y pide la mejor ruta.',
    icon: '🚕',
    category: 'travel',
    level: 'A1',
    city: 'Berlin',
    characterId: 'hans',
    initialGreeting: 'Hallo! Wohin möchten Sie heute fahren?',
    targetLanguage: 'de',
    goals: [
      'Indica la dirección o monumento al que vas',
      'Pregunta cuánto tiempo tardará',
      'Pregunta el precio del viaje',
    ],
    vocabulary: ['Adresse', 'Bahnhof', 'Hotel', 'Wie lange', 'Wie viel kostet', 'Danke'],
  },
];

export function getScenarioById(id: string | undefined): Scenario | undefined {
  if (!id) return undefined;
  return SCENARIOS.find((s) => s.id === id);
}

export function getScenariosForLanguage(language: LanguageCode): readonly Scenario[] {
  // Return scenarios matching target language or global English/travel scenarios
  return SCENARIOS.filter(
    (s) => s.targetLanguage === language || s.targetLanguage === 'en'
  );
}
