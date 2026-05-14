import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  small?: boolean;
  icon?: React.ReactNode;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  small = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.container, small && styles.containerSmall, style]}
    >
      <LinearGradient
        colors={disabled ? ['#555', '#444'] : [Colors.gold, Colors.goldDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, small && styles.gradientSmall]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.onGold} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                small && styles.textSmall,
                disabled && styles.textDisabled,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  containerSmall: {
    alignSelf: 'flex-start',
  },
  gradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gradientSmall: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  text: {
    ...Fonts.labelLarge,
    color: Colors.onGold,
    textTransform: 'uppercase',
  },
  textSmall: {
    ...Fonts.labelMedium,
  },
  textDisabled: {
    color: Colors.onSurfaceDim,
  },
});
