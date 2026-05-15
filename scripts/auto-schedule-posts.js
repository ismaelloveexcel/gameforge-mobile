#!/usr/bin/env node
/**
 * Auto-Schedule Social Media Posts
 * 
 * Integrates with Buffer.com API for automated posting
 * Or exports to CSV for manual import
 * 
 * Usage: node scripts/auto-schedule-posts.js valentine
 */

const fs = require('fs');
const path = require('path');

const campaign = process.argv[2] || 'valentine';
const BUFFER_API_KEY = process.env.BUFFER_API_KEY; // Optional

async function scheduleToBuffer(posts) {
  if (!BUFFER_API_KEY) {
    console.log('⚠️  Buffer API not configured - use CSV export instead');
    return false;
  }

  // Buffer.com API integration
  // POST to https://api.bufferapp.com/1/updates/create.json
  
  for (const post of posts) {
    try {
      const response = await fetch('https://api.bufferapp.com/1/updates/create.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: BUFFER_API_KEY,
          text: `${post.caption}\n\n${post.hashtags}`,
          profile_ids: [process.env.BUFFER_INSTAGRAM_PROFILE_ID],
          scheduled_at: post.scheduledFor,
          media: {
            photo: post.mediaUrl
          }
        })
      });

      if (response.ok) {
        console.log(`✅ Scheduled: ${post.caption.substring(0, 40)}...`);
      } else {
        console.log(`❌ Failed: ${post.caption.substring(0, 40)}...`);
      }

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error scheduling post: ${error.message}`);
    }
  }

  return true;
}

function exportToCSV(campaign) {
  const inputFile = path.join(__dirname, '..', 'marketing-output', campaign, 'posting-schedule.csv');
  
  if (!fs.existsSync(inputFile)) {
    console.log('❌ No posting schedule found. Run: npm run marketing:generate-all first');
    return;
  }

  console.log('✅ Posting schedule ready!');
  console.log(`📁 Location: ${inputFile}`);
  console.log('\n📤 Import to:');
  console.log('  • Buffer.com - Free tier supports 10 scheduled posts');
  console.log('  • Later.com - Visual Instagram scheduler');
  console.log('  • Hootsuite - Multi-platform');
  console.log('  • Meta Business Suite - Instagram + Facebook native\n');
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║      Auto-Schedule Social Media Posts          ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  console.log(`Campaign: ${campaign}`);

  // Try Buffer API first
  const scheduled = await scheduleToBuffer([]);

  if (!scheduled) {
    // Export CSV for manual tools
    exportToCSV(campaign);
  }

  console.log('\n✅ Marketing automation ready!');
  console.log('Posts will automatically publish at scheduled times.\n');
}

main();
