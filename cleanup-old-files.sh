#!/bin/bash

# OptiBio Repository Cleanup Script
# Removes old, redundant, and unnecessary files to reduce repo size

set -e

echo "🧹 OptiBio Repository Cleanup"
echo "=============================="
echo ""

# Calculate initial size
INITIAL_SIZE=$(du -sh . --exclude=node_modules --exclude=.git | cut -f1)
echo "📊 Initial size: $INITIAL_SIZE"
echo ""

# Backup important files first
echo "💾 Creating backup of todo.md..."
cp todo.md todo.md.backup

# Array to track deleted files
DELETED_FILES=()
DELETED_SIZE=0

# Function to safely remove files/directories
safe_remove() {
  local path="$1"
  local description="$2"
  
  if [ -e "$path" ]; then
    local size=$(du -sh "$path" 2>/dev/null | cut -f1)
    rm -rf "$path"
    DELETED_FILES+=("$description ($size)")
    echo "  ✓ Removed: $description ($size)"
  fi
}

echo "🗑️  Removing build outputs..."
safe_remove "dist/" "Build output directory"
safe_remove "build/" "Build directory"

echo ""
echo "🗑️  Removing redundant documentation (keeping essential files)..."

# Old audit/status reports (superseded by current state)
safe_remove "ACCESSIBILITY_AUDIT.md" "Old accessibility audit"
safe_remove "ACCESSIBILITY_AUDIT_REPORT.md" "Old accessibility report"
safe_remove "AUDIT_FINDINGS.md" "Old audit findings"
safe_remove "BRAND_ANALYSIS.md" "Old brand analysis"
safe_remove "COLOR_AUDIT_REPORT.md" "Old color audit"
safe_remove "COLOR_FIX_ANALYSIS.md" "Old color fix analysis"
safe_remove "COLOR_LOCK_SUMMARY.md" "Old color lock summary"
safe_remove "COLOR_LOCK_SYSTEM.md" "Old color lock system"
safe_remove "COLOR_LOCK_VALIDATION_REPORT.md" "Old color validation"
safe_remove "COLOR_SYSTEM_README.md" "Old color system readme"
safe_remove "COLOR_USAGE_GUIDE.md" "Old color usage guide"
safe_remove "COLOR_VERIFICATION.md" "Old color verification"
safe_remove "COLOR_VERIFICATION_COMPLETE.md" "Old color verification complete"
safe_remove "COLOR_VERIFICATION_SUMMARY.md" "Old color verification summary"
safe_remove "COLORS_LOCKED.md" "Old colors locked doc"
safe_remove "CURRENT_STATUS.md" "Old status (superseded by todo.md)"
safe_remove "CURRENT_STATUS_AND_ROADMAP.md" "Old status and roadmap"
safe_remove "DARK_MODE_AUDIT_REPORT.md" "Old dark mode audit"
safe_remove "DESIGN_AUDIT.md" "Old design audit"
safe_remove "DESIGN_AUDIT_REPORT.md" "Old design audit report"
safe_remove "DESIGN_FIXES_REPORT.md" "Old design fixes"
safe_remove "DUAL_COLOR_SCHEMA_VERIFICATION.md" "Old dual color verification"
safe_remove "EXACT_COMPARISON.md" "Old comparison"
safe_remove "FINAL_COMPARISON.md" "Old final comparison"
safe_remove "FINAL_DESIGN_AUDIT_REPORT.md" "Old final design audit"
safe_remove "FINAL_VERIFICATION_REPORT.md" "Old final verification"
safe_remove "GRADIENT_BUTTONS_VERIFICATION.md" "Old gradient verification"
safe_remove "HERO_REDESIGN_DRAFT.md" "Old hero redesign draft"
safe_remove "HOMEPAGE_REDESIGN_ANALYSIS.md" "Old homepage analysis"
safe_remove "IMPLEMENTATION_PROGRESS.md" "Old implementation progress"
safe_remove "IMPROVEMENTS_SUMMARY.md" "Old improvements summary"
safe_remove "LAYOUT_COMPARISON.md" "Old layout comparison"
safe_remove "LIGHT_DARK_MODE_VERIFICATION_SUMMARY.md" "Old light/dark verification"
safe_remove "LIGHT_MODE_COLOR_VERIFICATION_REPORT.md" "Old light mode verification"
safe_remove "LIVE_INSPECTION_NOTES.md" "Old inspection notes"
safe_remove "MOBILE_DESIGN_AUDIT.md" "Old mobile audit"
safe_remove "OPTIMIZATION_TODO.md" "Old optimization todo"
safe_remove "P0_FIXES_IMPLEMENTATION.md" "Old P0 fixes"
safe_remove "PAGE_VERIFICATION_AUDIT.md" "Old page verification"
safe_remove "PHASE1_LAUNCH_READY.md" "Old phase 1 doc"
safe_remove "PHASE2_LUXURY_POLISH_SUMMARY.md" "Old phase 2 summary"
safe_remove "POSITIONING_ANALYSIS.md" "Old positioning analysis"
safe_remove "PRIORITY_ACTION_PLAN.md" "Old priority action plan"
safe_remove "PRODUCT_DESIGN_REFERENCE.md" "Old product design ref"
safe_remove "PROGRESS_LOG.md" "Old progress log"
safe_remove "PROGRESS_UPDATE.md" "Old progress update"
safe_remove "QA_AUDIT_FINDINGS.md" "Old QA audit"
safe_remove "REDESIGN_PLAN.md" "Old redesign plan"
safe_remove "SME_DARK_MODE_REVIEW.md" "Old SME review"
safe_remove "STATUS_REPORT.md" "Old status report"
safe_remove "STYLING_STRATEGY.md" "Old styling strategy"
safe_remove "TESTING_LOG.md" "Old testing log"
safe_remove "TESTING_NOTES.md" "Old testing notes"
safe_remove "V3_IMPLEMENTATION_PLAN.md" "Old V3 plan"
safe_remove "VERIFICATION_CHECKLIST.md" "Old verification checklist"
safe_remove "VERIFICATION_REPORT.md" "Old verification report"
safe_remove "VISUAL_AUDIT.md" "Old visual audit"
safe_remove "VISUAL_TEST_RESULTS.md" "Old visual test results"
safe_remove "clinical-light-success.md" "Old clinical light doc"
safe_remove "dark-mode-verification.md" "Old dark mode verification"
safe_remove "gemini-feedback-analysis.md" "Old gemini feedback"
safe_remove "logo-fix-status.md" "Old logo fix status"
safe_remove "mobile-issues-analysis.md" "Old mobile issues"
safe_remove "night-clinic-implementation.md" "Old night clinic doc"
safe_remove "product-image-replacement-verification.md" "Old product image verification"

# Redundant team/planning docs (keeping only essential ones)
safe_remove "AI_AGENT_JOB_DESCRIPTIONS.md" "Old AI agent job descriptions"
safe_remove "AI_AGENT_PROFILES.md" "Old AI agent profiles"
safe_remove "COMPLETE_AI_TEAM_PROFILES.md" "Old complete team profiles"
safe_remove "DREAM_TEAM_ONBOARDING.md" "Old dream team onboarding"
safe_remove "OPTIBIO_DREAM_TEAM_AGENTS.md" "Old dream team agents"
safe_remove "OPTIBIO_DREAM_TEAM_IMPLEMENTATION_GUIDE.md" "Old implementation guide"
safe_remove "OPTIBIO_PHASE2_IMPLEMENTATION_GUIDE.md" "Old phase 2 implementation"
safe_remove "OPTIBIO_PHASE2_SCALING_TEAM.md" "Old phase 2 scaling"
safe_remove "OPTIBIO_TEAM_COORDINATION_PLAYBOOK.md" "Old coordination playbook"

# Old implementation guides (info now in current codebase)
safe_remove "ABANDONED_CART_COMPLETE.md" "Old abandoned cart doc"
safe_remove "ABANDONED_CART_RECOVERY.md" "Old abandoned cart recovery"
safe_remove "ACCESSIBILITY_ENHANCEMENTS_REPORT.md" "Old accessibility enhancements"
safe_remove "ANALYTICS_TRACKING_SETUP.md" "Old analytics setup"
safe_remove "CHECKOUT_FLOW_TEST_RESULTS.md" "Old checkout test results"
safe_remove "COMMERCIAL_READINESS_REPORT.md" "Old commercial readiness"
safe_remove "CONTENT_AUDIT_REPORT.md" "Old content audit"
safe_remove "CRISP_CHAT_SETUP.md" "Old crisp chat setup"
safe_remove "DATE_RANGE_FILTERING.md" "Old date range filtering"
safe_remove "EMERGENCY_LAUNCH_PLAN.md" "Old emergency launch plan"
safe_remove "FAVICON_AND_DEPLOYMENT_GUIDE.md" "Old favicon guide"
safe_remove "FULL_IMPLEMENTATION_PLAN.md" "Old implementation plan"
safe_remove "GODADDY_DNS_STEPS.md" "Old GoDaddy DNS steps"
safe_remove "IMAGERY_ENHANCEMENT_SUMMARY.md" "Old imagery enhancement"
safe_remove "IMPLEMENTATION_ROADMAP.md" "Old implementation roadmap"
safe_remove "LAUNCH_BLOCKERS_COMPLETE.md" "Old launch blockers"
safe_remove "LAUNCH_SUMMARY.md" "Old launch summary"
safe_remove "ORDER_TRACKING_ANALYTICS.md" "Old order tracking analytics"
safe_remove "REVENUE_KILLERS_FIXED.md" "Old revenue killers doc"
safe_remove "SECURITY_IMPLEMENTATION.md" "Old security implementation"
safe_remove "STRIPE_INTEGRATION_COMPLETE.md" "Old Stripe integration doc"
safe_remove "THEME_IMPLEMENTATION_SUMMARY.md" "Old theme implementation"
safe_remove "URGENCY_WARMTH_IMPLEMENTATION.md" "Old urgency warmth doc"
safe_remove "UX_AUDIT_FINDINGS.md" "Old UX audit findings"
safe_remove "UX_UI_AUDIT_REPORT.md" "Old UX/UI audit"
safe_remove "UX_UI_FIXES_BEFORE_AFTER.md" "Old UX/UI fixes"

echo ""
echo "🗑️  Removing large reference files..."
safe_remove "REFERENCE_DESIGN.png" "Large reference design image (180K)"
safe_remove "lighthouse-report-v2.json" "Old lighthouse report (256K)"

echo ""
echo "🗑️  Removing duplicate/old marketing assets..."
# Keep only the essential marketing strategy docs, remove old creative files
safe_remove "marketing-assets/ad-creative-2-sleep-benefit.jpg" "Old ad creative (5.8M)"
safe_remove "marketing-assets/ad-creative-3-stress-relief.jpg" "Old ad creative (5.3M)"

echo ""
echo "🗑️  Removing old product images (keeping only current ones)..."
# Remove corrected versions (we use the final ones)
safe_remove "client/public/products/optibio-90cap-bottle-front-corrected.jpg" "Old corrected product image"
safe_remove "client/public/products/optibio-90cap-bottle-angle-corrected.jpg" "Old corrected product image"

echo ""
echo "🗑️  Removing export artifacts..."
safe_remove "optibio-gemini-export/" "Export directory"
safe_remove "optibio-for-gemini-*.zip" "Export zip files"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  Files/directories removed: ${#DELETED_FILES[@]}"
echo ""
echo "Removed items:"
for item in "${DELETED_FILES[@]}"; do
  echo "  - $item"
done

echo ""
FINAL_SIZE=$(du -sh . --exclude=node_modules --exclude=.git | cut -f1)
echo "📊 Initial size: $INITIAL_SIZE"
echo "📊 Final size: $FINAL_SIZE"
echo ""
echo "💡 Next steps:"
echo "1. Review the changes: git status"
echo "2. If satisfied, commit: git add -A && git commit -m 'Clean up old/redundant files'"
echo "3. Push to GitHub: git push"
echo "4. Run ./export-for-gemini.sh to create a clean export"
