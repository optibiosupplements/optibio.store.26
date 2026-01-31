#!/usr/bin/env node

/**
 * Lighthouse Accessibility Audit Script
 * Runs Lighthouse programmatically to check accessibility, performance, and best practices
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function runLighthouse(url) {
  console.log(`\n🔍 Running Lighthouse audit on: ${url}\n`);
  
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['accessibility', 'performance', 'best-practices', 'seo'],
    port: chrome.port
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Extract scores
  const scores = {
    accessibility: runnerResult.lhr.categories.accessibility.score * 100,
    performance: runnerResult.lhr.categories.performance.score * 100,
    bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
    seo: runnerResult.lhr.categories.seo.score * 100
  };
  
  // Get accessibility audits
  const accessibilityAudits = runnerResult.lhr.audits;
  const failedAudits = [];
  
  for (const [key, audit] of Object.entries(accessibilityAudits)) {
    if (audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === 'binary') {
      failedAudits.push({
        id: key,
        title: audit.title,
        description: audit.description
      });
    }
  }
  
  await chrome.kill();
  
  // Print results
  console.log('\n📊 LIGHTHOUSE SCORES:\n');
  console.log(`✅ Accessibility: ${scores.accessibility.toFixed(0)}/100`);
  console.log(`⚡ Performance: ${scores.performance.toFixed(0)}/100`);
  console.log(`🎯 Best Practices: ${scores.bestPractices.toFixed(0)}/100`);
  console.log(`🔍 SEO: ${scores.seo.toFixed(0)}/100`);
  
  if (failedAudits.length > 0) {
    console.log('\n❌ FAILED ACCESSIBILITY AUDITS:\n');
    failedAudits.forEach((audit, i) => {
      console.log(`${i + 1}. ${audit.title}`);
      console.log(`   ${audit.description}\n`);
    });
  } else {
    console.log('\n✅ All accessibility audits passed!\n');
  }
  
  // Save full report
  fs.writeFileSync('lighthouse-report.json', JSON.stringify(runnerResult.lhr, null, 2));
  console.log('📄 Full report saved to: lighthouse-report.json\n');
  
  return scores;
}

// Get URL from command line or use default
const url = process.argv[2] || 'http://localhost:3000';

runLighthouse(url)
  .then(scores => {
    if (scores.accessibility >= 98) {
      console.log('🎉 TARGET ACHIEVED: Accessibility score is 98+!\n');
      process.exit(0);
    } else {
      console.log(`⚠️  Target not met: Need ${(98 - scores.accessibility).toFixed(0)} more points\n`);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Lighthouse audit failed:', err);
    process.exit(1);
  });
