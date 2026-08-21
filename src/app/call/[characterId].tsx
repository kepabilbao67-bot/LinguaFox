import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { CharacterCallScreen } from '@/components/screens/character-call-screen';
import { getCharacterById } from '@/data/characters';
export default function CallRoute() { const { characterId } = useLocalSearchParams<{ characterId?: string }>(); const character = getCharacterById(characterId); return character ? <CharacterCallScreen character={character}/> : <ScreenContainer title="Llamada"><EmptyState title="Personaje no encontrado" message="No se puede iniciar esta llamada." /></ScreenContainer>; }
