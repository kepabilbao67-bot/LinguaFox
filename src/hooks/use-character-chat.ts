import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { Character, CharacterMessage } from '@/types/learning';

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createGreeting(character: Character): CharacterMessage {
  return { id: createId('character'), characterId: character.id, role: 'tutor', text: character.greeting, createdAt: new Date().toISOString() };
}

function isCharacterMessage(value: unknown, characterId: string): value is CharacterMessage {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const message = value as Record<string, unknown>;
  return typeof message.id === 'string' && message.characterId === characterId && (message.role === 'tutor' || message.role === 'user') && typeof message.text === 'string' && typeof message.createdAt === 'string';
}

export function useCharacterChat(character: Character) {
  const storageKey = `@linguafox/character-chat/v1/${character.id}`;
  const [messages, setMessages] = useState<readonly CharacterMessage[]>([createGreeting(character)]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory(): Promise<void> {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const parsed = stored ? (JSON.parse(stored) as unknown) : [];
        const history = Array.isArray(parsed)
          ? parsed.filter((message): message is CharacterMessage => isCharacterMessage(message, character.id))
          : [];
        if (isMounted && history.length > 0) setMessages(history);
      } catch (error: unknown) {
        console.warn('No se pudo cargar la charla del personaje.', error);
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    }
    void loadHistory();
    return () => { isMounted = false; };
  }, [character.id, storageKey]);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(messages)).catch((error: unknown) => {
      console.warn('No se pudo guardar la charla del personaje.', error);
    });
  }, [isHydrated, messages, storageKey]);

  const appendMessage = useCallback((message: CharacterMessage): void => {
    if (!isCharacterMessage(message, character.id) || !message.text.trim()) return;
    setMessages((current) => [...current, message]);
  }, [character.id]);

  const createMessage = useCallback((role: CharacterMessage['role'], text: string, correction?: CharacterMessage['correction']): CharacterMessage => ({
    id: createId(role), characterId: character.id, role, text: text.trim(), createdAt: new Date().toISOString(), ...(correction ? { correction } : {}),
  }), [character.id]);

  const startNewConversation = useCallback(() => setMessages([createGreeting(character)]), [character]);

  return { messages, isHydrated, appendMessage, createMessage, startNewConversation };
}
