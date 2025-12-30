# GA4 Setup Guide - OptiBio Analytics

## Overview

Your OptiBio website now has **Google Analytics 4 (GA4)** configured with:
- **Measurement ID:** G-BMT4HP6FX1
- **Cookie Consent:** Custom Navy/Gold banner (GDPR/CCPA compliant)
- **Event Tracking:** Mid-page vs Footer CTA comparison
- **Custom Audiences:** For retargeting and analysis

---

## 1. Cookie Consent Banner

### How It Works
- **First Visit:** Navy/Gold banner appears at bottom of viewport
- **Accept All:** GA4 loads + event tracking begins
- **Decline:** No GA4 tracking
- **Persistent:** Choice saved in localStorage (won't show again)

### Design
- **Background:** Deep Navy (#1E3A5F)
- **Top Border:** Antique Gold (#C9A961) - 4px
- **Accept Button:** Gold (#C9A961) with Navy text
- **Decline Button:** Transparent with white border
- **Position:** Fixed bottom, full width

---

## 2. GA4 Event Tracking

### Events Being Tracked

#### Science Page CTAs
1. **click_cta_mid_science**
   - Fires when user clicks "Start The Protocol - $49.99" button
   - Location: After clinical research grid (peak motivation)
   - Category: conversion
   - Page: science_page

2. **click_cta_footer**
   - Fires when user clicks "Shop Now" button in footer
   - Location: Bottom of page
   - Category: conversion
   - Page: science_page

### Event Data Structure
```json
{
  "event_name": "click_cta_mid_science",
  "event_category": "conversion",
  "page_location": "science_page",
  "timestamp": "2024-01-15T14:32:00Z"
}
```

---

## 3. Setting Up Custom Audiences in GA4

### Audience 1: Mid-Page CTA Clickers
**Purpose:** Users who engaged with clinical data and clicked mid-page CTA

**Steps:**
1. Go to **Google Analytics 4 Dashboard**
2. Click **Admin** (bottom left)
3. Select your property
4. Go to **Audiences** (under "Data Collection")
5. Click **Create Audience**
6. Select **Create new audience**
7. Name: `Mid-Page CTA Clickers`
8. Set condition:
   - Event name: `click_cta_mid_science`
   - Condition: Equals
9. Click **Create**

### Audience 2: Footer CTA Clickers
**Purpose:** Users who scrolled to bottom and clicked footer CTA

**Steps:**
1. Repeat steps 1-5 above
2. Name: `Footer CTA Clickers`
3. Set condition:
   - Event name: `click_cta_footer`
   - Condition: Equals
4. Click **Create**

### Audience 3: CTA Converters (Both)
**Purpose:** Users who clicked either CTA

**Steps:**
1. Repeat steps 1-5 above
2. Name: `CTA Converters`
3. Set conditions (use OR logic):
   - Event name: `click_cta_mid_science` OR
   - Event name: `click_cta_footer`
4. Click **Create**

---

## 4. Testing GA4 Tracking

### Real-Time Verification
1. Go to **Google Analytics 4 Dashboard**
2. Click **Realtime** (left sidebar)
3. Visit your Science page: https://optibiosupplements.com/science
4. Accept cookies in banner
5. Click "Start The Protocol - $49.99" button
6. Watch Realtime dashboard - you should see:
   - Event: `click_cta_mid_science`
   - Category: `conversion`
   - Page: `science_page`

### Expected Results
- **Mid-page CTA:** Should fire immediately after clicking
- **Footer CTA:** Should fire when clicking footer button
- **Console Logs:** Check browser console for debug messages

---

## 5. Creating GA4 Dashboard

### Recommended Dashboard Metrics

#### Card 1: CTA Performance
- **Metric 1:** Total Events (click_cta_mid_science)
- **Metric 2:** Total Events (click_cta_footer)
- **Metric 3:** Conversion Rate (CTAs / Page Views)

#### Card 2: Audience Breakdown
- **Dimension:** Audience Name
- **Metric:** Users
- **Breakdown:** Mid-Page Clickers vs Footer Clickers

#### Card 3: Traffic Source
- **Dimension:** Source/Medium
- **Metric:** Users, Sessions, Conversion Rate
- **Filter:** Audience = CTA Converters

#### Card 4: Device Performance
- **Dimension:** Device Category
- **Metric:** Users, Conversion Rate
- **Filter:** Event = click_cta_mid_science OR click_cta_footer

### How to Create Dashboard
1. Go to **Google Analytics 4 Dashboard**
2. Click **Explore** (left sidebar)
3. Click **Create New Exploration**
4. Select **Blank Exploration**
5. Add metrics and dimensions as above
6. Save as dashboard

---

## 6. Retargeting Strategy

### Use Cases

#### Retarget Mid-Page Clickers
- **Audience:** Mid-Page CTA Clickers
- **Message:** "You read the science. Here's why it works..."
- **CTA:** "Complete Your Order"
- **Platform:** Facebook, Google Ads, Instagram

#### Retarget Footer Clickers
- **Audience:** Footer CTA Clickers
- **Message:** "Almost there! Finish your protocol..."
- **CTA:** "Claim Your 90-Day Guarantee"
- **Platform:** Facebook, Google Ads, Instagram

#### Retarget Non-Converters
- **Audience:** Visited Science page but didn't click CTA
- **Message:** "The data doesn't lie. See what 2,847 customers discovered..."
- **CTA:** "View Clinical Studies"
- **Platform:** Facebook, Google Ads, Instagram

---

## 7. Troubleshooting

### GA4 Not Tracking Events
**Problem:** Events not appearing in Realtime

**Solutions:**
1. **Check Cookie Consent:** Did user click "Accept All"?
2. **Check Console:** Open browser DevTools → Console
   - Should see: `trackEvent called: click_cta_mid_science`
3. **Check Network:** Go to Network tab
   - Should see requests to `www.googletagmanager.com`
4. **Wait 24 hours:** GA4 can take time to process events

### Banner Not Showing
**Problem:** Cookie banner doesn't appear

**Solutions:**
1. **Clear localStorage:** Open DevTools → Application → Local Storage → Clear optibio-cookie-consent
2. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check console:** Should see no errors

### GA4 Script Not Loading
**Problem:** GA4 script fails to load

**Solutions:**
1. **Check Measurement ID:** Verify G-BMT4HP6FX1 is correct
2. **Check ad blockers:** Disable ad blockers (they block GA4)
3. **Check network:** Ensure internet connection is working

---

## 8. Privacy & Compliance

### GDPR Compliance
✅ **Cookie Consent Banner** - Users must opt-in
✅ **Anonymize IP** - GA4 configured to anonymize IPs
✅ **No Ad Personalization** - Disabled by default
✅ **User Choice Respected** - Decline option available

### CCPA Compliance
✅ **Opt-in Required** - Users must accept cookies
✅ **Clear Messaging** - Banner explains data use
✅ **Easy Opt-out** - Decline button available
✅ **Data Minimization** - Only essential data collected

---

## 9. Next Steps

1. **Test the banner:** Visit site, accept cookies, verify GA4 loads
2. **Create audiences:** Follow steps in Section 3
3. **Set up dashboard:** Follow steps in Section 5
4. **Monitor for 24 hours:** Let GA4 collect data
5. **Review results:** Check Realtime dashboard for events
6. **Launch retargeting:** Use audiences for ad campaigns

---

## 10. Support

### GA4 Documentation
- [Google Analytics 4 Help](https://support.google.com/analytics/answer/10089681)
- [Event Setup Guide](https://support.google.com/analytics/answer/9322688)
- [Audience Creation](https://support.google.com/analytics/answer/9267572)

### OptiBio Implementation
- **Measurement ID:** G-BMT4HP6FX1
- **Banner Component:** `/client/src/components/CookieConsentBanner.tsx`
- **Event Tracking:** `/client/src/pages/Science.tsx` (lines 417-452)
- **HTML Config:** `/client/index.html` (lines 59-61)

---

## Quick Reference

| Item | Value |
|------|-------|
| Measurement ID | G-BMT4HP6FX1 |
| Banner Type | Custom Navy/Gold |
| Events Tracked | click_cta_mid_science, click_cta_footer |
| Audiences | 3 (Mid-Page, Footer, Both) |
| Compliance | GDPR/CCPA Ready |
| Status | ✅ Live & Testing |

