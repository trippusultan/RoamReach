import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { GoldButton } from '../../src/components/common/GoldButton';
import { GhostButton } from '../../src/components/common/GhostButton';
import { GlassCard } from '../../src/components/common/GlassCard';
import { ReputationBadge, VerifiedBadge, CountryFlag, HotBadge } from '../../src/components/common/Badges';
import { usePlansStore } from '../../src/stores/plansStore';
import { useAuthStore } from '../../src/stores/authStore';
import { MOCK_BACKPACKERS } from '../../src/data/mockData';
import { getCategoryConfig } from '../../src/constants/categories';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getPlanById, joinPlan, leavePlan, isFull, isHot } = usePlansStore();
  const user = useAuthStore((s) => s.user);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', userId: 'bp-01', text: 'I\'ll be at the meeting point 10 min early!', time: '5m ago' },
    { id: '2', userId: 'bp-04', text: 'Awesome, see you there! 🎉', time: '3m ago' },
  ]);
  const [showRating, setShowRating] = useState(false);

  const plan = getPlanById(id);
  const isJoined = plan?.attendeeIds.includes(user?.id ?? 'user-me');
  const planDate = plan?.date || '';
  const today = new Date().toISOString().split('T')[0];
  const showRateButton = isJoined && plan && planDate < today;
  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Plan not found</Text>
      </View>
    );
  }

  const creator = MOCK_BACKPACKERS.find((b) => b.id === plan.creatorId);
  const cat = getCategoryConfig(plan.category);
  const full = isFull(plan.id);
  const hot = isHot(plan.id);
  const attendees = plan.attendeeIds
    .map((aid) => MOCK_BACKPACKERS.find((b) => b.id === aid))
    .filter(Boolean);

  const handleJoin = () => {
    const result = joinPlan(plan.id, user?.id ?? 'user-me');
    Alert.alert(result.success ? '🎉 You\'re in!' : 'Oops', result.message);
  };

  const handleLeave = () => {
    leavePlan(plan.id, user?.id ?? 'user-me');
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        userId: user?.id ?? 'user-me',
        text: chatMessage.trim(),
        time: 'now',
      },
    ]);
    setChatMessage('');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: plan.coverImage }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(19,19,19,0.85)', Colors.surface]}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{cat.emoji} {cat.label.toUpperCase()}</Text>
              </View>
              <Text style={styles.heroTitle}>{plan.title.toUpperCase()}</Text>
              <Text style={styles.heroDate}>{plan.date} — {plan.time}</Text>
            </View>
          </LinearGradient>

          {/* Close */}
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + Spacing.sm }]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Creator */}
          <TouchableOpacity
            style={styles.creatorRow}
            onPress={() => router.push(`/backpacker/${creator?.id}`)}
          >
            <Image source={{ uri: creator?.avatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorInfo}>
              <View style={styles.creatorNameRow}>
                <Text style={styles.creatorName}>{creator?.name}</Text>
                {creator?.isVerified && <VerifiedBadge size={14} />}
              </View>
              <ReputationBadge score={creator?.reputationScore ?? 0} size="sm" />
            </View>
            {hot && <HotBadge />}
          </TouchableOpacity>

          {/* Description */}
          <Text style={styles.description}>{plan.description}</Text>

          {/* Details */}
          <GlassCard>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={Colors.gold} />
              <View>
                <Text style={styles.detailLabel}>MEETING POINT</Text>
                <Text style={styles.detailValue}>{plan.meetingPoint}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={Colors.gold} />
              <View>
                <Text style={styles.detailLabel}>DATE & TIME</Text>
                <Text style={styles.detailValue}>{plan.date} at {plan.time}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={18} color={Colors.gold} />
              <View>
                <Text style={styles.detailLabel}>SPOTS</Text>
                <Text style={styles.detailValue}>
                  {plan.attendeeIds.length} of {plan.maxSpots} going
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(plan.attendeeIds.length / plan.maxSpots) * 100}%`,
                  backgroundColor: full ? Colors.error : Colors.gold,
                },
              ]}
            />
          </View>

          {/* Attendees */}
          <Text style={styles.sectionLabel}>WHO'S GOING</Text>
          <View style={styles.attendeesRow}>
            {attendees.map((bp) =>
              bp ? (
                <TouchableOpacity
                  key={bp.id}
                  onPress={() => router.push(`/backpacker/${bp.id}`)}
                >
                  <Image source={{ uri: bp.avatar }} style={styles.attendeeAvatar} />
                </TouchableOpacity>
              ) : null
            )}
            {plan.maxSpots - plan.attendeeIds.length > 0 && (
              <View style={styles.emptySpot}>
                <Ionicons name="add" size={18} color={Colors.onSurfaceDim} />
              </View>
            )}
          </View>

          {/* Join/Leave */}
          <View style={styles.actionSection}>
            {isJoined ? (
              <GhostButton title="LEAVE PLAN" onPress={handleLeave} />
            ) : full ? (
              <GhostButton title="PLAN IS FULL" onPress={() => {}} />
            ) : (
              <GoldButton title="JOIN THIS PLAN" onPress={handleJoin} />
            )}
          </View>

          {/* Rate Experience - only if user attended */}
          {showRateButton && (
            <GoldButton
              title="RATE YOUR EXPERIENCE"
              onPress={() => setShowRating(true)}
              style={{ marginTop: Spacing.md }}
            />
          )}

          {/* Group Chat */}
          <Text style={styles.sectionLabel}>GROUP CHAT</Text>
          <GlassCard>
            {chatMessages.map((msg) => {
              const sender = MOCK_BACKPACKERS.find((b) => b.id === msg.userId);
              const isMe = msg.userId === (user?.id ?? 'user-me');
              return (
                <View key={msg.id} style={styles.chatBubble}>
                  {!isMe && sender && (
                    <Image source={{ uri: sender.avatar }} style={styles.chatAvatar} />
                  )}
                  <View
                    style={[
                      styles.chatContent,
                      isMe && styles.chatContentMe,
                    ]}
                  >
                    {!isMe && (
                      <Text style={styles.chatSender}>{sender?.name ?? 'You'}</Text>
                    )}
                    <Text style={styles.chatText}>{msg.text}</Text>
                    <Text style={styles.chatTime}>{msg.time}</Text>
                  </View>
                </View>
              );
            })}

            {/* Chat input */}
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder="Say something..."
                placeholderTextColor={Colors.onSurfaceDim}
              />
              <TouchableOpacity onPress={handleSendChat} style={styles.sendBtn}>
                <Ionicons name="send" size={18} color={Colors.onGold} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  errorText: { ...Fonts.bodyLarge, color: Colors.error, textAlign: 'center', marginTop: 100 },

  heroContainer: { height: 320, position: 'relative' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { padding: Spacing.lg },
  catBadge: {
    backgroundColor: 'rgba(233, 193, 118, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  catBadgeText: { ...Fonts.labelSmall, color: Colors.gold, letterSpacing: 1 },
  heroTitle: { ...Fonts.headlineLarge, color: Colors.onSurface, fontWeight: '800' },
  heroDate: { ...Fonts.labelMedium, color: Colors.gold, letterSpacing: 1, marginTop: Spacing.xs },
  closeBtn: {
    position: 'absolute',
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(19,19,19,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  creatorAvatar: { width: 48, height: 48, borderRadius: 24 },
  creatorInfo: { flex: 1, gap: Spacing.xs },
  creatorNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  creatorName: { ...Fonts.titleMedium, color: Colors.onSurface },
  description: { ...Fonts.bodyLarge, color: Colors.onSurfaceMuted, lineHeight: 26 },

  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  detailLabel: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 1 },
  detailValue: { ...Fonts.bodyMedium, color: Colors.onSurface },

  progressBg: { height: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },

  sectionLabel: { ...Fonts.labelSmall, color: Colors.goldMuted, letterSpacing: 2 },
  attendeesRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  attendeeAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.gold },
  emptySpot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionSection: { marginVertical: Spacing.sm },

  chatBubble: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  chatAvatar: { width: 32, height: 32, borderRadius: 16 },
  chatContent: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
    padding: Spacing.sm,
  },
  chatContentMe: { backgroundColor: 'rgba(233, 193, 118, 0.1)', marginLeft: Spacing.xxl },
  chatSender: { ...Fonts.labelSmall, color: Colors.gold, marginBottom: 2 },
  chatText: { ...Fonts.bodyMedium, color: Colors.onSurface },
  chatTime: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, marginTop: Spacing.xs, alignSelf: 'flex-end' },

  chatInputRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md, alignItems: 'center' },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
