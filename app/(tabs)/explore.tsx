import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { GoldButton } from '../../src/components/common/GoldButton';
import { GlassCard } from '../../src/components/common/GlassCard';
import { ReputationBadge, VerifiedBadge, CountryFlag } from '../../src/components/common/Badges';
import { TravelStyleTag } from '../../src/components/common/Chips';
import { CheckInSheet } from '../../src/components/checkin/CheckInSheet';
import { PlanCard } from '../../src/components/plan/PlanCard';
import { ViewToggle, StyleFilter, MapView as DiscoverMapView } from '../../src/components/discover';
import { useLocationStore } from '../../src/stores/locationStore';
import { useDiscoverStore } from '../../src/stores/discoverStore';
import { usePlansStore } from '../../src/stores/plansStore';
import { MOCK_BACKPACKERS, MOCK_PLANS } from '../../src/data/mockData';
import { getCategoryConfig } from '../../src/constants/categories';
import { TRAVEL_STYLES, TravelStyle } from '../../src/constants/travelStyles';
import { getFlag } from '../../src/constants/countries';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { isCheckedIn, currentCity, checkIn } = useLocationStore();
  const { filterStyle, setFilterStyle, getSortedByDistance } = useDiscoverStore();
  const plans = usePlansStore((s) => s.plans);
  const activePlans = plans.filter((p) => p.attendeeIds.length < p.maxSpots);

  // User location (default to Bangalore if not checked in yet)
  const { latitude: userLat = 12.9716, longitude: userLon = 77.5946 } = useLocationStore();
  const nearbyBackpackers = getSortedByDistance(userLat, userLon);
  const nearbyCount = nearbyBackpackers.length;

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    const scan = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    );
    scan.start();
    return () => scan.stop();
  }, []);

  // UI state
  const [checkInSheetVisible, setCheckInSheetVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedBpId, setSelectedBpId] = useState<string | null>(null);

  const handleCheckInComplete = (city: string, lat: number, lon: number) => {
    checkIn(city, lat, lon);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>ROAMREACH</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/messages')}>
            <Ionicons name="chatbubble-outline" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Check-in trigger & Quick action bar */}
        <View style={styles.checkInSection}>
          {!isCheckedIn ? (
            <TouchableOpacity
              style={styles.checkInTrigger}
              activeOpacity={0.8}
              onPress={() => setCheckInSheetVisible(true)}
            >
              <Ionicons name="location" size={24} color={Colors.gold} />
              <Text style={styles.checkInTriggerText}>Check In to Discover Nearby Travelers</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gold} />
            </TouchableOpacity>
          ) : (
            <View style={styles.checkedInBar}>
              <View style={styles.checkedInInfo}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={styles.checkedInText}>
                  You're checked in at {currentCity || 'Bangalore'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCheckInSheetVisible(true)}>
                <Text style={styles.changeCityBtn}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Check In Modal Sheet */}
        <CheckInSheet
          visible={checkInSheetVisible}
          onClose={() => setCheckInSheetVisible(false)}
          onCheckIn={handleCheckInComplete}
          currentCity={currentCity || 'Bangalore'}
        />

        {/* Discover controls - only show when checked in */}
        {isCheckedIn && (
          <>
            <View style={styles.controlsRow}>
              <ViewToggle
                viewMode={viewMode}
                onToggle={(mode) => setViewMode(mode)}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <StyleFilter
                selected={filterStyle}
                onSelect={(style) => setFilterStyle(style)}
                style={{ flex: 2 }}
              />
            </View>

            {/* Map View Placeholder */}
            {viewMode === 'map' && (
              <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>
                    🗺️ Map View — react-native-maps integration
                  </Text>
                  <Text style={styles.mapPlaceholderSub}>
                    {nearbyCount} voyagers within 5km radius
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Live updates header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>LIVE UPDATES</Text>
            <Text style={styles.sectionTitle}>What's{'\n'}happening now</Text>
          </View>
          <View style={styles.nearbyCount}>
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
            <Text style={styles.nearbyNumber}>{nearbyCount}</Text>
            <Text style={styles.nearbyLabel}>NEARBY</Text>
          </View>
        </View>

        {/* Featured Plan Card */}
        {activePlans.length > 0 && (
          <PlanCard plan={activePlans[0]} variant="featured" />
        )}

        {/* Active Meetups */}
        <View style={styles.meetupsSection}>
          <View style={styles.meetupsHeader}>
            <Text style={styles.meetupsTitle}>Active Meetups</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/plans')}>
              <Text style={styles.viewAllText}>VIEW ALL DESTINATIONS</Text>
            </TouchableOpacity>
          </View>

          {activePlans.slice(0, 4).map((plan) => (
            <PlanCard key={plan.id} plan={plan} variant="compact" />
          ))}
        </View>

        {/* Nearby travelers preview */}
        <View style={styles.travelersSection}>
          <Text style={styles.sectionTag}>NEARBY VOYAGERS</Text>
          <Text style={styles.meetupsTitle}>Who's around you</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.travelersScroll}
          >
            {nearbyBackpackers.slice(0, 6).map((bp) => (
              <TouchableOpacity
                key={bp.id}
                style={styles.travelerCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/backpacker/${bp.id}`)}
              >
                <Image source={{ uri: bp.avatar }} style={styles.travelerAvatar} />
                <View style={styles.travelerOnline} />
                <Text style={styles.travelerName} numberOfLines={1}>{bp.name.split(' ')[0]}</Text>
                <Text style={styles.travelerFlag}>{getFlag(bp.countryCode)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Spacer for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/plan/create')}
      >
        <LinearGradient
          colors={[Colors.gold, Colors.goldDark]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color={Colors.onGold} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    zIndex: 10,
  },
  brandTitle: {
    ...Fonts.titleMedium,
    color: Colors.gold,
    letterSpacing: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },

  // Check-in section (trigger + modal)
  checkInSection: {
    marginBottom: Spacing.lg,
  },
  checkInTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    gap: Spacing.sm,
  },
  checkInTriggerText: {
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
    flex: 1,
  },
  checkedInBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  checkedInInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkedInText: {
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
  },
  changeCityBtn: {
    ...Fonts.labelSmall,
    color: Colors.gold,
    letterSpacing: 0.5,
  },

  // Controls row
  controlsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  // Map container placeholder
  mapContainer: {
    height: 300,
    marginBottom: Spacing.xl,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mapPlaceholderText: {
    ...Fonts.titleSmall,
    color: Colors.onSurfaceMuted,
  },
  mapPlaceholderSub: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceDim,
  },

  // Live updates section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  sectionTag: {
    ...Fonts.labelSmall,
    color: Colors.goldMuted,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Fonts.headlineLarge,
    color: Colors.onSurface,
  },
  nearbyCount: {
    alignItems: 'flex-end',
    gap: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  nearbyNumber: {
    ...Fonts.headlineMedium,
    color: Colors.onSurface,
  },
  nearbyLabel: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceDim,
    letterSpacing: 2,
  },

  // Featured card (handled by PlanCard component)

  // Meetups Section
  meetupsSection: {
    marginBottom: Spacing.xl,
  },
  meetupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  meetupsTitle: {
    ...Fonts.headlineSmall,
    color: Colors.onSurface,
  },
  viewAllText: {
    ...Fonts.labelSmall,
    color: Colors.gold,
    letterSpacing: 1,
  },

  // Nearby travelers
  travelersSection: {
    marginBottom: Spacing.xl,
  },
  travelersScroll: {
    gap: Spacing.md,
    paddingTop: Spacing.md,
  },
  travelerCard: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: 72,
  },
  travelerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  travelerOnline: {
    position: 'absolute',
    top: 40,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  travelerName: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
    textAlign: 'center',
  },
  travelerFlag: {
    fontSize: 14,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: Spacing.lg,
    borderRadius: 28,
    overflow: 'hidden',
    ...Shadows.ambient,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
});
