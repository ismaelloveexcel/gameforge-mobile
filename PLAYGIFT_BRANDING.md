# PlayGift Branding System

Complete implementation of the PlayGift logo and branding system with the Nocturnal Romance theme for the GameForge Mobile application.

## Overview

This branding system provides:
- **Creative Brief Generation** - AI-powered design brief and logo concepts
- **3D Logo Rendering** - Babylon.js-based 3D logo scene generator
- **Theme System** - Nocturnal Romance color palette and styling
- **Asset Generation** - Tools for creating all required app assets

## Color Palette - Nocturnal Romance

The Nocturnal Romance theme blends Ramadan and Valentine's aesthetics for the UAE market with luxurious, sophisticated colors:

- **Primary (Deep Plum)**: `#4A1E5A`
- **Accent (Gold)**: `#D4AF37`
- **Background (Dark Midnight Blue)**: `#0A1931`
- **Secondary (Rose Gold)**: `#B76E79`

## Components

### 1. GenieService - Creative Brief Generation

Generate creative briefs and logo concepts using AI.

**Location**: `src/services/GenieService.ts`

**Usage**:
```typescript
import { genieService } from './services/GenieService';

const brief = await genieService.generateCreativeBrief(
  'PlayGift',
  'Nocturnal Romance',
  {
    primary: '#4A1E5A',
    accent: '#D4AF37',
    dark: '#0A1931',
    secondary: '#B76E79',
  }
);

// Access creative concepts
console.log(brief.concepts); // Array of 3 creative directions
console.log(brief.requiredAssets); // List of required asset files
```

**Features**:
- Generates 3 distinct creative directions
- Each concept includes:
  - Core symbol idea
  - Typography recommendation
  - Key visual adjective
- Lists required final asset files

### 2. ArtStyleService - Nocturnal Romance Style

Access the Nocturnal Romance art style configuration.

**Location**: `src/services/ArtStyleService.ts`

**Usage**:
```typescript
import { artStyleService } from './services/ArtStyleService';

const style = artStyleService.getStyleById('nocturnal-romance');
console.log(style.colors); // Access color palette
console.log(style.shaders); // Access shader configurations
console.log(style.filters); // Access post-processing filters

// Generate UI palette
const uiPalette = artStyleService.generateUIPalette('nocturnal-romance');

// Get asset recommendations
const recommendations = artStyleService.getAssetRecommendations('nocturnal-romance');
```

**Features**:
- Complete color palette definition
- Luxury glow shader for 3D rendering
- Bloom and vignette filters
- UI palette generation
- Asset recommendations

### 3. PlayGiftLogoScene - 3D Logo Rendering

Render the PlayGift 3D logo using Babylon.js.

**Location**: `src/engines/logo-generator/PlayGiftLogoScene.ts`

**Usage**:
```typescript
import { PlayGiftLogoScene } from './engines/logo-generator/PlayGiftLogoScene';

const canvas = document.getElementById('logo-canvas') as HTMLCanvasElement;
const logoScene = new PlayGiftLogoScene();

await logoScene.renderLogoScene(canvas, {
  concept: 'Elegant Fusion',
  renderWidth: 1024,
  renderHeight: 1024,
});

// Capture screenshot
const screenshot = await logoScene.captureScreenshot(1024, 1024);

// Clean up
logoScene.dispose();
```

**Features**:
- 3D gift box with play button integration
- Professional three-point lighting
- PBR materials with metallic/roughness
- Post-processing (bloom, vignette)
- Screenshot capture capability
- Configurable camera positions

**Logo Design**:
- Gift box base (Deep Plum)
- Gold ribbon (horizontal and vertical)
- Rose Gold play button triangle
- Gold decorative bow
- Subtle rotation animation

### 4. Asset Configurations

Predefined camera and rendering configurations for all required assets.

**Location**: `src/engines/logo-generator/assetConfigurations.ts`

**Available Configurations**:
- **App Icon** (1024x1024) - Close-up square view
- **Adaptive Icon** (1024x1024) - Android specific
- **Favicon** (32x32) - Simple small view
- **Full Logo** (2048x1024) - Horizontal layout
- **Hero Illustration** (1200x600) - Wide format for wizard screens
- **Social Banner** (1500x500) - Social media
- **Splash Screen** (1080x1920) - Full screen mobile

**Usage**:
```typescript
import { ASSET_CONFIGURATIONS, specToLogoConfig } from './assetConfigurations';

const iconConfig = ASSET_CONFIGURATIONS.appIcon;
const logoConfig = specToLogoConfig(iconConfig);
await logoScene.renderLogoScene(canvas, logoConfig);
```

### 5. Theme Context - Nocturnal Romance Theme

Apply the Nocturnal Romance theme throughout the app.

**Location**: `src/contexts/ThemeContext.tsx`

**Usage**:
```typescript
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { setThemeChoice, seasonalTheme } = useTheme();

  // Set to Nocturnal Romance theme
  useEffect(() => {
    setThemeChoice('nocturnal-romance');
  }, []);

  // Access theme colors
  const colors = seasonalTheme.colors;

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Welcome to PlayGift</Text>
    </View>
  );
}
```

**Theme Colors Available**:
- `primary`, `secondary`, `accent`
- `background`, `surface`
- `text`, `muted`
- `glow` (for special effects)

### 6. Asset Generation Script

Generate and optimize assets from rendered images.

**Location**: `scripts/generate-assets.js`

**Usage**:
```bash
npm run generate-assets
```

**Features**:
- Creates placeholder SVG logo
- Updates app.json with theme colors
- Generates documentation
- Supports sharp for image optimization (when installed)

## Complete Workflow

### Step 1: Generate Creative Brief
```bash
node -e "require('./src/examples/PlayGiftBrandingExamples').generatePlayGiftBrief()"
```

### Step 2: Render 3D Logo (in browser)
1. Create a React component with a canvas element
2. Import and use PlayGiftLogoScene
3. Render with different asset configurations
4. Capture screenshots

### Step 3: Generate Assets
```bash
npm run generate-assets
```

### Step 4: Apply Theme
```typescript
setThemeChoice('nocturnal-romance');
```

## File Structure

```
src/
├── services/
│   ├── GenieService.ts          # Creative brief generation
│   └── ArtStyleService.ts       # Nocturnal Romance style
├── engines/
│   └── logo-generator/
│       ├── PlayGiftLogoScene.ts # 3D logo renderer
│       └── assetConfigurations.ts # Asset specs
├── contexts/
│   └── ThemeContext.tsx         # Theme management
├── design-tokens/
│   └── theme.ts                 # Theme definitions
├── examples/
│   └── PlayGiftBrandingExamples.ts # Usage examples
└── __tests__/
    ├── GenieService.test.ts
    └── ArtStyleService.test.ts

scripts/
└── generate-assets.js           # Asset generation script

assets/
├── playgift-logo.svg           # Placeholder logo
└── PLAYGIFT-ASSETS-README.md   # Asset documentation
```

## Testing

Run tests to verify the branding system:

```bash
npm test -- ArtStyleService.test.ts
npm test -- GenieService.test.ts
```

## Design Specifications

### Typography Recommendations
- **Elegant Fusion**: Modern serif with geometric elements
- **Digital Jewel**: Clean sans-serif with premium weight
- **Luminous Abstract**: Contemporary geometric typeface

### Visual Adjectives
- Sophisticated and luxurious
- Premium and radiant
- Modern and ethereal

### Required Assets
1. App Icon (1024x1024)
2. Favicon (32x32)
3. Full Logo (SVG)
4. Hero Illustration (1200x600)
5. Social Media Banner (1500x500)
6. Splash Screen (1080x1920)
7. Adaptive Icon (1024x1024)

## Best Practices

1. **3D Rendering**: Always render in a browser environment (not Node.js)
2. **Asset Quality**: Use high-resolution renders then downscale
3. **Theme Consistency**: Apply Nocturnal Romance colors throughout UI
4. **Performance**: Dispose of Babylon.js scenes when done
5. **Testing**: Verify all color contrasts meet accessibility standards

## Future Enhancements

Potential improvements:
- Real-time logo customization
- Export to multiple formats (SVG, PNG, WEBP)
- Animation presets for logo reveal
- Integration with design tools (Figma plugin)
- A/B testing different concepts

## Support

For issues or questions:
1. Check example usage in `src/examples/PlayGiftBrandingExamples.ts`
2. Review test files for implementation patterns
3. Consult asset documentation in `assets/PLAYGIFT-ASSETS-README.md`

## License

Part of GameForge Mobile - MIT License
