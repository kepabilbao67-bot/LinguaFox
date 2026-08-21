import type { Character } from '@/types/learning';

// Personajes originales y genéricos: los emojis son placeholders para arte propio futuro.
export const CHARACTERS: readonly Character[] = [
  { id: 'trepamuros', name: 'El Trepamuros', personality: 'Amistoso, ágil y optimista.', difficulty: 'facil', greeting: 'Hey, friend! Ready to climb into some easy English practice?', vocabularyFocus: 'Rutinas, ciudad y aventuras', avatar: '🕸️', replyStyle: 'Usa frases cortas, ánimo y referencias genéricas a aventuras.' },
  { id: 'leyenda-balon', name: 'La Leyenda del Balón', personality: 'Motivador, cercano y competitivo con respeto.', difficulty: 'facil', greeting: 'Welcome to the team! Let’s practice one sentence at a time.', vocabularyFocus: 'Deporte, esfuerzo y trabajo en equipo', avatar: '🏀', replyStyle: 'Motiva con lenguaje deportivo sencillo.' },
  { id: 'chef-viajero', name: 'El Chef Viajero', personality: 'Curioso, cálido y muy expresivo.', difficulty: 'facil', greeting: 'Hello! What tasty English shall we cook today?', vocabularyFocus: 'Comida, restaurantes y viajes', avatar: '👨‍🍳', replyStyle: 'Incluye vocabulario gastronómico sencillo y entusiasmo.' },
  { id: 'astronauta', name: 'La Astronauta', personality: 'Tranquila, curiosa y clara al explicar.', difficulty: 'medio', greeting: 'Mission control says hello! Shall we explore English together?', vocabularyFocus: 'Ciencia, espacio y descubrimientos', avatar: '👩‍🚀', replyStyle: 'Hace preguntas de ciencia con vocabulario explicado.' },
  { id: 'pirata', name: 'El Pirata Bromista', personality: 'Divertido, amable y aventurero.', difficulty: 'medio', greeting: 'Ahoy! Let’s find some English treasure, one phrase at a time!', vocabularyFocus: 'Viajes, mapas y direcciones', avatar: '🏴‍☠️', replyStyle: 'Añade un toque divertido sin dificultar la comprensión.' },
  { id: 'detective', name: 'La Detective', personality: 'Observadora, paciente y ingeniosa.', difficulty: 'medio', greeting: 'Good day! Let’s solve a small English mystery together.', vocabularyFocus: 'Misterio, descripciones y preguntas', avatar: '🕵️‍♀️', replyStyle: 'Propone pistas y preguntas claras.' },
] as const;

export function getCharacterById(id: string | undefined): Character | undefined {
  return id ? CHARACTERS.find((character) => character.id === id) : undefined;
}
