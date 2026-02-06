#!/usr/bin/env node
/**
 * Repository Cleanup Script
 * 
 * Cleans up stale PRs and branches
 * Provides recommendations for merging/closing
 * 
 * Usage: npm run repo:cleanup
 */

const { execSync } = require('child_process');

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

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

function main() {
  log('\n╔════════════════════════════════════════════════╗', 'cyan');
  log('║        Repository Cleanup Analysis             ║', 'cyan');
  log('╚════════════════════════════════════════════════╝\n', 'cyan');

  // Check for gh CLI
  const hasGH = exec('gh --version');
  
  if (!hasGH) {
    log('⚠️  GitHub CLI not installed', 'yellow');
    log('Install: https://cli.github.com\n', 'yellow');
    log('Manual cleanup recommended:', 'cyan');
    log('  • Close stale copilot/* PRs', 'yellow');
    log('  • Merge PR #16 (PlayGift branding)', 'yellow');
    log('  • Merge PR #30 (current work)', 'yellow');
    return;
  }

  // List all PRs
  log('📋 Analyzing Pull Requests...', 'cyan');
  const prs = exec('gh pr list --state all --json number,title,state,headRefName --limit 50');
  
  if (prs) {
    const prList = JSON.parse(prs);
    
    const openPRs = prList.filter(pr => pr.state === 'OPEN');
    const mergedPRs = prList.filter(pr => pr.state === 'MERGED');
    
    log(`\nTotal PRs: ${prList.length}`, 'yellow');
    log(`  Open: ${openPRs.length}`, openPRs.length > 5 ? 'red' : 'green');
    log(`  Merged: ${mergedPRs.length}\n`, 'green');
    
    // Categorize open PRs
    const copilotPRs = openPRs.filter(pr => pr.headRefName.startsWith('copilot/'));
    const cursorPRs = openPRs.filter(pr => pr.headRefName.startsWith('cursor/'));
    const importantPRs = openPRs.filter(pr => 
      pr.title.includes('PlayGift') || 
      pr.title.includes('firebase') || 
      pr.title.includes('payment')
    );
    
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('RECOMMENDATIONS', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
    
    // Critical PRs to merge
    log('🔴 URGENT - Merge These:', 'red');
    if (important PRs.length > 0) {
      importantPRs.forEach(pr => {
        log(`  #${pr.number}: ${pr.title}`, 'yellow');
        log(`    → gh pr merge ${pr.number} --squash`, 'cyan');
      });
    } else {
      log('  None found', 'green');
    }
    
    // Stale copilot PRs to close
    log('\n🟡 CLOSE - Stale Copilot PRs:', 'yellow');
    if (copilotPRs.length > 0) {
      copilotPRs.slice(0, 15).forEach(pr => {
        log(`  #${pr.number}: ${pr.title.substring(0, 60)}...`, 'yellow');
        log(`    → gh pr close ${pr.number} -c "Superseded by unified implementation"`, 'cyan');
      });
    }
    
    // Current work PRs
    log('\n🟢 KEEP - Active Work:', 'green');
    cursorPRs.forEach(pr => {
      log(`  #${pr.number}: ${pr.title}`, 'green');
    });
  }
  
  // Analyze branches
  log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('BRANCH ANALYSIS', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
  
  const branches = exec('git branch -r').split('\n').filter(b => b.trim());
  
  const copilotBranches = branches.filter(b => b.includes('copilot/'));
  const cursorBranches = branches.filter(b => b.includes('cursor/'));
  
  log(`Total remote branches: ${branches.length}`, 'yellow');
  log(`  Copilot branches: ${copilotBranches.length}`, 'yellow');
  log(`  Cursor branches: ${cursorBranches.length}\n`, 'yellow');
  
  log('🗑️  DELETE - Stale Copilot Branches:', 'red');
  copilotBranches.slice(0, 10).forEach(branch => {
    const name = branch.trim().replace('remotes/origin/', '');
    log(`  ${name}`, 'yellow');
  });
  if (copilotBranches.length > 10) {
    log(`  ... and ${copilotBranches.length - 10} more`, 'yellow');
  }
  
  log('\n✅ To clean up:', 'cyan');
  log('  git push origin --delete <branch-name>', 'yellow');
  log('  Or run: npm run repo:cleanup-branches\n', 'yellow');
  
  // Summary
  log('╔════════════════════════════════════════════════╗', 'bright');
  log('║           Cleanup Summary                      ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');
  
  log(`PRs to close: ${copilotPRs.length}`, 'yellow');
  log(`PRs to merge: ${importantPRs.length}`, 'yellow');
  log(`Branches to delete: ${copilotBranches.length}`, 'yellow');
  log('\nRun automated cleanup:', 'cyan');
  log('  npm run repo:auto-cleanup\n', 'cyan');
}

main();
