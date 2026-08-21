import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { Message } from '@/types/learning';

const STORAGE_KEY = '@linguafox/tutor-chat/v1';

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createWelcomeMessage(): Message {
  return {
    id: createId('tutor'),
    role: 'tutor',
    text: 'Hi! I’m Fox 🦊. Let’s practice English together. How are you today?',
    createdAt: new Date().toISOString(),
  };
}

function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const message = value as Record<string, unknown>;
  return (
    typeof message.id === 'string' &&
    (message.role === 'tutor' || message.role === 'user') &&
    typeof message.text === 'string' &&
    typeof message.createdAt === 'string'
  );
}

function sanitizeHistory(value: unknown): Message[] {
  return Array.isArray(value) ? value.filter(isMessage) : [];
}

interface ChatHistory {
  messages: readonly Message[];
  isHydrated: boolean;
  appendMessage: (message: Message) => void;
  createMessage: (role: Message['role'], text: string, correction?: Message['correction']) => Message;
  startNewConversation: () => void;
}

export function useChatHistory(): ChatHistory {
  const [messages, setMessages] = useState<readonly Message[]>([createWelcomeMessage()]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory(): Promise<void> {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const history = stored ? sanitizeHistory(JSON.parse(stored) as unknown) : [];
        if (isMounted && history.length > 0) setMessages(history);
      } catch (error: unknown) {
        console.warn('No se pudo cargar el historial del tutor.', error);
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    }

    void loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages)).catch((error: unknown) => {
      console.warn('No se pudo guardar el historial del tutor.', error);
    });
  }, [isHydrated, messages]);

  const appendMessage = useCallback((message: Message) => {
    if (!isMessage(message) || !message.text.trim()) return;
    setMessages((current) => [...current, message]);
  }, []);

  const createMessage = useCallback(
    (role: Message['role'], text: string, correction?: Message['correction']): Message => ({
      id: createId(role),
      role,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      ...(correction ? { correction } : {}),
    }),
    [],
  );

  const startNewConversation = useCallback(() => setMessages([createWelcomeMessage()]), []);

  return { messages, isHydrated, appendMessage, createMessage, startNewConversation };
}
