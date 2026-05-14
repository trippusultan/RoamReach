import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

interface GhostButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  small?: boolean;
  icon?: React.ReactNode;
}

export const GhostButton: React.FC<GhostButtonProps> = ({
  title,
  onPress,
  style,
  small = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, small && styles.containerSmall, style]}
    >
      {icon}
      <Text style={[styles.text, small && styles.textSmall]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(68, 71, 72, 0.3)',
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  containerSmall: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  text: {
    ...Fonts.labelLarge,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  textSmall: {
    ...Fonts.labelMedium,
  },
});
