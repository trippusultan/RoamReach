import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

export default function SignInScreen() {
  const { signIn, signInWithOAuth, isAuthenticated, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Navigate to Explore once Supabase has a live session.
  // onAuthStateChange fires after the OAuth redirect is processed.
  const [wasOnSignIn, setWasOnSignIn] = useState(true);

  useEffect(() => {
    // Only navigate if we started on the sign-in screen
    if (isAuthenticated && wasOnSignIn) {
      router.replace('/(tabs)/explore');
    }
  }, [isAuthenticated, wasOnSignIn]);

  const handleGoogleSignIn = async () => {
    try {
      // Build redirect URL — must match what's configured in Supabase Dashboard
      const redirectTo = Platform.select({
        web: process.env.EXPO_PUBLIC_REDIRECT_URL,
        default: undefined,   // native: Supabase uses the app's custom scheme / deep link
      });
      await signInWithOAuth('google', redirectTo);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const redirectTo = Platform.select({
        web:  (process.env.EXPO_PUBLIC_REDIRECT_URL || (typeof window !== 'undefined' ? window.location.origin : undefined)),
        default: undefined,
      });
      await signInWithOAuth('apple', redirectTo);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signIn(email, password);
      // onAuthStateChange → useEffect above navigates
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
        <Text style={styles.welcomeTitle}>Welcome back,{'"\n"'}explorer.</Text>
        <Text style={styles.welcomeDesc}>
          Sign in to reconnect with travelers nearby and discover what&apos;s happening tonight.
        </Text>
      </View>

      {/* Auth buttons */}
      <View style={styles.authSection}>
        <TouchableOpacity
          style={[styles.authButton, isLoading && styles.authButtonDisabled]}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[Colors.surfaceContainerHigh, Colors.surfaceContainerLow]}
            style={styles.authGradient}
          >
            <Ionicons name="logo-google" size={22} color={Colors.onSurface} />
            <Text style={styles.authText}>
              {isLoading ? 'Connecting…' : 'Continue with Google'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.authButton, isLoading && styles.authButtonDisabled]}
          onPress={handleAppleSignIn}
          activeOpacity={0.8}
          disabled={isLoading}
        >
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

        {/* Email inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.onSurfaceDim}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.onSurfaceDim}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.goldAuth, isLoading && styles.authButtonDisabled]}
          onPress={handleEmailSignIn}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[Colors.gold, Colors.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authGradient}
          >
            <Ionicons name="mail-outline" size={20} color={Colors.onGold} />
            <Text style={[styles.authText, { color: Colors.onGold }]}>
              {isLoading ? 'Signing in…' : 'Sign in with Email'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Demo account hint */}
        <Text style={styles.demoHint}>
          Demo accounts created in SQL — use Google or Apple to test the real flow.
        </Text>
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
    gap: Spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  brand: {
    ...Fonts.headlineSmall,
    color: Colors.gold,
    letterSpacing: 8,
  },
  subtitle: {
    ...Fonts.labelMedium,
    color: Colors.onSurfaceDim,
    letterSpacing: 3,
  },
  welcomeSection: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  welcomeTitle: {
    ...Fonts.headlineLarge,
    color: Colors.onSurface,
  },
  welcomeDesc: {
    ...Fonts.bodyLarge,
    color: Colors.onSurfaceMuted,
  },
  authSection: {
    gap: Spacing.md,
  },
  authButton: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  authButtonDisabled: {
    opacity: 0.5,
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
  input: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Fonts.bodyLarge,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
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
  demoHint: {
    ...Fonts.bodySmall,
    color: Colors.goldMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  terms: {
    ...Fonts.bodySmall,
    color: Colors.onSurfaceDim,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  link: {
    color: Colors.gold,
    fontWeight: '600',
  },
});
