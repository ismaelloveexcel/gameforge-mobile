/**
 * Feature Flags
 * Controls gating of heavy visual effects and animations
 */

/**
 * PlayGiftConsumerMode - Controls premium wow features
 * 
 * When FALSE (default):
 * - Basic UX polish enabled (tactile animations, subtle springs)
 * - Glassmorphism with minimal effects
 * - No heavy particles or morphing
 * 
 * When TRUE:
 * - Full premium experience
 * - Dynamic morphing backgrounds
 * - Particle systems
 * - Shimmer effects
 * - Intense animations
 */
export const PlayGiftConsumerMode = false;

/**
 * Helper to check if wow features should be enabled
 */
export const enableWowFeatures = (): boolean => PlayGiftConsumerMode;

/**
 * Helper to check if basic polish should be enabled
 * Basic polish is ALWAYS ON - lightweight tactile feedback
 */
export const enableBasicPolish = (): boolean => true;
