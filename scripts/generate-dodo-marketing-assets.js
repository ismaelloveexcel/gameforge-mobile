#!/usr/bin/env node
/**
 * Generate Dodo Marketing Assets
 * 
 * Creates Dodo character images for Valentine's/Ramadan marketing
 * Uses YOUR DALL-E 3 API (already configured)
 * 
 * Usage: node scripts/generate-dodo-marketing-assets.js --theme valentine
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment
require('dotenv').config();

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ EXPO_PUBLIC_OPENAI_API_KEY not found in environment');
  console.log('Run: npm run setup');
  process.exit(1);
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get theme from command line
const theme = process.argv.includes('--theme') 
  ? process.argv[process.argv.indexOf('--theme') + 1]
  : 'valentine';

// Dodo prompts for different scenes
const DODO_PROMPTS = {
  valentine: {
    scene1: `Cute friendly dodo bird character as magical alchemist,
      round fluffy body, small wings, orange beak, big adorable eyes,
      wearing heart-shaped VR headset/goggles,
      carefully brewing glowing pink love potion in round bottle,
      romantic futuristic background with floating hearts and rose petals,
      soft pink and red gradient background,
      dreamy soft lighting with bokeh effect,
      Pixar-Disney quality 3D character rendering,
      professional game cinematics quality,
      character centered in frame`,
    
    scene2: `Same cute dodo bird alchemist character,
      jumping with joy and celebration, arms/wings raised,
      big happy smile, eyes sparkling with excitement,
      surrounded by floating pink hearts and sparkles,
      magical confetti explosion around character,
      romantic theme colors pink and red,
      Pixar-Disney quality 3D rendering,
      dynamic celebratory pose`,
    
    scene3: `Same cute dodo bird character as friendly alchemist,
      friendly wave gesture with wing/arm extended,
      welcoming warm smile, inviting expression,
      speech bubble floating above saying "Create your love game!",
      romantic background with soft lighting,
      Pixar-Disney quality 3D character,
      approachable and friendly composition`
  },
  
  ramadan: {
    scene1: `Cute friendly dodo bird character as wise alchemist,
      round fluffy body, small wings, orange beak,
      wearing traditional embroidered Arabian vest,
      sitting in cozy Arabian majlis setting,
      beautiful glowing golden lanterns floating around,
      crescent moon visible in background night sky,
      warm golden and deep midnight blue color palette,
      subtle Islamic geometric patterns in background,
      Pixar-Disney quality 3D rendering,
      peaceful serene night atmosphere`,
    
    scene2: `Same dodo bird alchemist character,
      carefully brewing glowing golden potion,
      magical golden sparks rising from potion,
      surrounded by traditional Arabian lanterns,
      warm golden light illuminating character,
      nighttime setting with stars,
      Pixar-Disney quality 3D character rendering,
      magical mystical atmosphere`,
    
    scene3: `Same cute dodo character as alchemist,
      celebrating with arms raised, joyful expression,
      wearing festive golden outfit for Eid,
      gift boxes and celebration elements around,
      warm family-friendly aesthetic,
      golden and green festive colors,
      Pixar-Disney quality 3D rendering,
      happy celebration scene`
  }
};

async function generateDodoImage(prompt, filename) {
  log(`\n🎨 Generating: ${filename}...`, 'cyan');
  log(`📝 Prompt: ${prompt.substring(0, 100)}...`, 'yellow');

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'hd',
        n: 1
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt;
    
    log(`✅ Generated! URL: ${imageUrl.substring(0, 50)}...`, 'green');
    log(`🔄 Revised prompt: ${revisedPrompt.substring(0, 80)}...`, 'yellow');
    
    // Download image
    const outputDir = path.join(__dirname, '..', 'assets', 'marketing');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, filename);
    await downloadImage(imageUrl, outputPath);
    
    log(`💾 Saved to: ${outputPath}`, 'green');
    
    return {
      filename,
      url: imageUrl,
      revisedPrompt,
      cost: 0.08 // DALL-E 3 HD cost
    };
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'yellow');
    throw error;
  }
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  log('\n╔════════════════════════════════════════════════╗', 'magenta');
  log('║   Dodo Marketing Asset Generator              ║', 'magenta');
  log('╚════════════════════════════════════════════════╝\n', 'magenta');
  
  log(`Theme: ${theme}`, 'cyan');
  log(`Using: YOUR DALL-E 3 API`, 'green');
  
  const prompts = DODO_PROMPTS[theme];
  
  if (!prompts) {
    log(`❌ Unknown theme: ${theme}`, 'yellow');
    log(`Available: valentine, ramadan`, 'yellow');
    process.exit(1);
  }
  
  const results = [];
  let totalCost = 0;
  
  // Generate each scene
  for (const [sceneKey, prompt] of Object.entries(prompts)) {
    const filename = `dodo-${theme}-${sceneKey}.png`;
    
    try {
      const result = await generateDodoImage(prompt, filename);
      results.push(result);
      totalCost += result.cost;
      
      // Rate limit: Wait between requests
      log('⏱️  Waiting 5 seconds (rate limit)...', 'yellow');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      log(`❌ Failed to generate ${sceneKey}`, 'yellow');
    }
  }
  
  // Summary
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'magenta');
  log('GENERATION COMPLETE', 'magenta');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'magenta');
  
  log(`✅ Generated: ${results.length} images`, 'green');
  log(`💰 Total cost: $${totalCost.toFixed(2)}`, 'green');
  log(`📁 Saved to: assets/marketing/`, 'cyan');
  
  log('\nNext steps:', 'cyan');
  log('  1. Review images in assets/marketing/', 'cyan');
  log('  2. Import to CapCut for video assembly', 'cyan');
  log('  3. Add text overlays and music', 'cyan');
  log('  4. Export as Instagram Reel (9:16)', 'cyan');
  
  // Save metadata
  const metadataPath = path.join(__dirname, '..', 'assets', 'marketing', `${theme}-metadata.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));
  log(`\n📄 Metadata saved: ${metadataPath}\n`, 'green');
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'yellow');
  process.exit(1);
});
