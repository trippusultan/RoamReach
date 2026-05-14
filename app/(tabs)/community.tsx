import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { GlassCard } from '../../src/components/common/GlassCard';
import { GoldButton } from '../../src/components/common/GoldButton';
import { ReputationBadge, VerifiedBadge, CountryFlag } from '../../src/components/common/Badges';
import { TravelStyleTag } from '../../src/components/common/Chips';
import { StyleFilter } from '../../src/components/discover/StyleFilter';
import { useDiscoverStore } from '../../src/stores/discoverStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { formatDistance, haversineDistance } from '../../src/utils/haversine';
// import { TRAVEL_STYLES, TravelStyle } from '../../src/constants/travelStyles'; // no longer needed

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { backpackers, filterStyle, setFilterStyle } = useDiscoverStore();
  const { latitude, longitude, currentCity } = useLocationStore();
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();
  }, []);

  // Sort by distance
  const sortedBackpackers = backpackers
    .filter((bp) => !filterStyle || bp.travelStyles.includes(filterStyle))
    .map((bp) => ({
      ...bp,
      distance: haversineDistance(latitude, longitude, bp.latitude, bp.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);

  // Featured (closest) backpacker
  const featured = sortedBackpackers[0];
  const rest = sortedBackpackers.slice(1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NEARBY</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Scanning Card */}
        <GlassCard style={styles.scanCard} elevated>
          <View style={styles.scanHeader}>
            <Animated.View style={[styles.scanDot, { opacity: pulseAnim }]} />
            <Text style={styles.scanTag}>ACTIVE REGION</Text>
            <View style={styles.scanBadge}>
              <Animated.View
                style={[
                  styles.scanPulse,
                  {
                    opacity: scanAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.5, 0],
                    }),
                  },
                ]}
              />
              <Text style={styles.scanBadgeText}>SCANNING...</Text>
            </View>
          </View>
          <Text style={styles.scanCity}>{currentCity || 'Bangalore'}</Text>
          <Text style={styles.scanMeta}>
            {sortedBackpackers.length} voyagers currently exploring within 5km radius of your location.
          </Text>
        </GlassCard>

        {/* Style Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by travel style</Text>
          <StyleFilter
            selected={filterStyle}
            onSelect={(style) => setFilterStyle(style)}
          />
        </View>

        {/* Featured Closest Traveler */}
        {featured && (
          <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/backpacker/${featured.id}`)}
          >
            <Image source={{ uri: featured.coverPhoto }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredDistRow}>
                <Ionicons name="navigate" size={12} color={Colors.gold} />
                <Text style={styles.featuredDist}>
                  {formatDistance(featured.distance).toUpperCase()}
                </Text>
              </View>
              <View style={styles.featuredInfoRow}>
                <Image source={{ uri: featured.avatar }} style={styles.featuredAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.featuredNameRow}>
                    <Text style={styles.featuredName}>{featured.name}</Text>
                    {featured.isVerified && <VerifiedBadge size={16} />}
                  </View>
                  <Text style={styles.featuredBio} numberOfLines={2}>
                    "{featured.bio}"
                  </Text>
                </View>
                <GoldButton title="SAY HI" onPress={() => router.push(`/backpacker/${featured.id}`)} small />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Rest of Travelers */}
        {rest.map((bp) => (
          <TouchableOpacity
            key={bp.id}
            style={styles.bpCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/backpacker/${bp.id}`)}
          >
            <View style={styles.bpCardInner}>
              <Image source={{ uri: bp.avatar }} style={styles.bpAvatar} />
              <View style={styles.bpInfo}>
                <View style={styles.bpNameRow}>
                  <CountryFlag code={bp.countryCode} size={16} />
                  <Text style={styles.bpName}>{bp.name}</Text>
                  {bp.isVerified && <VerifiedBadge size={13} />}
                </View>
                <Text style={styles.bpMeta}>
                  {formatDistance(bp.distance)} • {bp.currentCity}
                </Text>
                <Text style={styles.bpBio} numberOfLines={1}>{bp.bio}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.sayHiBtn}
              onPress={() => router.push(`/backpacker/${bp.id}`)}
            >
              <Text style={styles.sayHiText}>SAY HI</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Insights Card */}
        <GlassCard style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Voyager Insights</Text>
          <Text style={styles.insightsText}>
            Most travelers in your area are heading towards{' '}
            <Text style={styles.insightsHighlight}>Cultural Districts</Text>. The peak
            density is expected around 18:00.
          </Text>
          <View style={styles.insightsAvatars}>
            {sortedBackpackers.slice(0, 3).map((bp) => (
              <Image key={bp.id} source={{ uri: bp.avatar }} style={styles.insightsAvatar} />
            ))}
            <View style={styles.insightsMore}>
              <Text style={styles.insightsMoreText}>+{Math.max(0, sortedBackpackers.length - 3)}</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Fonts.titleMedium, color: Colors.gold, letterSpacing: 4 },

  scrollContent: { paddingHorizontal: Spacing.lg },

  scanCard: { marginBottom: Spacing.md, paddingVertical: Spacing.xl },
  scanHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  scanDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  scanTag: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 2, flex: 1 },
  scanBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.full,
    position: 'relative',
    overflow: 'hidden',
  },
  scanPulse: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.gold,
    borderRadius: Radii.full,
  },
  scanBadgeText: { ...Fonts.labelSmall, color: Colors.onSurface, letterSpacing: 1 },
  scanCity: { ...Fonts.headlineLarge, color: Colors.onSurface, marginBottom: Spacing.xs },
  scanMeta: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted },

  filterScroll: { gap: Spacing.sm, paddingVertical: Spacing.sm, marginBottom: Spacing.md },

  featuredCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    height: 280,
    backgroundColor: Colors.surfaceContainerLow,
  },
  featuredImage: { width: '100%', height: 180 },
  featuredOverlay: { padding: Spacing.md, gap: Spacing.sm },
  featuredDistRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  featuredDist: { ...Fonts.labelSmall, color: Colors.gold, letterSpacing: 1 },
  featuredInfoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featuredAvatar: { width: 44, height: 44, borderRadius: 22 },
  featuredNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  featuredName: { ...Fonts.titleMedium, color: Colors.onSurface },
  featuredBio: { ...Fonts.bodySmall, color: Colors.onSurfaceMuted, fontStyle: 'italic' },

  bpCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  bpCardInner: { flexDirection: 'row', gap: Spacing.md },
  bpAvatar: { width: 52, height: 52, borderRadius: 26 },
  bpInfo: { flex: 1, gap: 2 },
  bpNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  bpName: { ...Fonts.titleSmall, color: Colors.onSurface },
  bpMeta: { ...Fonts.labelSmall, color: Colors.gold, letterSpacing: 0.5 },
  bpBio: { ...Fonts.bodySmall, color: Colors.onSurfaceMuted, marginTop: 2 },
  sayHiBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
  },
  sayHiText: { ...Fonts.labelMedium, color: Colors.gold },

  insightsCard: { marginTop: Spacing.md },
  insightsTitle: { ...Fonts.titleLarge, color: Colors.onSurface, marginBottom: Spacing.sm },
  insightsText: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted, lineHeight: 22, marginBottom: Spacing.md },
  insightsHighlight: { color: Colors.gold, fontWeight: '600' },
  insightsAvatars: { flexDirection: 'row', gap: -8 },
  insightsAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: Colors.surface },
  insightsMore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  filterSection: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
    marginBottom: Spacing.sm,
  },

  insightsMoreText: { ...Fonts.labelSmall, color: Colors.gold },
});
