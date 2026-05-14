import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';
import { TRAVEL_STYLES, TravelStyle } from '../../constants/travelStyles';

interface StyleFilterProps {
  selected: TravelStyle | null;
  onSelect: (style: TravelStyle | null) => void;
  style?: object;
}

export const StyleFilter: React.FC<StyleFilterProps> = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {/* All filter */}
      <TouchableOpacity
        style={[styles.chip, selected === null && styles.chipActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.chipText, selected === null && styles.chipTextActive]}>
          All
        </Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TRAVEL_STYLES.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[
              styles.chip,
              selected === style.id && styles.chipActive,
            ]}
            onPress={() => onSelect(style.id)}
          >
            <Text style={styles.chipIcon}>{style.emoji}</Text>
            <Text
              style={[
                styles.chipText,
                selected === style.id && styles.chipTextActive,
              ]}
            >
              {style.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scrollContent: {
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  chipActive: {
    backgroundColor: Colors.goldDark,
    borderColor: Colors.gold,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
  },
  chipTextActive: {
    color: Colors.gold,
  },
});
