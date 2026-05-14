import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';
import { GoldButton } from '../common/GoldButton';
import { GlassCard } from '../common/GlassCard';

interface CheckInSheetProps {
  visible: boolean;
  onClose: () => void;
  onCheckIn: (city: string, lat: number, lon: number) => void;
  currentCity?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CheckInSheet: React.FC<CheckInSheetProps> = ({
  visible,
  onClose,
  onCheckIn,
  currentCity = 'Bangalore',
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [manualCity, setManualCity] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const recentCities = ['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Pune'];

  const handleCheckIn = () => {
    const cityToUse = manualCity || selectedCity;
    // Use default coordinates for demo (Bangalore)
    onCheckIn(cityToUse, 12.9716, 77.5946);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.sheetContainer}>
          {/* Handle */}
          <View style={styles.handle} />

          <View style={styles.content}>
            {/* Location pulse icon */}
            <View style={styles.locationIconContainer}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [
                      {
                        scale: slideAnim.interpolate({
                          inputRange: [0, SCREEN_HEIGHT],
                          outputRange: [1, 0.5],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Ionicons name="location" size={32} color={Colors.gold} />
            </View>

            <Text style={styles.title}>Check In</Text>
            <Text style={styles.subtitle}>
              Let nearby travelers know you're here
            </Text>

            {/* Current city display */}
            <GlassCard style={styles.cityCard} elevated>
              <Text style={styles.cityLabel}>Detected Location</Text>
              <Text style={styles.cityName}>{currentCity}</Text>
            </GlassCard>

            {/* Quick select recent cities */}
            <Text style={styles.sectionLabel}>Recent Cities</Text>
            <View style={styles.recentCitiesRow}>
              {recentCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.cityChip,
                    selectedCity === city && styles.cityChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedCity(city);
                    setManualCity('');
                  }}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      selectedCity === city && styles.cityChipTextSelected,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Manual input */}
            <Text style={styles.sectionLabel}>Or enter city name</Text>
            <TextInput
              style={styles.input}
              placeholder="City name"
              placeholderTextColor={Colors.onSurfaceDim}
              value={manualCity}
              onChangeText={setManualCity}
            />

            <GoldButton
              title="CHECK IN HERE"
              onPress={handleCheckIn}
              style={{ marginTop: Spacing.md }}
            />

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl + Spacing.lg,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.outline,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.gold,
  },
  title: {
    ...Fonts.headlineSmall,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Fonts.bodyMedium,
    color: Colors.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  cityCard: {
    width: '100%',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cityLabel: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceDim,
    marginBottom: Spacing.xs,
  },
  cityName: {
    ...Fonts.headlineSmall,
    color: Colors.gold,
  },
  sectionLabel: {
    ...Fonts.labelMedium,
    color: Colors.onSurfaceMuted,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  recentCitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  cityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  cityChipSelected: {
    backgroundColor: Colors.goldDark,
    borderColor: Colors.gold,
  },
  cityChipText: {
    ...Fonts.labelSmall,
    color: Colors.onSurfaceMuted,
  },
  cityChipTextSelected: {
    color: Colors.gold,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    ...Fonts.bodyLarge,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: Spacing.md,
  },
  cancelBtn: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
  cancelText: {
    ...Fonts.bodyMedium,
    color: Colors.onSurfaceMuted,
  },
});
