# OptiBio Complete Redesign Plan

## Reference Design Analysis

Based on the 8 reference images provided, the new design has these characteristics:

### Color Scheme
- **Primary Background**: Light blue-gray (#EBF5FB to #F8FCFE) - very light, airy
- **Card Backgrounds**: White (#FFFFFF) or cream (#F7F4EF)
- **Text**: Dark navy (#1E3A5F) for headings, gray for body
- **Accents**: Navy (#1E3A5F) for CTAs and section breaks
- **Gold**: Minimal use, only for badges/highlights

### Layout Principles
1. **Generous whitespace** - Sections have lots of breathing room
2. **Clean cards** - White cards with subtle shadows, no heavy borders
3. **Simple typography** - Clear hierarchy, not too many font weights
4. **Minimal gradients** - Mostly solid colors
5. **Professional photography** - Clean product shots on light backgrounds

### Homepage Sections (in order)
1. **Hero**: Two columns - left text, right buy box with blue bottle
2. **Benefits**: 4 cards in 2x2 grid with lifestyle images
3. **Guarantee**: Navy section with 3-step process
4. **Why KSM-66**: Light background, 4 numbered points
5. **Timeline**: Light blue tint, 3 white cards (Week 1, 4, 8+)
6. **Wellness Plan**: CTA section
7. **Who This Is For**: Two-column comparison (green checks vs red X)
8. **Product Card**: Horizontal card with image left, details right
9. **Testimonials**: 3 white cards with 5-star ratings
10. **Quality Badges**: 4-column grid
11. **Final CTA**: Navy section
12. **Pricing**: 3-column comparison (Single, 3-month, 6-month)
13. **Footer**: Dark navy

### Other Pages

**Shop Page ("The Protocol")**
- Hero: "STORE" badge, "The Protocol." headline
- Single product card: Image left, details right
- Trust badges at bottom

**Product Detail**
- Breadcrumbs
- Two columns: Gallery left, buy box right
- Tabs: Description, Ingredients, Clinical Studies, Reviews
- Trust badges at bottom

**Cart**
- Light blue background
- White card for cart items
- Order summary card on right
- Trust badges at bottom

**About Page**
- "Redefining Wellness Through Science" hero
- 3-card mission/vision/promise section
- Story section with text
- Why KSM-66 section
- Quality standards grid
- Team section
- Final CTA

**Science Page**
- "The Science Behind KSM-66" hero
- Stats grid (20+ studies, 1000+ participants, etc.)
- KSM-66 vs Generic comparison
- Clinical outcomes with percentages
- CTA section
- Benefits grid
- Safety section
- References list

**FAQ Page**
- "How Can We Help?" hero
- Accordion sections by category
- Email support CTA at bottom

## Implementation Strategy

### Phase 1: Global Theme Updates
- [ ] Update index.css color variables for light theme
- [ ] Ensure ThemeProvider defaults to light
- [ ] Remove dark navy backgrounds from light mode
- [ ] Update text colors for better contrast

### Phase 2: Homepage Redesign
- [ ] Hero: Simplify layout, ensure two-column works
- [ ] Benefits: Clean white cards with better spacing
- [ ] Guarantee: Keep navy but simplify
- [ ] Timeline: Light blue background, white cards
- [ ] Testimonials: Clean white cards
- [ ] Product card: Horizontal layout
- [ ] Pricing: Clean comparison table

### Phase 3: Other Pages
- [ ] Shop: Match "The Protocol" layout
- [ ] Product Detail: Clean two-column
- [ ] Cart: Light background, white cards
- [ ] About: Match reference sections
- [ ] Science: Clinical layout with stats
- [ ] FAQ: Clean accordion

### Phase 4: Final Polish
- [ ] Remove all old product images
- [ ] Test all pages in light mode
- [ ] Verify mobile responsiveness
- [ ] Check all CTAs and links
- [ ] Create checkpoint

## Key Design Decisions

1. **Default to light theme** - Reference design is clearly light-first
2. **Navy as accent only** - Not primary background
3. **Generous spacing** - Don't pack content tightly
4. **Clean cards** - White with subtle shadows
5. **Professional tone** - Less "hype", more credible

## Current Status

✅ Blue bottle images updated across all pages
⏳ Now working on: Homepage layout and styling
