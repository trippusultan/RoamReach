import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';

interface JourneyGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
}

export const JourneyGallery: React.FC<JourneyGalleryProps> = ({
  images,
  onImagePress,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>JOURNEY GALLERY</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageWrapper}
            onPress={() => onImagePress?.(index)}
            activeOpacity={0.9}
          >
            <Image source={{ uri }} style={styles.image} />
            <View style={styles.imageOverlay} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  label: {
    ...Fonts.labelSmall,
    color: Colors.goldMuted,
    letterSpacing: 2,
  },
  viewAll: {
    ...Fonts.labelSmall,
    color: Colors.gold,
    letterSpacing: 1,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
