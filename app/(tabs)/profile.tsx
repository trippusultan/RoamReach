import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { GlassCard } from '../../src/components/common/GlassCard';
import { GoldButton } from '../../src/components/common/GoldButton';
import { GhostButton } from '../../src/components/common/GhostButton';
import { ReputationBadge, VerifiedBadge } from '../../src/components/common/Badges';
import { TravelStyleTag } from '../../src/components/common/Chips';
import { JourneyGallery } from '../../src/components/profile/JourneyGallery';
import { useAuthStore } from '../../src/stores/authStore';
import { getFlag } from '../../src/constants/countries';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  // Fallback for when user is null
  const profile = user ?? {
    name: 'Explorer',
    countryCode: 'US',
    homeCity: 'Unknown',
    avatar: 'https://i.pravatar.cc/200?img=68',
    coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    bio: '',
    travelStyles: [],
    countriesVisited: 0,
    travellingMonths: 0,
    reputationScore: 0,
    totalRatings: 0,
    isVerified: false,
    journeyImages: [],
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/onboarding');
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
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={{ uri: profile.avatar! }} style={styles.headerAvatarSmall} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover + Avatar */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: profile.coverPhoto! }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', Colors.surface]}
            style={styles.coverGradient}
          />
          <View style={styles.avatarOverlay}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profile.avatar! }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="pencil" size={14} color={Colors.onGold} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Name + Info */}
        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{profile.name}</Text>
            {profile.isVerified && <VerifiedBadge size={20} />}
          </View>
          <View style={styles.subtitleRow}>
            <Text style={styles.userSubtitle}>VAGABOND</Text>
            <Text style={styles.userSubtitle}>•</Text>
            <Text style={styles.userSubtitle}>{profile.countriesVisited} DESTINATIONS</Text>
          </View>
          <GhostButton title="EDIT PROFILE" onPress={() => {}} small style={{ marginTop: Spacing.sm }} />
        </View>

        {/* Countries Visited */}
        <GlassCard style={styles.statCard}>
          <Text style={styles.statLabel}>COUNTRIES VISITED</Text>
          <View style={styles.statRow}>
            <Text style={styles.statNumber}>{profile.countriesVisited}</Text>
            <Text style={styles.statTotal}>/195</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${(profile.countriesVisited / 195) * 100}%` },
              ]}
            />
          </View>
        </GlassCard>

        {/* Reputation */}
        <GlassCard style={styles.statCard}>
          <Text style={styles.statLabel}>REPUTATION</Text>
          <ReputationBadge
            score={profile.reputationScore}
            totalRatings={profile.totalRatings}
            size="lg"
          />
        </GlassCard>

        {/* Milestones */}
        <GlassCard style={styles.statCard}>
          <Text style={styles.statLabel}>MILESTONES</Text>
          <View style={styles.milestonesRow}>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneIcon}>
                <Ionicons name="trail-sign" size={20} color={Colors.gold} />
              </View>
              <Text style={styles.milestoneLabel}>TRAILBLAZER</Text>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneIcon}>
                <Ionicons name="people" size={20} color={Colors.gold} />
              </View>
              <Text style={styles.milestoneLabel}>SOCIAL STAR</Text>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneIcon}>
                <Ionicons name="globe" size={20} color={Colors.gold} />
              </View>
              <Text style={styles.milestoneLabel}>GLOBAL NOMAD</Text>
            </View>
          </View>
        </GlassCard>

        {/* Travel Style */}
        <GlassCard style={styles.statCard}>
          <Text style={styles.statLabel}>TRAVEL STYLE</Text>
          <Text style={styles.styleText}>
            {(profile.travelStyles as string[])
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(', ')}
          </Text>
          <View style={styles.styleTags}>
            {(profile.travelStyles as string[]).map((style) => (
              <TravelStyleTag key={style} style={style as any} />
            ))}
          </View>
        </GlassCard>

        {/* Bio */}
        {profile.bio ? (
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>ABOUT</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </GlassCard>
        ) : null}

        {/* Journey Gallery */}
        {profile.journeyImages && profile.journeyImages.length > 0 && (
          <JourneyGallery
            images={profile.journeyImages}
            onImagePress={(index) => console.log('Image pressed:', index)}
          />
        )}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  brandTitle: { ...Fonts.titleMedium, color: Colors.gold, letterSpacing: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerAvatarSmall: { width: 28, height: 28, borderRadius: 14 },
  scrollContent: {},

  coverContainer: { height: 240, position: 'relative' },
  coverImage: { ...StyleSheet.absoluteFillObject },
  coverGradient: { ...StyleSheet.absoluteFillObject },
  avatarOverlay: { position: 'absolute', bottom: -30, left: Spacing.lg },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 12, borderWidth: 3, borderColor: Colors.surface },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },

  nameSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl, marginBottom: Spacing.lg },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  userName: { ...Fonts.headlineLarge, color: Colors.onSurface },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  userSubtitle: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, letterSpacing: 1.5 },

  statCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  statLabel: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 2, marginBottom: Spacing.sm },
  statRow: { flexDirection: 'row', alignItems: 'baseline' },
  statNumber: { ...Fonts.displaySmall, color: Colors.gold },
  statTotal: { ...Fonts.headlineSmall, color: Colors.onSurfaceDim },
  progressBg: { height: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 2, marginTop: Spacing.sm, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 2 },

  milestonesRow: { flexDirection: 'row', gap: Spacing.lg },
  milestoneItem: { alignItems: 'center', gap: Spacing.sm },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneLabel: { ...Fonts.labelSmall, color: Colors.onSurfaceMuted, letterSpacing: 0.5 },

  styleText: { ...Fonts.titleMedium, color: Colors.onSurface, marginBottom: Spacing.sm },
  styleTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },

  bioText: { ...Fonts.bodyLarge, color: Colors.onSurfaceMuted, lineHeight: 26 },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(255, 180, 171, 0.08)',
  },
  signOutText: { ...Fonts.titleSmall, color: Colors.error },
});
