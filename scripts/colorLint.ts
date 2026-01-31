#!/usr/bin/env node
/**
 * Color Lint - Prevent hardcoded color values in components
 * 
 * This script scans all TSX/JSX files and blocks hardcoded hex colors,
 * ensuring only CSS variables and semantic tokens are used.
 * 
 * Usage: pnpm run color:lint
 */

import * as fs from 'fs';
import * as path from 'path';

// Allowed color patterns (CSS variables and semantic tokens)
const ALLOWED_PATTERNS = [
  /className="[^"]*text-(foreground|primary|secondary|muted|accent|destructive)/,
  /className="[^"]*bg-(background|card|popover|primary|secondary|muted|accent|destructive)/,
  /className="[^"]*border-(border|input|ring)/,
  /className="[^"]*bg-hero-gradient/,
  /className="[^"]*text-gradient-optibio/,
  /className="[^"]*btn-metallic-gold/,
  // Allow Tailwind utility colors ONLY in specific approved contexts
  /className="[^"]*bg-(white|black|transparent)/,
  /className="[^"]*text-(white|black)/,
];

// Forbidden patterns (hardcoded hex values)
const FORBIDDEN_PATTERNS = [
  // Hex colors in Tailwind classes
  /from-\[#[0-9A-Fa-f]{6}\]/,
  /to-\[#[0-9A-Fa-f]{6}\]/,
  /via-\[#[0-9A-Fa-f]{6}\]/,
  /bg-\[#[0-9A-Fa-f]{6}\]/,
  /text-\[#[0-9A-Fa-f]{6}\]/,
  /border-\[#[0-9A-Fa-f]{6}\]/,
  // Generic Tailwind colors (slate, blue, gray, etc.)
  /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}/,
  /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}/,
  /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}/,
];

interface ColorViolation {
  file: string;
  line: number;
  column: number;
  match: string;
  context: string;
}

function scanFile(filePath: string): ColorViolation[] {
  const violations: ColorViolation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    FORBIDDEN_PATTERNS.forEach((pattern) => {
      const matches = line.matchAll(new RegExp(pattern, 'g'));
      for (const match of matches) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          match: match[0],
          context: line.trim(),
        });
      }
    });
  });

  return violations;
}

function scanDirectory(dir: string, extensions: string[] = ['.tsx', '.jsx']): ColorViolation[] {
  let violations: ColorViolation[] = [];

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (!['node_modules', 'dist', 'build', '.next'].includes(file)) {
        violations = violations.concat(scanDirectory(filePath, extensions));
      }
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      violations = violations.concat(scanFile(filePath));
    }
  });

  return violations;
}

function main() {
  console.log('🎨 OptiBio Color Lint - Scanning for hardcoded colors...\n');

  const clientDir = path.join(process.cwd(), 'client', 'src');
  const violations = scanDirectory(clientDir);

  if (violations.length === 0) {
    console.log('✅ No color violations found! All components use semantic tokens.\n');
    process.exit(0);
  }

  console.log(`❌ Found ${violations.length} color violation(s):\n`);

  violations.forEach((violation, index) => {
    console.log(`${index + 1}. ${violation.file}:${violation.line}:${violation.column}`);
    console.log(`   Pattern: ${violation.match}`);
    console.log(`   Context: ${violation.context}`);
    console.log('');
  });

  console.log('💡 Fix these violations by using semantic tokens:');
  console.log('   - Instead of text-[#1E3A5F], use text-primary');
  console.log('   - Instead of bg-[#F7F4EF], use bg-background');
  console.log('   - Instead of text-slate-700, use text-muted-foreground');
  console.log('   - See index.css for full list of semantic tokens\n');

  process.exit(1);
}

main();
