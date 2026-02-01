/**
 * PlayGift Branding System - Usage Examples
 * 
 * This file demonstrates how to use the PlayGift branding system components.
 */

import { genieService } from '../services/GenieService';
import { artStyleService } from '../services/ArtStyleService';
import { ASSET_CONFIGURATIONS } from '../engines/logo-generator/assetConfigurations';

// ============================================================================
// EXAMPLE 1: Generate Creative Brief for PlayGift
// ============================================================================

export async function generatePlayGiftBrief() {
  console.log('🎨 Generating PlayGift Creative Brief...\n');

  const brief = await genieService.generateCreativeBrief(
    'PlayGift',
    'Nocturnal Romance (blending Ramadan and Valentine\'s)',
    {
      primary: '#4A1E5A',     // Deep Plum
      accent: '#D4AF37',       // Gold
      dark: '#0A1931',         // Dark Midnight Blue
      secondary: '#B76E79',    // Rose Gold
    }
  );

  console.log('Brand Name:', brief.brandName);
  console.log('Theme:', brief.theme);
  console.log('\nCreative Brief:');
  console.log(brief.brief);
  console.log('\n--- Creative Concepts ---');
  
  brief.concepts.forEach((concept: any, index: number) => {
    console.log(`\nConcept ${index + 1}: ${concept.name}`);
    console.log('  Symbol:', concept.coreSymbol);
    console.log('  Typography:', concept.typography);
    console.log('  Style:', concept.visualAdjective);
  });

  console.log('\n--- Required Assets ---');
  brief.requiredAssets.forEach((asset: string) => {
    console.log('  •', asset);
  });

  return brief;
}

// ============================================================================
// EXAMPLE 2: Access Nocturnal Romance Art Style
// ============================================================================

export function getNocturnalRomanceStyle() {
  console.log('🌙 Accessing Nocturnal Romance Art Style...\n');

  const style = artStyleService.getStyleById('nocturnal-romance');
  
  if (!style) {
    console.error('Style not found!');
    return null;
  }

  console.log('Style Name:', style.name);
  console.log('Description:', style.description);
  console.log('\nColor Palette:');
  console.log('  Primary:', style.colors.primary);
  console.log('  Secondary:', style.colors.secondary);
  console.log('  Accent:', style.colors.accent);
  console.log('  Background:', style.colors.background);
  console.log('  Text:', style.colors.text);
  console.log('  Custom Colors:', style.colors.custom);

  // Get UI palette
  const uiPalette = artStyleService.generateUIPalette('nocturnal-romance');
  console.log('\nGenerated UI Palette:');
  console.log(JSON.stringify(uiPalette, null, 2));

  // Get asset recommendations
  const recommendations = artStyleService.getAssetRecommendations('nocturnal-romance');
  console.log('\nAsset Recommendations:');
  recommendations.forEach((rec: string) => {
    console.log('  •', rec);
  });

  return style;
}

// ============================================================================
// EXAMPLE 3: List Asset Configurations
// ============================================================================

export function listAssetConfigurations() {
  console.log('📦 PlayGift Asset Configurations:\n');

  Object.entries(ASSET_CONFIGURATIONS).forEach(([key, config]) => {
    console.log(`${config.name}:`);
    console.log(`  Size: ${config.width}x${config.height}`);
    console.log(`  Camera: (${config.cameraPosition.x}, ${config.cameraPosition.y}, ${config.cameraPosition.z})`);
    console.log(`  Background: ${config.backgroundColor}`);
    console.log('');
  });

  return ASSET_CONFIGURATIONS;
}

// ============================================================================
// EXAMPLE 4: Complete Workflow
// ============================================================================

export async function completePlayGiftWorkflow() {
  console.log('🚀 PlayGift Branding - Complete Workflow\n');
  console.log('='.repeat(60));
  console.log('\n');

  // Step 1: Generate Creative Brief
  console.log('STEP 1: Generate Creative Brief');
  console.log('-'.repeat(60));
  const brief = await generatePlayGiftBrief();
  console.log('\n');

  // Step 2: Get Art Style
  console.log('STEP 2: Access Art Style Configuration');
  console.log('-'.repeat(60));
  const style = getNocturnalRomanceStyle();
  console.log('\n');

  // Step 3: List Asset Requirements
  console.log('STEP 3: Asset Configuration Review');
  console.log('-'.repeat(60));
  listAssetConfigurations();
  console.log('\n');

  // Step 4: Instructions for 3D rendering
  console.log('STEP 4: 3D Logo Rendering (Browser Required)');
  console.log('-'.repeat(60));
  console.log('To render the 3D logo:');
  console.log('1. Create a canvas element in your HTML/React component');
  console.log('2. Import PlayGiftLogoScene from src/engines/logo-generator/');
  console.log('3. Call logoScene.renderLogoScene(canvas, config)');
  console.log('4. Capture screenshots for each asset configuration');
  console.log('5. Run npm run generate-assets to process and optimize');
  console.log('\n');

  console.log('='.repeat(60));
  console.log('✅ Workflow Complete!\n');

  return {
    brief,
    style,
    assets: ASSET_CONFIGURATIONS,
  };
}
