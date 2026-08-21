import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { PedagogicalCorrection } from '@/types/pedagogical-correction';
import { AppColors } from '@/constants/app-theme';

interface ErrorExplanationCardProps {
  correction: PedagogicalCorrection;
  onDismiss?: () => void;
  onPlayAudio?: () => void;
}

const GRAVITY_LABEL: Record<PedagogicalCorrection['gravedad'], string> = {
  bloqueante: 'Error bloqueante',
  menor: 'Aviso menor',
};

const GRAVITY_ICON: Record<PedagogicalCorrection['gravedad'], string> = {
  bloqueante: '🚨',
  menor: '💡',
};

const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'Corrección verificada',
  medium: 'Corrección probable',
  low: 'Corrección orientativa — verifica con un experto',
};

export function ErrorExplanationCard({
  correction,
  onDismiss,
  onPlayAudio,
}: ErrorExplanationCardProps) {
  const [expanded, setExpanded] = useState(correction.gravedad === 'bloqueante');

  const gravityLabel = GRAVITY_LABEL[correction.gravedad];
  const gravityIcon  = GRAVITY_ICON[correction.gravedad];
  const confidenceLabel = CONFIDENCE_LABEL[correction.confianza] ?? 'Confianza desconocida';

  return (
    <View
      style={styles.container}
      accessible={false}
    >
      {/* ── Header ── */}
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        accessibilityRole="button"
        accessibilityLabel={`${gravityLabel}: ${correction.tipoError}. Pulsa para ${expanded ? 'contraer' : 'expandir'} la explicación.`}
        accessibilityState={{ expanded }}
      >
        <View style={styles.headerTitleRow}>
          <Text style={styles.title} aria-hidden>
            {gravityIcon}{' '}
          </Text>
          <Text style={styles.title}>
            {gravityLabel}: {correction.tipoError}
          </Text>
        </View>
        <Text style={styles.chevron} aria-hidden>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {/* ── Resumen siempre visible ── */}
      <View style={styles.summaryContainer}>
        <Text
          style={styles.originalText}
          accessibilityLabel={`Error detectado: ${correction.errorDetectado}`}
        >
          ❌ {correction.errorDetectado}
        </Text>
        <Text
          style={styles.correctedText}
          accessibilityLabel={`Forma correcta: ${correction.correccion}`}
        >
          ✅ {correction.correccion}
        </Text>
        <Text style={styles.confidenceText}>{confidenceLabel}</Text>
      </View>

      {/* ── Contenido Expandido ── */}
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Por qué está mal?</Text>
            <Text style={styles.sectionText}>{correction.explicacionPorQue}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cómo se usa correctamente?</Text>
            <Text style={styles.sectionText}>{correction.explicacionComo}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cuándo se usa?</Text>
            <Text style={styles.sectionText}>{correction.explicacionCuando}</Text>
          </View>

          {correction.explicacionCuandoNo ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>¿Cuándo NO se usa?</Text>
              <Text style={styles.sectionText}>{correction.explicacionCuandoNo}</Text>
            </View>
          ) : null}

          {correction.ejemplos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ejemplos:</Text>
              {correction.ejemplos.map((ej, idx) => (
                <Text key={idx} style={styles.exampleText}>• {ej}</Text>
              ))}
            </View>
          )}

          <View style={styles.practiceBox}>
            <Text style={styles.practiceTitle}>Práctica rápida</Text>
            <Text style={styles.practiceText}>{correction.ejercicioComprobacion}</Text>
          </View>

          <View style={styles.actions}>
            {onPlayAudio && (
              <Pressable
                style={styles.audioButton}
                onPress={onPlayAudio}
                accessibilityRole="button"
                accessibilityLabel="Escuchar la explicación en voz alta"
              >
                <Text style={styles.audioButtonText}>🔊 Escuchar</Text>
              </Pressable>
            )}

            {onDismiss && (
              <Pressable
                style={styles.dismissButton}
                onPress={onDismiss}
                accessibilityRole="button"
                accessibilityLabel="Entendido, cerrar esta corrección"
              >
                <Text style={styles.dismissButtonText}>Entendido</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.surfaceRaised,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    minHeight: 48, // WCAG minimum touch target
    backgroundColor: AppColors.surfaceRaised,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: AppColors.text,
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  chevron: {
    color: AppColors.text,
    fontSize: 14,
    marginLeft: 8,
  },
  summaryContainer: {
    padding: 16,
    gap: 8,
  },
  originalText: {
    fontWeight: '500',
    fontSize: 16,
    color: AppColors.text, // Avoid low-contrast dark red on dark bg
    textDecorationLine: 'line-through',
  },
  correctedText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: AppColors.primaryBright,
  },
  confidenceText: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: AppColors.textMuted,
  },
  sectionText: {
    fontSize: 15,
    color: AppColors.text,
    lineHeight: 22,
  },
  exampleText: {
    fontWeight: '500',
    fontSize: 15,
    color: AppColors.primaryBright,
    lineHeight: 22,
    marginLeft: 8,
  },
  practiceBox: {
    backgroundColor: AppColors.surfaceRaised,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  practiceTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: AppColors.primaryBright,
    marginBottom: 4,
  },
  practiceText: {
    fontWeight: '500',
    fontSize: 15,
    color: AppColors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    borderRadius: 20,
    backgroundColor: AppColors.surfaceRaised,
  },
  audioButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: AppColors.primaryBright,
  },
  dismissButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    borderRadius: 20,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
  },
  dismissButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: AppColors.text,
  },
});
