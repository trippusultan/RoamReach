import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';
import { CATEGORIES, PlanCategory } from '../../constants/categories';
import { TRAVEL_STYLES, TravelStyle } from '../../constants/travelStyles';

interface CategoryChipProps {
  category: PlanCategory;
  selected: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected,
  onPress,
}) => {
  const config = CATEGORIES.find((c) => c.id === category)!;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={styles.chipEmoji}>{config.emoji}</Text>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
};

interface TravelStyleTagProps {
  style: TravelStyle;
  selected?: boolean;
  onPress?: () => void;
  small?: boolean;
}

export const TravelStyleTag: React.FC<TravelStyleTagProps> = ({
  style: travelStyle,
  selected = false,
  onPress,
  small = false,
}) => {
  const config = TRAVEL_STYLES.find((s) => s.id === travelStyle)!;
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tag, selected && styles.tagSelected, small && styles.tagSmall]}
    >
      <Text style={small ? styles.tagEmojiSmall : styles.tagEmoji}>{config.emoji}</Text>
      <Text style={[styles.tagText, selected && styles.tagTextSelected, small && styles.tagTextSmall]}>
        {config.label}
      </Text>
    </Wrapper>
  );
};

interface CategoryFilterBarProps {
  selected: PlanCategory | null;
  onSelect: (cat: PlanCategory | null) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selected,
  onSelect,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterBar}
  >
    <TouchableOpacity
      onPress={() => onSelect(null)}
      style={[styles.chip, !selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, !selected && styles.chipTextSelected]}>All</Text>
    </TouchableOpacity>
    {CATEGORIES.map((cat) => (
      <CategoryChip
        key={cat.id}
        category={cat.id}
        selected={selected === cat.id}
        onPress={() => onSelect(cat.id)}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  chipSelected: {
    backgroundColor: 'rgba(233, 193, 118, 0.15)',
    borderColor: Colors.gold,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    ...Fonts.labelMedium,
    color: Colors.onSurfaceMuted,
  },
  chipTextSelected: {
    color: Colors.gold,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagSelected: {
    backgroundColor: 'rgba(233, 193, 118, 0.12)',
    borderColor: Colors.goldMuted,
  },
  tagSmall: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  tagEmoji: {
    fontSize: 13,
  },
  tagEmojiSmall: {
    fontSize: 11,
  },
  tagText: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
  },
  tagTextSelected: {
    color: Colors.gold,
  },
  tagTextSmall: {
    fontSize: 10,
  },
  filterBar: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
});
