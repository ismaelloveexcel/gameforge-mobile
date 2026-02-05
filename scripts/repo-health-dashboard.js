#!/usr/bin/env node

/**
 * Repository Supervisor Dashboard
 * Quick command-line interface for checking repo health
 */

const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    return '';
  }
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('');
  log('═══════════════════════════════════════════════', 'cyan');
  log(`  ${title}`, 'bright');
  log('═══════════════════════════════════════════════', 'cyan');
  console.log('');
}

function calculateHealthScore(stats) {
  let score = 100;
  score -= stats.stalePRs * 5;
  score -= stats.obsoleteBranches * 2;
  score -= stats.failedWorkflows * 10;
  return Math.max(0, score);
}

function getHealthStatus(score) {
  if (score >= 90) return { emoji: '🟢', text: 'Excellent', color: 'green' };
  if (score >= 70) return { emoji: '��', text: 'Good', color: 'yellow' };
  if (score >= 50) return { emoji: '🟠', text: 'Fair', color: 'yellow' };
  return { emoji: '🔴', text: 'Needs Attention', color: 'red' };
}

async function main() {
  header('🏥 REPOSITORY HEALTH DASHBOARD');
  
  log('Checking repository health...', 'cyan');
  console.log('');
  
  // Check if gh CLI is available
  const ghVersion = exec('gh --version 2>/dev/null');
  if (!ghVersion) {
    log('⚠️  GitHub CLI (gh) not found. Install it for full functionality:', 'yellow');
    log('   https://cli.github.com/', 'yellow');
    console.log('');
  }
  
  // Simple health check without complex parsing
  log(`📋 REPOSITORY STATUS`, 'blue');
  log(`   Repository: gameforge-mobile`);
  log(`   Branch: ${exec('git branch --show-current') || 'unknown'}`);
  log(`   Last commit: ${exec('git log -1 --format=%cr') || 'unknown'}`);
  console.log('');
  
  log('💡 Quick Actions:', 'cyan');
  log('   • Check repo health: npm run health');
  log('   • View PRs: gh pr list');
  log('   • View workflows: gh run list');
  log('   • Trigger supervisor: gh workflow run repo-supervisor.yml');
  console.log('');
  
  log(`Last updated: ${new Date().toLocaleString()}`, 'reset');
  console.log('');
}

// Run dashboard
main().catch(error => {
  console.error('Error running dashboard:', error.message);
  process.exit(1);
});
