import { getCharacterById } from '../data/characters';
import { createPedagogicalCorrection } from './tutor-reply';
import type { CharacterReply } from '../types/learning';

const CHARACTER_RESPONSES: Record<
  string,
  {
    responses: readonly { text: string; translation?: string }[];
    suggestions: readonly string[];
  }
> = {
  fox: {
    responses: [
      { text: '¡Excelente intento! Me encanta cómo practicas. ¿Qué más te gustaría contarme?', translation: 'Great try! I love how you practice. What else would you like to tell me?' },
      { text: '¡Vas por muy buen camino! Cada frase te acerca más a la fluidez. Sigamos conversando.', translation: 'You are on the right track! Every sentence brings you closer to fluency.' },
      { text: '¡Esa es una buena forma de decirlo! ¿Te animas a añadir una frase más sobre este tema?', translation: 'That is a good way to say it! Would you like to add one more sentence?' },
    ],
    suggestions: ['¿Puedes darme un ejemplo?', 'Quiero practicar otra frase.', '¿Cómo se dice en inglés?'],
  },
  emma: {
    responses: [
      { text: 'Lovely! London is famous for afternoon tea and museums. Have you ever visited the UK?', translation: '¡Encantador! Londres es famosa por el té y los museos. ¿Has visitado el Reino Unido?' },
      { text: 'That sounds brilliant! I love spending weekends in Hyde Park listening to live music.', translation: '¡Suena genial! Me encanta pasar los fines de semana en Hyde Park escuchando música en vivo.' },
      { text: 'Spot on! Tell me, what kind of music or films do you usually enjoy?', translation: '¡Exacto! Dime, ¿qué tipo de música o películas sueles disfrutar?' },
    ],
    suggestions: ['I love British culture!', 'I want to visit Big Ben.', 'Tell me about London tea.'],
  },
  luca: {
    responses: [
      { text: 'Mamma mia, che bello! In Italy food is art and family. What is your favorite Italian dish?', translation: '¡Qué maravilla! En Italia la comida es arte y familia. ¿Cuál es tu plato italiano favorito?' },
      { text: 'Perfetto! A good espresso in the morning and a plate of fresh pasta make any day special.', translation: '¡Perfecto! Un buen café por la mañana y pasta fresca hacen especial cualquier día.' },
      { text: 'Molto bene! Tell me, do you prefer cooking at home or going out to a traditional trattoria?', translation: '¡Muy bien! Dime, ¿prefieres cocinar en casa o ir a una trattoria tradicional?' },
    ],
    suggestions: ['Mi piace la pizza margherita.', 'Adoro la pasta fresca.', 'Un caffè per favore!'],
  },
  sofia: {
    responses: [
      { text: '¡Qué bien! Madrid tiene una energía increíble en sus plazas y terrazas. ¿Te gusta pasear?', translation: 'How nice! Madrid has an incredible energy in its squares and terraces.' },
      { text: '¡Totalmente de acuerdo! Tapear por La Latina con amigos es uno de mis planes favoritos.', translation: 'I completely agree! Eating tapas in La Latina with friends is one of my favorite plans.' },
      { text: '¡Qué interesante! Cuéntame qué ciudades o lugares te gustaría visitar en tus próximos viajes.', translation: 'How interesting! Tell me what cities or places you would like to visit next.' },
    ],
    suggestions: ['Me encanta viajar.', 'Quiero visitar el Museo del Prado.', '¿Qué tapas recomiendas?'],
  },
  hans: {
    responses: [
      { text: 'Sehr gut! Berlin ist eine Stadt voller Geschichte, Technologie und modernem Design.', translation: '¡Muy bien! Berlín es una ciudad llena de historia, tecnología y diseño moderno.' },
      { text: 'Das ist interessant. In Deutschland schätzen wir Pünktlichkeit, klare Struktur und gute Ideen.', translation: 'Eso es interesante. En Alemania valoramos la puntualidad, la estructura y las buenas ideas.' },
      { text: 'Ausgezeichnet! Was machst du beruflich oder was lernst du im Moment?', translation: '¡Excelente! ¿A qué te dedicas o qué estás aprendiendo en este momento?' },
    ],
    suggestions: ['Ich lerne gerne Deutsch.', 'Berlin ist sehr interessant.', 'Ich mag moderne Technologie.'],
  },
  ana: {
    responses: [
      { text: 'Que maravilha! Lisboa é mágica ao entardecer junto ao rio Tejo. Já viste as fotografias?', translation: '¡Qué maravilla! Lisboa es mágica al atardecer junto al río Tajo. ¿Has visto las fotos?' },
      { text: 'Muito bem! Um passeio de elétrico por Alfama acompanhado de um pastel de nata é perfeito.', translation: '¡Muy bien! Un paseo en tranvía por Alfama con un pastel de nata es perfecto.' },
      { text: 'Adoro! Diz-me, gostas mais de tirar fotografias à natureza ou a cidades antigas?', translation: '¡Me encanta! Dime, ¿te gusta más fotografiar la naturaleza o ciudades antiguas?' },
    ],
    suggestions: ['Adoro viajar por Portugal.', 'Quero provar pastéis de nata.', 'Lisboa é muito bonita.'],
  },
  camarero: {
    responses: [
      { text: 'Of course! Today we have fresh pastries, espresso, cappuccino and herbal tea. What would you like?', translation: '¡Por supuesto! Hoy tenemos bollería fresca, espresso, cappuccino y té. ¿Qué te gustaría?' },
      { text: 'Excellent choice! Would you like that with regular milk, oat milk, or black?', translation: '¡Excelente elección! ¿Lo quieres con leche normal, de avena o solo?' },
      { text: 'Right away! Can I get you any water or dessert to go with that?', translation: '¡Enseguida! ¿Te traigo agua o algún postre para acompañar?' },
    ],
    suggestions: ['A cappuccino and a croissant, please.', 'Can I see the menu?', 'How much is the total?'],
  },
  recepcionista: {
    responses: [
      { text: 'Welcome! I have your reservation ready. Your room is on the 4th floor with a lovely city view.', translation: '¡Bienvenido! Tengo su reserva lista. Su habitación está en la 4ª planta con vistas a la ciudad.' },
      { text: 'Breakfast is served in the main dining hall from 7:00 to 10:30 AM. Here is your key card.', translation: 'El desayuno se sirve en el comedor principal de 7:00 a 10:30. Aquí tiene su tarjeta.' },
      { text: 'The Wi-Fi network is "HotelGuest" and no password is required. Do you need luggage assistance?', translation: 'La red Wi-Fi es "HotelGuest" y no requiere contraseña. ¿Necesita ayuda con las maletas?' },
    ],
    suggestions: ['What time is check-out?', 'Can you recommend a restaurant nearby?', 'Thank you for your help!'],
  },
  entrevistador: {
    responses: [
      { text: 'Thank you for that overview. How do you usually handle challenges or tight deadlines in a team?', translation: 'Gracias por ese resumen. ¿Cómo sueles gestionar desafíos o plazos ajustados en equipo?' },
      { text: 'That’s a great quality. Where do you see your professional skills evolving over the next two years?', translation: 'Es una gran cualidad. ¿Dónde te ves desarrollando tus habilidades en los próximos dos años?' },
      { text: 'Very impressive. Do you have any questions for us regarding the company culture or the role?', translation: 'Muy impresionante. ¿Tienes alguna pregunta sobre la cultura de la empresa o el puesto?' },
    ],
    suggestions: ['I enjoy solving complex problems.', 'I work well under pressure.', 'What are the main goals of this role?'],
  },
  'buho-sabio': {
    responses: [
      { text: 'Hoo-hoo! Wisdom comes with daily practice. What do you enjoy reflecting on at night?', translation: '¡Hoo-hoo! La sabiduría llega con la práctica diaria. ¿Sobre qué te gusta reflexionar de noche?' },
    ],
    suggestions: ['I like reading books.', 'I go to sleep early.', 'I look at the stars.'],
  },
  'leyenda-balon': {
    responses: [
      { text: 'Nice teamwork! Passion and practice are the keys to victory. What sport inspires you?', translation: '¡Buen trabajo de equipo! La pasión y la práctica son la clave de la victoria.' },
    ],
    suggestions: ['I like basketball.', 'I play with my friends.', 'I watch sports.'],
  },
  'chef-viajero': {
    responses: [
      { text: 'Delicious answer! The secret ingredient is love for the craft. What is your favorite recipe?', translation: '¡Deliciosa respuesta! El ingrediente secreto es el amor por el oficio.' },
    ],
    suggestions: ['I like pizza.', 'My favorite food is pasta.', 'I like cooking.'],
  },
  astronauta: {
    responses: [
      { text: 'Mission control confirms! Exploration begins with curiosity. What would you like to discover in space?', translation: '¡Control de misión confirma! La exploración comienza con curiosidad.' },
    ],
    suggestions: ['I want to see the Moon.', 'I like stars.', 'Space is interesting.'],
  },
  pirata: {
    responses: [
      { text: 'Ahoy, brave learner! Every word learned is a shiny gold coin in your chest. Where to next?', translation: '¡Ahoy, valiente aprendiz! Cada palabra aprendida es una moneda de oro en tu cofre.' },
    ],
    suggestions: ['I want to go to an island.', 'I like maps.', 'I travel by boat.'],
  },
  detective: {
    responses: [
      { text: 'Interesting clue! Every sentence reveals a piece of the puzzle. What else did you notice?', translation: '¡Interesante pista! Cada frase revela una pieza del puzle. ¿Qué más notaste?' },
    ],
    suggestions: ['I see a small house.', 'It is blue.', 'There is a dog.'],
  },
};

export async function fetchCharacterReply(
  characterId: string,
  userText: string
): Promise<CharacterReply | undefined> {
  const character = getCharacterById(characterId);
  const text = userText.trim();
  if (!character || !text) return undefined;

  const correction = createPedagogicalCorrection(text);
  const pool = CHARACTER_RESPONSES[character.id] ?? CHARACTER_RESPONSES.fox;

  const idx = Math.abs(text.length) % pool.responses.length;
  const picked = pool.responses[idx];

  let replyText = picked.text;
  if (correction) {
    replyText = `Good try! ${replyText}`;
  }

  const levelNote =
    character.difficulty === 'facil'
      ? ' Keep it short and simple.'
      : ' Try adding one more detail.';

  return {
    text: `${replyText}${levelNote}`,
    translation: picked.translation,
    correction,
    suggestions: pool.suggestions,
    levelHint: character.difficulty,
  };
}
