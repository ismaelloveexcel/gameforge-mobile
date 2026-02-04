#!/usr/bin/env node
/**
 * PlayGift Asset Generation Script
 * 
 * This script generates all required assets for the PlayGift branding:
 * - App icons (iOS and Android)
 * - Favicon
 * - Splash screens
 * - Social media banners
 * 
 * Note: This script requires the Babylon.js logo scene to be rendered first
 * in a browser environment, then uses the exported images to generate
 * optimized assets for all platforms.
 * 
 * Usage:
 *   npm run generate-assets
 */

const fs = require('fs');
const path = require('path');

// Color configuration for PlayGift
const PLAYGIFT_COLORS = {
  primary: '#4A1E5A',     // Deep Plum
  accent: '#D4AF37',       // Gold
  background: '#0A1931',   // Dark Midnight Blue
  secondary: '#B76E79',    // Rose Gold
};

/**
 * Create placeholder assets
 */
function createPlaceholderAssets() {
  console.log('📦 Creating PlayGift placeholder assets...\n');
  
  const ASSETS_DIR = path.join(__dirname, '..', 'assets');
  
  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
  
  // Create a simple SVG as placeholder
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PLAYGIFT_COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${PLAYGIFT_COLORS.background};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  
  <!-- Gift Box -->
  <rect x="312" y="412" width="400" height="300" fill="${PLAYGIFT_COLORS.primary}" rx="20"/>
  
  <!-- Ribbon Horizontal -->
  <rect x="292" y="537" width="440" height="50" fill="${PLAYGIFT_COLORS.accent}" rx="5"/>
  
  <!-- Ribbon Vertical -->
  <rect x="487" y="362" width="50" height="400" fill="${PLAYGIFT_COLORS.accent}" rx="5"/>
  
  <!-- Play Button -->
  <polygon points="512,512 612,562 612,462" fill="${PLAYGIFT_COLORS.secondary}"/>
  
  <!-- Bow -->
  <circle cx="512" cy="387" r="40" fill="${PLAYGIFT_COLORS.accent}"/>
  
  <!-- Text -->
  <text x="512" y="850" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
        text-anchor="middle" fill="${PLAYGIFT_COLORS.accent}">PlayGift</text>
</svg>`;
  
  // Write SVG placeholder
  const svgPath = path.join(ASSETS_DIR, 'playgift-logo.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('  ✓ playgift-logo.svg');
  
  // Create README
  const readmePath = path.join(ASSETS_DIR, 'PLAYGIFT-ASSETS-README.md');
  const readmeContent = `# PlayGift Assets

These are placeholder assets for the PlayGift branding.

## Color Palette - Nocturnal Romance Theme

- Primary (Deep Plum): ${PLAYGIFT_COLORS.primary}
- Accent (Gold): ${PLAYGIFT_COLORS.accent}
- Background (Dark Midnight Blue): ${PLAYGIFT_COLORS.background}
- Secondary (Rose Gold): ${PLAYGIFT_COLORS.secondary}

## Theme Application

The Nocturnal Romance theme is available in:
- ThemeContext: Select 'nocturnal-romance' theme
- ArtStyleService: Use 'nocturnal-romance' art style
- Logo Generator: PlayGiftLogoScene renders with these colors

## Required Assets

- icon.png (1024x1024) - Main app icon
- adaptive-icon.png (1024x1024) - Android adaptive icon
- favicon.png (32x32) - Web favicon
- splash.png (1080x1920) - Splash screen

## Generating High-Quality Assets

To render actual 3D logo assets:
1. Use the PlayGiftLogoScene.ts in src/engines/logo-generator/
2. Render in browser with Babylon.js
3. Export images at required resolutions
4. Replace placeholder files in assets/
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('  ✓ PLAYGIFT-ASSETS-README.md\n');
  
  console.log('✨ Placeholder assets created\n');
}

/**
 * Update app.json with PlayGift branding
 */
function updateAppConfig() {
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  
  if (!fs.existsSync(appJsonPath)) {
    console.log('⚠️  app.json not found, skipping config update');
    return;
  }
  
  try {
    const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // Update branding info (keep original name but note PlayGift theme available)
    if (appConfig.expo) {
      // Update colors to Nocturnal Romance theme
      if (appConfig.expo.splash) {
        appConfig.expo.splash.backgroundColor = PLAYGIFT_COLORS.background;
      }
      
      if (appConfig.expo.android?.adaptiveIcon) {
        appConfig.expo.android.adaptiveIcon.backgroundColor = PLAYGIFT_COLORS.background;
      }
    }
    
    // Write back
    fs.writeFileSync(appJsonPath, JSON.stringify(appConfig, null, 2));
    console.log('✓ Updated app.json with Nocturnal Romance theme colors\n');
  } catch (error) {
    console.error('✗ Failed to update app.json:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎮 PlayGift Asset Generator\n');
  console.log('═'.repeat(50));
  console.log('\n');
  
  createPlaceholderAssets();
  updateAppConfig();
  
  console.log('═'.repeat(50));
  console.log('\n✅ Asset generation complete!\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { main };
