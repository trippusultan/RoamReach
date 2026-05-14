import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { CategoryFilterBar } from '../../src/components/common/Chips';
import { GoldButton } from '../../src/components/common/GoldButton';
import { GhostButton } from '../../src/components/common/GhostButton';
import { HotBadge, VerifiedBadge, CountryFlag } from '../../src/components/common/Badges';
import { usePlansStore } from '../../src/stores/plansStore';
import { PlanCard } from '../../src/components/plan/PlanCard';
import { useLocationStore } from '../../src/stores/locationStore';
import { MOCK_BACKPACKERS } from '../../src/data/mockData';
import { getCategoryConfig } from '../../src/constants/categories';

export default function PlansScreen() {
  const insets = useSafeAreaInsets();
  const { filterCategory, setFilterCategory, getFilteredPlans, isHot, isFull } = usePlansStore();
  const currentCity = useLocationStore((s) => s.currentCity) || 'Bangalore';
  const plans = getFilteredPlans();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>ROAMREACH</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://i.pravatar.cc/200?img=68' }}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.sectionTag}>ACTIVE SEEKERS</Text>
          <Text style={styles.pageTitle}>Nearby Plans</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={Colors.goldMuted} />
            <Text style={styles.locationText}>Within 15km of {currentCity}</Text>
          </View>
        </View>

        {/* Category filter */}
        <CategoryFilterBar selected={filterCategory} onSelect={setFilterCategory} />

        {/* Plan Cards */}
        {plans.map((plan) => {
          const creator = MOCK_BACKPACKERS.find((b) => b.id === plan.creatorId);
          const cat = getCategoryConfig(plan.category);
          const full = isFull(plan.id);
          const hot = isHot(plan.id);
          const spotsLeft = plan.maxSpots - plan.attendeeIds.length;

          return (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/plan/${plan.id}`)}
            >
              {/* Cover Image */}
              <View style={styles.planImageContainer}>
                <Image source={{ uri: plan.coverImage }} style={styles.planImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(19,19,19,0.9)']}
                  style={styles.planImageGradient}
                >
                  <View style={styles.planImageContent}>
                    <Ionicons name="location" size={14} color={Colors.gold} />
                    <Text style={styles.planCardTitle}>{plan.title.toUpperCase()}</Text>
                    <Text style={styles.planDateRange}>
                      {plan.date} — {plan.time}
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Creator & Details */}
              <View style={styles.planDetails}>
                <View style={styles.planCreatorRow}>
                  <Image source={{ uri: creator?.avatar }} style={styles.creatorAvatar} />
                  <View style={styles.creatorInfo}>
                    <View style={styles.creatorNameRow}>
                      <Text style={styles.creatorName}>{creator?.name}</Text>
                      {creator?.isVerified && <VerifiedBadge size={14} />}
                    </View>
                    <Text style={styles.creatorRole}>
                      {cat.emoji} {cat.label}
                    </Text>
                  </View>
                  {hot && !full && <HotBadge />}
                  {!full && (
                    <View style={styles.spotsBadge}>
                      <Text style={styles.spotsText}>{spotsLeft} SPOTS LEFT</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.planDescription} numberOfLines={3}>
                  {plan.description}
                </Text>

                {/* Spots progress */}
                <View style={styles.spotsProgressContainer}>
                  <View style={styles.spotsProgressBg}>
                    <View
                      style={[
                        styles.spotsProgressFill,
                        {
                          width: `${(plan.attendeeIds.length / plan.maxSpots) * 100}%`,
                          backgroundColor: full ? Colors.error : Colors.gold,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.spotsCounter}>
                    {plan.attendeeIds.length} of {plan.maxSpots} going
                  </Text>
                </View>

                {/* Action */}
                {full ? (
                  <GhostButton title="WAITING LIST" onPress={() => {}} />
                ) : (
                  <GoldButton
                    title="JOIN PLAN"
                    onPress={() => router.push(`/plan/${plan.id}`)}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Map CTA at bottom */}
        <View style={styles.mapCTA}>
          <Ionicons name="map-outline" size={28} color={Colors.onSurface} />
          <Text style={styles.mapCTATitle}>Explore the Live Map</Text>
          <Text style={styles.mapCTADesc}>
            Visualize exactly where fellow travelers are gathering. Never miss a chance to connect.
          </Text>
          <View style={styles.mapStats}>
            <View style={styles.mapStat}>
              <Text style={styles.mapStatNumber}>{plans.length}</Text>
              <Text style={styles.mapStatLabel}>ACTIVE PLANS</Text>
            </View>
            <View style={styles.mapStat}>
              <Text style={styles.mapStatNumber}>{MOCK_BACKPACKERS.length}</Text>
              <Text style={styles.mapStatLabel}>TRAVELERS</Text>
            </View>
          </View>
        </View>

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
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  brandTitle: { ...Fonts.titleMedium, color: Colors.gold, letterSpacing: 4 },
  headerAvatar: { width: 32, height: 32, borderRadius: 16 },
  scrollContent: { paddingHorizontal: Spacing.lg },

  titleSection: { marginBottom: Spacing.md },
  sectionTag: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 2, marginBottom: Spacing.xs },
  pageTitle: { ...Fonts.displaySmall, color: Colors.onSurface, marginBottom: Spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  locationText: { ...Fonts.bodySmall, color: Colors.onSurfaceMuted },

  planCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  planImageContainer: { height: 200, overflow: 'hidden' },
  planImage: { ...StyleSheet.absoluteFillObject },
  planImageGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  planImageContent: { gap: Spacing.xs },
  planCardTitle: { ...Fonts.headlineSmall, color: Colors.onSurface, fontWeight: '800' },
  planDateRange: { ...Fonts.labelSmall, color: Colors.gold, letterSpacing: 1 },

  planDetails: { padding: Spacing.lg, gap: Spacing.md },
  planCreatorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  creatorAvatar: { width: 40, height: 40, borderRadius: 20 },
  creatorInfo: { flex: 1 },
  creatorNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  creatorName: { ...Fonts.titleSmall, color: Colors.onSurface },
  creatorRole: { ...Fonts.bodySmall, color: Colors.onSurfaceMuted },
  spotsBadge: {
    backgroundColor: 'rgba(233, 193, 118, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  spotsText: { ...Fonts.labelSmall, color: Colors.gold },
  planDescription: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted, lineHeight: 22 },

  spotsProgressContainer: { gap: Spacing.xs },
  spotsProgressBg: {
    height: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 2,
    overflow: 'hidden',
  },
  spotsProgressFill: { height: '100%', borderRadius: 2 },
  spotsCounter: { ...Fonts.bodySmall, color: Colors.onSurfaceDim },

  mapCTA: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  mapCTATitle: { ...Fonts.headlineSmall, color: Colors.onSurface },
  mapCTADesc: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted, textAlign: 'center' },
  mapStats: { flexDirection: 'row', gap: Spacing.xxl },
  mapStat: { alignItems: 'center' },
  mapStatNumber: { ...Fonts.headlineMedium, color: Colors.gold },
  mapStatLabel: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, letterSpacing: 1 },

  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: Spacing.lg,
    borderRadius: 28,
    overflow: 'hidden',
    ...Shadows.ambient,
  },
  fabGradient: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 28 },
});
