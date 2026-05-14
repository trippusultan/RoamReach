import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing } from '../../src/constants/theme';
import { GoldButton } from '../../src/components/common/GoldButton';
import { useAuthStore } from '../../src/stores/authStore';

export default function SetupProfileScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const handleComplete = () => {
    completeOnboarding();
    router.replace('/(tabs)/explore');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RoamReach</Text>
      <Text style={styles.subtitle}>
        Your profile is ready. Start exploring!
      </Text>
      <GoldButton
        title="START EXPLORING"
        onPress={handleComplete}
        style={styles.cta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Fonts.headlineLarge,
    color: Colors.onSurface,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.bodyLarge,
    color: Colors.onSurfaceMuted,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  cta: {
    width: '100%',
  },
});
