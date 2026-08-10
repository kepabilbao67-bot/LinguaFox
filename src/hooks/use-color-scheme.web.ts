import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const emptySubscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 *
 * Usa useSyncExternalStore en lugar de useEffect + setState para detectar la
 * hidratación: es el patrón que React recomienda para valores que difieren
 * entre el snapshot de servidor y el de cliente, y evita el render en cascada
 * que produce llamar a setState dentro de un efecto.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
