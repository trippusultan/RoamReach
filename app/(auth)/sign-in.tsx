import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

export default function SignInScreen() {
  const { signIn, signInWithOAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithOAuth('google');
      router.replace('/(tabs)/explore');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithOAuth('apple');
      router.replace('/(tabs)/explore');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)/explore');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo area */}
      <View style={styles.logoSection}>
        <Text style={styles.brand}>R O A M R E A C H</Text>
        <Text style={styles.subtitle}>THE SOVEREIGN VOYAGER</Text>
      </View>

      {/* Welcome text */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back,{'\n'}explorer.</Text>
        <Text style={styles.welcomeDesc}>
          Sign in to reconnect with travelers nearby and discover what&apos;s happening tonight.
        </Text>
      </View>

      {/* Auth buttons */}
      <View style={styles.authSection}>
        <TouchableOpacity style={styles.authButton} onPress={handleGoogleSignIn} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.surfaceContainerHigh, Colors.surfaceContainerLow]}
            style={styles.authGradient}
          >
            <Ionicons name="logo-google" size={22} color={Colors.onSurface} />
            <Text style={styles.authText}>Continue with Google</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.authButton} onPress={handleAppleSignIn} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.surfaceContainerHigh, Colors.surfaceContainerLow]}
            style={styles.authGradient}
          >
            <Ionicons name="logo-apple" size={22} color={Colors.onSurface} />
            <Text style={styles.authText}>Continue with Apple</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Email */}
        <TouchableOpacity style={styles.goldAuth} onPress={handleSignIn} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.gold, Colors.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authGradient}
          >
            <Ionicons name="mail-outline" size={20} color={Colors.onGold} />
            <Text style={[styles.authText, { color: Colors.onGold }]}>
              Sign in with Email
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  brand: {
    ...Fonts.headlineSmall,
    color: Colors.gold,
    letterSpacing: 8,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Fonts.labelMedium,
    color: Colors.onSurfaceDim,
    letterSpacing: 3,
  },
  welcomeSection: {
    marginBottom: Spacing.xxl,
  },
  welcomeTitle: {
    ...Fonts.headlineLarge,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
  },
  welcomeDesc: {
    ...Fonts.bodyLarge,
    color: Colors.onSurfaceMuted,
  },
  authSection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  authButton: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  goldAuth: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  authGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radii.lg,
  },
  authText: {
    ...Fonts.titleSmall,
    color: Colors.onSurface,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  dividerText: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceDim,
  },
  terms: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceDim,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  link: {
    color: Colors.gold,
  },
});
