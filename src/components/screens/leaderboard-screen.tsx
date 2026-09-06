import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import {
  LEAGUE_TIERS,
  type LeagueTier,
} from '@/types/leagues';
import {
  generateWeeklyDivision,
  getTierProgression,
} from '@/services/leagues';

export function LeaderboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated } = useProgress();

  const currentTier: LeagueTier = progress.weeklyLeague?.tier ?? 'bronce';
  const userWeeklyXp = progress.weeklyLeague?.weeklyXp ?? 0;
  const tierConfig = LEAGUE_TIERS[currentTier];

  const division = useMemo(() => {
    return generateWeeklyDivision(currentTier, userWeeklyXp);
  }, [currentTier, userWeeklyXp]);

  const userRank = division.userRank;
  const isPromoting = userRank <= tierConfig.promotionCutoff;
  const isDemoting = currentTier !== 'bronce' && userRank >= tierConfig.demotionCutoff;
  const nextTier = getTierProgression(currentTier, 'ascenso');
  const prevTier = getTierProgression(currentTier, 'descenso');

  // Compute XP needed for promotion
  const promotionCutoffParticipant = division.participants[tierConfig.promotionCutoff - 1];
  const targetPromotionXp = promotionCutoffParticipant?.xp ?? 0;
  const xpNeededForPromotion = Math.max(1, targetPromotionXp - userWeeklyXp + 5);

  return (
    <ScreenContainer title="Ligas Semanales" isLoading={!isHydrated} scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tier Hero Header */}
        <View style={[styles.heroCard, { borderColor: tierConfig.color }]}>
          <View style={styles.heroTopRow}>
            <View style={[styles.badgeCircle, { backgroundColor: `${tierConfig.color}22` }]}>
              <Text style={styles.badgeIcon}>{tierConfig.badge}</Text>
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.tierName}>{tierConfig.name}</Text>
              <Text style={styles.weekTag}>
                División {division.weekKey} · Finaliza el domingo
              </Text>
            </View>
          </View>

          {/* User Quick Stats Banner */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>#{userRank}</Text>
              <Text style={styles.statLabel}>Tu Puesto</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{userWeeklyXp}</Text>
              <Text style={styles.statLabel}>XP Semanal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>🪙 {tierConfig.rewardCoins}</Text>
              <Text style={styles.statLabel}>Premio Ascenso</Text>
            </View>
          </View>

          {/* Goal Gradient Status Banner */}
          <View
            style={[
              styles.statusBanner,
              isPromoting
                ? styles.statusBannerSuccess
                : isDemoting
                  ? styles.statusBannerDanger
                  : styles.statusBannerNeutral,
            ]}
          >
            <Text style={styles.statusBannerText}>
              {isPromoting
                ? `🚀 ¡Estás en Zona de Ascenso! Termina así para subir a ${LEAGUE_TIERS[nextTier].name}.`
                : isDemoting
                  ? `⚠️ Zona de riesgo. Consigue más XP para no descender a ${LEAGUE_TIERS[prevTier].name}.`
                  : `⚡ Puesto de permanencia. Estás a ${xpNeededForPromotion} XP del ascenso a ${LEAGUE_TIERS[nextTier].name}.`}
            </Text>
          </View>
        </View>

        {/* Legend / Zone Info */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: AppColors.success }]} />
            <Text style={styles.legendText}>
              Top {tierConfig.promotionCutoff} Ascienden
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: AppColors.primaryBright }]} />
            <Text style={styles.legendText}>Permanencia</Text>
          </View>
          {currentTier !== 'bronce' && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: AppColors.danger }]} />
              <Text style={styles.legendText}>Puesto ≥ {tierConfig.demotionCutoff} Descenso</Text>
            </View>
          )}
        </View>

        {/* Leaderboard Table (30 participants) */}
        <View style={styles.tableContainer}>
          {division.participants.map((participant, index) => {
            const isTop3 = participant.rank <= 3;
            const inPromotionZone = participant.rank <= tierConfig.promotionCutoff;
            const inDemotionZone = currentTier !== 'bronce' && participant.rank >= tierConfig.demotionCutoff;

            const rankBadge =
              participant.rank === 1
                ? '🥇'
                : participant.rank === 2
                  ? '🥈'
                  : participant.rank === 3
                    ? '🥉'
                    : `#${participant.rank}`;

            return (
              <React.Fragment key={participant.id}>
                {/* Zone Divider Headers */}
                {participant.rank === 1 && (
                  <View style={styles.zoneDividerGreen}>
                    <Text style={styles.zoneDividerTextGreen}>
                      ▲ ZONA DE ASCENSO · TOP {tierConfig.promotionCutoff}
                    </Text>
                  </View>
                )}

                {participant.rank === tierConfig.promotionCutoff + 1 && (
                  <View style={styles.zoneDividerNeutral}>
                    <Text style={styles.zoneDividerTextNeutral}>
                      — ZONA DE PERMANENCIA —
                    </Text>
                  </View>
                )}

                {currentTier !== 'bronce' && participant.rank === tierConfig.demotionCutoff && (
                  <View style={styles.zoneDividerRed}>
                    <Text style={styles.zoneDividerTextRed}>
                      ▼ ZONA DE DESCENSO
                    </Text>
                  </View>
                )}

                {/* Participant Row */}
                <View
                  style={[
                    styles.row,
                    participant.isUser && styles.userRow,
                    inPromotionZone && !participant.isUser && styles.promotionRow,
                    inDemotionZone && !participant.isUser && styles.demotionRow,
                  ]}
                  accessible={true}
                  accessibilityLabel={`Puesto ${participant.rank}. ${participant.name}. ${participant.xp} puntos de experiencia. ${
                    participant.isUser ? 'Tu posición actual.' : ''
                  }`}
                >
                  <View style={styles.rankBox}>
                    <Text
                      style={[
                        styles.rankText,
                        isTop3 && styles.top3RankText,
                        participant.isUser && styles.userRankText,
                      ]}
                    >
                      {rankBadge}
                    </Text>
                  </View>

                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{participant.avatar}</Text>
                    <Text style={styles.flagText}>{participant.countryCode}</Text>
                  </View>

                  <View style={styles.nameWrap}>
                    <Text
                      style={[
                        styles.nameText,
                        participant.isUser && styles.userNameText,
                      ]}
                      numberOfLines={1}
                    >
                      {participant.name}
                    </Text>
                    {participant.isUser && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>TÚ</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.xpWrap}>
                    <Text
                      style={[
                        styles.xpText,
                        participant.isUser && styles.userXpText,
                      ]}
                    >
                      {participant.xp} XP
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Deterministic Local Info Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            ℹ️ División de 30 estudiantes sincronizada localmente cada semana. Gana XP completando lecciones, repasos y retos para escalar puestos antes del cierre del domingo.
          </Text>
        </View>

        {/* Bottom CTA Button */}
        <Pressable
          style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
          onPress={() => router.push('/')}
          accessibilityRole="button"
          accessibilityLabel="Continuar aprendiendo lecciones para ganar XP"
        >
          <Text style={styles.ctaButtonText}>▶ Continuar Estudiando (+XP)</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: {
      paddingBottom: 40,
      gap: 16,
    },
    heroCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1.5,
      gap: 14,
    },
    heroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    badgeCircle: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeIcon: {
      fontSize: 30,
    },
    heroTextWrap: {
      flex: 1,
    },
    tierName: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '900',
    },
    weekTag: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 2,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    statBox: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '900',
    },
    statLabel: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
      marginTop: 2,
      textTransform: 'uppercase',
    },
    statDivider: {
      width: 1,
      height: 24,
      backgroundColor: colors.surfaceBorder,
    },
    statusBanner: {
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
    },
    statusBannerSuccess: {
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    statusBannerDanger: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    statusBannerNeutral: {
      backgroundColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    statusBannerText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 18,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      flexWrap: 'wrap',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    tableContainer: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    zoneDividerGreen: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(34, 197, 94, 0.25)',
    },
    zoneDividerTextGreen: {
      color: AppColors.success,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    zoneDividerNeutral: {
      backgroundColor: 'rgba(148, 163, 184, 0.1)',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    zoneDividerTextNeutral: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '800',
      textAlign: 'center',
    },
    zoneDividerRed: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(239, 68, 68, 0.25)',
    },
    zoneDividerTextRed: {
      color: AppColors.danger,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 52, // touch and scan target
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
      gap: 12,
    },
    userRow: {
      backgroundColor: 'rgba(249, 115, 22, 0.15)',
      borderLeftWidth: 4,
      borderLeftColor: AppColors.primary,
    },
    promotionRow: {
      backgroundColor: 'rgba(34, 197, 94, 0.04)',
    },
    demotionRow: {
      backgroundColor: 'rgba(239, 68, 68, 0.04)',
    },
    rankBox: {
      width: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rankText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '800',
    },
    top3RankText: {
      fontSize: 18,
    },
    userRankText: {
      color: AppColors.primaryBright,
      fontWeight: '900',
    },
    avatarWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    avatarText: {
      fontSize: 20,
    },
    flagText: {
      fontSize: 14,
    },
    nameWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    nameText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    userNameText: {
      color: AppColors.primaryBright,
      fontWeight: '800',
    },
    youBadge: {
      backgroundColor: AppColors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    youBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '900',
    },
    xpWrap: {
      alignItems: 'flex-end',
    },
    xpText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    userXpText: {
      color: AppColors.primaryBright,
      fontWeight: '900',
    },
    disclaimerBox: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    disclaimerText: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },
    ctaButton: {
      minHeight: 52,
      backgroundColor: AppColors.primary,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    ctaButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
    },
    pressed: {
      opacity: 0.85,
    },
  });
}
