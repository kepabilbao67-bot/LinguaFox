import type { PropsWithChildren } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';

interface ScreenContainerProps extends PropsWithChildren {
  title?: string;
  isLoading?: boolean;
}

export function ScreenContainer({ children, title, isLoading = false }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={AppColors.primaryBright} size="large" />
            <Text style={styles.loadingText}>Cargando tu progreso…</Text>
          </View>
        ) : (
          children
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  scrollView: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  title: {
    color: AppColors.primaryBright,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 18,
  },
  loading: { minHeight: 280, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: AppColors.textMuted, fontSize: 15 },
});
