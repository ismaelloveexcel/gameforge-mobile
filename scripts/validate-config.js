#!/usr/bin/env node
/**
 * Configuration Validator
 * 
 * Validates Firebase and Payment configuration
 * Run: npm run validate-config
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    return null;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        env[key] = value;
      }
    }
  });
  
  return env;
}

function validateFirebase(env) {
  const required = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];
  
  const missing = required.filter(key => !env[key]);
  
  if (missing.length === 0) {
    log('  ✅ All Firebase keys present', 'green');
    
    // Validate format
    const warnings = [];
    
    if (!env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN.includes('firebaseapp.com')) {
      warnings.push('Auth Domain should end with .firebaseapp.com');
    }
    
    if (!env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET.includes('appspot.com')) {
      warnings.push('Storage Bucket should end with .appspot.com');
    }
    
    if (!/^\d+$/.test(env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)) {
      warnings.push('Messaging Sender ID should be numeric');
    }
    
    if (!env.EXPO_PUBLIC_FIREBASE_APP_ID.includes(':')) {
      warnings.push('App ID format looks incorrect');
    }
    
    if (warnings.length > 0) {
      log('  ⚠️  Warnings:', 'yellow');
      warnings.forEach(w => log(`     - ${w}`, 'yellow'));
    }
    
    return true;
  } else {
    log('  ❌ Missing Firebase keys:', 'red');
    missing.forEach(key => log(`     - ${key}`, 'red'));
    return false;
  }
}

function validatePayment(env) {
  const hasPayTabs = env.EXPO_PUBLIC_PAYTABS_PROFILE_ID && 
                     env.EXPO_PUBLIC_PAYTABS_CLIENT_KEY;
  
  const hasStripe = env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (hasPayTabs) {
    log('  ✅ PayTabs configured', 'green');
    
    // Validate PayTabs format
    if (!env.EXPO_PUBLIC_PAYTABS_CLIENT_KEY.startsWith('C')) {
      log('  ⚠️  Client Key should start with C', 'yellow');
    }
    
    if (env.EXPO_PUBLIC_PAYTABS_SERVER_KEY && !env.EXPO_PUBLIC_PAYTABS_SERVER_KEY.startsWith('S')) {
      log('  ⚠️  Server Key should start with S', 'yellow');
    }
    
    return 'paytabs';
  }
  
  if (hasStripe) {
    log('  ✅ Stripe configured', 'green');
    
    // Validate Stripe format
    const key = env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
      log('  ⚠️  Stripe key should start with pk_test_ or pk_live_', 'yellow');
    }
    
    if (key.startsWith('pk_test_')) {
      log('  ℹ️  Using TEST mode', 'cyan');
    }
    
    return 'stripe';
  }
  
  log('  ⚠️  No payment provider configured', 'yellow');
  log('     App will run in DEMO mode (free gifts only)', 'yellow');
  return 'demo';
}

function validateAI(env) {
  const hasOpenAI = env.EXPO_PUBLIC_OPENAI_API_KEY;
  const hasGrok = env.EXPO_PUBLIC_GROK_API_KEY;
  
  if (hasOpenAI || hasGrok) {
    if (hasOpenAI) {
      log('  ✅ OpenAI configured', 'green');
      
      if (!env.EXPO_PUBLIC_OPENAI_API_KEY.startsWith('sk-')) {
        log('  ⚠️  OpenAI key should start with sk-', 'yellow');
      }
    }
    
    if (hasGrok) {
      log('  ✅ Grok configured', 'green');
    }
    
    return true;
  } else {
    log('  ⚠️  No AI service configured', 'yellow');
    log('     App will use fallback templates', 'yellow');
    return false;
  }
}

function main() {
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║      GameForge Configuration Validator         ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');
  
  const env = loadEnv();
  
  if (!env) {
    log('❌ No .env file found!', 'red');
    log('\nRun setup wizard:', 'yellow');
    log('  npm run setup\n', 'yellow');
    process.exit(1);
  }
  
  log('Validating configuration...\n', 'cyan');
  
  // Validate Firebase
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('Firebase (Content Database)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  const firebaseValid = validateFirebase(env);
  
  // Validate Payment
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('Payment Provider', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  const paymentProvider = validatePayment(env);
  
  // Validate AI
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('AI Services', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  const aiValid = validateAI(env);
  
  // Summary
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║                   Summary                      ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');
  
  const status = {
    firebase: firebaseValid ? '✅' : '❌',
    payment: paymentProvider !== 'demo' ? '✅' : '⚠️',
    ai: aiValid ? '✅' : '⚠️',
  };
  
  log(`Firebase:  ${status.firebase} ${firebaseValid ? 'Ready' : 'Missing configuration'}`, 'cyan');
  log(`Payment:   ${status.payment} ${paymentProvider === 'paytabs' ? 'PayTabs' : paymentProvider === 'stripe' ? 'Stripe' : 'Demo mode'}`, 'cyan');
  log(`AI:        ${status.ai} ${aiValid ? 'Ready' : 'Using fallbacks'}`, 'cyan');
  
  // Overall status
  log('\n' + '━'.repeat(50), 'bright');
  
  if (firebaseValid && paymentProvider !== 'demo') {
    log('✅ Configuration is production-ready!', 'green');
  } else if (firebaseValid) {
    log('✅ Configuration is valid for development', 'green');
    log('⚠️  Add payment provider for production', 'yellow');
  } else {
    log('⚠️  Configuration incomplete', 'yellow');
    log('Run: npm run setup', 'yellow');
  }
  
  log('');
}

main();
