import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { webScrollStyle } from '@/constants/web-styles';

interface ScreenContainerProps extends PropsWithChildren {
  title?: string;
  isLoading?: boolean;
  scrollable?: boolean;
}

export function ScreenContainer({
  children,
  title,
  isLoading = false,
  scrollable = true,
}: ScreenContainerProps) {
  const content = (
    <>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={AppColors.primaryBright} size="large" />
          <Text style={styles.loadingText}>Cargando tu progreso…</Text>
        </View>
      ) : (
        children
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, styles.contentGrow]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.scrollView, styles.nonScrollContent]}>
          {content}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
    ...webScrollStyle,
  },
  scrollView: {
    flex: 1,
    ...webScrollStyle,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  contentGrow: {
    flexGrow: 1,
  },
  nonScrollContent: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    flex: 1,
    ...webScrollStyle,
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
