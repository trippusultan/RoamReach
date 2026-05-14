import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { GoldButton } from '../../src/components/common/GoldButton';
import { CategoryChip } from '../../src/components/common/Chips';
import { CATEGORIES, PlanCategory } from '../../src/constants/categories';
import { usePlansStore } from '../../src/stores/plansStore';
import { useAuthStore } from '../../src/stores/authStore';

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

export default function CreatePlanScreen() {
  const insets = useSafeAreaInsets();
  const createPlan = usePlansStore((s) => s.createPlan);
  const user = useAuthStore((s) => s.user);

  const [category, setCategory] = useState<PlanCategory>('food');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<'Today' | 'Tomorrow' | 'Custom'>('Today');
  const [time, setTime] = useState('19:00');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [groupSize, setGroupSize] = useState(6);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'everyone' | 'connections'>('everyone');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handlePost = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Give your plan a catchy title!');
      return;
    }
    if (!meetingPoint.trim()) {
      Alert.alert('Missing Meeting Point', 'Where are you meeting?');
      return;
    }

    createPlan({
      title: title.trim(),
      category,
      description: description.trim(),
      creatorId: user?.id ?? 'user-me',
      date,
      time,
      meetingPoint: meetingPoint.trim(),
      meetingPointLat: 12.9716,
      meetingPointLon: 77.5946,
      maxSpots: groupSize,
      attendeeIds: [user?.id ?? 'user-me'],
      visibility,
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    });

    Alert.alert('Plan Posted! 🎉', 'Every backpacker in your city just got pinged.', [
      { text: 'Awesome!', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category */}
        <Text style={styles.label}>CATEGORY</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat.id}
              selected={category === cat.id}
              onPress={() => setCategory(cat.id)}
            />
          ))}
        </View>

        {/* Title */}
        <Text style={styles.label}>WHAT'S THE PLAN?</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(t) => t.length <= 80 && setTitle(t)}
            placeholder="Street food in Chinatown tonight?"
            placeholderTextColor={Colors.onSurfaceDim}
            maxLength={80}
          />
          <Text style={styles.charCount}>{title.length}/80</Text>
        </View>

        {/* Date */}
        <Text style={styles.label}>WHEN</Text>
        <View style={styles.dateRow}>
          {(['Today', 'Tomorrow', 'Custom'] as const).map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.dateChip, date === d && styles.dateChipSelected]}
              onPress={() => setDate(d)}
            >
              <Text style={[styles.dateChipText, date === d && styles.dateChipTextSelected]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time */}
        <Text style={styles.label}>TIME</Text>
        <TouchableOpacity
          style={styles.timeSelector}
          onPress={() => setShowTimePicker(!showTimePicker)}
        >
          <Ionicons name="time-outline" size={18} color={Colors.gold} />
          <Text style={styles.timeText}>{time}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.onSurfaceDim} />
        </TouchableOpacity>
        {showTimePicker && (
          <ScrollView
            style={styles.timePickerScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, time === slot && styles.timeSlotSelected]}
                onPress={() => { setTime(slot); setShowTimePicker(false); }}
              >
                <Text style={[styles.timeSlotText, time === slot && styles.timeSlotTextSelected]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Meeting Point */}
        <Text style={styles.label}>MEETING POINT</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={18} color={Colors.gold} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={meetingPoint}
            onChangeText={setMeetingPoint}
            placeholder="Type a place name..."
            placeholderTextColor={Colors.onSurfaceDim}
          />
        </View>

        {/* Group Size */}
        <Text style={styles.label}>GROUP SIZE</Text>
        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => groupSize > 2 && setGroupSize(groupSize - 1)}
          >
            <Ionicons name="remove" size={20} color={Colors.gold} />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{groupSize}</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => groupSize < 10 && setGroupSize(groupSize + 1)}
          >
            <Ionicons name="add" size={20} color={Colors.gold} />
          </TouchableOpacity>
          <Text style={styles.stepperLabel}>people max</Text>
        </View>

        {/* Description */}
        <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={(t) => t.length <= 500 && setDescription(t)}
            placeholder="Add some context..."
            placeholderTextColor={Colors.onSurfaceDim}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
        </View>
        <Text style={[styles.charCount, { alignSelf: 'flex-end', marginTop: -Spacing.sm }]}>
          {description.length}/500
        </Text>

        {/* Visibility */}
        <Text style={styles.label}>VISIBILITY</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={[styles.dateChip, visibility === 'everyone' && styles.dateChipSelected]}
            onPress={() => setVisibility('everyone')}
          >
            <Text style={[styles.dateChipText, visibility === 'everyone' && styles.dateChipTextSelected]}>
              Everyone nearby
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateChip, visibility === 'connections' && styles.dateChipSelected]}
            onPress={() => setVisibility('connections')}
          >
            <Text style={[styles.dateChipText, visibility === 'connections' && styles.dateChipTextSelected]}>
              Connections only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post Button */}
        <GoldButton title="POST PLAN" onPress={handlePost} style={styles.postBtn} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  headerTitle: { ...Fonts.titleLarge, color: Colors.onSurface },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },

  label: {
    ...Fonts.labelSmall,
    color: Colors.goldMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  input: {
    ...Fonts.bodyLarge,
    color: Colors.onSurface,
    paddingVertical: Spacing.md,
    flex: 1,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
  },
  charCount: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, marginTop: Spacing.xs },

  dateRow: { flexDirection: 'row', gap: Spacing.sm },
  dateChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  dateChipSelected: {
    backgroundColor: 'rgba(233, 193, 118, 0.15)',
    borderColor: Colors.gold,
  },
  dateChipText: { ...Fonts.labelMedium, color: Colors.onSurfaceMuted },
  dateChipTextSelected: { color: Colors.gold },

  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  timeText: { ...Fonts.titleMedium, color: Colors.onSurface, flex: 1 },
  timePickerScroll: {
    maxHeight: 200,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    marginTop: Spacing.sm,
  },
  timeSlot: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  timeSlotSelected: { backgroundColor: 'rgba(233, 193, 118, 0.15)' },
  timeSlotText: { ...Fonts.bodyMedium, color: Colors.onSurfaceMuted },
  timeSlotTextSelected: { color: Colors.gold, fontWeight: '600' },

  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { ...Fonts.headlineMedium, color: Colors.gold, minWidth: 32, textAlign: 'center' },
  stepperLabel: { ...Fonts.bodyMedium, color: Colors.onSurfaceDim },

  postBtn: { marginTop: Spacing.xl },
});
