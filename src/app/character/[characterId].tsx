import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { CharacterScreen } from '@/components/screens/character-screen';
import { getCharacterById } from '@/data/characters';
export default function CharacterRoute() { const { characterId } = useLocalSearchParams<{ characterId?: string }>(); const character = getCharacterById(characterId); return character ? <CharacterScreen character={character}/> : <ScreenContainer title="Personaje"><EmptyState title="Personaje no encontrado" message="El personaje solicitado no existe." /></ScreenContainer>; }
