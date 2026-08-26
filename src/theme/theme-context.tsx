import { createContext, useContext, useMemo } from 'react';
import { colors } from '@/theme/colors';

const legacyColors = {
  ...colors,
  textMuted: colors.textSecondary,
  primaryBright: colors.primary,
  surfaceRaised: colors.surfaceBorder,
  accent: colors.secondary,
  disabled: '#555555'
};

export type ThemeColors = typeof legacyColors;

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const value = useMemo(() => ({colors: legacyColors, isDark: true}), []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const ThemeContext = createContext<{colors: ThemeColors; isDark: boolean}>({colors: legacyColors, isDark: true});
export const useTheme = () => useContext(ThemeContext);
