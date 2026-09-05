import type { CityAdventure, LanguageCode } from '@/types/learning';

export const CITIES: readonly CityAdventure[] = [
  {
    id: 'london',
    name: 'Londres',
    country: 'Reino Unido',
    flag: '🇬🇧',
    emoji: '💂‍♂️',
    level: 'A1',
    description: 'Recorre el Támesis, viaja en el Underground y pide un té tradicional.',
    landmarks: ['Big Ben', 'Tower Bridge', 'Hyde Park', 'Camden Market'],
    vocabulary: ['underground', 'ticket', 'afternoon tea', 'museum', 'bridge', 'umbrella'],
    scenarios: ['cafe-order', 'airport-checkin'],
    xpReward: 150,
  },
  {
    id: 'roma',
    name: 'Roma',
    country: 'Italia',
    flag: '🇮🇹',
    emoji: '🏛️',
    level: 'A1',
    description: 'Descubre el Coliseo, pide el mejor espresso y charla con un chef local.',
    landmarks: ['Colosseo', 'Fontana di Trevi', 'Piazza Navona', 'Trastevere'],
    vocabulary: ['caffè', 'pasta', 'gelato', 'piazza', 'storia', 'meraviglioso'],
    scenarios: ['restaurant-dinner', 'cafe-order'],
    xpReward: 150,
  },
  {
    id: 'berlin',
    name: 'Berlín',
    country: 'Alemania',
    flag: '🇩🇪',
    emoji: '🥨',
    level: 'A2',
    description: 'Camina por la Puerta de Brandenburgo y explora el arte urbano y la tecnología.',
    landmarks: ['Brandenburger Tor', 'Museumsinsel', 'Alexanderplatz', 'Tiergarten'],
    vocabulary: ['U-Bahn', 'Bahnhof', 'Kaffee', 'Museum', 'Technologie', 'Brot'],
    scenarios: ['taxi-directions', 'job-interview'],
    xpReward: 200,
  },
  {
    id: 'lisboa',
    name: 'Lisboa',
    country: 'Portugal',
    flag: '🇵🇹',
    emoji: '🚋',
    level: 'A1',
    description: 'Súbete al tranvía 28, prueba los pastéis de nata y disfruta de los miradores al Atlántico.',
    landmarks: ['Torre de Belém', 'Alfama', 'Praça do Comércio', 'Miradouro'],
    vocabulary: ['elétrico', 'pastéis de nata', 'miradouro', 'mar', 'fado', 'praia'],
    scenarios: ['supermarket', 'cafe-order'],
    xpReward: 150,
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'España',
    flag: '🇪🇸',
    emoji: '💃',
    level: 'A1',
    description: 'Pasea por el Retiro, tapea en La Latina y conversa con los lugareños.',
    landmarks: ['Plaza Mayor', 'Parque del Retiro', 'Gran Vía', 'Museo del Prado'],
    vocabulary: ['tapas', 'metro', 'museo', 'parque', 'terraza', 'amigos'],
    scenarios: ['meet-friend', 'cafe-order'],
    xpReward: 150,
  },
  {
    id: 'paris',
    name: 'París',
    country: 'Francia',
    flag: '🇫🇷',
    emoji: '🥐',
    level: 'A2',
    description: 'Admira la Torre Eiffel, pasea por Montmartre y pide en una panadería artesanal.',
    landmarks: ['Tour Eiffel', 'Louvre', 'Montmartre', 'Notre-Dame'],
    vocabulary: ['croissant', 'métro', 'boulangerie', 'café', 'art', 'musée'],
    scenarios: ['hotel-reservation', 'cafe-order'],
    xpReward: 180,
  },
  {
    id: 'newyork',
    name: 'Nueva York',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    emoji: '🗽',
    level: 'B1',
    description: 'Cruza el puente de Brooklyn, pasea por Broadway y pide en un auténtico deli neoyorquino.',
    landmarks: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    vocabulary: ['subway', 'deli', 'avenue', 'skyscraper', 'theater', 'bagel'],
    scenarios: ['cafe-order', 'job-interview'],
    xpReward: 220,
  },
];

export function getCityById(id: string | undefined): CityAdventure | undefined {
  if (!id) return undefined;
  return CITIES.find((c) => c.id === id);
}

export function getCityForLanguage(language: LanguageCode): CityAdventure {
  switch (language) {
    case 'it':
      return CITIES.find((c) => c.id === 'roma')!;
    case 'de':
      return CITIES.find((c) => c.id === 'berlin')!;
    case 'pt':
      return CITIES.find((c) => c.id === 'lisboa')!;
    case 'es':
      return CITIES.find((c) => c.id === 'madrid')!;
    case 'fr':
      return CITIES.find((c) => c.id === 'paris')!;
    case 'en':
    default:
      return CITIES.find((c) => c.id === 'london')!;
  }
}
