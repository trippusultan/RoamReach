import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  elevated = false,
}) => {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  elevated: {
    backgroundColor: Colors.surfaceContainerHigh,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
