/**
 * RoamReach — Midnight Gilt Design System
 * "The Midnight Concierge" — luxury editorial approach to travel.
 * Matte dark surfaces + brushed gold accents.
 */

export const Colors = {
  // Surface hierarchy (no pure black)
  surface: '#131313',
  surfaceDim: '#0e0e0e',
  surfaceContainerLowest: '#161616',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#242323',
  surfaceContainerHigh: '#2e2d2d',
  surfaceContainerHighest: '#353534',

  // Gold spectrum
  gold: '#e9c176',
  goldDark: '#604403',
  goldMuted: '#a38a52',
  goldLight: '#f5dca8',
  onGold: '#412d00',

  // Text & content
  onSurface: '#e6e1e5',
  onSurfaceMuted: '#c8c6c5',
  onSurfaceDim: '#8c8a89',

  // Utility
  outline: '#444748',
  outlineVariant: 'rgba(68, 71, 72, 0.15)',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  success: '#7dd99a',
  info: '#7db8e3',

  // Glassmorphism
  glass: 'rgba(19, 19, 19, 0.70)',
  glassBorder: 'rgba(68, 71, 72, 0.15)',

  // Overlays
  overlayDark: 'rgba(0, 0, 0, 0.5)',
  overlayGold: 'rgba(233, 193, 118, 0.08)',
} as const;

export const Fonts = {
  // Display & Headlines — Manrope (Editorial voice)
  displayLarge: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1.5,
  },
  displayMedium: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Body & Titles — Plus Jakarta Sans (Functional voice)
  titleLarge: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.8,
  },
  labelMedium: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
  },
  labelSmall: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.5,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radii = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  ambient: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#e9c176',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
