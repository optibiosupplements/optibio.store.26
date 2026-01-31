# Laws of UX Implementation Guide for OptiBio Hero Section

## Overview
This document outlines the specific UX laws from Pip Deck that will be applied to create a modern, aesthetic, trustworthy, and premium hero section.

---

## 1. Fitts's Law
**Principle:** The time to acquire a target is a function of the distance to and size of the target.

**Application:**
- Make primary CTA button larger (min 48px height, full width on mobile)
- Position CTA in natural eye-flow path (F-pattern reading)
- Increase touch targets for mobile (min 44x44px)
- Reduce distance between price and CTA button

---

## 2. Hick's Law
**Principle:** The time it takes to make a decision increases with the number and complexity of choices.

**Application:**
- Pre-select the "Best Value" bundle option (3 bottles)
- Limit bundle options to 3 (not 4 or 5)
- Single primary CTA ("Pre-Order Now") vs multiple competing buttons
- Progressive disclosure: show advanced options only when needed

---

## 3. Jakob's Law
**Principle:** Users spend most of their time on other sites, so they expect your site to work the same way.

**Application:**
- Use familiar e-commerce patterns (price on right, CTA below)
- Standard trust badge placement (below price)
- Conventional countdown timer format (HH:MM:SS)
- Expected cart icon placement (top right)

---

## 4. Miller's Law
**Principle:** The average person can only keep 7 (±2) items in working memory.

**Application:**
- Group trust badges into 3 items (not 5+)
- Chunk benefits into scannable groups
- Limit visible information above fold to ~5-7 key elements
- Use visual hierarchy to prioritize information

---

## 5. Peak-End Rule
**Principle:** People judge an experience based on how they felt at its peak and at its end.

**Application:**
- Create "wow moment" with golden glow animation on product
- End hero section with strong guarantee message
- Use satisfying micro-interactions on button hover
- Celebrate bundle selection with visual feedback

---

## 6. Serial Position Effect
**Principle:** Users best remember the first and last items in a series.

**Application:**
- Place most important message first ("Feel calm again")
- End with strongest CTA and guarantee
- Position key trust signals at start and end of trust row
- First and last bundle options should be clearly differentiated

---

## 7. Von Restorff Effect (Isolation Effect)
**Principle:** Items that stand out from their surroundings are more likely to be remembered.

**Application:**
- Make "BEST VALUE" badge visually distinct (gold/amber color)
- Use golden glow to isolate product image
- Highlight savings percentage with contrasting color
- Make countdown timer visually prominent

---

## 8. Aesthetic-Usability Effect
**Principle:** Users often perceive aesthetically pleasing design as more usable.

**Application:**
- Premium typography with proper hierarchy
- Smooth animations and transitions (300ms ease)
- Consistent spacing rhythm (8px grid system)
- High-quality product imagery with professional lighting
- Subtle shadows for depth and dimension

---

## 9. Law of Proximity
**Principle:** Objects near each other are perceived as related.

**Application:**
- Group price + savings + badge together
- Keep trust icons in tight horizontal row
- Position CTA directly below pricing block
- Group social proof elements together

---

## 10. Law of Similarity
**Principle:** Similar elements are perceived as more related than dissimilar elements.

**Application:**
- Consistent styling for all trust badges
- Uniform button styles for bundle options
- Same typography treatment for all prices
- Consistent icon style throughout

---

## 11. Law of Common Region
**Principle:** Elements within a boundary are perceived as a group.

**Application:**
- Use cards/containers for offer section
- Boundary around bundle selector
- Container for social proof section
- Visual separation between hero sections

---

## 12. Zeigarnik Effect
**Principle:** People remember uncompleted tasks better than completed ones.

**Application:**
- Countdown timer creates sense of incompletion
- "Pre-order window closes in..." implies action needed
- Progress indicators for multi-step checkout
- "Limited stock" messaging

---

## Implementation Priority

### High Impact (Implement First)
1. Fitts's Law - Larger, more accessible CTAs
2. Von Restorff Effect - Visual distinction for key elements
3. Aesthetic-Usability Effect - Premium polish throughout
4. Hick's Law - Simplified choices with pre-selection

### Medium Impact
5. Law of Proximity - Proper grouping
6. Serial Position Effect - Strategic placement
7. Peak-End Rule - Memorable interactions

### Supporting
8. Miller's Law - Information chunking
9. Jakob's Law - Familiar patterns
10. Law of Similarity - Consistent styling

---

## Visual Design Enhancements

### Typography Hierarchy
- Hero headline: 56px/64px, weight 800, tracking -0.03em
- Subheadline: 18px, weight 400, line-height 1.6
- Price: 48px, weight 700
- Body: 16px, weight 400

### Spacing System (8px grid)
- Section padding: 64px (8 units)
- Element gaps: 24px (3 units)
- Micro gaps: 8px (1 unit)

### Animation Timing
- Hover transitions: 200ms ease-out
- Entrance animations: 400ms ease-out
- Glow pulse: 3s ease-in-out infinite

### Shadow System
- Subtle: 0 2px 8px rgba(0,0,0,0.08)
- Medium: 0 4px 16px rgba(0,0,0,0.12)
- Elevated: 0 8px 32px rgba(0,0,0,0.16)
- Glow: 0 0 60px rgba(201,169,97,0.4)
