import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';

interface ViewToggleProps {
  viewMode: 'map' | 'list';
  onToggle: (mode: 'map' | 'list') => void;
  style?: StyleProp<ViewStyle>;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onToggle }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, viewMode === 'map' && styles.active]}
        onPress={() => onToggle('map')}
      >
        <Text style={[styles.text, viewMode === 'map' && styles.textActive]}>
          Map
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, viewMode === 'list' && styles.active]}
        onPress={() => onToggle('list')}
      >
        <Text style={[styles.text, viewMode === 'list' && styles.textActive]}>
          List
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    padding: 2,
    gap: 2,
  },
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
  },
  active: {
    backgroundColor: Colors.surfaceContainer,
  },
  text: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
    letterSpacing: 1,
  },
  textActive: {
    color: Colors.gold,
    fontWeight: '700',
  },
});
