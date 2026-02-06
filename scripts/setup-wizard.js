#!/usr/bin/env node
/**
 * GameForge Setup Wizard
 * 
 * Interactive CLI to configure Firebase and Payment providers
 * Run: npm run setup
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_PATH = path.join(__dirname, '..', '.env');
const ENV_EXAMPLE_PATH = path.join(__dirname, '..', '.env.example');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${prompt}${colors.reset}`, resolve);
  });
}

async function main() {
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║     GameForge Configuration Wizard v1.0        ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');
  
  log('This wizard will help you configure:', 'blue');
  log('  ✓ Firebase (Content Database)', 'blue');
  log('  ✓ Payment Provider (PayTabs or Stripe)', 'blue');
  log('  ✓ AI Services (OpenAI or Grok)\n', 'blue');
  
  // Check if .env already exists
  if (fs.existsSync(ENV_PATH)) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log('\n✅ Setup cancelled. Existing .env preserved.', 'green');
      rl.close();
      return;
    }
  }
  
  const config = {};
  
  // ==================== Firebase Setup ====================
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('STEP 1: Firebase Configuration (Required)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright');
  
  log('📝 Get credentials from: https://console.firebase.google.com', 'yellow');
  log('   Project Settings > Your apps > Web app\n', 'yellow');
  
  const setupFirebase = await question('Configure Firebase now? (Y/n): ');
  
  if (setupFirebase.toLowerCase() !== 'n') {
    config.EXPO_PUBLIC_FIREBASE_API_KEY = await question('Firebase API Key: ');
    config.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = await question('Auth Domain: ');
    config.EXPO_PUBLIC_FIREBASE_PROJECT_ID = await question('Project ID: ');
    config.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = await question('Storage Bucket: ');
    config.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = await question('Messaging Sender ID: ');
    config.EXPO_PUBLIC_FIREBASE_APP_ID = await question('App ID: ');
    
    log('\n✅ Firebase configured!', 'green');
  } else {
    log('\n⚠️  Skipping Firebase - app will use demo mode', 'yellow');
  }
  
  // ==================== Payment Setup ====================
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('STEP 2: Payment Provider (Optional)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright');
  
  log('Choose payment provider:', 'blue');
  log('  1. PayTabs (Recommended for UAE)', 'blue');
  log('  2. Stripe (International)', 'blue');
  log('  3. Skip (Demo mode - free gifts only)\n', 'blue');
  
  const paymentChoice = await question('Enter choice (1/2/3): ');
  
  if (paymentChoice === '1') {
    log('\n📝 Get credentials from: https://site.paytabs.com', 'yellow');
    log('   Dashboard > Developers > API Keys\n', 'yellow');
    
    config.EXPO_PUBLIC_PAYTABS_PROFILE_ID = await question('PayTabs Profile ID: ');
    config.EXPO_PUBLIC_PAYTABS_SERVER_KEY = await question('PayTabs Server Key: ');
    config.EXPO_PUBLIC_PAYTABS_CLIENT_KEY = await question('PayTabs Client Key: ');
    
    log('\n✅ PayTabs configured!', 'green');
  } else if (paymentChoice === '2') {
    log('\n📝 Get key from: https://dashboard.stripe.com/apikeys', 'yellow');
    log('   Copy the Publishable Key (pk_test_...)\n', 'yellow');
    
    config.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY = await question('Stripe Publishable Key: ');
    
    log('\n✅ Stripe configured!', 'green');
  } else {
    log('\n⚠️  Payment skipped - app will run in DEMO mode', 'yellow');
  }
  
  // ==================== AI Services (Optional) ====================
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('STEP 3: AI Services (Optional)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright');
  
  const setupAI = await question('Configure AI services? (y/N): ');
  
  if (setupAI.toLowerCase() === 'y') {
    log('\nChoose AI provider:', 'blue');
    log('  1. OpenAI (Recommended)', 'blue');
    log('  2. Grok (Alternative)', 'blue');
    log('  3. Both\n', 'blue');
    
    const aiChoice = await question('Enter choice (1/2/3): ');
    
    if (aiChoice === '1' || aiChoice === '3') {
      config.EXPO_PUBLIC_OPENAI_API_KEY = await question('OpenAI API Key: ');
    }
    
    if (aiChoice === '2' || aiChoice === '3') {
      config.EXPO_PUBLIC_GROK_API_KEY = await question('Grok API Key: ');
    }
    
    log('\n✅ AI services configured!', 'green');
  }
  
  // ==================== Write .env file ====================
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('Generating .env file...', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright');
  
  let envContent = '# GameForge Configuration\n';
  envContent += `# Generated: ${new Date().toISOString()}\n`;
  envContent += '# DO NOT commit this file to git!\n\n';
  
  // Add Firebase
  if (config.EXPO_PUBLIC_FIREBASE_API_KEY) {
    envContent += '# Firebase\n';
    envContent += `EXPO_PUBLIC_FIREBASE_API_KEY=${config.EXPO_PUBLIC_FIREBASE_API_KEY}\n`;
    envContent += `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN}\n`;
    envContent += `EXPO_PUBLIC_FIREBASE_PROJECT_ID=${config.EXPO_PUBLIC_FIREBASE_PROJECT_ID}\n`;
    envContent += `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET}\n`;
    envContent += `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}\n`;
    envContent += `EXPO_PUBLIC_FIREBASE_APP_ID=${config.EXPO_PUBLIC_FIREBASE_APP_ID}\n\n`;
  }
  
  // Add Payment
  if (config.EXPO_PUBLIC_PAYTABS_PROFILE_ID) {
    envContent += '# PayTabs Payment\n';
    envContent += `EXPO_PUBLIC_PAYTABS_PROFILE_ID=${config.EXPO_PUBLIC_PAYTABS_PROFILE_ID}\n`;
    envContent += `EXPO_PUBLIC_PAYTABS_SERVER_KEY=${config.EXPO_PUBLIC_PAYTABS_SERVER_KEY}\n`;
    envContent += `EXPO_PUBLIC_PAYTABS_CLIENT_KEY=${config.EXPO_PUBLIC_PAYTABS_CLIENT_KEY}\n\n`;
  }
  
  if (config.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    envContent += '# Stripe Payment\n';
    envContent += `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=${config.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}\n\n`;
  }
  
  // Add AI
  if (config.EXPO_PUBLIC_OPENAI_API_KEY) {
    envContent += '# OpenAI\n';
    envContent += `EXPO_PUBLIC_OPENAI_API_KEY=${config.EXPO_PUBLIC_OPENAI_API_KEY}\n\n`;
  }
  
  if (config.EXPO_PUBLIC_GROK_API_KEY) {
    envContent += '# Grok\n';
    envContent += `EXPO_PUBLIC_GROK_API_KEY=${config.EXPO_PUBLIC_GROK_API_KEY}\n\n`;
  }
  
  fs.writeFileSync(ENV_PATH, envContent);
  
  log('✅ Configuration saved to .env', 'green');
  
  // ==================== Summary ====================
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║              Setup Complete! 🎉                ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');
  
  log('Configuration Summary:', 'blue');
  log(`  Firebase:  ${config.EXPO_PUBLIC_FIREBASE_API_KEY ? '✅ Configured' : '⚠️  Not configured'}`, 'blue');
  log(`  Payment:   ${config.EXPO_PUBLIC_PAYTABS_PROFILE_ID || config.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Configured' : '⚠️  Demo mode'}`, 'blue');
  log(`  AI:        ${config.EXPO_PUBLIC_OPENAI_API_KEY || config.EXPO_PUBLIC_GROK_API_KEY ? '✅ Configured' : '⚠️  Using fallback templates'}`, 'blue');
  
  log('\nNext Steps:', 'yellow');
  log('  1. Run: npm install', 'yellow');
  log('  2. Run: npm run validate-config (optional)', 'yellow');
  log('  3. Run: npm start', 'yellow');
  
  if (config.EXPO_PUBLIC_FIREBASE_API_KEY) {
    log('\nFirebase Security Rules:', 'yellow');
    log('  Deploy rules: npm run deploy:firebase-rules', 'yellow');
    log('  Or manually copy from: docs/CONFIGURATION_GUIDE.md', 'yellow');
  }
  
  log('\n📚 Documentation:', 'cyan');
  log('  Quick Start: FIREBASE_PAYMENT_SETUP.md', 'cyan');
  log('  Full Guide:  docs/CONFIGURATION_GUIDE.md\n', 'cyan');
  
  rl.close();
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'yellow');
  rl.close();
  process.exit(1);
});
