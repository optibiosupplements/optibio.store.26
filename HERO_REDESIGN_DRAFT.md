# Hero Section Redesign - Match Reference Layout

## Reference Analysis (pasted_file_2YqsG0_image.png)

### Layout Structure:
1. **Top Section** (centered):
   - Badge: "Science-Backed • Third-Party Tested"
   - Headline: "Feel Like Yourself Again"
   - Subheadline: Description text
   - Trust badges (3 icons with checkmarks)

2. **Product Card** (single white card, centered, max-width):
   - **Left side**: Blue bottle image (larger, prominent)
   - **Right side**: Purchase details
     - Pre-orders close countdown timer (peach gradient)
     - Price display
     - Quantity selector
     - CTA button (Electric Blue)
     - Trust indicators below button
     - Social proof (rating, customers, sold, stock, viewing)

### Key Differences from Current:
- ❌ Current: Two-column grid (text left, buy box right)
- ✅ Reference: Single column, headline on top, then ONE integrated product card below

### New Structure:
```
<section hero with Sky Gradient background>
  <container>
    <!-- Top: Headline Section (centered) -->
    <div centered, max-w-4xl>
      <Badge>Science-Backed</Badge>
      <h1>Feel Like Yourself Again</h1>
      <p>Description</p>
      <Trust badges row>
    </div>
    
    <!-- Bottom: Integrated Product Card -->
    <Card white background, max-w-6xl, centered, margin-top>
      <div grid 2-columns>
        <!-- Left: Bottle Image -->
        <div>
          <img blue bottle />
        </div>
        
        <!-- Right: Purchase Details -->
        <div>
          <Countdown Timer (peach gradient)/>
          <Price Display/>
          <Quantity Selector/>
          <CTA Button (Electric Blue)/>
          <Trust Indicators/>
          <Social Proof (green gradient cards)/>
        </div>
      </div>
    </Card>
  </container>
</section>
```

## Implementation Plan:
1. Remove two-column grid layout
2. Create centered headline section
3. Create integrated product card component
4. Apply v3 color system
5. Match exact spacing and proportions

