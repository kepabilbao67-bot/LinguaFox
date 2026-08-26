import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/GlassCard';
import { ProgressRing } from '@/components/ProgressRing';
import { IconButton } from '@/components/IconButton';
import { Image } from 'expo-image';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=47' }} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Alex Ramirez</Text>
              <Text style={styles.level}>Level 14 | Español</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>14</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <IconButton name="bell" size={20} style={styles.iconBtn} />
            <IconButton name="gearshape" size={20} style={styles.iconBtn} />
          </View>
        </View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          <GlassCard style={styles.statsCard} accentColor={colors.primary}>
            <Text style={styles.cardTitle}>Daily Progress</Text>
            <View style={styles.progressContainer}>
              <ProgressRing progress={68} size={110} color={colors.primary} />
            </View>
            <Text style={styles.statsSubtitle}>34/50 XP Today</Text>
          </GlassCard>

          <GlassCard style={styles.statsCard} accentColor={colors.secondary}>
            <Text style={styles.cardTitle}>Current Streak</Text>
            <View style={styles.streakContainer}>
              <SymbolView name="flame.fill" size={80} tintColor={colors.primary} />
              <Text style={styles.streakDays}>73 Days</Text>
            </View>
            <Text style={styles.statsSubtitle}>Daily Goal Achieved! 🔥</Text>
          </GlassCard>
        </Animated.View>

        {/* Continue Lesson Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <GlassCard style={styles.lessonCard} accentColor={colors.primary}>
            <Text style={styles.cardLabel}>Continue Lesson</Text>
            <Text style={styles.lessonTitle}>Unit 3: Travel ✈️</Text>
            <Text style={styles.lessonSubtitle}>Lesson 4: Booking a Hotel</Text>
            <Text style={styles.lessonDesc}>
              Learn essential vocabulary for checking in, requesting amenities, and handling issues at a hotel.
            </Text>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('/lesson')}>
              <Text style={styles.buttonTextPrimary}>Resume Lesson</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Practice Card */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <GlassCard style={styles.practiceCard} accentColor={colors.secondary}>
            <Text style={styles.cardLabel}>Listening Practice</Text>
            <Text style={styles.lessonTitle}>Airport Dialogue 🎧</Text>
            <View style={styles.mediaControls}>
              <SymbolView name="backward.fill" size={20} tintColor={colors.white} />
              <SymbolView name="play.circle.fill" size={40} tintColor={colors.white} />
              <SymbolView name="forward.fill" size={20} tintColor={colors.white} />
            </View>
            <View style={styles.levelTag}>
              <Text style={styles.levelTagText}>Intermediate</Text>
            </View>
            <View style={styles.buttonSecondary}>
              <Text style={styles.buttonTextSecondary}>Start Practice</Text>
            </View>
          </GlassCard>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    marginLeft: 12,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  level: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 10,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    padding: 15,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressContainer: {
    marginVertical: 10,
  },
  statsSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  streakDays: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  lessonCard: {
    marginBottom: 20,
  },
  practiceCard: {
    marginBottom: 20,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lessonSubtitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  lessonDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 15,
  },
  levelTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15,
  },
  levelTagText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
