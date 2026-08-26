import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export function ProgressBar({ 
  progress, 
  height = 10, 
  color = colors.primary,
  backgroundColor = colors.surfaceBorder,
  style,
  ...props
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.container, { height, backgroundColor }, style]} {...props}>
      <View 
        style={[
          styles.fill, 
          { width: `${clampedProgress}%`, backgroundColor: color }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
