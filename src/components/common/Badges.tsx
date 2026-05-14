import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { getFlag } from '../../constants/countries';

interface ReputationBadgeProps {
  score: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ReputationBadge: React.FC<ReputationBadgeProps> = ({
  score,
  totalRatings,
  size = 'md',
}) => {
  const starSize = size === 'sm' ? 10 : size === 'md' ? 14 : 18;
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < fullStars ? 'star' : i === fullStars && hasHalf ? 'star-half' : 'star-outline'}
            size={starSize}
            color={Colors.gold}
          />
        ))}
      </View>
      <Text style={[styles.score, size === 'sm' && styles.scoreSm]}>
        {score.toFixed(1)}
      </Text>
      {totalRatings !== undefined && (
        <Text style={styles.count}>({totalRatings})</Text>
      )}
    </View>
  );
};

export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <View style={styles.verifiedContainer}>
    <Ionicons name="checkmark-circle" size={size} color="#4da6ff" />
  </View>
);

export const HotBadge: React.FC = () => (
  <View style={styles.hotBadge}>
    <Ionicons name="flame" size={12} color={Colors.onGold} />
    <Text style={styles.hotText}>HOT</Text>
  </View>
);

export const CountryFlag: React.FC<{ code: string; size?: number }> = ({
  code,
  size = 20,
}) => {
  return <Text style={{ fontSize: size }}>{getFlag(code)}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  score: {
    ...Fonts.labelMedium,
    color: Colors.gold,
  },
  scoreSm: {
    ...Fonts.labelSmall,
  },
  count: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceDim,
  },
  verifiedContainer: {
    marginLeft: 2,
  },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 100,
  },
  hotText: {
    ...Fonts.labelSmall,
    color: Colors.onGold,
    fontWeight: '700',
  },
});
