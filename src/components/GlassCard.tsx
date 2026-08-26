import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  accentColor?: string;
}

export function GlassCard({ children, accentColor, style, ...props }: GlassCardProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <BlurView 
        intensity={20} 
        tint="dark" 
        style={[
          styles.blur,
          accentColor ? { borderColor: accentColor } : null
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  blur: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
