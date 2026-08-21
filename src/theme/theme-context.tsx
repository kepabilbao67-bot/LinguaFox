import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useProgress } from '@/hooks/use-progress';
import { darkColors, lightColors } from '@/theme/colors';
export type ThemeColors = Record<keyof typeof darkColors, string>;
export function ThemeProvider({children}:{children:React.ReactNode}){const {progress}=useProgress();const system=useColorScheme()==='dark';const dark=progress.ajustes.modoTema==='oscuro'||(progress.ajustes.modoTema!=='claro'&&system);const value=useMemo(()=>({colors:dark?darkColors:lightColors,isDark:dark}),[dark]);return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>}
const ThemeContext=createContext<{colors:ThemeColors;isDark:boolean}>({colors:darkColors,isDark:true});export const useTheme=()=>useContext(ThemeContext);
