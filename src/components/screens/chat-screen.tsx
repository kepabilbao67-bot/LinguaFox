import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { useChatHistory } from '@/hooks/use-chat-history';
import { fetchTutorReply, INITIAL_TUTOR_SUGGESTIONS } from '@/services/tutor-reply';
import type { Message } from '@/types/learning';

export function ChatScreen() {
  const { messages, isHydrated, appendMessage, createMessage, startNewConversation } = useChatHistory();
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState<readonly string[]>(INITIAL_TUTOR_SUGGESTIONS);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToLatest = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const cleanText = text.trim();
      if (!cleanText || isSending || !isHydrated) return;

      appendMessage(createMessage('user', cleanText));
      setDraft('');
      setIsSending(true);

      try {
        const reply = await fetchTutorReply(cleanText);
        if (!reply) {
          appendMessage(
            createMessage('tutor', 'I’m still here. Could you try saying that in a different way?'),
          );
          return;
        }

        appendMessage(createMessage('tutor', reply.text, reply.correction));
        setSuggestions(reply.suggestions);
      } catch (error: unknown) {
        if (__DEV__) console.warn('No se pudo obtener la respuesta del tutor.', error instanceof Error ? error.name : 'Unknown');
        appendMessage(
          createMessage('tutor', 'El tutor está temporalmente no disponible. Inténtalo de nuevo en unos minutos.')
        );
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage, createMessage, isHydrated, isSending],
  );

  const startFreshConversation = (): void => {
    if (isSending) return;
    startNewConversation();
    setSuggestions(INITIAL_TUTOR_SUGGESTIONS);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Text style={styles.headerButtonText}>‹ Volver</Text>
          </Pressable>
          <View style={styles.tutorIdentity}>
            {/* Placeholder: sustituible por una ilustración original del zorro. */}
            <Text style={styles.avatar}>🦊</Text>
            <View>
              <Text style={styles.tutorName}>Fox, tu tutor</Text>
              <Text style={styles.tutorStatus}>Modo práctica</Text>
            </View>
          </View>
          <Pressable
            disabled={isSending}
            style={[styles.headerButton, isSending && styles.disabled]}
            onPress={startFreshConversation}>
            <Text style={styles.headerButtonText}>Nueva</Text>
          </Pressable>
        </View>

        {!isHydrated ? (
          <View style={styles.loading}>
            <ActivityIndicator color={AppColors.primaryBright} size="large" />
            <Text style={styles.loadingText}>Cargando conversación…</Text>
          </View>
        ) : (
          <>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messages}
              contentContainerStyle={styles.messagesContent}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={scrollToLatest}>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSending ? (
                <View style={[styles.bubbleRow, styles.tutorRow]}>
                  <Text style={styles.avatar}>🦊</Text>
                  <View style={[styles.bubble, styles.tutorBubble]}>
                    <Text style={styles.typingText}>Fox está escribiendo…</Text>
                  </View>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.composer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionRow}
                keyboardShouldPersistTaps="handled">
                {suggestions.map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    disabled={isSending}
                    style={[styles.suggestion, isSending && styles.disabled]}
                    onPress={() => void sendMessage(suggestion)}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.inputRow}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Escribe en inglés…"
                  placeholderTextColor={AppColors.textMuted}
                  style={styles.input}
                  multiline
                  maxLength={500}
                  editable={!isSending}
                  returnKeyType="send"
                  onSubmitEditing={() => void sendMessage(draft)}
                  accessibilityLabel="Mensaje para el tutor"
                />
                <Pressable
                  disabled={!draft.trim() || isSending}
                  style={[
                    styles.sendButton,
                    (!draft.trim() || isSending) && styles.sendButtonDisabled,
                  ]}
                  onPress={() => void sendMessage(draft)}>
                  <Text style={styles.sendButtonText}>Enviar</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isTutor = message.role === 'tutor';

  return (
    <View style={[styles.bubbleRow, isTutor ? styles.tutorRow : styles.userRow]}>
      {isTutor ? <Text style={styles.avatar}>🦊</Text> : null}
      <View style={[styles.bubble, isTutor ? styles.tutorBubble : styles.userBubble]}>
        <Text style={styles.messageText} selectable>
          {message.text}
        </Text>
        {message.correction ? (
          <View style={styles.correction}>
            <Text style={styles.correctionTitle}>I think you meant:</Text>
            <Text style={styles.correctedText}>{message.correction.correctedText}</Text>
            <Text style={styles.correctionExplanation}>{message.correction.explanation}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  keyboardView: { flex: 1 },
  header: {
    minHeight: 68,
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    gap: 8,
  },
  headerButton: { paddingVertical: 10, paddingHorizontal: 4 },
  headerButtonText: { color: AppColors.primaryBright, fontWeight: '800' },
  tutorIdentity: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { fontSize: 28 },
  tutorName: { color: AppColors.text, fontWeight: '800' },
  tutorStatus: { color: AppColors.textMuted, fontSize: 12 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12, width: '100%', maxWidth: 720, alignSelf: 'center' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
  tutorRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: 18, padding: 12 },
  tutorBubble: { backgroundColor: AppColors.surfaceRaised, borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: AppColors.primary, borderBottomRightRadius: 4 },
  messageText: { color: AppColors.text, fontSize: 16, lineHeight: 22 },
  correction: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.textMuted,
    paddingTop: 8,
  },
  correctionTitle: { color: AppColors.primaryBright, fontWeight: '800', fontSize: 13 },
  correctedText: { color: AppColors.text, fontWeight: '800', marginTop: 3 },
  correctionExplanation: { color: AppColors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 4 },
  typingText: { color: AppColors.textMuted, fontStyle: 'italic' },
  composer: { backgroundColor: AppColors.surface, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  suggestionRow: { gap: 8, paddingBottom: 10 },
  suggestion: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestionText: { color: AppColors.text, fontSize: 13, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 104,
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 14,
    color: AppColors.text,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 16,
  },
  sendButton: { backgroundColor: AppColors.primary, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14 },
  sendButtonDisabled: { backgroundColor: AppColors.disabled },
  sendButtonText: { color: AppColors.text, fontWeight: '800' },
  disabled: { opacity: 0.55 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: AppColors.textMuted },
});
