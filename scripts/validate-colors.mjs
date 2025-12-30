#!/usr/bin/env node

/**
 * OptiBio® Color Validation Script
 * 
 * Scans all TypeScript/TSX files for hardcoded color values
 * and verifies they are approved in the brand guidelines.
 * 
 * Usage:
 *   node scripts/validate-colors.mjs
 *   npm run validate:colors
 * 
 * Exit Codes:
 *   0 - All colors approved
 *   1 - Unapproved colors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// ============================================
// APPROVED COLORS (From Master Brand Guidelines v2.0)
// ============================================

const APPROVED_COLORS = new Set([
  // Primary Brand Colors
  '#1E3A5F', // Deep Navy
  '#152B45', // Navy Dark
  '#0D1B2A', // Navy Depth
  '#FFFFFF', // Pure White
  '#F7F4EF', // Warm Ivory
  '#C9A961', // Antique Gold
  '#B89651', // Gold Dark
  
  // Background Colors
  '#EDE9E3', // Ivory Light
  '#FAFAF9', // Soft White
  '#F0F9FF', // Sky Mist
  
  // Text Colors
  '#2D2D2D', // Charcoal
  '#475569', // Slate Grey
  '#666666', // Light Gray
  '#666',    // Light Gray (shorthand)
  '#A0A0A0', // Muted Gray
  
  // Sky Blue Gradient
  '#F8FCFE', // Sky Light
  '#EBF5FB', // Sky Mid
  '#D6EAF8', // Sky Deep
  
  // Accent Colors
  '#2563EB', // Electric Blue / Trust Blue
  '#5FA865', // Success Green
  '#DC2626', // Error Red
  
  // Logo Gradient Colors
  '#87CEEB', // Logo Light Blue
  '#FFD700', // Logo Gold
  '#1E3ABA', // Logo Navy
  '#F59E0B', // Logo Amber
  
  // Dark Mode Colors (Reserved)
  '#0B1120', // Abyssal Navy
  '#15233E', // Navy Card
  '#2D4A77', // Navy-700
  '#D4AF37', // Luminous Gold
  '#94A3B8', // Sky Grey
  '#0F172A', // Dark Slate
  
  // Utility Colors (Stripe, etc.)
  '#1E293B', // Stripe dark text
  '#F8F8F7', // Manus dialog bg
  '#34322D', // Manus dialog text
  '#858481', // Manus dialog muted
  '#1A1A19', // Manus dialog button
  '#B89850', // Cookie banner hover (close to Gold Dark)
  
  // Border/Separator Colors
  '#E0E0E0', // Default border
  '#E2E8F0', // Border slate
  '#FFC9C9', // Countdown border (light pink)
  
  // CONVERSION & UTILITY PALETTE (v3.0) - E-commerce colors
  
  // Urgency Red System
  '#DC2626', // Alert Red - Discount badges
  '#991B1B', // Muted Red - Timer labels
  '#7C2D12', // Deep Timer Brown - Countdown numbers
  '#FFF7ED', // Warm Blush - Timer background
  '#FEF9F3', // Blush Gradient Start
  '#FFF5E8', // Blush Gradient End
  '#FED7AA', // Timer Border
  
  // Social Proof Green System
  '#F0FDF4', // Mint Background - Review cards
  '#DCFCE7', // Mint Gradient End
  '#BBF7D0', // Mint Border
  '#16A34A', // Success Green - "Bottles sold" text
  '#FBBF24', // Review Star Gold
  
  // Action Blue System
  '#2563EB', // Electric Blue - CTA buttons
  '#1D4ED8', // Hover Blue - CTA hover
  
  // Supporting Conversion Colors
  '#2C4A6B', // Navy circles for avatars
  '#22C55E', // Alternative success green
  '#F0F0F0', // Light background
  '#6B7280', // Gray text
  '#E5E5E5', // Light gray border
  '#D4B76E', // Gold variant
  '#FDE68A', // Yellow background
  '#C8E6C9', // Light green background
  '#24426A', // Navy variant
]);

// ============================================
// FORBIDDEN COLORS (Known violations)
// ============================================

const FORBIDDEN_COLORS = new Set([
  '#000000', // Pure Black - too aggressive
  '#D4745F', // Coral Red - NOT in brand guidelines (found in audit)
]);

// ============================================
// ALLOWED EXCEPTIONS (CSS variables, oklch, etc.)
// ============================================

const ALLOWED_PATTERNS = [
  /var\(--[a-z-]+\)/gi,           // CSS variables
  /oklch\([^)]+\)/gi,              // OKLCH color format
  /rgba?\([^)]+\)/gi,              // RGB/RGBA (for shadows, opacity)
  /hsla?\([^)]+\)/gi,              // HSL/HSLA
  /#ccc/gi,                        // Recharts default (in chart.tsx)
  /#fff/gi,                        // White shorthand (in chart.tsx)
];

// ============================================
// FILE SCANNING
// ============================================

function getAllTsxFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, build
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        getAllTsxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// ============================================
// COLOR EXTRACTION
// ============================================

function extractHexColors(content) {
  // Match hex colors: #RGB or #RRGGBB
  const hexPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
  const matches = content.match(hexPattern) || [];
  
  // Normalize to uppercase and expand 3-digit hex
  return matches.map(color => {
    const normalized = color.toUpperCase();
    if (normalized.length === 4) {
      // Expand #RGB to #RRGGBB
      const r = normalized[1];
      const g = normalized[2];
      const b = normalized[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return normalized;
  });
}

function isAllowedException(line) {
  // Check if line contains allowed patterns
  return ALLOWED_PATTERNS.some(pattern => pattern.test(line));
}

// ============================================
// VALIDATION
// ============================================

function validateFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];
  
  lines.forEach((line, index) => {
    // Skip lines with allowed patterns
    if (isAllowedException(line)) {
      return;
    }
    
    const colors = extractHexColors(line);
    
    colors.forEach(color => {
      if (FORBIDDEN_COLORS.has(color)) {
        violations.push({
          line: index + 1,
          color,
          type: 'FORBIDDEN',
          message: `FORBIDDEN color ${color} found. This color is NOT in brand guidelines.`,
        });
      } else if (!APPROVED_COLORS.has(color)) {
        violations.push({
          line: index + 1,
          color,
          type: 'UNAPPROVED',
          message: `Unapproved color ${color} found. Use CSS variables or approved colors.`,
        });
      }
    });
  });
  
  return violations;
}

// ============================================
// REPORTING
// ============================================

function printReport(results) {
  let totalViolations = 0;
  let forbiddenCount = 0;
  let unapprovedCount = 0;
  
  console.log('\n🎨 OptiBio® Color Validation Report\n');
  console.log('━'.repeat(80));
  
  if (results.length === 0) {
    console.log('\n✅ All colors are approved! No violations found.\n');
    return 0;
  }
  
  results.forEach(({ file, violations }) => {
    if (violations.length === 0) return;
    
    const relativePath = relative(PROJECT_ROOT, file);
    console.log(`\n📄 ${relativePath}`);
    console.log('─'.repeat(80));
    
    violations.forEach(({ line, color, type, message }) => {
      totalViolations++;
      if (type === 'FORBIDDEN') forbiddenCount++;
      if (type === 'UNAPPROVED') unapprovedCount++;
      
      const icon = type === 'FORBIDDEN' ? '🚫' : '⚠️';
      console.log(`  ${icon} Line ${line}: ${message}`);
    });
  });
  
  console.log('\n' + '━'.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Total violations: ${totalViolations}`);
  console.log(`   🚫 Forbidden colors: ${forbiddenCount}`);
  console.log(`   ⚠️  Unapproved colors: ${unapprovedCount}`);
  
  if (forbiddenCount > 0) {
    console.log(`\n🚫 CRITICAL: ${forbiddenCount} FORBIDDEN colors found!`);
    console.log(`   These colors are explicitly BANNED from OptiBio brand.`);
    console.log(`   Replace with approved colors from MASTER_COLOR_SPECIFICATION.md`);
  }
  
  if (unapprovedCount > 0) {
    console.log(`\n⚠️  WARNING: ${unapprovedCount} unapproved colors found.`);
    console.log(`   Use CSS variables (var(--optibio-*)) or approved hex colors.`);
    console.log(`   See MASTER_COLOR_SPECIFICATION.md for complete list.`);
  }
  
  console.log('\n📚 Documentation:');
  console.log('   - MASTER_COLOR_SPECIFICATION.md (Complete color list)');
  console.log('   - COLOR_AUDIT_REPORT.md (Audit findings)');
  console.log('   - client/src/const/colors.ts (TypeScript constants)');
  console.log('   - client/src/index.css (CSS variables)\n');
  
  return totalViolations > 0 ? 1 : 0;
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log('🔍 Scanning for hardcoded colors...\n');
  
  const clientSrcDir = join(PROJECT_ROOT, 'client', 'src');
  const files = getAllTsxFiles(clientSrcDir);
  
  console.log(`📁 Found ${files.length} TypeScript/TSX files\n`);
  
  const results = files.map(file => ({
    file,
    violations: validateFile(file),
  }));
  
  const exitCode = printReport(results);
  process.exit(exitCode);
}

main();
