/**
 * RouletteWheel - Animated spinning wheel selector
 * Fun, interactive way to make random selections
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, G, Circle, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, typography } from '../design-tokens/theme';

export interface RouletteSegment {
  id: string;
  label: string;
  value: any;
  color?: string;
  icon?: string;
}

export interface RouletteWheelProps {
  segments: RouletteSegment[];
  onSpinComplete?: (segment: RouletteSegment) => void;
  size?: number;
  centerText?: string;
  spinDuration?: number;
  minSpins?: number;
  maxSpins?: number;
  style?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_SIZE = Math.min(SCREEN_WIDTH - 80, 320);
const DEFAULT_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

export default function RouletteWheel({
  segments,
  onSpinComplete,
  size = DEFAULT_SIZE,
  centerText = 'SPIN',
  spinDuration = 4000,
  minSpins = 5,
  maxSpins = 8,
  style,
}: RouletteWheelProps) {
  const { theme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<RouletteSegment | null>(null);
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const segmentAngle = 360 / segments.length;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Create wheel segments with colors
  const coloredSegments = segments.map((segment, index) => ({
    ...segment,
    color: segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  // Calculate SVG path for a segment
  const getSegmentPath = (index: number): string => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Calculate text position for segment
  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const textRadius = radius * 0.7;
    return {
      x: centerX + textRadius * Math.cos(angle),
      y: centerY + textRadius * Math.sin(angle),
    };
  };

  const handleSpinComplete = useCallback((finalRotation: number) => {
    setIsSpinning(false);
    
    // Calculate which segment was selected
    const normalizedRotation = (360 - (finalRotation % 360)) % 360;
    const selectedIndex = Math.floor(normalizedRotation / segmentAngle) % segments.length;
    const selected = segments[selectedIndex];
    
    setSelectedSegment(selected);
    onSpinComplete?.(selected);
  }, [segments, segmentAngle, onSpinComplete]);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedSegment(null);
    
    // Random number of full rotations + random angle
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation.value + spins * 360 + randomAngle;
    
    // Animate rotation
    rotation.value = withTiming(
      totalRotation,
      {
        duration: spinDuration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleSpinComplete)(totalRotation);
        }
      }
    );

    // Scale animation for emphasis
    scale.value = withSequence(
      withTiming(1.05, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, [isSpinning, rotation, scale, minSpins, maxSpins, spinDuration, handleSpinComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      {/* Wheel */}
      <Animated.View style={[styles.wheelContainer, animatedStyle]}>
        <Svg width={size} height={size}>
          <G>
            {/* Segments */}
            {coloredSegments.map((segment, index) => (
              <G key={segment.id}>
                <Path
                  d={getSegmentPath(index)}
                  fill={segment.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
                {/* Segment Label */}
                <SvgText
                  x={getTextPosition(index).x}
                  y={getTextPosition(index).y}
                  fill="#fff"
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(${index * segmentAngle + segmentAngle / 2}, ${getTextPosition(index).x}, ${getTextPosition(index).y})`}
                >
                  {segment.label}
                </SvgText>
              </G>
            ))}
            
            {/* Center Circle */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.25}
              fill={theme.colors.primary}
              stroke="#fff"
              strokeWidth={3}
            />
          </G>
        </Svg>
      </Animated.View>

      {/* Pointer */}
      <View style={[styles.pointer, { top: -spacing.md }]}>
        <Icon name="triangle" size={32} color={theme.colors.primary} />
      </View>

      {/* Center Button */}
      <TouchableOpacity
        style={[
          styles.centerButton,
          {
            backgroundColor: theme.colors.primary,
            width: radius * 0.5,
            height: radius * 0.5,
            borderRadius: radius * 0.25,
          },
        ]}
        onPress={handleSpin}
        disabled={isSpinning}
        activeOpacity={0.8}
      >
        <Text style={styles.centerButtonText}>
          {isSpinning ? '...' : centerText}
        </Text>
      </TouchableOpacity>

      {/* Result Display */}
      {selectedSegment && !isSpinning && (
        <Animated.View
          entering={withSpring}
          style={[
            styles.resultContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Icon name="check-circle" size={24} color={theme.colors.success} />
          <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
            Selected:
          </Text>
          <Text style={[styles.resultValue, { color: theme.colors.text }]}>
            {selectedSegment.label}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pointer: {
    position: 'absolute',
    zIndex: 10,
  },
  centerButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerButtonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.medium,
  },
  resultValue: {
    fontSize: typography.size.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
  },
});
