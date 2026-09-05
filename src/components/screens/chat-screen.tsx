import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { useProgress } from '@/hooks/use-progress';
import { fetchTutorReply, INITIAL_TUTOR_SUGGESTIONS } from '@/services/tutor-reply';
import { fetchCharacterReply } from '@/services/character-reply';
import { getCharacterById } from '@/data/characters';
import { getScenarioById } from '@/data/scenarios';
import { speakText, stopSpeaking } from '@/services/speech';
import type { ConversationMode, Message, TrackedError } from '@/types/learning';

type SpeechSpeed = 'lenta' | 'normal' | 'rápida';

export function ChatScreen() {
  const params = useLocalSearchParams<{
    characterId?: string;
    scenarioId?: string;
    mode?: ConversationMode;
    initialGreeting?: string;
  }>();

  const { progress, addTrackedError, incrementSpokenPhrases, completeScenario, registerCharacterInteraction } = useProgress();
  const { messages, isHydrated, appendMessage, createMessage } = useChatHistory();

  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>('normal');
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);

  const character = getCharacterById(params.characterId) ?? getCharacterById('fox')!;
  const scenario = getScenarioById(params.scenarioId);
  const mode = params.mode ?? (scenario ? 'scenario' : 'tutor');

  const [suggestions, setSuggestions] = useState<readonly string[]>(() => {
    if (scenario) {
      return scenario.vocabulary.slice(0, 3).map((w) => `I want to ask about ${w}.`);
    }
    return INITIAL_TUTOR_SUGGESTIONS;
  });

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Initial greeting if scenario or character is provided and conversation is empty
  useEffect(() => {
    if (isHydrated && messages.length === 0) {
      const greeting = params.initialGreeting ?? scenario?.initialGreeting ?? character.greeting;
      const initialMsg = createMessage('tutor', greeting);
      appendMessage(initialMsg);
      // Read aloud initial greeting
      const rate = speechSpeed === 'lenta' ? 0.6 : speechSpeed === 'rápida' ? 1.15 : 0.85;
      speakText(greeting, { language: character.language ?? progress.idiomaObjetivo, rate });
    }
  }, [appendMessage, character.greeting, character.language, createMessage, isHydrated, messages.length, params.initialGreeting, progress.idiomaObjetivo, scenario?.initialGreeting, speechSpeed]);

  const scrollToLatest = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const playAudio = useCallback((text: string) => {
    const rate = speechSpeed === 'lenta' ? 0.6 : speechSpeed === 'rápida' ? 1.15 : 0.85;
    speakText(text, { language: character.language ?? progress.idiomaObjetivo, rate });
  }, [character.language, progress.idiomaObjetivo, speechSpeed]);

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const cleanText = text.trim();
      if (!cleanText || isSending || !isHydrated) return;

      appendMessage(createMessage('user', cleanText));
      incrementSpokenPhrases();
      registerCharacterInteraction(params.characterId ?? 'fox', 'chat');
      setDraft('');
      setIsSending(true);

      try {
        let reply;
        if (params.characterId && params.characterId !== 'fox') {
          reply = await fetchCharacterReply(params.characterId, cleanText);
        } else {
          reply = await fetchTutorReply(cleanText, {
            level: progress.nivelObjetivo ?? 'A1',
            targetLanguage: progress.idiomaObjetivo,
            mode,
            scenarioId: params.scenarioId,
          });
        }

        if (!reply) {
          appendMessage(
            createMessage('tutor', 'I’m still listening. Could you say that in another way?')
          );
          return;
        }

        // Track pedagogical correction in user's error bank
        if (reply.correction) {
          setErrorsCount((prev) => prev + 1);
          const errorItem: TrackedError = {
            id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            userText: cleanText,
            correctedText: reply.correction.correctedText,
            explanation: reply.correction.explanation,
            category: reply.correction.category ?? 'grammar',
            language: progress.idiomaObjetivo,
            timestamp: Date.now(),
            reviewed: false,
          };
          addTrackedError(errorItem);
        }

        const tutorMsg: Message = {
          ...createMessage('tutor', reply.text, reply.correction),
          translation: reply.translation,
        };

        appendMessage(tutorMsg);
        setSuggestions(reply.suggestions);

        // Auto speak tutor response
        playAudio(reply.text);
      } catch (error: unknown) {
        if (__DEV__) console.warn('Error al responder.', error);
        appendMessage(
          createMessage('tutor', 'Estoy aquí contigo. ¿Probamos a decir otra frase?')
        );
      } finally {
        setIsSending(false);
      }
    },
    [addTrackedError, appendMessage, createMessage, incrementSpokenPhrases, isHydrated, isSending, mode, params.characterId, params.scenarioId, playAudio, progress.idiomaObjetivo, progress.nivelObjetivo, registerCharacterInteraction],
  );

  const handleVoicePrompt = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const contextualSuggestions: Record<string, string[]> = {
        en: [
          'Hello! I would like to practice speaking with you.',
          'Can you tell me more about this topic?',
          'Could you recommend something interesting to visit?',
        ],
        es: [
          '¡Hola! Me gustaría practicar mi español contigo.',
          '¿Podrías explicarme más sobre esta ciudad?',
          '¿Qué me recomiendas hacer por aquí?',
        ],
        fr: [
          'Bonjour ! Je voudrais pratiquer mon français.',
          'Pourriez-vous me recommander un bon endroit ?',
        ],
        de: [
          'Hallo! Ich möchte mein Deutsch üben.',
          'Können Sie mir bitte mehr darüber erzählen?',
        ],
        it: [
          'Ciao! Vorrei fare un po’ di conversazione in italiano.',
          'Cosa mi consigli di visitare?',
        ],
        pt: [
          'Olá! Gostaria de praticar conversação.',
          'Poderia me dar uma dica sobre a cidade?',
        ],
      };

      const langList = contextualSuggestions[progress.idiomaObjetivo] ?? contextualSuggestions.en;
      const picked = langList[Math.floor(Math.random() * langList.length)];
      setDraft(picked);
    }, 600);
  };

  const toggleTranslation = (messageId: string) => {
    setShowTranslations((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const finishConversation = () => {
    if (scenario) {
      completeScenario(scenario.id);
    }
    router.push({
      pathname: '/conversation-result',
      params: {
        messagesCount: String(messages.length),
        errorsCount: String(errorsCount),
        xpEarned: String(messages.length * 10 + 20),
        characterName: character.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Text style={styles.headerButtonText}>‹ Volver</Text>
          </Pressable>

          <View style={styles.tutorIdentity}>
            <Text style={styles.avatar}>{character.avatar}</Text>
            <View>
              <Text style={styles.tutorName}>{character.name}</Text>
              <Text style={styles.tutorStatus}>
                {scenario ? scenario.title : mode === 'travel' ? 'Modo Viaje 🌍' : 'Profesor IA 🦊'}
              </Text>
            </View>
          </View>

          <Pressable style={styles.finishBtn} onPress={finishConversation}>
            <Text style={styles.finishBtnText}>🏁 Terminar</Text>
          </Pressable>
        </View>

        {/* Speed Bar */}
        <View style={styles.speedBar}>
          <Text style={styles.speedLabel}>Velocidad de voz:</Text>
          <View style={styles.speedRow}>
            {(['lenta', 'normal', 'rápida'] as SpeechSpeed[]).map((speed) => (
              <Pressable
                key={speed}
                style={[styles.speedPill, speechSpeed === speed && styles.speedPillActive]}
                onPress={() => setSpeechSpeed(speed)}
              >
                <Text style={[styles.speedText, speechSpeed === speed && styles.speedTextActive]}>
                  {speed === 'lenta' ? '🐢 Lento' : speed === 'normal' ? '🦊 Normal' : '⚡ Rápido'}
                </Text>
              </Pressable>
            ))}
          </View>
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
              {messages.map((message) => {
                const isTutor = message.role === 'tutor';
                const isTranslated = showTranslations[message.id];

                return (
                  <View
                    key={message.id}
                    style={[styles.bubbleRow, isTutor ? styles.tutorRow : styles.userRow]}
                  >
                    {isTutor && <Text style={styles.avatar}>{character.avatar}</Text>}
                    <View style={[styles.bubble, isTutor ? styles.tutorBubble : styles.userBubble]}>
                      <Text style={styles.messageText} selectable>
                        {message.text}
                      </Text>

                      {/* Optional Translation */}
                      {message.translation && isTranslated && (
                        <View style={styles.translationBox}>
                          <Text style={styles.translationText}>🌐 {message.translation}</Text>
                        </View>
                      )}

                      {/* Bubble Action Footer */}
                      {isTutor && (
                        <View style={styles.bubbleActions}>
                          <Pressable
                            style={styles.actionIconBtn}
                            onPress={() => playAudio(message.text)}
                          >
                            <Text style={styles.actionIcon}>🔊 Escuchar</Text>
                          </Pressable>
                          {message.translation && (
                            <Pressable
                              style={styles.actionIconBtn}
                              onPress={() => toggleTranslation(message.id)}
                            >
                              <Text style={styles.actionIcon}>
                                {isTranslated ? '🙈 Ocultar traducción' : '🌐 Traducir'}
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      )}

                      {/* Pedagogical Correction Banner */}
                      {message.correction && (
                        <View style={styles.correctionCard}>
                          <Text style={styles.correctionTitle}>💡 Sugerencia amigable de LinguaFox:</Text>
                          <Text style={styles.correctedText}>
                            {`✅ "${message.correction.correctedText}"`}
                          </Text>
                          <Text style={styles.correctionExplanation}>
                            {`📖 ${message.correction.explanation}`}
                          </Text>
                          <Pressable
                            style={styles.correctionAudioBtn}
                            onPress={() => playAudio(message.correction!.correctedText)}
                          >
                            <Text style={styles.correctionAudioText}>🔊 Escuchar forma correcta</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}

              {isSending && (
                <View style={[styles.bubbleRow, styles.tutorRow]}>
                  <Text style={styles.avatar}>{character.avatar}</Text>
                  <View style={[styles.bubble, styles.tutorBubble]}>
                    <Text style={styles.typingText}>{character.name} está pensando…</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Actions & Composer */}
            <View style={styles.composer}>
              {/* Quick Action Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickActionsRow}
                keyboardShouldPersistTaps="handled">
                <Pressable
                  style={styles.quickChip}
                  onPress={() => void sendMessage('¿Puedes hablar más despacio, por favor?')}
                >
                  <Text style={styles.quickChipText}>🐢 Más despacio</Text>
                </Pressable>
                <Pressable
                  style={styles.quickChip}
                  onPress={() => void sendMessage('¿Puedes repetir lo último que dijiste?')}
                >
                  <Text style={styles.quickChipText}>🔊 Repítelo</Text>
                </Pressable>
                <Pressable
                  style={styles.quickChip}
                  onPress={() => void sendMessage('¿Qué significa esta palabra?')}
                >
                  <Text style={styles.quickChipText}>💡 ¿Qué significa?</Text>
                </Pressable>
                <Pressable
                  style={styles.quickChip}
                  onPress={() => void sendMessage('¿Podrías darme una pista para responder?')}
                >
                  <Text style={styles.quickChipText}>🎯 Dame una pista</Text>
                </Pressable>
              </ScrollView>

              {/* Suggestions */}
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

              {/* Input & Mic Row */}
              <View style={styles.inputRow}>
                <Pressable
                  style={[styles.micBtn, isRecording && styles.micBtnActive]}
                  onPress={handleVoicePrompt}
                  accessibilityLabel="Insertar sugerencia de práctica oral"
                >
                  <Text style={styles.micIcon}>{isRecording ? '🔴' : '🎙️'}</Text>
                </Pressable>

                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Escribe tu mensaje…"
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  keyboardView: { flex: 1 },
  header: {
    minHeight: 64,
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.surfaceBorder,
  },
  headerButton: { paddingVertical: 8, paddingHorizontal: 4 },
  headerButtonText: { color: AppColors.primaryBright, fontWeight: '800' },
  tutorIdentity: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { fontSize: 30 },
  tutorName: { color: AppColors.text, fontWeight: '900', fontSize: 16 },
  tutorStatus: { color: AppColors.accentBright, fontSize: 12, fontWeight: '700' },
  finishBtn: {
    backgroundColor: AppColors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  finishBtnText: { color: AppColors.text, fontWeight: '800', fontSize: 13 },
  speedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surfaceRaised,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  speedLabel: { color: AppColors.textMuted, fontSize: 12, fontWeight: '700' },
  speedRow: { flexDirection: 'row', gap: 6 },
  speedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: AppColors.surface,
  },
  speedPillActive: { backgroundColor: AppColors.primary },
  speedText: { color: AppColors.textMuted, fontSize: 11, fontWeight: '700' },
  speedTextActive: { color: AppColors.text, fontWeight: '800' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 14, width: '100%', maxWidth: 720, alignSelf: 'center' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  tutorRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', borderRadius: 20, padding: 14, gap: 6 },
  tutorBubble: { backgroundColor: AppColors.surfaceRaised, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: AppColors.surfaceBorder },
  userBubble: { backgroundColor: AppColors.primary, borderBottomRightRadius: 4 },
  messageText: { color: AppColors.text, fontSize: 16, lineHeight: 22, fontWeight: '600' },
  translationBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  translationText: { color: AppColors.blueLight, fontSize: 13, lineHeight: 18 },
  bubbleActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  actionIconBtn: { paddingVertical: 2 },
  actionIcon: { color: AppColors.primaryBright, fontSize: 12, fontWeight: '700' },
  correctionCard: {
    marginTop: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderLeftWidth: 3,
    borderLeftColor: AppColors.danger,
    padding: 10,
    borderRadius: 8,
    gap: 3,
  },
  correctionTitle: { color: AppColors.danger, fontWeight: '800', fontSize: 12 },
  correctedText: { color: AppColors.text, fontWeight: '800', fontSize: 14 },
  correctionExplanation: { color: AppColors.textMuted, fontSize: 12, lineHeight: 16 },
  correctionAudioBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  correctionAudioText: { color: AppColors.primaryBright, fontSize: 12, fontWeight: '800' },
  typingText: { color: AppColors.textMuted, fontStyle: 'italic', fontSize: 14 },
  composer: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.surfaceBorder,
    gap: 8,
  },
  quickActionsRow: { gap: 6 },
  quickChip: {
    backgroundColor: AppColors.surfaceRaised,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  quickChipText: { color: AppColors.textMuted, fontSize: 12, fontWeight: '700' },
  suggestionRow: { gap: 8 },
  suggestion: {
    backgroundColor: 'rgba(255, 122, 0, 0.12)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppColors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  suggestionText: { color: AppColors.primaryBright, fontSize: 13, fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  micBtn: {
    backgroundColor: AppColors.surfaceRaised,
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  micBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: AppColors.danger,
  },
  micIcon: { fontSize: 20 },
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
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  sendButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  sendButtonDisabled: { backgroundColor: AppColors.disabled },
  sendButtonText: { color: AppColors.text, fontWeight: '900', fontSize: 15 },
  disabled: { opacity: 0.55 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: AppColors.textMuted },
});
