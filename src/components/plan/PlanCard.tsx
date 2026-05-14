import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';
import { HotBadge, CountryFlag } from '../common/Badges';
import { getCategoryConfig } from '../../constants/categories';
import { Plan, MOCK_BACKPACKERS } from '../../data/mockData';

interface PlanCardProps {
  plan: Plan;
  variant?: 'featured' | 'compact';
  onPress?: (id: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, variant = 'compact', onPress }) => {
  const creator = MOCK_BACKPACKERS.find((b) => b.id === plan.creatorId);
  const cat = getCategoryConfig(plan.category);
  const spotsLeft = plan.maxSpots - plan.attendeeIds.length;
  const isFull = spotsLeft === 0;
  const isHot = plan.attendeeIds.length / plan.maxSpots > 2 / 3;

  const handlePress = () => {
    if (onPress) {
      onPress(plan.id);
    } else {
      router.push(`/plan/${plan.id}`);
    }
  };

  if (variant === 'featured') {
    return (
      <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9} onPress={handlePress}>
        <Image source={{ uri: plan.coverImage }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(19,19,19,0.85)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredBadgeRow}>
            {isHot && <HotBadge />}
            <Text style={styles.featuredCity}>{plan.meetingPoint}</Text>
          </View>
          <Text style={styles.featuredTitle}>{plan.title}</Text>
          <Text style={styles.featuredDesc} numberOfLines={2}>
            {plan.description}
          </Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredTime}>{plan.date} • {plan.time}</Text>
            <Text style={styles.featuredSpots}>
              {plan.attendeeIds.length}/{plan.maxSpots} spots
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Compact card (used in lists)
  return (
    <TouchableOpacity style={styles.compactCard} activeOpacity={0.8} onPress={handlePress}>
      <Image source={{ uri: plan.coverImage }} style={styles.compactImage} />
      <View style={styles.compactContent}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {cat.emoji} {plan.title}
          </Text>
          {creator && <CountryFlag code={creator.countryCode} size={14} />}
        </View>
        <Text style={styles.compactMeta} numberOfLines={1}>
          {plan.meetingPoint} • {plan.time}
        </Text>
        <View style={styles.compactFooter}>
          <Text style={styles.compactDate}>
            {plan.date === 'Today' ? 'STARTING TODAY' : plan.date}
          </Text>
          <View style={[styles.statusBadge, isHot && styles.statusBadgeHot]}>
            <Text style={[styles.statusText, isHot && styles.statusTextHot]}>
              {isFull ? 'FULL' : isHot ? 'HOT' : 'OPEN'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Featured card
  featuredCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    height: 280,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radii.xl,
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  featuredCity: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
    letterSpacing: 1,
  },
  featuredTitle: {
    ...Fonts.headlineSmall,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  featuredDesc: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceMuted,
    marginBottom: Spacing.md,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredTime: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceMuted,
  },
  featuredSpots: {
    ...Fonts.labelMedium,
    color: Colors.gold,
  },

  // Compact card
  compactCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
  },
  compactContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitle: {
    ...Fonts.titleSmall,
    color: Colors.onSurface,
    flex: 1,
    marginRight: Spacing.xs,
  },
  compactMeta: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceMuted,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  compactDate: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    backgroundColor: 'rgba(125, 217, 154, 0.15)',
  },
  statusBadgeHot: {
    backgroundColor: 'rgba(233, 193, 118, 0.15)',
  },
  statusText: {
    ...Fonts.labelSmall,
    color: Colors.success,
    letterSpacing: 0.5,
  },
  statusTextHot: {
    color: Colors.gold,
  },
});
