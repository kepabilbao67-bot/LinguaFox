import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/app-theme';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: AppColors.surface, borderRadius: 18, padding: 20, gap: 12 },
  title: { color: AppColors.text, fontSize: 20, fontWeight: '800' },
  message: { color: AppColors.textMuted, fontSize: 16, lineHeight: 23 },
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  buttonText: { color: AppColors.text, fontWeight: '700' },
});
