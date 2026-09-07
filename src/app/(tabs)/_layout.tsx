import { Tabs } from 'expo-router';
import { AppColors } from '@/constants/app-theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: AppColors.surface,
          borderTopColor: AppColors.surfaceBorder,
        },
        tabBarActiveTintColor: AppColors.primaryBright,
        tabBarInactiveTintColor: AppColors.textMuted,
      }}
    />
  );
}
