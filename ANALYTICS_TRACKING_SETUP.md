# 📊 Analytics & Tracking Setup Guide

**Status**: ✅ Code Installed (Awaiting IDs)  
**Impact**: Enable retargeting, conversion tracking, and detailed user behavior analysis

---

## 🎯 Overview

Three tracking systems are now installed on the OptiBio website:

1. **Facebook Pixel** - Retargeting ads and conversion tracking
2. **Google Analytics 4** - User behavior analysis and conversion funnels
3. **Umami Analytics** - Privacy-focused analytics (already active)

---

## 📋 Setup Checklist

### 1. Facebook Pixel Setup

#### Create Facebook Pixel

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click "Connect Data Sources" → "Web"
3. Select "Facebook Pixel" → Click "Connect"
4. Name your pixel: "OptiBio Website"
5. Enter website URL: `https://optibiosupplements.com`
6. Copy your **Pixel ID** (format: `1234567890123456`)

#### Install Pixel ID

1. Open `client/index.html`
2. Find line 52: `fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');`
3. Replace `YOUR_FACEBOOK_PIXEL_ID` with your actual Pixel ID
4. Find line 84: `src="https://www.facebook.com/tr?id=YOUR_FACEBOOK_PIXEL_ID&...`
5. Replace `YOUR_FACEBOOK_PIXEL_ID` with your actual Pixel ID

#### Test Pixel

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit your website
3. Click the extension icon
4. Verify "PageView" event is firing
5. Check for any errors

---

### 2. Google Analytics 4 Setup

#### Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (bottom left)
3. Click "Create Property"
4. Property name: "OptiBio"
5. Select timezone and currency
6. Click "Next" → "Create"
7. Select "Web" as platform
8. Enter website URL: `https://optibiosupplements.com`
9. Stream name: "OptiBio Website"
10. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

#### Install Measurement ID

1. Open `client/index.html`
2. Find line 58: `src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"`
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID
4. Find line 63: `gtag('config', 'G-XXXXXXXXXX');`
5. Replace `G-XXXXXXXXXX` with your actual Measurement ID

#### Test GA4

1. Visit your website
2. In GA4, go to "Reports" → "Realtime"
3. Verify you see your visit in real-time
4. Check "Event count by Event name" - should see `page_view`

---

## 🎯 Event Tracking Implementation

### Facebook Pixel Events

Add these events to key pages/actions:

#### Product Page View
```javascript
// In ProductDetail.tsx, add to useEffect
if (window.fbq) {
  window.fbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.priceInCents / 100,
    currency: 'USD'
  });
}
```

#### Add to Cart
```javascript
// In cart add function
if (window.fbq) {
  window.fbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.priceInCents / 100,
    currency: 'USD'
  });
}
```

#### Initiate Checkout
```javascript
// In checkout page
if (window.fbq) {
  window.fbq('track', 'InitiateCheckout', {
    content_ids: cartItems.map(item => item.productId),
    contents: cartItems.map(item => ({
      id: item.productId,
      quantity: item.quantity
    })),
    value: totalValue / 100,
    currency: 'USD'
  });
}
```

#### Purchase
```javascript
// In order confirmation page
if (window.fbq) {
  window.fbq('track', 'Purchase', {
    value: order.totalInCents / 100,
    currency: 'USD',
    content_ids: order.items.map(item => item.productId),
    content_type: 'product'
  });
}
```

### Google Analytics 4 Events

#### Product View
```javascript
// In ProductDetail.tsx
if (window.gtag) {
  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: product.priceInCents / 100,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: 'Supplements',
      item_brand: 'OptiBio',
      price: product.priceInCents / 100
    }]
  });
}
```

#### Add to Cart
```javascript
if (window.gtag) {
  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: product.priceInCents / 100,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: 'Supplements',
      item_brand: 'OptiBio',
      price: product.priceInCents / 100,
      quantity: quantity
    }]
  });
}
```

#### Begin Checkout
```javascript
if (window.gtag) {
  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: totalValue / 100,
    items: cartItems.map(item => ({
      item_id: item.productId,
      item_name: item.productName,
      item_category: 'Supplements',
      item_brand: 'OptiBio',
      price: item.priceInCents / 100,
      quantity: item.quantity
    }))
  });
}
```

#### Purchase
```javascript
if (window.gtag) {
  window.gtag('event', 'purchase', {
    transaction_id: order.id,
    value: order.totalInCents / 100,
    currency: 'USD',
    tax: 0,
    shipping: order.shippingCost / 100,
    items: order.items.map(item => ({
      item_id: item.productId,
      item_name: item.productName,
      item_category: 'Supplements',
      item_brand: 'OptiBio',
      price: item.priceInCents / 100,
      quantity: item.quantity
    }))
  });
}
```

---

## 🔧 TypeScript Declarations

Add to `client/src/vite-env.d.ts`:

```typescript
interface Window {
  fbq?: (action: string, event: string, params?: Record<string, any>) => void;
  gtag?: (command: string, ...args: any[]) => void;
  dataLayer?: any[];
}
```

---

## 📈 Key Metrics to Track

### Facebook Ads Manager

1. **Conversion Tracking**
   - Set up "Purchase" as conversion event
   - Assign value to conversions
   - Track ROAS (Return on Ad Spend)

2. **Custom Audiences**
   - Website visitors (last 30 days)
   - Product page viewers
   - Add to cart (but didn't purchase)
   - Past purchasers

3. **Lookalike Audiences**
   - Based on purchasers
   - Based on high-value customers ($100+)

### Google Analytics 4

1. **Conversion Events**
   - Mark "purchase" as key event
   - Set up conversion value
   - Track subscription sign-ups

2. **Funnels**
   - Homepage → Product Page → Add to Cart → Checkout → Purchase
   - Identify drop-off points

3. **User Behavior**
   - Average session duration
   - Pages per session
   - Bounce rate
   - User demographics

4. **E-commerce Reports**
   - Revenue by product
   - Revenue by source/medium
   - Average order value
   - Purchase frequency

---

## 🎯 Retargeting Strategy

### Facebook Retargeting Campaigns

#### Campaign 1: Cart Abandoners
- **Audience**: Added to cart but didn't purchase (last 7 days)
- **Ad**: Show product they abandoned + 5% discount
- **Budget**: $10/day
- **Expected ROAS**: 3-5x

#### Campaign 2: Product Viewers
- **Audience**: Viewed product page but didn't add to cart (last 14 days)
- **Ad**: Social proof + benefits + testimonials
- **Budget**: $5/day
- **Expected ROAS**: 2-3x

#### Campaign 3: Past Purchasers
- **Audience**: Purchased 30-60 days ago
- **Ad**: Reorder reminder + subscription offer
- **Budget**: $5/day
- **Expected ROAS**: 4-6x

### Google Ads Retargeting

#### Campaign 1: Display Retargeting
- **Audience**: Website visitors (last 30 days)
- **Ad Format**: Responsive display ads
- **Budget**: $10/day
- **Placement**: Google Display Network

#### Campaign 2: YouTube Retargeting
- **Audience**: Product page viewers
- **Ad Format**: 15-second video ads
- **Budget**: $5/day
- **Focus**: Brand awareness + benefits

---

## 📊 Conversion Tracking Setup

### Facebook Conversions API (Advanced)

For more accurate tracking (bypasses ad blockers):

1. In Facebook Events Manager, click "Settings"
2. Click "Conversions API" → "Set Up"
3. Choose "Partner Integration" → Select your platform
4. Follow setup instructions
5. Verify events are being received

### Google Ads Conversion Tracking

1. In Google Ads, click "Tools & Settings"
2. Click "Conversions" under "Measurement"
3. Click "+" to create new conversion action
4. Select "Website"
5. Category: "Purchase"
6. Value: Use transaction-specific value
7. Copy conversion ID and label
8. Add to order confirmation page:

```javascript
if (window.gtag) {
  window.gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXX',
    'value': order.totalInCents / 100,
    'currency': 'USD',
    'transaction_id': order.id
  });
}
```

---

## 🔒 Privacy & Compliance

### GDPR Compliance

1. **Cookie Consent Banner** (Required for EU visitors)
   - Install cookie consent library
   - Only load tracking scripts after consent
   - Provide opt-out mechanism

2. **Privacy Policy Update**
   - Add section on tracking technologies
   - Explain what data is collected
   - Link to Facebook and Google privacy policies

### Example Cookie Consent

```javascript
// Wait for consent before initializing tracking
window.addEventListener('cookieConsent', (event) => {
  if (event.detail.analytics) {
    // Initialize GA4
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }
  
  if (event.detail.marketing) {
    // Initialize Facebook Pixel
    fbq('consent', 'grant');
  }
});
```

---

## 🧪 Testing Checklist

### Facebook Pixel Testing

- [ ] Install Facebook Pixel Helper extension
- [ ] Visit homepage - verify PageView fires
- [ ] Visit product page - verify ViewContent fires
- [ ] Add to cart - verify AddToCart fires
- [ ] Go to checkout - verify InitiateCheckout fires
- [ ] Complete test purchase - verify Purchase fires
- [ ] Check Events Manager for all events

### Google Analytics 4 Testing

- [ ] Visit website
- [ ] Open GA4 Realtime report
- [ ] Verify your visit appears
- [ ] Navigate to product page - check view_item event
- [ ] Add to cart - check add_to_cart event
- [ ] Go to checkout - check begin_checkout event
- [ ] Complete test purchase - check purchase event
- [ ] Verify transaction appears in Realtime → Conversions

---

## 📞 Troubleshooting

### Facebook Pixel Not Firing

1. Check browser console for errors
2. Verify Pixel ID is correct
3. Check ad blockers are disabled
4. Use Facebook Pixel Helper to diagnose
5. Check Events Manager for errors

### Google Analytics Not Tracking

1. Check Measurement ID is correct
2. Verify gtag.js script is loading
3. Check browser console for errors
4. Use GA Debugger extension
5. Check Realtime report (data can take 24-48 hours for full reports)

### Common Issues

**Issue**: Events not showing in Facebook Events Manager  
**Solution**: Wait 20 minutes for data to process, check Pixel Helper for errors

**Issue**: GA4 showing 0 users  
**Solution**: Check Measurement ID, verify script is loading, disable ad blockers

**Issue**: Duplicate events firing  
**Solution**: Check for multiple tracking scripts, ensure events only fire once per action

---

## 📈 Expected Results

### Month 1
- Establish baseline metrics
- Set up conversion tracking
- Create initial retargeting audiences
- Test different ad creatives

### Month 2-3
- Optimize retargeting campaigns
- Achieve 3-5x ROAS on cart abandonment ads
- Build lookalike audiences
- Scale winning campaigns

### Month 4+
- Expand to cold traffic campaigns
- Test new ad formats (video, carousel)
- Implement advanced attribution
- Optimize for lifetime value

---

## 💰 ROI Projections

### Retargeting Campaigns

**Assumptions**:
- 1,000 website visitors/month
- 60% view product page (600)
- 30% add to cart (180)
- 5% purchase without retargeting (9)
- 15% purchase with retargeting (27)
- Average order value: $70

**Results**:
- Additional orders: 18/month
- Additional revenue: $1,260/month
- Ad spend: $600/month ($20/day)
- ROAS: 2.1x
- Net profit: $660/month (assuming 50% margin)

**Annual Impact**: $7,920 additional profit

---

## 🚀 Next Steps

1. **Immediate** (This Week)
   - [ ] Create Facebook Pixel
   - [ ] Create GA4 property
   - [ ] Install tracking IDs in code
   - [ ] Test all events
   - [ ] Verify data in dashboards

2. **Short-term** (This Month)
   - [ ] Set up conversion tracking
   - [ ] Create custom audiences
   - [ ] Launch first retargeting campaign
   - [ ] Set up e-commerce reports

3. **Long-term** (Next 3 Months)
   - [ ] Implement Conversions API
   - [ ] Build lookalike audiences
   - [ ] Scale retargeting campaigns
   - [ ] Add cookie consent banner
   - [ ] Optimize based on data

---

**Last Updated**: December 26, 2024  
**Implementation Status**: ✅ Scripts Installed (Awaiting IDs)  
**Next Action**: Create Facebook Pixel and GA4 property, install IDs
