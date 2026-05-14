import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.onSurfaceDim,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => (
          <View style={styles.tabBarBg}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.tabBarOverlay} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: 'PLANS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'COMMUNITY',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: Spacing.sm,
  },
  tabBarBg: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.glass,
  },
  tabLabel: {
    ...Fonts.labelSmall,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
