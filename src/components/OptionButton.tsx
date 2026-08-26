import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface OptionButtonProps extends TouchableOpacityProps {
  label: string;
  text: string;
  status?: 'default' | 'selected' | 'correct' | 'incorrect';
}

export function OptionButton({ 
  label, 
  text, 
  status = 'default',
  style,
  onPress,
  ...props 
}: OptionButtonProps) {
  
  const scale = useSharedValue(1);

  const getBorderColor = () => {
    switch (status) {
      case 'selected': return colors.primary;
      case 'correct': return colors.success;
      case 'incorrect': return colors.error;
      default: return colors.surfaceBorder;
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'correct': return <SymbolView name="checkmark.circle.fill" size={24} tintColor={colors.success} />;
      case 'incorrect': return <SymbolView name="xmark.circle.fill" size={24} tintColor={colors.error} />;
      case 'selected': return <SymbolView name="circle.fill" size={24} tintColor={colors.primary} />;
      default: return <SymbolView name="circle" size={24} tintColor={colors.surfaceBorder} />;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1);
  };

  const handlePress = (e: any) => {
    if (status !== 'correct' && status !== 'incorrect') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPress) onPress(e);
  };

  return (
    <AnimatedTouchableOpacity 
      style={[
        styles.button, 
        { borderColor: getBorderColor() },
        status === 'selected' ? { backgroundColor: 'rgba(255, 107, 0, 0.1)' } : null,
        animatedStyle,
        style
      ]} 
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      <View style={styles.contentRow}>
        <Text style={[styles.label, status !== 'default' && { color: getBorderColor() }]}>{label}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      {getIcon()}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  text: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
});
