import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const STREAK_KEY = 'user.streak.data';
const TIMESTAMP_KEY = 'user.last.timestamp'; // Clave numérica anti-trampas

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

export const StreakService = {
  async getStreakData(): Promise<StreakData> {
    try {
      const raw = await AsyncStorage.getItem(STREAK_KEY);
      return raw ? JSON.parse(raw) : { currentStreak: 0, longestStreak: 0, lastStudyDate: null };
    } catch {
      return { currentStreak: 0, longestStreak: 0, lastStudyDate: null };
    }
  },

  async updateStreak(): Promise<StreakData> {
    const now = Date.now();
    const todayStr = new Date(now).toISOString().split('T')[0];
    const data = await this.getStreakData();
    
    // Protección: Si ya estudió hoy, no hace nada
    if (data.lastStudyDate === todayStr) return data;

    const lastTsStr = await AsyncStorage.getItem(TIMESTAMP_KEY);
    const lastTs = lastTsStr ? parseInt(lastTsStr, 10) : 0;
    const msInDay = 86400000; // Milisegundos en un día
    const diff = now - lastTs;

    // Lógica Anti-Trampas: 
    // Solo suma racha si la última vez fue hace menos de 48 horas.
    // Esto evita que cambiar la hora del dispositivo infla la racha artificialmente.
    if (diff < msInDay * 1.5 && lastTs > 0) {
      data.currentStreak += 1;
      // Feedback háptico al mantener la racha
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      data.currentStreak = 1;
      // Feedback háptico diferente al reiniciar racha
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }

    data.lastStudyDate = todayStr;
    
    // Guardamos datos y timestamp numérico atómicamente
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(TIMESTAMP_KEY, now.toString());

    return data;
  }
};
