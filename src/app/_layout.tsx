import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { ProgressProvider } from '@/hooks/use-progress';
import { ThemeProvider } from '@/theme/theme-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: AppColors.background },
          }}
        />
        </ThemeProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
