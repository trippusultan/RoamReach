import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';
import { GoldButton } from '../common/GoldButton';
import { Ionicons } from '@expo/vector-icons';

interface RatingPromptProps {
  visible: boolean;
  userName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export const RatingPrompt: React.FC<RatingPromptProps> = ({
  visible,
  userName,
  onSubmit,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      setSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setComment('');
        setSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Rate your meetup</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          How was your experience with {userName}?
        </Text>

        {/* Star rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              onPressIn={() => setRating(star)}
            >
              <Ionicons
                name={star <= (hoverRating || rating) ? 'star' : 'star-outline'}
                size={48}
                color={star <= (hoverRating || rating) ? Colors.gold : Colors.outline}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingLabel}>
          {rating === 0
            ? 'Tap to rate'
            : rating === 1
            ? 'Poor'
            : rating === 2
            ? 'Fair'
            : rating === 3
            ? 'Good'
            : rating === 4
            ? 'Great'
            : 'Excellent'}
        </Text>

        {/* Comment input */}
        <Text style={styles.label}>Leave a comment (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your experience..."
          placeholderTextColor={Colors.onSurfaceDim}
          multiline
          numberOfLines={3}
          value={comment}
          onChangeText={setComment}
        />

        <GoldButton
          title={submitted ? 'Thank you!' : 'Submit Rating'}
          onPress={handleSubmit}
          disabled={rating === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Fonts.headlineSmall,
    color: Colors.onSurface,
  },
  closeBtn: {
    ...Fonts.titleLarge,
    color: Colors.onSurfaceMuted,
  },
  subtitle: {
    ...Fonts.bodyMedium,
    color: Colors.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  ratingLabel: {
    ...Fonts.bodyMedium,
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Fonts.labelMedium,
    color: Colors.onSurfaceMuted,
    marginBottom: Spacing.sm,
  },
  input: {
    height: 80,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    padding: Spacing.md,
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: Colors.outline,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
});
