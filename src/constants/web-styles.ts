import { Platform, type ViewStyle } from 'react-native';

/**
 * Estilos específicos para web en React Native Web para garantizar que
 * el scroll vertical con rueda de ratón fluya libremente y sin bloqueos de overflow.
 */
export const webScrollStyle: ViewStyle = Platform.select({
  web: {
    overflowY: 'auto',
    maxHeight: '100vh',
  } as unknown as ViewStyle,
  default: {},
}) || {};
