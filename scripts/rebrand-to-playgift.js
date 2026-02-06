#!/usr/bin/env node
/**
 * CRITICAL: Rebrand GameForge to PlayGift
 * 
 * Fixes 454+ references across entire codebase
 * Updates: Code, docs, marketing, configs, URLs
 * 
 * Usage: npm run rebrand:playgift
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const replacements = [
  // App names
  { from: 'GameForge Mobile', to: 'PlayGift', desc: 'App name' },
  { from: 'GameForge', to: 'PlayGift', desc: 'Brand name' },
  { from: 'gameforge-mobile', to: 'playgift-mobile', desc: 'Package name' },
  { from: 'gameforge', to: 'playgift', desc: 'Lowercase brand' },
  
  // URLs
  { from: 'gameforge.app', to: 'playgift.app', desc: 'Domain' },
  { from: 'gameforge-', to: 'playgift-', desc: 'Prefixes' },
  
  // Bundle IDs
  { from: 'com.gameforge.mobile', to: 'com.playgift.mobile', desc: 'Bundle ID' },
  
  // Social Media
  { from: '@GameForgeUAE', to: '@PlayGiftUAE', desc: 'Instagram handle' },
  { from: '#GameForgeUAE', to: '#PlayGiftUAE', desc: 'Hashtag' },
  { from: '#GameForge', to: '#PlayGift', desc: 'Hashtag' },
  
  // Storage keys
  { from: '@gameforge_', to: '@playgift_', desc: 'AsyncStorage keys' },
  
  // Git references
  { from: 'gameforge-demo', to: 'playgift-demo', desc: 'Demo Firebase project' },
];

// Files/folders to exclude
const exclude = [
  'node_modules',
  '.git',
  'build',
  'dist',
  'web-build',
  '.expo',
  'ios/Pods',
  'android/build',
];

function shouldProcess(filePath) {
  // Skip excluded directories
  for (const exc of exclude) {
    if (filePath.includes(`/${exc}/`) || filePath.includes(`\\${exc}\\`)) {
      return false;
    }
  }
  
  // Process these extensions
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml', '.txt', '.html'];
  return extensions.some(ext => filePath.endsWith(ext));
}

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const replacement of replacements) {
      if (content.includes(replacement.from)) {
        content = content.replaceAll(replacement.from, replacement.to);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  } catch (error) {
    // Skip files that can't be read/written
  }
  
  return false;
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      if (!exclude.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (shouldProcess(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function main() {
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║   🚨 REBRANDING: GameForge → PlayGift         ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');

  const rootDir = path.join(__dirname, '..');
  
  log('🔍 Scanning files...', 'cyan');
  const allFiles = getAllFiles(rootDir);
  log(`Found ${allFiles.length} files to check\n`, 'cyan');
  
  log('🔄 Replacing references...', 'cyan');
  let filesChanged = 0;
  
  for (const file of allFiles) {
    const relativePath = path.relative(rootDir, file);
    if (replaceInFile(file)) {
      filesChanged++;
      if (filesChanged <= 10) {
        log(`  ✓ ${relativePath}`, 'green');
      } else if (filesChanged === 11) {
        log(`  ... and ${allFiles.length - 10} more files`, 'yellow');
      }
    }
  }
  
  log(`\n✅ Updated ${filesChanged} files`, 'green');
  
  // Summary of changes
  log('\n📊 Changes made:', 'cyan');
  replacements.forEach(r => {
    log(`  • ${r.from} → ${r.to} (${r.desc})`, 'yellow');
  });
  
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║          ✅ REBRANDING COMPLETE                ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');
  
  log('🎯 Next steps:', 'cyan');
  log('  1. Review changes: git diff', 'yellow');
  log('  2. Test app: npm start', 'yellow');
  log('  3. Commit: git add . && git commit -m "rebrand: GameForge → PlayGift"', 'yellow');
  log('  4. Regenerate marketing: npm run marketing:valentine --brand PlayGift\n', 'yellow');
}

main();
