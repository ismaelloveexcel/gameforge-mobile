import { ArtStyleConfig, ArtStyle } from '../types';

/**
 * Art Style Library
 * Contains 5 signature art styles with complete configurations
 */

// Style 1: Pixel Perfect
const pixelPerfectStyle: ArtStyleConfig = {
  id: 'pixel',
  name: 'Pixel Perfect',
  description: 'Retro pixel art style with crisp edges and limited colors',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d',
    background: '#1a1a2e',
    text: '#f7fff7',
    custom: ['#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#a8d8ea'],
  },
  filters: [
    {
      type: 'pixelate',
      parameters: { size: 4 },
    },
    {
      type: 'contrast',
      parameters: { amount: 1.2 },
    },
  ],
};

// Style 2: Low Poly 3D
const lowPolyStyle: ArtStyleConfig = {
  id: 'lowpoly',
  name: 'Low Poly 3D',
  description: 'Minimalist 3D aesthetic with flat shading and geometric shapes',
  colors: {
    primary: '#ff9a76',
    secondary: '#96ceb4',
    accent: '#ffeaa7',
    background: '#dfe6e9',
    text: '#2d3436',
    custom: ['#fab1a0', '#74b9ff', '#a29bfe', '#fd79a8', '#00b894'],
  },
  shaders: [
    {
      name: 'flatShading',
      vertexShader: `
        attribute vec3 position;
        attribute vec3 normal;
        uniform mat4 worldViewProjection;
        varying vec3 vNormal;
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vNormal = normal;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        void main() {
          vec3 color = vec3(0.8, 0.6, 0.4);
          float lighting = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0)));
          gl_FragColor = vec4(color * lighting, 1.0);
        }
      `,
      uniforms: {},
    },
  ],
};

// Style 3: Hand-Drawn
const handDrawnStyle: ArtStyleConfig = {
  id: 'handdrawn',
  name: 'Hand-Drawn',
  description: 'Sketch and cartoon style with organic, hand-crafted feel',
  colors: {
    primary: '#ff6b9d',
    secondary: '#c44569',
    accent: '#f8b500',
    background: '#fff5e4',
    text: '#3d3d3d',
    custom: ['#ea8685', '#f6c667', '#a3de83', '#7ed7c1', '#b8b8d0'],
  },
  filters: [
    {
      type: 'outline',
      parameters: { thickness: 2, color: '#000000' },
    },
    {
      type: 'sketch',
      parameters: { intensity: 0.3 },
    },
    {
      type: 'paper',
      parameters: { texture: 'rough' },
    },
  ],
};

// Style 4: Neon Cyberpunk
const neonCyberpunkStyle: ArtStyleConfig = {
  id: 'cyberpunk',
  name: 'Neon Cyberpunk',
  description: 'Futuristic glowing aesthetic with neon colors and dark backgrounds',
  colors: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: '#0a0e27',
    text: '#ffffff',
    custom: ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b'],
  },
  shaders: [
    {
      name: 'neonGlow',
      vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vUV = uv;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUV;
        uniform vec3 glowColor;
        uniform float glowIntensity;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUV, center);
          float glow = glowIntensity * (1.0 - dist);
          gl_FragColor = vec4(glowColor * glow, 1.0);
        }
      `,
      uniforms: {
        glowColor: [1.0, 0.0, 1.0],
        glowIntensity: 2.0,
      },
    },
  ],
  filters: [
    {
      type: 'bloom',
      parameters: { strength: 1.5, threshold: 0.5 },
    },
    {
      type: 'scanlines',
      parameters: { intensity: 0.2 },
    },
  ],
};

// Style 5: Watercolor Dreams
const watercolorStyle: ArtStyleConfig = {
  id: 'watercolor',
  name: 'Watercolor Dreams',
  description: 'Soft artistic style with watercolor textures and pastel colors',
  colors: {
    primary: '#f5c7f7',
    secondary: '#c3aed6',
    accent: '#ffd2a0',
    background: '#fef9f3',
    text: '#6b5b5b',
    custom: ['#ffcce7', '#d4c5ff', '#b4e0ff', '#ffd4a3', '#ffeaa7'],
  },
  filters: [
    {
      type: 'watercolor',
      parameters: { wetness: 0.7, bleeding: 0.4 },
    },
    {
      type: 'blur',
      parameters: { amount: 2 },
    },
    {
      type: 'paper',
      parameters: { texture: 'watercolor' },
    },
  ],
};

// Style 6: Valentine Iridescent
const valentineIridescentStyle: ArtStyleConfig = {
  id: 'valentine-iridescent',
  name: 'Valentine Iridescent',
  description: 'Romantic premium style with iridescent shimmer and heart sparkles',
  colors: {
    primary: '#C41E3A',
    secondary: '#FFB6C1',
    accent: '#FAEBD7',
    background: '#FFF5F7',
    text: '#4A1C2B',
    custom: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FAEBD7', '#E6B8C3'],
  },
  filters: [
    {
      type: 'iridescent',
      parameters: { intensity: 0.3, shimmer: true },
    },
    {
      type: 'particles',
      parameters: { type: 'hearts', density: 0.4 },
    },
    {
      type: 'bloom',
      parameters: { strength: 0.8, threshold: 0.7 },
    },
  ],
  shaders: [
    {
      name: 'heartSparkle',
      vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vUV = uv;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUV;
        uniform float time;
        uniform vec3 tintColor;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUV, center);
          float sparkle = sin(time * 2.0 + dist * 10.0) * 0.5 + 0.5;
          vec3 color = tintColor * sparkle;
          gl_FragColor = vec4(color, 0.6);
        }
      `,
      uniforms: {
        time: 0.0,
        tintColor: [0.77, 0.07, 0.23], // Deep rose
      },
    },
  ],
};

// Style 7: Ramadan Lantern Glow
const ramadanLanternGlowStyle: ArtStyleConfig = {
  id: 'ramadan-lantern-glow',
  name: 'Ramadan Lantern Glow',
  description: 'Spiritual warm style with floating lanterns and gentle sparkles',
  colors: {
    primary: '#D4AF37',
    secondary: '#F4A460',
    accent: '#FFE5B4',
    background: '#0D1B2A',
    text: '#F5F5DC',
    custom: ['#D4AF37', '#F4A460', '#DEB887', '#FFE5B4', '#FFF8DC'],
  },
  filters: [
    {
      type: 'glow',
      parameters: { color: '#D4AF37', intensity: 0.5, radius: 20 },
    },
    {
      type: 'particles',
      parameters: { type: 'lanterns', density: 0.3 },
    },
    {
      type: 'ambientLight',
      parameters: { color: '#F4A460', intensity: 0.4 },
    },
  ],
  shaders: [
    {
      name: 'lanternGlow',
      vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vUV = uv;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUV;
        uniform float time;
        uniform vec3 glowColor;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUV, center);
          float pulse = sin(time * 1.5) * 0.3 + 0.7;
          float glow = (1.0 - dist) * pulse;
          vec3 color = glowColor * glow;
          gl_FragColor = vec4(color, glow * 0.8);
        }
      `,
      uniforms: {
        time: 0.0,
        glowColor: [0.83, 0.69, 0.22], // Warm gold
      },
    },
  ],
};

/**
 * Art Style Service
 * Manages art styles and their application
 */
class ArtStyleService {
  private styles: ArtStyleConfig[] = [
    pixelPerfectStyle,
    lowPolyStyle,
    handDrawnStyle,
    neonCyberpunkStyle,
    watercolorStyle,
    valentineIridescentStyle,
    ramadanLanternGlowStyle,
  ];

  private activeStyle: ArtStyle | null = null;

  getAllStyles(): ArtStyleConfig[] {
    return this.styles;
  }

  getStyleById(id: ArtStyle): ArtStyleConfig | undefined {
    return this.styles.find((s) => s.id === id);
  }

  getStyleColors(id: ArtStyle): ArtStyleConfig['colors'] | undefined {
    const style = this.getStyleById(id);
    return style?.colors;
  }

  /**
   * Set the active style (for seasonal switching)
   */
  setActiveStyle(styleId: ArtStyle): void {
    this.activeStyle = styleId;
  }

  /**
   * Get the currently active style
   */
  getActiveStyle(): ArtStyle | null {
    return this.activeStyle;
  }

  /**
   * Get seasonal style based on occasion
   */
  getSeasonalStyle(occasion: string): ArtStyle | null {
    const occasionLower = occasion.toLowerCase();
    
    if (occasionLower.includes('valentine') || occasionLower.includes('romantic')) {
      return 'valentine-iridescent';
    }
    
    if (occasionLower.includes('ramadan') || occasionLower.includes('eid')) {
      return 'ramadan-lantern-glow';
    }
    
    return null;
  }

  /**
   * Apply art style filters to an engine
   */
  applyStyleToEngine(styleId: ArtStyle, engine: any): void {
    const style = this.getStyleById(styleId);
    if (!style) return;

    // Apply filters based on engine type
    if (style.filters) {
      style.filters.forEach((filter) => {
        this.applyFilter(engine, filter);
      });
    }

    // Apply shaders for 3D engines
    if (style.shaders) {
      style.shaders.forEach((shader) => {
        this.applyShader(engine, shader);
      });
    }
  }

  private applyFilter(engine: any, filter: any): void {
    // Filter application logic would go here
    // This would vary based on the engine (Pixi, Babylon, A-Frame)
    console.log('Applying filter:', filter.type, filter.parameters);
  }

  private applyShader(engine: any, shader: any): void {
    // Shader application logic would go here
    console.log('Applying shader:', shader.name);
  }

  /**
   * Generate color palette for UI elements
   */
  generateUIPalette(styleId: ArtStyle): any {
    const style = this.getStyleById(styleId);
    if (!style) return null;

    return {
      background: style.colors.background,
      surface: this.lighten(style.colors.background, 10),
      primary: style.colors.primary,
      secondary: style.colors.secondary,
      accent: style.colors.accent,
      text: style.colors.text,
      textSecondary: this.adjustOpacity(style.colors.text, 0.7),
      border: this.adjustOpacity(style.colors.text, 0.2),
      custom: style.colors.custom,
    };
  }

  /**
   * Lighten a color
   */
  private lighten(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  /**
   * Adjust color opacity
   */
  private adjustOpacity(hex: string, opacity: number): string {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    return `${hex}${alpha}`;
  }

  /**
   * Get asset recommendations for a style
   */
  getAssetRecommendations(styleId: ArtStyle): string[] {
    const recommendations: Record<ArtStyle, string[]> = {
      pixel: [
        '8x8 or 16x16 sprite sheets',
        'Limited color palette textures',
        'Chip-tune music',
        'Retro sound effects',
      ],
      lowpoly: [
        'Low polygon 3D models',
        'Flat-shaded materials',
        'Minimalist textures',
        'Ambient soundtrack',
      ],
      handdrawn: [
        'Hand-drawn sprite animations',
        'Sketchy UI elements',
        'Organic sound effects',
        'Acoustic music',
      ],
      cyberpunk: [
        'Neon textures and materials',
        'Holographic UI elements',
        'Synthwave music',
        'Electronic sound effects',
      ],
      watercolor: [
        'Watercolor textures',
        'Soft gradient backgrounds',
        'Gentle sound effects',
        'Classical music',
      ],
      'valentine-iridescent': [
        'Heart-shaped particles',
        'Iridescent textures',
        'Romantic music themes',
        'Soft chime sound effects',
      ],
      'ramadan-lantern-glow': [
        'Lantern models and sprites',
        'Golden gradient textures',
        'Traditional instruments',
        'Gentle ambient sounds',
      ],
    };

    return recommendations[styleId] || [];
  }
}

export const artStyleService = new ArtStyleService();
