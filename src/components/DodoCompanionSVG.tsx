/**
 * DodoCompanion - A beautifully illustrated, animated Dodo mascot 🦤
 * Features smooth SVG graphics with expressive animations
 */
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Svg, {
  G,
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { forgeColors } from '../design-tokens/theme';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type DodoMood = 
  | 'idle' 
  | 'happy' 
  | 'thinking' 
  | 'excited' 
  | 'sleepy' 
  | 'celebrating' 
  | 'curious'
  | 'waving';

interface DodoCompanionProps {
  mood?: DodoMood;
  size?: 'mini' | 'small' | 'medium' | 'large' | 'hero';
  message?: string;
  showBubble?: boolean;
  color?: string;
}

const SIZE_MAP = {
  mini: 40,
  small: 64,
  medium: 100,
  large: 140,
  hero: 200,
};

// Beautiful color palette for Dodo
const DODO_COLORS = {
  // Body - soft blue-grey with warmth
  bodyMain: '#5B7C99',
  bodyLight: '#7A9BB8',
  bodyDark: '#3D5A73',
  bodyHighlight: '#A8C4D9',
  
  // Belly - warm cream
  belly: '#F5E6D3',
  bellyLight: '#FFF5EA',
  bellyShade: '#E8D4BE',
  
  // Beak - warm orange gradient
  beakMain: '#FF9F43',
  beakLight: '#FFBE76',
  beakDark: '#E17055',
  beakTip: '#D35400',
  
  // Eyes - big and expressive
  eyeWhite: '#FFFFFF',
  eyeIris: '#2C3E50',
  eyePupil: '#1A1A2E',
  eyeShine: '#FFFFFF',
  eyeHighlight: '#E8F4FD',
  
  // Feet - warm orange
  feet: '#FF7F50',
  feetDark: '#E25822',
  
  // Wings
  wingMain: '#4A6B82',
  wingLight: '#6B8FA8',
  wingDark: '#34495E',
  
  // Cheeks - rosy blush
  cheek: '#FFB7B2',
  
  // Feather details
  featherAccent: '#89A4B8',
};

export default function DodoCompanion({
  mood = 'idle',
  size = 'medium',
  message,
  showBubble = true,
  color,
}: DodoCompanionProps) {
  const { isDark } = useTheme();
  const dimensions = SIZE_MAP[size];
  
  // Animation values
  const bounce = useSharedValue(0);
  const wingFlap = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const headTilt = useSharedValue(0);
  const bodySquish = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const breathe = useSharedValue(0);
  const cheekPuff = useSharedValue(0);
  const pupilX = useSharedValue(0);
  const pupilY = useSharedValue(0);
  
  // Apply mood-specific animations
  useEffect(() => {
    // Reset animations
    bounce.value = 0;
    wingFlap.value = 0;
    headTilt.value = 0;
    bodySquish.value = 0;
    tailWag.value = 0;
    cheekPuff.value = 0;
    
    // Continuous breathing for all moods
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Random blinking
    const startBlinking = () => {
      eyeBlink.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 100 }),
          withDelay(
            Math.random() * 3000 + 2000,
            withSequence(
              withTiming(0, { duration: 80 }),
              withTiming(1, { duration: 80 })
            )
          )
        ),
        -1,
        false
      );
    };
    startBlinking();
    
    switch (mood) {
      case 'idle':
        bounce.value = withRepeat(
          withSequence(
            withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        tailWag.value = withRepeat(
          withSequence(
            withTiming(5, { duration: 800 }),
            withTiming(-5, { duration: 800 })
          ),
          -1,
          true
        );
        break;
        
      case 'happy':
        bounce.value = withRepeat(
          withSequence(
            withSpring(-8, { damping: 8, stiffness: 200 }),
            withSpring(0, { damping: 8, stiffness: 200 })
          ),
          -1,
          true
        );
        cheekPuff.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.7, { duration: 300 })
          ),
          -1,
          true
        );
        tailWag.value = withRepeat(
          withSequence(
            withTiming(15, { duration: 200 }),
            withTiming(-15, { duration: 200 })
          ),
          -1,
          true
        );
        break;
        
      case 'thinking':
        headTilt.value = withTiming(12, { duration: 500 });
        pupilX.value = withRepeat(
          withSequence(
            withTiming(-3, { duration: 1500 }),
            withTiming(3, { duration: 1500 })
          ),
          -1,
          true
        );
        pupilY.value = withTiming(-2, { duration: 500 });
        break;
        
      case 'excited':
        bounce.value = withRepeat(
          withSequence(
            withSpring(-15, { damping: 5, stiffness: 300 }),
            withSpring(0, { damping: 5, stiffness: 300 })
          ),
          -1,
          true
        );
        wingFlap.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 100 }),
            withTiming(0, { duration: 100 })
          ),
          -1,
          true
        );
        tailWag.value = withRepeat(
          withSequence(
            withTiming(20, { duration: 100 }),
            withTiming(-20, { duration: 100 })
          ),
          -1,
          true
        );
        cheekPuff.value = 1;
        break;
        
      case 'sleepy':
        eyeBlink.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 2000 }),
            withTiming(0.5, { duration: 2000 })
          ),
          -1,
          true
        );
        headTilt.value = withRepeat(
          withSequence(
            withTiming(8, { duration: 3000 }),
            withTiming(-8, { duration: 3000 })
          ),
          -1,
          true
        );
        bounce.value = withRepeat(
          withSequence(
            withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;
        
      case 'celebrating':
        bounce.value = withRepeat(
          withSequence(
            withSpring(-20, { damping: 4, stiffness: 400 }),
            withSpring(0, { damping: 4, stiffness: 400 })
          ),
          -1,
          true
        );
        wingFlap.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 80 }),
            withTiming(0, { duration: 80 })
          ),
          -1,
          true
        );
        bodySquish.value = withRepeat(
          withSequence(
            withTiming(0.05, { duration: 150 }),
            withTiming(-0.03, { duration: 150 })
          ),
          -1,
          true
        );
        cheekPuff.value = 1;
        break;
        
      case 'curious':
        headTilt.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            withTiming(15, { duration: 800, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        pupilX.value = withRepeat(
          withSequence(
            withTiming(4, { duration: 600 }),
            withTiming(-4, { duration: 600 })
          ),
          -1,
          true
        );
        tailWag.value = withRepeat(
          withSequence(
            withTiming(10, { duration: 400 }),
            withTiming(-10, { duration: 400 })
          ),
          -1,
          true
        );
        break;
        
      case 'waving':
        wingFlap.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.3, { duration: 300 })
          ),
          6,
          true
        );
        bounce.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 600 }),
            withTiming(0, { duration: 600 })
          ),
          -1,
          true
        );
        cheekPuff.value = 0.8;
        break;
    }
  }, [mood]);
  
  // Animated styles
  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { scaleX: 1 + bodySquish.value },
      { scaleY: 1 - bodySquish.value * 0.5 },
    ],
  }));
  
  const headAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${headTilt.value}deg` },
      { translateY: bounce.value * 0.5 },
    ],
  }));
  
  const leftWingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(wingFlap.value, [0, 1], [0, -45])}deg` },
    ],
  }));
  
  const rightWingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(wingFlap.value, [0, 1], [0, 45])}deg` },
    ],
  }));
  
  const tailStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${tailWag.value}deg` },
    ],
  }));
  
  // Speech bubble animation
  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: showBubble && message ? 1 : 0,
    transform: [
      { scale: showBubble && message ? 1 : 0.8 },
      { translateY: bounce.value * 0.3 },
    ],
  }));
  
  const scale = dimensions / 100; // Base design is 100px
  
  return (
    <View style={[styles.container, { width: dimensions, height: dimensions + 40 }]}>
      {/* Speech Bubble */}
      {message && showBubble && (
        <Animated.View style={[styles.speechBubble, bubbleStyle]}>
          <View style={[
            styles.bubbleContent,
            { backgroundColor: isDark ? '#2D3748' : '#FFFFFF' }
          ]}>
            <Text style={[
              styles.bubbleText,
              { color: isDark ? '#E2E8F0' : '#2D3748' }
            ]}>
              {message}
            </Text>
          </View>
          <View style={[
            styles.bubbleTail,
            { borderTopColor: isDark ? '#2D3748' : '#FFFFFF' }
          ]} />
        </Animated.View>
      )}
      
      {/* The Dodo SVG */}
      <Animated.View style={bodyAnimatedStyle}>
        <Svg
          width={dimensions}
          height={dimensions}
          viewBox="0 0 100 100"
        >
          <Defs>
            {/* Body gradient */}
            <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={DODO_COLORS.bodyLight} />
              <Stop offset="50%" stopColor={DODO_COLORS.bodyMain} />
              <Stop offset="100%" stopColor={DODO_COLORS.bodyDark} />
            </LinearGradient>
            
            {/* Belly gradient */}
            <RadialGradient id="bellyGradient" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor={DODO_COLORS.bellyLight} />
              <Stop offset="70%" stopColor={DODO_COLORS.belly} />
              <Stop offset="100%" stopColor={DODO_COLORS.bellyShade} />
            </RadialGradient>
            
            {/* Beak gradient */}
            <LinearGradient id="beakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={DODO_COLORS.beakLight} />
              <Stop offset="50%" stopColor={DODO_COLORS.beakMain} />
              <Stop offset="100%" stopColor={DODO_COLORS.beakDark} />
            </LinearGradient>
            
            {/* Wing gradient */}
            <LinearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={DODO_COLORS.wingLight} />
              <Stop offset="100%" stopColor={DODO_COLORS.wingDark} />
            </LinearGradient>
            
            {/* Eye shine */}
            <RadialGradient id="eyeShine" cx="30%" cy="30%" r="50%">
              <Stop offset="0%" stopColor={DODO_COLORS.eyeShine} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={DODO_COLORS.eyeShine} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          
          {/* Tail feathers */}
          <G transform="translate(70, 55)">
            <Path
              d="M0,0 Q15,-8 12,5 Q8,15 0,10 Z"
              fill={DODO_COLORS.bodyMain}
            />
            <Path
              d="M2,2 Q18,-5 15,8 Q10,18 2,12 Z"
              fill={DODO_COLORS.bodyLight}
              opacity={0.7}
            />
            <Path
              d="M0,5 Q12,0 10,10 Q5,18 0,12 Z"
              fill={DODO_COLORS.featherAccent}
              opacity={0.5}
            />
          </G>
          
          {/* Left leg */}
          <G>
            <Path
              d="M38,75 L35,88 L30,90 M35,88 L35,92 M35,88 L40,90"
              stroke={DODO_COLORS.feet}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
            />
          </G>
          
          {/* Right leg */}
          <G>
            <Path
              d="M55,75 L58,88 L53,90 M58,88 L58,92 M58,88 L63,90"
              stroke={DODO_COLORS.feet}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
            />
          </G>
          
          {/* Main body */}
          <Ellipse
            cx={48}
            cy={55}
            rx={28}
            ry={25}
            fill="url(#bodyGradient)"
          />
          
          {/* Body highlight */}
          <Ellipse
            cx={42}
            cy={48}
            rx={12}
            ry={10}
            fill={DODO_COLORS.bodyHighlight}
            opacity={0.3}
          />
          
          {/* Belly */}
          <Ellipse
            cx={48}
            cy={60}
            rx={18}
            ry={15}
            fill="url(#bellyGradient)"
          />
          
          {/* Left wing */}
          <G transform="translate(22, 45)" originX={10} originY={10}>
            <Path
              d="M10,0 Q-5,10 0,25 Q5,30 15,25 Q25,15 20,5 Q15,-5 10,0 Z"
              fill="url(#wingGradient)"
            />
            {/* Wing feather details */}
            <Path
              d="M8,8 Q2,15 5,22"
              stroke={DODO_COLORS.wingLight}
              strokeWidth={1.5}
              fill="none"
              opacity={0.6}
            />
            <Path
              d="M12,6 Q8,14 10,20"
              stroke={DODO_COLORS.wingLight}
              strokeWidth={1.5}
              fill="none"
              opacity={0.6}
            />
          </G>
          
          {/* Right wing */}
          <G transform="translate(60, 45)" originX={10} originY={10}>
            <Path
              d="M10,0 Q25,10 20,25 Q15,30 5,25 Q-5,15 0,5 Q5,-5 10,0 Z"
              fill="url(#wingGradient)"
            />
            <Path
              d="M12,8 Q18,15 15,22"
              stroke={DODO_COLORS.wingLight}
              strokeWidth={1.5}
              fill="none"
              opacity={0.6}
            />
          </G>
          
          {/* Head */}
          <G>
            {/* Main head shape */}
            <Circle
              cx={48}
              cy={28}
              r={20}
              fill="url(#bodyGradient)"
            />
            
            {/* Head highlight */}
            <Ellipse
              cx={43}
              cy={22}
              rx={8}
              ry={6}
              fill={DODO_COLORS.bodyHighlight}
              opacity={0.4}
            />
            
            {/* Fluffy head tuft */}
            <G transform="translate(48, 8)">
              <Ellipse cx={0} cy={0} rx={4} ry={6} fill={DODO_COLORS.bodyLight} />
              <Ellipse cx={-4} cy={2} rx={3} ry={5} fill={DODO_COLORS.bodyMain} />
              <Ellipse cx={4} cy={2} rx={3} ry={5} fill={DODO_COLORS.bodyMain} />
            </G>
            
            {/* Left eye white */}
            <Ellipse
              cx={38}
              cy={26}
              rx={8}
              ry={9}
              fill={DODO_COLORS.eyeWhite}
            />
            
            {/* Right eye white */}
            <Ellipse
              cx={58}
              cy={26}
              rx={8}
              ry={9}
              fill={DODO_COLORS.eyeWhite}
            />
            
            {/* Left eye iris */}
            <Circle
              cx={39}
              cy={27}
              r={5}
              fill={DODO_COLORS.eyeIris}
            />
            
            {/* Right eye iris */}
            <Circle
              cx={57}
              cy={27}
              r={5}
              fill={DODO_COLORS.eyeIris}
            />
            
            {/* Left pupil */}
            <Circle
              cx={40}
              cy={27}
              r={2.5}
              fill={DODO_COLORS.eyePupil}
            />
            
            {/* Right pupil */}
            <Circle
              cx={56}
              cy={27}
              r={2.5}
              fill={DODO_COLORS.eyePupil}
            />
            
            {/* Eye shines */}
            <Circle cx={37} cy={24} r={2} fill={DODO_COLORS.eyeShine} />
            <Circle cx={55} cy={24} r={2} fill={DODO_COLORS.eyeShine} />
            <Circle cx={41} cy={29} r={1} fill={DODO_COLORS.eyeShine} opacity={0.6} />
            <Circle cx={59} cy={29} r={1} fill={DODO_COLORS.eyeShine} opacity={0.6} />
            
            {/* Cheeks */}
            <Ellipse
              cx={28}
              cy={32}
              rx={5}
              ry={3}
              fill={DODO_COLORS.cheek}
              opacity={0.6}
            />
            <Ellipse
              cx={68}
              cy={32}
              rx={5}
              ry={3}
              fill={DODO_COLORS.cheek}
              opacity={0.6}
            />
            
            {/* Beak */}
            <G transform="translate(48, 35)">
              {/* Upper beak */}
              <Path
                d="M-8,-2 Q-2,-8 8,-2 Q12,2 8,5 L-8,5 Q-12,2 -8,-2 Z"
                fill="url(#beakGradient)"
              />
              {/* Beak curve/hook */}
              <Path
                d="M5,0 Q10,3 8,8 Q6,10 4,8 Q3,5 5,0 Z"
                fill={DODO_COLORS.beakDark}
              />
              {/* Nostril */}
              <Ellipse cx={-2} cy={0} rx={1.5} ry={1} fill={DODO_COLORS.beakDark} opacity={0.5} />
              {/* Beak highlight */}
              <Path
                d="M-6,-1 Q-2,-5 4,-1"
                stroke={DODO_COLORS.beakLight}
                strokeWidth={1.5}
                fill="none"
                opacity={0.6}
              />
            </G>
            
            {/* Eyebrows for expression */}
            {(mood === 'thinking' || mood === 'curious') && (
              <>
                <Path
                  d="M32,18 Q38,15 44,18"
                  stroke={DODO_COLORS.bodyDark}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d="M52,18 Q58,15 64,18"
                  stroke={DODO_COLORS.bodyDark}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            )}
            
            {/* Happy squinty eyes */}
            {(mood === 'happy' || mood === 'celebrating') && (
              <>
                <Path
                  d="M30,26 Q38,22 46,26"
                  stroke={DODO_COLORS.eyeIris}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d="M50,26 Q58,22 66,26"
                  stroke={DODO_COLORS.eyeIris}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            )}
            
            {/* Sleepy eyes */}
            {mood === 'sleepy' && (
              <>
                <Path
                  d="M30,27 L46,27"
                  stroke={DODO_COLORS.eyeIris}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d="M50,27 L66,27"
                  stroke={DODO_COLORS.eyeIris}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Z's for sleeping */}
                <Text
                  x={70}
                  y={15}
                  fontSize={8}
                  fill={DODO_COLORS.bodyDark}
                  opacity={0.6}
                >
                  z
                </Text>
                <Text
                  x={75}
                  y={10}
                  fontSize={6}
                  fill={DODO_COLORS.bodyDark}
                  opacity={0.4}
                >
                  z
                </Text>
              </>
            )}
          </G>
          
          {/* Sparkles for excited/celebrating */}
          {(mood === 'excited' || mood === 'celebrating') && (
            <G>
              <Path
                d="M15,15 L17,20 L22,18 L17,22 L19,27 L15,23 L11,27 L13,22 L8,18 L13,20 Z"
                fill={forgeColors.spark[500]}
              />
              <Path
                d="M80,20 L81,23 L84,22 L81,24 L82,27 L80,25 L78,27 L79,24 L76,22 L79,23 Z"
                fill={forgeColors.spark[400]}
              />
              <Circle cx={10} cy={40} r={2} fill={forgeColors.gold[500]} />
              <Circle cx={85} cy={35} r={1.5} fill={forgeColors.gold[400]} />
            </G>
          )}
          
          {/* Hearts for happy */}
          {mood === 'happy' && (
            <G>
              <Path
                d="M12,20 C12,18 14,16 16,18 C18,16 20,18 20,20 C20,24 16,26 16,26 C16,26 12,24 12,20 Z"
                fill={forgeColors.ember[400]}
                opacity={0.8}
              />
            </G>
          )}
          
          {/* Question mark for curious */}
          {mood === 'curious' && (
            <G transform="translate(75, 10)">
              <Circle cx={0} cy={12} r={8} fill={forgeColors.forge[100]} />
              <Text
                x={-4}
                y={16}
                fontSize={12}
                fontWeight="bold"
                fill={forgeColors.forge[600]}
              >
                ?
              </Text>
            </G>
          )}
          
          {/* Light bulb for thinking */}
          {mood === 'thinking' && (
            <G transform="translate(72, 5)">
              <Path
                d="M8,0 C4,0 0,4 0,8 C0,11 2,13 4,15 L4,18 L12,18 L12,15 C14,13 16,11 16,8 C16,4 12,0 8,0 Z"
                fill={forgeColors.spark[400]}
              />
              <Path
                d="M5,18 L11,18 L11,20 L5,20 Z"
                fill={forgeColors.spark[600]}
              />
              <Path
                d="M6,20 L10,20 L9,22 L7,22 Z"
                fill={forgeColors.spark[600]}
              />
              {/* Rays */}
              <Path d="M8,-3 L8,-6" stroke={forgeColors.spark[500]} strokeWidth={1.5} />
              <Path d="M-2,4 L-5,2" stroke={forgeColors.spark[500]} strokeWidth={1.5} />
              <Path d="M18,4 L21,2" stroke={forgeColors.spark[500]} strokeWidth={1.5} />
            </G>
          )}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  speechBubble: {
    position: 'absolute',
    top: -60,
    alignItems: 'center',
    zIndex: 10,
  },
  bubbleContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: 200,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
