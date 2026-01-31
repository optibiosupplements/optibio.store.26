# OptiBio Design Specifications - Approved Reference Implementation

**Date:** December 30, 2025  
**Reference:** Approved design mockup (pasted_file_bFuiTl_image.png)  
**Status:** Complete pixel-perfect specification  
**Authority:** Brand Guidelines - LOCKED

---

## 🎨 COLOR HIERARCHY (STRICT RULES)

### **Action Color: Electric Blue**
- **Primary CTA Buttons:** `#2563EB` (var(--optibio-electric))
- **Usage:** All main action buttons (Pre-Order Now, Add to Cart, Checkout)
- **NEVER use gold for action buttons**

### **Trust/Quality Color: Gold**
- **Accents Only:** `#C9A961` (var(--optibio-gold))
- **Usage:** Stars, badges, icons, bottle caps, certification shields
- **NEVER use for primary action buttons**

### **Text Color: Deep Navy**
- **Headlines & Body:** `#2C4A6E` (approximately, close to #1E3A5F)
- **Usage:** All text content, headlines, descriptions
- **High contrast against sky blue background**

---

## 📐 SECTION-BY-SECTION SPECIFICATIONS

---

### **1. HERO SECTION**

#### **Background**
- **Color:** Sky blue gradient (top to bottom)
  - Top: `#C8DFF5` (--optibio-sky-deep)
  - Middle: `#D6EAF8` (--optibio-sky-mid)
  - Bottom: `#E8F3FB` (--optibio-sky-light)
- **Effect:** Soft, calming gradient creating depth
- **Mood:** Clinical freshness, trustworthy, premium

#### **Top Badge ("Science-Backed • Third-Party Tested")**
- **Background:** Deep Navy `#2C4A6E` (dark, solid)
- **Text Color:** White `#FFFFFF`
- **Font Weight:** 600 (semi-bold)
- **Border Radius:** Full pill shape (999px or 9999px)
- **Padding:** 10px 20px
- **Icon:** Shield checkmark icon (left side, white)
- **Position:** Top left of hero content

#### **Main Headline ("Feel Like Yourself Again")**
- **Font Family:** Sora (bold, display font)
- **Font Size:** 56px - 64px (desktop), 36px (mobile)
- **Font Weight:** 700 (bold)
- **Color:** Deep Navy `#2C4A6E`
- **Line Height:** 1.1 (tight, impactful)
- **Letter Spacing:** -0.02em (slightly condensed)
- **Max Width:** 600px

#### **Subheadline / Body Copy**
- **Font Family:** Inter (body font)
- **Font Size:** 18px - 20px
- **Font Weight:** 400 (regular)
- **Color:** Deep Navy `#2C4A6E` (same as headline for consistency)
- **Line Height:** 1.6 (readable)
- **Max Width:** 500px
- **Content:** "Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply."

#### **Certification Icons (Below Body Copy)**
- **Layout:** Vertical stack, 3 items
- **Icon Style:** 
  - Shield icon (gold outline) + Medal icon (gold) + Checkmark circle (gold)
  - Icon color: `#C9A961` (gold)
  - Icon size: 24px x 24px
- **Text:**
  - Label: Bold, 14px, Deep Navy
  - Sublabel: Regular, 12px, Gray `#6B7280`
- **Spacing:** 16px between each item

---

### **2. PRICE CARD (White Card with Shadow)**

#### **Card Container**
- **Background:** Pure White `#FFFFFF`
- **Border Radius:** 16px (rounded corners)
- **Shadow:** Soft shadow for depth
  - `box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1)`
- **Padding:** 24px
- **Max Width:** 380px

#### **Countdown Timer Section**
- **Background:** Light Pink/Salmon `#FFE5E5`
- **Border:** 1px solid `#FFC9C9` (slightly darker pink)
- **Border Radius:** 8px
- **Padding:** 12px 16px
- **Layout:** Horizontal flex
- **Text:**
  - Label: "Pre-orders close in:" - 14px, Deep Navy, 600 weight
  - Timer Numbers: 24px, Red `#DC2626`, 700 weight (bold)
  - Timer Labels: 10px, Red `#DC2626`, 400 weight, uppercase
- **Icon:** Clock icon (red, 16px)

#### **Price Display**
- **Current Price:** 
  - Font Size: 48px
  - Font Weight: 700 (bold)
  - Color: Deep Navy `#2C4A6E`
  - Format: `$49.99`
- **Original Price (Strikethrough):**
  - Font Size: 20px
  - Font Weight: 400
  - Color: Gray `#9CA3AF`
  - Text Decoration: line-through
  - Format: `$69.99`
- **Sale Badge:**
  - Background: Bright Red `#DC2626`
  - Text: "Save 46%" - White, 12px, 700 weight
  - Border Radius: 4px
  - Padding: 4px 8px
  - Position: Inline with strikethrough price

#### **Pre-Order Special Row**
- **Icon:** Rocket emoji 🚀 (or rocket icon)
- **Text:** "Pre-Order Special: Ships Jan 20-27, 2026"
- **Font Size:** 14px
- **Color:** Deep Navy `#2C4A6E`
- **Font Weight:** 500 (medium)

#### **Free Shipping Row**
- **Background:** Light Yellow `#FFF9E5`
- **Border:** 1px solid `#FEF3C7` (slightly darker yellow)
- **Border Radius:** 6px
- **Padding:** 8px 12px
- **Icon:** Truck icon (amber/brown `#92400E`, 16px)
- **Text:** "Free shipping on orders $75+"
- **Font Size:** 14px
- **Color:** Brown `#92400E`
- **Font Weight:** 500

#### **PRIMARY CTA BUTTON (Pre-Order Now - Save 46%)**
**🔥 CRITICAL SPECIFICATION - EXACT MATCH REQUIRED**

- **Background:** Electric Blue `#2563EB` (solid fill)
- **Border:** 2px solid Deep Navy `#1E3A5F` (darker blue border)
  - **This creates the "darker line border and lighter shade filled in" effect**
- **Text Color:** White `#FFFFFF`
- **Font Size:** 16px
- **Font Weight:** 600 (semi-bold)
- **Border Radius:** 8px (slightly rounded)
- **Padding:** 14px 24px (generous padding)
- **Width:** 100% (full width of card)
- **Height:** 52px
- **Icon:** Arrow right icon (→) on the right side, white
- **Hover State:**
  - Background: Darker blue `#1E40AF`
  - Border: Same Deep Navy `#1E3A5F`
  - Transform: slight scale (1.02) or subtle lift
  - Transition: 200ms ease
- **Shadow:** Subtle shadow
  - `box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2)`

**CSS Implementation:**
```css
.btn-primary-cta {
  background: #2563EB; /* Electric Blue fill */
  border: 2px solid #1E3A5F; /* Deep Navy border */
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  padding: 14px 24px;
  width: 100%;
  height: 52px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  transition: all 200ms ease;
}

.btn-primary-cta:hover {
  background: #1E40AF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
```

#### **Trust Indicators (Below Button)**
- **Layout:** Horizontal flex, space-between
- **Icons:** 
  - Green checkmark (16px, `#10B981`)
  - Truck icon (16px, gray `#6B7280`)
  - Shield icon (16px, gray `#6B7280`)
- **Text:**
  - Font Size: 12px
  - Color: Gray `#6B7280`
  - Font Weight: 400
  - Content: "Secure checkout • Free shipping on $75+ • 90-day guarantee"
- **Spacing:** 8px between icon and text

---

### **3. SOCIAL PROOF SECTION (Below Price Card)**

#### **Container**
- **Background:** Light Green `#E8F5E9` (or `#ECFDF5`)
- **Border:** 1px solid `#D1FAE5` (slightly darker green)
- **Border Radius:** 12px
- **Padding:** 16px 20px

#### **Star Rating**
- **Stars:** 5 gold stars (filled)
- **Star Color:** Gold `#F59E0B` (bright gold/yellow)
- **Star Size:** 20px x 20px
- **Rating Text:** "4.9/5" - 18px, Deep Navy, 700 weight

#### **Customer Count**
- **Number:** "5,247" - 20px, Deep Navy, 700 weight
- **Label:** "happy customers" - 14px, Deep Navy, 400 weight

#### **Avatar Circles**
- **Layout:** Horizontal overlapping circles
- **Circle Color:** Deep Navy `#2C4A6E` (solid fill)
- **Circle Size:** 40px x 40px
- **Border:** 2px solid white (for separation)
- **Overlap:** -8px margin-left (except first)
- **Count:** 5 circles

#### **Recent Activity Indicator**
- **Icon:** Green checkmark (16px, `#10B981`)
- **Text:** "✅ 127 bottles sold in last 24 hours"
- **Font Size:** 13px
- **Color:** Deep Navy `#2C4A6E`
- **Font Weight:** 500
- **Background:** Slightly darker green (optional)

---

### **4. PRODUCT IMAGE (Right Side)**

#### **Container**
- **Background:** White `#FFFFFF` or very light cream `#FAFAF9`
- **Border Radius:** 16px (rounded)
- **Shadow:** Soft shadow for depth
  - `box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12)`
- **Padding:** 40px (generous padding around bottle)

#### **Bottle Image**
- **Style:** High-quality product photography
- **Background:** Pure white or transparent
- **Lighting:** Soft, professional lighting with subtle shadows
- **Angle:** Straight-on, centered
- **Size:** Large, prominent (fills container)

---

## 🎨 DARK MODE SPECIFICATIONS

### **Background System**
- **Page Background:** Abyssal Navy `#0B1120` (deep, rich navy - NOT black)
- **Gradient:** Subtle gradient (top to bottom)
  - Top: `#0B1120` (abyssal navy)
  - Bottom: `#0F172A` (dark slate)
- **Mood:** "Night Clinic" - premium, sophisticated, clinical in darkness

### **Card Backgrounds**
- **Primary Cards:** Navy Card `#15233E` (lighter than background)
- **Shadow:** Glow effect instead of drop shadow
  - `box-shadow: 0 0 40px rgba(212, 175, 55, 0.15)` (gold glow)

### **Text Colors**
- **Headlines:** White `#FFFFFF` or very light gray `#F8FAFC`
- **Body Text:** Sky Grey `#94A3B8` (softer, easier on eyes)
- **Accent Text:** Luminous Gold `#D4AF37` (brighter gold for visibility)

### **Button Styling (Dark Mode)**
- **Primary CTA:**
  - Background: Electric Blue `#3B82F6` (slightly brighter for dark bg)
  - Border: 2px solid Bright Blue `#60A5FA` (lighter border)
  - Text: White `#FFFFFF`
  - Glow: `box-shadow: 0 0 20px rgba(59, 130, 246, 0.4)`

### **Borders**
- **Default Borders:** White with opacity `rgba(255, 255, 255, 0.12)`
- **Accent Borders:** Luminous Gold `#D4AF37` with opacity

### **Icons & Badges**
- **Gold Icons:** Luminous Gold `#D4AF37` (brighter)
- **Shield/Checkmark:** Gold with subtle glow
- **Certification Badges:** Gold outlines on dark navy

---

## 🔧 IMPLEMENTATION CHECKLIST

### Light Mode
- [ ] Sky blue gradient background (top to bottom)
- [ ] Deep navy text (#2C4A6E)
- [ ] Electric blue CTA buttons with navy border
- [ ] Gold accents for badges/icons only
- [ ] Soft drop shadows on cards
- [ ] White card backgrounds
- [ ] Light pink countdown timer
- [ ] Light green social proof section

### Dark Mode
- [ ] Abyssal navy gradient background
- [ ] White/sky grey text
- [ ] Brighter electric blue CTAs with glow
- [ ] Luminous gold accents
- [ ] Gold glow effects on cards
- [ ] Navy card backgrounds
- [ ] Darker countdown timer (maintain contrast)
- [ ] Darker social proof section (maintain contrast)

### Button Specifications
- [ ] Primary CTA: Electric blue fill + deep navy border
- [ ] Secondary buttons: White fill + navy border + navy text
- [ ] Hover states: Darker shade + subtle lift
- [ ] Arrow icons on right side of CTAs
- [ ] Full width on mobile, auto width on desktop

### Typography
- [ ] Sora font for headlines (bold, 700)
- [ ] Inter font for body (regular, 400)
- [ ] Proper font sizes (56-64px headlines, 18-20px body)
- [ ] Tight line-height for headlines (1.1)
- [ ] Readable line-height for body (1.6)

---

## 📏 SPACING & LAYOUT

### Container Widths
- **Hero Content:** Max 600px
- **Price Card:** Max 380px
- **Product Image:** Max 500px
- **Page Container:** Max 1280px

### Section Padding
- **Desktop:** 80px top/bottom, 40px left/right
- **Mobile:** 40px top/bottom, 20px left/right

### Element Spacing
- **Headline to Body:** 24px
- **Body to Icons:** 32px
- **Card Internal:** 24px padding
- **Button Margin Top:** 20px

---

**Next Step:** Implement these exact specifications in CSS and components.
