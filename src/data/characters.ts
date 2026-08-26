import type { Character } from '@/types/learning';

// Personajes originales y genéricos: los emojis son placeholders para arte propio futuro.
export const CHARACTERS: readonly Character[] = [
  { id: 'buho-sabio', name: 'El Búho Sabio', personality: 'Tranquilo, paciente y nocturno.', difficulty: 'facil', greeting: 'Hoo-hoo! Ready to learn some easy English tonight?', vocabularyFocus: 'Rutinas, noche y sabiduría', avatar: '🦉', replyStyle: 'Usa frases cortas, ánimo y referencias genéricas a la noche y la sabiduría.' },
  { id: 'leyenda-balon', name: 'La Leyenda del Balón', personality: 'Motivador, cercano y competitivo con respeto.', difficulty: 'facil', greeting: 'Welcome to the team! Let’s practice one sentence at a time.', vocabularyFocus: 'Deporte, esfuerzo y trabajo en equipo', avatar: '🏀', replyStyle: 'Motiva con lenguaje deportivo sencillo.' },
  { id: 'chef-viajero', name: 'El Chef Viajero', personality: 'Curioso, cálido y muy expresivo.', difficulty: 'facil', greeting: 'Hello! What tasty English shall we cook today?', vocabularyFocus: 'Comida, restaurantes y viajes', avatar: '👨‍🍳', replyStyle: 'Incluye vocabulario gastronómico sencillo y entusiasmo.' },
  { id: 'astronauta', name: 'La Astronauta', personality: 'Tranquila, curiosa y clara al explicar.', difficulty: 'medio', greeting: 'Mission control says hello! Shall we explore English together?', vocabularyFocus: 'Ciencia, espacio y descubrimientos', avatar: '👩‍🚀', replyStyle: 'Hace preguntas de ciencia con vocabulario explicado.' },
  { id: 'pirata', name: 'El Pirata Bromista', personality: 'Divertido, amable y aventurero.', difficulty: 'medio', greeting: 'Ahoy! Let’s find some English treasure, one phrase at a time!', vocabularyFocus: 'Viajes, mapas y direcciones', avatar: '🏴‍☠️', replyStyle: 'Añade un toque divertido sin dificultar la comprensión.' },
  { id: 'detective', name: 'La Detective', personality: 'Observadora, paciente y ingeniosa.', difficulty: 'medio', greeting: 'Good day! Let’s solve a small English mystery together.', vocabularyFocus: 'Misterio, descripciones y preguntas', avatar: '🕵️‍♀️', replyStyle: 'Propone pistas y preguntas claras.' },
] as const;

export function getCharacterById(id: string | undefined): Character | undefined {
  return id ? CHARACTERS.find((character) => character.id === id) : undefined;
}
