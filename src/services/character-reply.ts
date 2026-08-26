import { getCharacterById } from '@/data/characters';
import type { Character, CharacterReply, ChatCorrection } from '@/types/learning';

function getCorrection(text: string): ChatCorrection | undefined {
  if (/\bi goed\b/i.test(text)) return { correctedText: text.replace(/\bi goed\b/i, 'I went'), explanation: 'Oops, I think you meant: “I went”. Go → went in the past. / “Go” cambia a “went”.' };
  if (/\bi no understand\b/i.test(text)) return { correctedText: text.replace(/\bi no understand\b/i, "I don't understand"), explanation: 'Use “I don’t understand”. / Usa “I don’t understand”.' };
  if (/^i\b/.test(text.trim())) return { correctedText: `I${text.trim().slice(1)}`, explanation: 'Remember the capital “I”. / Recuerda la mayúscula en “I”.' };
  return undefined;
}

function replyForCharacter(character: Character, text: string, correction?: ChatCorrection): CharacterReply {
  const simple = character.difficulty === 'facil';
  const intro = correction ? 'Oops, good try! ' : '';
  const prompts: Record<string, { text: string; suggestions: readonly string[] }> = {
    'buho-sabio': { text: `${intro}Great thinking! What do you like to do at night?`, suggestions: ['I like reading books.', 'I go to sleep early.', 'I look at the stars.'] },
    'leyenda-balon': { text: `${intro}Nice teamwork! What sport do you enjoy?`, suggestions: ['I like basketball.', 'I play with my friends.', 'I watch sports.'] },
    'chef-viajero': { text: `${intro}Delicious answer! What is your favorite food?`, suggestions: ['I like pizza.', 'My favorite food is pasta.', 'I like cooking.'] },
    astronauta: { text: `${intro}Excellent mission report. What would you like to discover in space?`, suggestions: ['I want to see the Moon.', 'I like stars.', 'Space is interesting.'] },
    pirata: { text: `${intro}Ahoy, brave learner! Where would you travel on a treasure map?`, suggestions: ['I want to go to an island.', 'I like maps.', 'I travel by boat.'] },
    detective: { text: `${intro}Interesting clue! Can you describe what you see?`, suggestions: ['I see a small house.', 'It is blue.', 'There is a dog.'] },
  };
  const themed = prompts[character.id] ?? { text: `${intro}Tell me more about ${character.vocabularyFocus.toLowerCase()}.`, suggestions: ['Can you repeat?', 'I like this topic.', 'What do you think?'] };
  const levelNote = simple ? ' Keep it short and simple.' : ' Try adding one more detail.';
  return { text: `${themed.text}${levelNote}`, correction, suggestions: themed.suggestions, levelHint: character.difficulty };
}

/** Punto de integración para voz/LLM reales: reemplazar el simulador por fetch a una API segura. */
export async function fetchCharacterReply(characterId: string, userText: string): Promise<CharacterReply | undefined> {
  const character = getCharacterById(characterId);
  const text = userText.trim();
  if (!character || !text) return undefined;
  return replyForCharacter(character, text, getCorrection(text));
}
