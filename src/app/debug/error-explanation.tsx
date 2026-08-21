import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { ErrorExplanationCard } from '@/components/ErrorExplanationCard';
import type { PedagogicalCorrection } from '@/types/pedagogical-correction';
import { AppColors } from '@/constants/app-theme';

// This screen is only available in development builds.
// In production it redirects to home immediately.
if (!__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redirect: R } = require('expo-router') as { Redirect: typeof Redirect };
  void R; // satisfied by the component-level guard below
}

const MOCK_CORRECTION_1: PedagogicalCorrection = {
  errorDetectado: 'I have 50 years',
  tipoError: 'gramatica',
  correccion: 'I am 50 years old',
  explicacionPorQue: 'En inglés la edad se expresa con el verbo "to be" (ser/estar), no con "to have" (tener).',
  explicacionComo: 'Usa "I am" seguido del número y "years old".',
  explicacionCuando: 'Siempre que quieras decir tu edad o preguntar la edad de alguien.',
  explicacionCuandoNo: 'No uses "I have X years" nunca para la edad — en inglés esa frase es siempre incorrecta.',
  ejemplos: ['I am 25 years old.', 'She is 40 years old.', 'How old are you?'],
  ejercicioComprobacion: 'Ahora dime en inglés: Mi hermano tiene 30 años.',
  idiomaExplicacion: 'es',
  gravedad: 'bloqueante',
  confianza: 'high',
  debeInterrumpir: true,
  textoParaVoz: 'Te he entendido, pero en inglés usamos I am para la edad, no I have. Escucha: I am 50 years old.',
};

const MOCK_CORRECTION_2: PedagogicalCorrection = {
  errorDetectado: 'I goed to the store',
  tipoError: 'vocabulario',
  correccion: 'I went to the store',
  explicacionPorQue: 'El verbo "go" es irregular en pasado. No se le añade "-ed".',
  explicacionComo: 'La forma en pasado de "go" es siempre "went".',
  explicacionCuando: 'Úsalo para hablar de lugares a los que fuiste en el pasado.',
  ejemplos: ['I went to the park yesterday.', 'We went to Spain for holidays.'],
  ejercicioComprobacion: 'Traduce: Fuimos al cine.',
  idiomaExplicacion: 'es',
  gravedad: 'menor',
  confianza: 'medium',
  debeInterrumpir: false,
  textoParaVoz: 'Recuerda que el pasado de go es went.',
};

export default function DebugErrorExplanationScreen() {
  // Production guard: never expose debug routes in release builds
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.devBanner}>
        <Text style={styles.devBannerText}>⚙️ DEBUG — Solo visible en desarrollo</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ErrorExplanationCard
          correction={MOCK_CORRECTION_1}
          onPlayAudio={() => console.log('Playing audio 1')}
          onDismiss={() => console.log('Dismissed 1')}
        />
        <ErrorExplanationCard
          correction={MOCK_CORRECTION_2}
          onPlayAudio={() => console.log('Playing audio 2')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  devBanner: {
    backgroundColor: '#7c3aed',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  devBannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
});
