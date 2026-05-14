import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { GoldButton } from '../../src/components/common/GoldButton';
import { GhostButton } from '../../src/components/common/GhostButton';
import { GlassCard } from '../../src/components/common/GlassCard';
import { ReputationBadge, VerifiedBadge, CountryFlag } from '../../src/components/common/Badges';
import { TravelStyleTag } from '../../src/components/common/Chips';
import { MOCK_BACKPACKERS, MOCK_PLANS } from '../../src/data/mockData';
import { ReportModal } from '../../src/components/safety/ReportModal';
import { BlockConfirm } from '../../src/components/safety/BlockConfirm';
import { useSocialStore } from '../../src/stores/socialStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { haversineDistance, formatDistance } from '../../src/utils/haversine';

export default function BackpackerCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { latitude, longitude } = useLocationStore();
  const { isConnected, sendRequest, blockUser, reportUser } = useSocialStore();
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  const backpacker = MOCK_BACKPACKERS.find((b) => b.id === id);
  if (!backpacker) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Backpacker not found</Text>
      </View>
    );
  }

  const distance = haversineDistance(latitude, longitude, backpacker.latitude, backpacker.longitude);
  const plan = backpacker.currentPlanId
    ? MOCK_PLANS.find((p) => p.id === backpacker.currentPlanId)
    : null;
  const connected = isConnected(backpacker.id);

  const handleConnect = () => {
    sendRequest(backpacker.id);
    Alert.alert('Request Sent', `Connection request sent to ${backpacker.name}!`);
  };

  const handleBlock = () => {
    setShowBlock(true);
  };

  const confirmBlock = () => {
    blockUser(backpacker.id);
    router.back();
  };

  const handleReport = () => {
    setShowReport(true);
  };

  const handleSubmitReport = (reason: string, details: string) => {
    reportUser({
      targetId: backpacker.id,
      targetType: 'profile' as const,
      reason,
      details,
      timestamp: new Date().toISOString(),
    });
    Alert.alert('Report Submitted', 'Thank you. Our team will review this within 2 hours.');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: backpacker.coverPhoto }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', Colors.surface]}
            style={styles.coverGradient}
          />

          {/* Close button */}
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + Spacing.sm }]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={22} color={Colors.onSurface} />
          </TouchableOpacity>

          {/* Avatar overlay */}
          <View style={styles.avatarRow}>
            <Image source={{ uri: backpacker.avatar }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
        </View>

        <View style={styles.contentSection}>
          {/* Name + Flag */}
          <View style={styles.nameRow}>
            <CountryFlag code={backpacker.countryCode} size={24} />
            <Text style={styles.name}>{backpacker.name}</Text>
            {backpacker.isVerified && <VerifiedBadge size={20} />}
          </View>
          <Text style={styles.homeCity}>{backpacker.homeCity}</Text>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{backpacker.travellingMonths}</Text>
              <Text style={styles.statLabel}>MONTHS{'\n'}TRAVELLING</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{backpacker.countriesVisited}</Text>
              <Text style={styles.statLabel}>COUNTRIES{'\n'}VISITED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{backpacker.daysInCity}d</Text>
              <Text style={styles.statLabel}>IN THIS{'\n'}CITY</Text>
            </View>
          </View>

          {/* Reputation */}
          <GlassCard style={styles.repCard}>
            <Text style={styles.cardLabel}>REPUTATION</Text>
            <ReputationBadge
              score={backpacker.reputationScore}
              totalRatings={backpacker.totalRatings}
              size="lg"
            />
          </GlassCard>

          {/* Travel Styles */}
          <GlassCard style={styles.repCard}>
            <Text style={styles.cardLabel}>TRAVEL STYLE</Text>
            <View style={styles.tagsRow}>
              {backpacker.travelStyles.map((s) => (
                <TravelStyleTag key={s} style={s} />
              ))}
            </View>
          </GlassCard>

          {/* Bio */}
          <GlassCard style={styles.repCard}>
            <Text style={styles.cardLabel}>ABOUT</Text>
            <Text style={styles.bioText}>{backpacker.bio}</Text>
          </GlassCard>

          {/* Current Plan */}
          {plan && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/plan/${plan.id}`)}
            >
              <GlassCard style={styles.planCard} elevated>
                <Text style={styles.cardLabel}>TONIGHT'S PLAN</Text>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.planMeta}>
                  <Ionicons name="time-outline" size={14} color={Colors.gold} />
                  <Text style={styles.planMetaText}>{plan.date} at {plan.time}</Text>
                </View>
                <View style={styles.planMeta}>
                  <Ionicons name="location-outline" size={14} color={Colors.gold} />
                  <Text style={styles.planMetaText}>{plan.meetingPoint}</Text>
                </View>
                <Text style={styles.planSpots}>
                  {plan.attendeeIds.length} of {plan.maxSpots} going
                </Text>
              </GlassCard>
            </TouchableOpacity>
          )}

          {/* Distance */}
          <View style={styles.distanceRow}>
            <Ionicons name="navigate" size={16} color={Colors.gold} />
            <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <GoldButton
              title={connected ? 'CONNECTED' : 'CONNECT'}
              onPress={handleConnect}
              disabled={connected}
              style={styles.actionBtn}
            />
            <GhostButton
              title="MESSAGE"
              onPress={() => router.push(`/messages/${backpacker.id}`)}
              style={styles.actionBtn}
              icon={<Ionicons name="chatbubble-outline" size={16} color={Colors.gold} />}
            />
          </View>

          {/* Report */}
          <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
            <Ionicons name="flag-outline" size={16} color={Colors.error} />
            <Text style={styles.reportText}>Report this profile</Text>
          </TouchableOpacity>

          {/* Block */}
          <TouchableOpacity style={styles.blockBtn} onPress={handleBlock}>
            <Ionicons name="ban-outline" size={16} color={Colors.onSurfaceDim} />
            <Text style={styles.blockText}>Block user</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  errorText: { ...Fonts.bodyLarge, color: Colors.error, textAlign: 'center', marginTop: 100 },

  coverContainer: { height: 280, position: 'relative' },
  coverImage: { ...StyleSheet.absoluteFillObject },
  coverGradient: { ...StyleSheet.absoluteFillObject },
  closeBtn: {
    position: 'absolute',
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(19,19,19,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRow: {
    position: 'absolute',
    bottom: -32,
    left: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.surface,
  },

  contentSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  name: { ...Fonts.headlineLarge, color: Colors.onSurface },
  homeCity: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted, marginTop: Spacing.xs, marginBottom: Spacing.lg },

  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  stat: { alignItems: 'center', flex: 1 },
  statNumber: { ...Fonts.headlineMedium, color: Colors.gold },
  statLabel: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, textAlign: 'center', letterSpacing: 0.5, marginTop: Spacing.xs },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.outlineVariant },

  repCard: { marginBottom: Spacing.md },
  cardLabel: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 2, marginBottom: Spacing.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  bioText: { ...Fonts.bodyLarge, color: Colors.onSurfaceMuted, lineHeight: 26 },

  planCard: { marginBottom: Spacing.md },
  planTitle: { ...Fonts.titleLarge, color: Colors.onSurface, marginBottom: Spacing.sm },
  planMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  planMetaText: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted },
  planSpots: { ...Fonts.labelSmall, color: Colors.gold, marginTop: Spacing.sm },

  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surfaceContainerLow,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
  },
  distanceText: { ...Fonts.labelMedium, color: Colors.gold },

  actionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  actionBtn: { flex: 1 },

  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(255, 180, 171, 0.08)',
    marginBottom: Spacing.sm,
  },
  reportText: { ...Fonts.titleSmall, color: Colors.error },

  blockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  blockText: { ...Fonts.bodySmall, color: Colors.onSurfaceDim },
});
