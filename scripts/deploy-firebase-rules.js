#!/usr/bin/env node
/**
 * Deploy Firebase Security Rules
 * 
 * Automatically deploys firestore.rules to your Firebase project
 * Run: npm run deploy:firebase-rules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('Firebase Security Rules Deployment', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
  
  // Check if rules file exists
  const rulesPath = path.join(__dirname, '..', 'firestore.rules');
  if (!fs.existsSync(rulesPath)) {
    log('❌ firestore.rules file not found!', 'red');
    process.exit(1);
  }
  
  log('✅ Found firestore.rules', 'green');
  
  // Check if Firebase CLI is installed
  if (!checkFirebaseCLI()) {
    log('\n❌ Firebase CLI not installed', 'red');
    log('\nInstall it with:', 'yellow');
    log('  npm install -g firebase-tools\n', 'yellow');
    process.exit(1);
  }
  
  log('✅ Firebase CLI installed', 'green');
  
  // Check if firebase.json exists
  const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
  if (!fs.existsSync(firebaseJsonPath)) {
    log('\n⚠️  No firebase.json found. Creating one...', 'yellow');
    
    const firebaseJson = {
      firestore: {
        rules: 'firestore.rules',
        indexes: 'firestore.indexes.json'
      }
    };
    
    fs.writeFileSync(
      firebaseJsonPath,
      JSON.stringify(firebaseJson, null, 2)
    );
    
    log('✅ Created firebase.json', 'green');
  }
  
  log('\n📝 Deploying security rules...', 'cyan');
  
  try {
    execSync('firebase deploy --only firestore:rules', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    log('\n✅ Security rules deployed successfully!', 'green');
    log('\nYour Firestore database is now secured.', 'cyan');
    
  } catch (error) {
    log('\n❌ Deployment failed', 'red');
    log('\nMake sure you:', 'yellow');
    log('  1. Have run: firebase login', 'yellow');
    log('  2. Have run: firebase init', 'yellow');
    log('  3. Selected the correct project\n', 'yellow');
    process.exit(1);
  }
}

main();
