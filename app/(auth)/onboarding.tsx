import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Animated as RNAnimated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';
import { GoldButton } from '../../src/components/common/GoldButton';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    tag: 'THE SOVEREIGN VOYAGER',
    title: 'Curate Your',
    titleItalic: 'Global Odyssey',
    description:
      'Welcome to an elite collective of explorers. Experience travel as a fine art, curated for the modern wanderer.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    id: '2',
    tag: 'STEP 02 — COMMUNITY',
    title: 'Find your ',
    titleHighlight: 'tribe',
    titleEnd: ' wherever you land.',
    description:
      'RoamReach bridges the gap between solo exploration and meaningful connection. Discover travelers nearby who share your rhythm, pace, and passions.',
    image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
  },
  {
    id: '3',
    tag: 'STEP 03 — EXPLORE',
    title: 'Tonight is',
    titleHighlight: ' never',
    titleEnd: ' boring.',
    description:
      'Create spontaneous plans, join street food crawls, sunset hikes, or techno nights. Every city has a story — write yours with fellow travellers.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new RNAnimated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  // Redirect to explore if user is already signed in
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace('/(tabs)/explore');
    }
  }, [isAuthenticated, authLoading]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/sign-in');
    }
  };

  const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      {/* Background image */}
      <Image source={{ uri: item.image }} style={styles.bgImage} />
      <LinearGradient
        colors={['transparent', 'rgba(19,19,19,0.6)', Colors.surface]}
        style={styles.gradient}
        locations={[0, 0.4, 0.65]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Brand */}
        <Text style={styles.brand}>R O A M R E A C H</Text>

        <View style={styles.textBlock}>
          {/* Tag line */}
          <View style={styles.tagRow}>
            <View style={styles.tagLine} />
            <Text style={styles.tag}>{item.tag}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {item.title}
            {item.titleItalic && (
              <Text style={styles.titleItalic}>{'\n'}{item.titleItalic}</Text>
            )}
            {item.titleHighlight && (
              <Text style={styles.titleGold}>{item.titleHighlight}</Text>
            )}
            {item.titleEnd && <Text>{item.titleEnd}</Text>}
          </Text>

          {/* Description */}
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <GoldButton
          title={currentIndex < SLIDES.length - 1 ? 'CONTINUE' : 'BEGIN JOURNEY'}
          onPress={handleNext}
          icon={<Ionicons name="arrow-forward" size={18} color={Colors.onGold} />}
          style={styles.cta}
        />

        {/* Skip / Already have account */}
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
          <Text style={styles.signInLink}>I have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  slide: {
    width,
    height,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width,
    height: height * 0.6,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl + Spacing.lg,
  },
  brand: {
    ...Fonts.labelLarge,
    color: Colors.gold,
    textAlign: 'center',
    letterSpacing: 6,
  },
  textBlock: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: height * 0.22,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tagLine: {
    width: 32,
    height: 2,
    backgroundColor: Colors.goldMuted,
  },
  tag: {
    ...Fonts.labelMedium,
    color: Colors.goldMuted,
    letterSpacing: 2,
  },
  title: {
    ...Fonts.displaySmall,
    color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  titleItalic: {
    fontStyle: 'italic',
    color: Colors.gold,
  },
  titleGold: {
    color: Colors.gold,
    fontWeight: '800',
  },
  description: {
    ...Fonts.bodyLarge,
    color: Colors.onSurfaceMuted,
    lineHeight: 26,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.onSurfaceDim,
  },
  dotActive: {
    width: 28,
    backgroundColor: Colors.gold,
  },
  cta: {
    width: '100%',
  },
  signInLink: {
    ...Fonts.titleSmall,
    color: Colors.gold,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});
