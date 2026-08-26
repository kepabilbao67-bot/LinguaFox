import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { ProgressBar } from '@/components/ProgressBar';
import { GlassCard } from '@/components/GlassCard';
import { OptionButton } from '@/components/OptionButton';

// Mock data for the quiz
const questionData = {
  phraseToTranslate: '¿Dónde está el aeropuerto?',
  options: [
    { id: 'A', text: 'Where is the airport?', isCorrect: true },
    { id: 'B', text: 'Where is the museum?', isCorrect: false },
    { id: 'C', text: 'How do I get there?', isCorrect: false },
    { id: 'D', text: 'When does the train arrive?', isCorrect: false },
  ],
};

export default function LessonScreen() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const speakPhrase = () => {
    // Attempt to use Spanish voice if available
    Speech.speak(questionData.phraseToTranslate, {
      language: 'es-ES',
      rate: 0.9,
    });
  };

  const handleSelect = (id: string) => {
    if (!isChecked) {
      setSelectedOption(id);
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    
    if (!isChecked) {
      setIsChecked(true);
      
      const isCorrect = questionData.options.find(o => o.id === selectedOption)?.isCorrect;
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else {
      // Move to next question or finish
      Alert.alert("Lesson Complete!", "Great job! +50 XP", [
        { text: "Continue", onPress: () => router.back() }
      ]);
    }
  };

  const getOptionStatus = (optionId: string, isCorrect: boolean) => {
    if (!isChecked) {
      return selectedOption === optionId ? 'selected' : 'default';
    }
    
    if (optionId === selectedOption) {
      return isCorrect ? 'correct' : 'incorrect';
    }
    
    // Highlight correct answer if user got it wrong
    if (isCorrect) {
      return 'correct';
    }
    
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Top Navigation & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <SymbolView name="xmark" size={24} tintColor={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <ProgressBar progress={85} height={12} color={colors.primary} />
        </View>
        <SymbolView name="heart.fill" size={24} tintColor={colors.error} />
        <Text style={styles.livesText}>5</Text>
      </View>

      <Text style={styles.lessonTitle}>Translate this sentence</Text>

      {/* Question Card */}
      <GlassCard style={styles.questionCard}>
        <Text style={styles.phraseText}>{questionData.phraseToTranslate}</Text>
        
        <TouchableOpacity style={styles.speakerButton} onPress={speakPhrase}>
          <SymbolView name="speaker.wave.2.fill" size={32} tintColor={colors.white} />
        </TouchableOpacity>
      </GlassCard>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {questionData.options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.id}
            text={option.text}
            status={getOptionStatus(option.id, option.isCorrect)}
            onPress={() => handleSelect(option.id)}
          />
        ))}
      </View>

      {/* Bottom Action Area */}
      <View style={styles.bottomArea}>
        <TouchableOpacity 
          style={[
            styles.checkButton, 
            !selectedOption && styles.checkButtonDisabled,
            isChecked && (questionData.options.find(o => o.id === selectedOption)?.isCorrect ? styles.checkButtonCorrect : styles.checkButtonIncorrect)
          ]} 
          onPress={handleCheck}
          disabled={!selectedOption}
        >
          <Text style={styles.checkButtonText}>
            {!isChecked ? 'Check Answer' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    padding: 5,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  livesText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  lessonTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  questionCard: {
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 30,
  },
  phraseText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  speakerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  bottomArea: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    backgroundColor: colors.background,
  },
  checkButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkButtonDisabled: {
    backgroundColor: colors.surfaceBorder,
  },
  checkButtonCorrect: {
    backgroundColor: colors.success,
  },
  checkButtonIncorrect: {
    backgroundColor: colors.error,
  },
  checkButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
