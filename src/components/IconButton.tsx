import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { colors } from '../theme/colors';

interface IconButtonProps extends TouchableOpacityProps {
  name: SFSymbol;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function IconButton({ 
  name, 
  size = 24, 
  color = colors.white,
  backgroundColor = colors.surface,
  style,
  ...props 
}: IconButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor, width: size * 1.8, height: size * 1.8, borderRadius: size * 0.9 },
        style
      ]} 
      {...props}
    >
      <SymbolView name={name} size={size} tintColor={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
});
