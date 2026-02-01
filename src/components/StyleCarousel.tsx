/**
 * StyleCarousel - Horizontal scrolling carousel for style selection
 * Beautiful, swipeable style previews with smooth animations
 */
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, typography } from '../design-tokens/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_HEIGHT = CARD_WIDTH * 1.2;
const CARD_SPACING = spacing.md;

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  colors: string[];
  icon?: string;
  preview?: any;
  tags?: string[];
}

export interface StyleCarouselProps {
  styles: StyleOption[];
  selectedStyleId?: string;
  onStyleSelect: (style: StyleOption) => void;
  showDetails?: boolean;
  showTags?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  style?: any;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function StyleCarousel({
  styles,
  selectedStyleId,
  onStyleSelect,
  showDetails = true,
  showTags = true,
  cardWidth = CARD_WIDTH,
  cardHeight = CARD_HEIGHT,
  style,
}: StyleCarouselProps) {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    
    const index = Math.round(offsetX / (cardWidth + CARD_SPACING));
    setActiveIndex(index);
  }, [cardWidth, scrollX]);

  const scrollToIndex = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (cardWidth + CARD_SPACING),
      animated: true,
    });
  }, [cardWidth]);

  const handleStylePress = useCallback((styleOption: StyleOption, index: number) => {
    onStyleSelect(styleOption);
    scrollToIndex(index);
  }, [onStyleSelect, scrollToIndex]);

  return (
    <View style={[styles_local.container, style]}>
      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + CARD_SPACING}
        snapToAlignment="center"
        contentContainerStyle={[
          styles_local.scrollContent,
          { paddingHorizontal: (SCREEN_WIDTH - cardWidth) / 2 },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {styles.map((styleOption, index) => (
          <StyleCard
            key={styleOption.id}
            styleOption={styleOption}
            index={index}
            isSelected={selectedStyleId === styleOption.id}
            isActive={activeIndex === index}
            scrollX={scrollX}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            showDetails={showDetails}
            showTags={showTags}
            onPress={() => handleStylePress(styleOption, index)}
          />
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles_local.indicatorContainer}>
        {styles.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles_local.indicator,
              {
                backgroundColor: index === activeIndex
                  ? theme.colors.primary
                  : theme.colors.textSecondary + '40',
                width: index === activeIndex ? 24 : 8,
              },
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>

      {/* Navigation Arrows */}
      {styles.length > 1 && (
        <>
          {activeIndex > 0 && (
            <Animated.View
              entering={FadeIn}
              style={[styles_local.arrowLeft, { backgroundColor: theme.colors.surface }]}
            >
              <TouchableOpacity onPress={() => scrollToIndex(activeIndex - 1)}>
                <Icon name="chevron-left" size={32} color={theme.colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {activeIndex < styles.length - 1 && (
            <Animated.View
              entering={FadeIn}
              style={[styles_local.arrowRight, { backgroundColor: theme.colors.surface }]}
            >
              <TouchableOpacity onPress={() => scrollToIndex(activeIndex + 1)}>
                <Icon name="chevron-right" size={32} color={theme.colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
}

interface StyleCardProps {
  styleOption: StyleOption;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  scrollX: Animated.SharedValue<number>;
  cardWidth: number;
  cardHeight: number;
  showDetails: boolean;
  showTags: boolean;
  onPress: () => void;
}

function StyleCard({
  styleOption,
  index,
  isSelected,
  isActive,
  scrollX,
  cardWidth,
  cardHeight,
  showDetails,
  showTags,
  onPress,
}: StyleCardProps) {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (cardWidth + CARD_SPACING),
      index * (cardWidth + CARD_SPACING),
      (index + 1) * (cardWidth + CARD_SPACING),
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <AnimatedTouchable
      entering={ZoomIn.delay(index * 100)}
      style={[
        styles_local.card,
        animatedStyle,
        {
          width: cardWidth,
          height: cardHeight,
          marginRight: index === styleOption.id.length - 1 ? 0 : CARD_SPACING,
        },
        isSelected && {
          borderWidth: 3,
          borderColor: theme.colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Gradient Background */}
      <LinearGradient
        colors={styleOption.colors.length >= 2 
          ? styleOption.colors.slice(0, 2) 
          : [styleOption.colors[0] || theme.colors.primary, theme.colors.primary]}
        style={styles_local.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Selection Indicator */}
      {isSelected && (
        <Animated.View
          entering={ZoomIn}
          style={[styles_local.selectionBadge, { backgroundColor: theme.colors.primary }]}
        >
          <Icon name="check-circle" size={24} color="#fff" />
        </Animated.View>
      )}

      {/* Content */}
      <View style={styles_local.cardContent}>
        {/* Icon */}
        {styleOption.icon && (
          <View style={styles_local.iconContainer}>
            <Icon name={styleOption.icon} size={48} color="#fff" />
          </View>
        )}

        {/* Style Info */}
        {showDetails && (
          <View style={styles_local.infoContainer}>
            <Text style={styles_local.styleName}>{styleOption.name}</Text>
            <Text style={styles_local.styleDescription} numberOfLines={3}>
              {styleOption.description}
            </Text>
          </View>
        )}

        {/* Tags */}
        {showTags && styleOption.tags && styleOption.tags.length > 0 && (
          <View style={styles_local.tagsContainer}>
            {styleOption.tags.slice(0, 3).map((tag, i) => (
              <View key={i} style={styles_local.tag}>
                <Text style={styles_local.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Color Palette Preview */}
        <View style={styles_local.colorPalette}>
          {styleOption.colors.slice(0, 5).map((color, i) => (
            <View
              key={i}
              style={[
                styles_local.colorSwatch,
                { backgroundColor: color },
              ]}
            />
          ))}
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles_local = StyleSheet.create({
  container: {
    height: CARD_HEIGHT + 100,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  card: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: '#fff',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  selectionBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: radii.full,
    padding: spacing.xs,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  styleName: {
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  styleDescription: {
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.regular,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  tagText: {
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.medium,
    color: '#fff',
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  indicator: {
    height: 8,
    borderRadius: radii.full,
    transition: 'all 0.3s ease',
  },
  arrowLeft: {
    position: 'absolute',
    left: spacing.md,
    top: '40%',
    borderRadius: radii.full,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  arrowRight: {
    position: 'absolute',
    right: spacing.md,
    top: '40%',
    borderRadius: radii.full,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
