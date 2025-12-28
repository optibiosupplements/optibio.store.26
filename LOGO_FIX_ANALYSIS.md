# Logo Transparency Issue - Root Cause Analysis

## Problem Confirmed

The logo file `optibio-logo-gradient-new.png` has a **transparent background** (checkered pattern visible when viewed). This is causing the checkered pattern to show through on the website.

## Root Cause

The logo was designed with transparency (alpha channel), which is correct for design flexibility. However, when displayed on web pages with certain background colors, the transparency shows as a checkered pattern or may clash with the background.

## Solution Strategy

We have two options:

### Option 1: Add White Background to Logo (RECOMMENDED)
- Generate a new version of the logo with a solid white background
- This ensures the logo always looks clean and professional
- Works on any background color
- File: `optibio-logo-white-bg.png`

### Option 2: CSS Background Fix
- Keep transparent logo
- Add CSS background color to logo container
- More flexible but requires careful styling on each page

## Recommended Approach

**Use Option 1** - Generate logo with white background for consistency and reliability across all pages.

## Implementation Plan

1. Generate new logo with solid white background
2. Save as `optibio-logo-white-bg.png`
3. Update `APP_LOGO` constant in `client/src/const.ts`
4. Test on all pages (About, Shop, Science, FAQ, etc.)
5. Verify no checkered pattern appears anywhere

## Color Palette Reminder

**Midnight Sophistication:**
- Deep Navy: #1E3A5F
- Warm Ivory: #F7F4EF
- Antique Gold: #C9A961

Logo should work cleanly on both navy and ivory backgrounds.
