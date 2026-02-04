/**
 * Asset Configuration for PlayGift Logo Generation
 * Defines camera setups and specifications for different asset types
 */
import * as BABYLON from 'babylonjs';
import { LogoSceneConfig } from './PlayGiftLogoScene';

export interface AssetSpecification {
  name: string;
  width: number;
  height: number;
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: number;
  cameraRadius?: number;
  backgroundColor?: string;
  postProcessing?: {
    bloom?: boolean;
    vignette?: boolean;
    contrast?: number;
  };
}

/**
 * Asset configurations for PlayGift branding
 */
export const ASSET_CONFIGURATIONS: Record<string, AssetSpecification> = {
  // App Icon - Square, close-up view
  appIcon: {
    name: 'app-icon',
    width: 1024,
    height: 1024,
    cameraPosition: { x: 0, y: 1, z: -6 },
    cameraRotation: 0,
    cameraRadius: 6,
    backgroundColor: '#4A1E5A', // Deep Plum
    postProcessing: {
      bloom: true,
      vignette: false,
      contrast: 1.1,
    },
  },

  // Favicon - Very small, simple view
  favicon: {
    name: 'favicon',
    width: 32,
    height: 32,
    cameraPosition: { x: 0, y: 1.5, z: -5 },
    cameraRotation: 0,
    cameraRadius: 5,
    backgroundColor: '#0A1931', // Dark Midnight Blue
    postProcessing: {
      bloom: false,
      vignette: false,
      contrast: 1.2,
    },
  },

  // Full Logo - Horizontal layout for branding
  fullLogo: {
    name: 'full-logo',
    width: 2048,
    height: 1024,
    cameraPosition: { x: 0, y: 1, z: -7 },
    cameraRotation: 0,
    cameraRadius: 7,
    backgroundColor: 'transparent',
    postProcessing: {
      bloom: true,
      vignette: false,
      contrast: 1.0,
    },
  },

  // Hero Illustration - Wide format for wizard screens
  heroIllustration: {
    name: 'hero-illustration',
    width: 1200,
    height: 600,
    cameraPosition: { x: 2, y: 2, z: -8 },
    cameraRotation: Math.PI / 12,
    cameraRadius: 8,
    backgroundColor: '#0A1931', // Dark Midnight Blue
    postProcessing: {
      bloom: true,
      vignette: true,
      contrast: 1.05,
    },
  },

  // Social Media Banner - Wide format
  socialBanner: {
    name: 'social-banner',
    width: 1500,
    height: 500,
    cameraPosition: { x: 3, y: 1.5, z: -7 },
    cameraRotation: Math.PI / 8,
    cameraRadius: 7,
    backgroundColor: '#4A1E5A', // Deep Plum
    postProcessing: {
      bloom: true,
      vignette: true,
      contrast: 1.1,
    },
  },

  // Splash Screen - Full screen mobile view
  splashScreen: {
    name: 'splash-screen',
    width: 1080,
    height: 1920,
    cameraPosition: { x: 0, y: 2, z: -9 },
    cameraRotation: 0,
    cameraRadius: 9,
    backgroundColor: '#0A1931', // Dark Midnight Blue
    postProcessing: {
      bloom: true,
      vignette: true,
      contrast: 1.05,
    },
  },

  // Adaptive Icon - Android specific
  adaptiveIcon: {
    name: 'adaptive-icon',
    width: 1024,
    height: 1024,
    cameraPosition: { x: 0, y: 1, z: -5.5 },
    cameraRotation: 0,
    cameraRadius: 5.5,
    backgroundColor: 'transparent', // Will be set in app.json
    postProcessing: {
      bloom: true,
      vignette: false,
      contrast: 1.0,
    },
  },
};

/**
 * Get all asset configurations
 */
export function getAllAssetConfigurations(): AssetSpecification[] {
  return Object.values(ASSET_CONFIGURATIONS);
}

/**
 * Get specific asset configuration
 */
export function getAssetConfiguration(name: string): AssetSpecification | undefined {
  return ASSET_CONFIGURATIONS[name];
}

/**
 * Convert specification to LogoSceneConfig
 */
export function specToLogoConfig(spec: AssetSpecification): LogoSceneConfig {
  return {
    concept: 'Elegant Fusion', // Default concept
    cameraPosition: new BABYLON.Vector3(
      spec.cameraPosition.x,
      spec.cameraPosition.y,
      spec.cameraPosition.z
    ),
    cameraRotation: spec.cameraRotation,
    renderWidth: spec.width,
    renderHeight: spec.height,
    backgroundColor: spec.backgroundColor,
  };
}
