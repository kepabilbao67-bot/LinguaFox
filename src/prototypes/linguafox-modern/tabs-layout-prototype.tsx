import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surfaceBorder,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <SymbolView name="house.fill" size={24} tintColor={color} />,
        }}
      />
    </Tabs>
  );
}
