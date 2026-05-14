import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { MOCK_BACKPACKERS, MOCK_MESSAGES } from '../../src/data/mockData';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>ROAMREACH</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Messages</Text>
        <Text style={styles.connectedLabel}>CONNECTED</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.onSurfaceDim} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search backpackers..."
          placeholderTextColor={Colors.onSurfaceDim}
        />
      </View>

      {/* Messages List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {MOCK_MESSAGES.map((msg) => {
          const contact = MOCK_BACKPACKERS.find((b) => b.id === msg.contactId);
          if (!contact) return null;

          return (
            <TouchableOpacity
              key={msg.id}
              style={[styles.messageCard, msg.unread && styles.messageCardUnread]}
              activeOpacity={0.8}
              onPress={() => router.push(`/messages/${contact.id}`)}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                {contact.isOnline && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.messagePreview} numberOfLines={1}>
                  {msg.lastMessage}
                </Text>
              </View>
              <View style={styles.messageRight}>
                <Text style={styles.messageTime}>{msg.timestamp.toUpperCase()}</Text>
                {msg.unread && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  brandTitle: { ...Fonts.titleMedium, color: Colors.gold, letterSpacing: 4 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  pageTitle: { ...Fonts.headlineLarge, color: Colors.onSurface },
  connectedLabel: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 2 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  searchInput: { ...Fonts.bodyMedium, color: Colors.onSurface, flex: 1 },

  scrollContent: { paddingHorizontal: Spacing.lg },

  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.xl,
    marginBottom: Spacing.sm,
  },
  messageCardUnread: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  messageContent: { flex: 1, gap: 4 },
  contactName: { ...Fonts.titleMedium, color: Colors.onSurface },
  messagePreview: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted },
  messageRight: { alignItems: 'flex-end', gap: Spacing.sm },
  messageTime: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, letterSpacing: 0.5 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
});
