# GA4 Dashboard Testing & Verification Guide

## Overview

This guide walks you through creating a GA4 dashboard to monitor OptiBio's CTA performance and verifying that event tracking is working correctly.

---

## Part 1: Real-Time Verification (Immediate)

### Step 1: Access GA4 Realtime Dashboard

1. Go to: https://analytics.google.com
2. Select your OptiBio property
3. Click **Realtime** (left sidebar)
4. You should see live user activity

### Step 2: Test Event Tracking

1. **Open your OptiBio website** in a new tab: https://optibiosupplements.com
2. **Accept cookies** in the Navy/Gold banner at bottom
3. **Navigate to Science page**: https://optibiosupplements.com/science
4. **Scroll down** to find the mid-page CTA button "Start The Protocol - $49.99"
5. **Click the button** (don't complete checkout)
6. **Return to GA4 Realtime tab**

### Step 3: Verify Event Fired

**Expected Results:**
- You should see your session appear in Realtime
- Look for event: `click_cta_mid_science`
- Event details should show:
  - Event name: `click_cta_mid_science`
  - Category: `conversion`
  - Page: `science_page`

**If you see the event:** ✅ GA4 is tracking correctly!  
**If you don't see it:** Check troubleshooting section below

### Step 4: Test Footer CTA

1. **Scroll to bottom** of Science page
2. **Click "Shop Now"** button in footer
3. **Return to GA4 Realtime tab**

**Expected Results:**
- Event: `click_cta_footer` should appear
- Category: `conversion`
- Page: `science_page`

---

## Part 2: Creating GA4 Dashboard

### Dashboard Overview

Your GA4 dashboard will display 5 key cards:

**Card 1:** CTA Performance Summary  
**Card 2:** Mid-Page vs Footer Comparison  
**Card 3:** Traffic Source Breakdown  
**Card 4:** Device Performance  
**Card 5:** Conversion Funnel  

### Step-by-Step Dashboard Creation

#### Step 1: Create New Exploration

1. Go to: https://analytics.google.com
2. Select your OptiBio property
3. Click **Explore** (left sidebar)
4. Click **Create New Exploration**
5. Select **Blank Exploration**

#### Step 2: Configure Card 1 - CTA Performance Summary

**Purpose:** Show total CTA clicks and conversion rate

1. **Set Dimensions:**
   - Click **Dimensions** (left panel)
   - Add: `Event Name`

2. **Set Metrics:**
   - Click **Metrics** (left panel)
   - Add: `Event Count`
   - Add: `Users`

3. **Filter for CTAs:**
   - Click **Filters** (left panel)
   - Add filter: Event name = `click_cta_mid_science` OR `click_cta_footer`

4. **Visualize:**
   - Choose visualization: **Table**
   - Rows: Event Name
   - Values: Event Count, Users

5. **Save:**
   - Click **Save** (top right)
   - Name: `CTA Performance Summary`

#### Step 3: Configure Card 2 - Mid-Page vs Footer Comparison

**Purpose:** Compare performance of two CTAs

1. **Create new exploration**
2. **Set Dimensions:**
   - Add: `Event Name`

3. **Set Metrics:**
   - Add: `Event Count`
   - Add: `Conversion Rate`
   - Add: `Average Session Duration`

4. **Filter:**
   - Event name = `click_cta_mid_science` OR `click_cta_footer`

5. **Visualize:**
   - Choose: **Scorecard** or **Table**
   - Show side-by-side comparison

6. **Save:**
   - Name: `Mid-Page vs Footer CTA Comparison`

#### Step 4: Configure Card 3 - Traffic Source Breakdown

**Purpose:** See which traffic sources drive CTA clicks

1. **Create new exploration**
2. **Set Dimensions:**
   - Add: `Source / Medium`

3. **Set Metrics:**
   - Add: `Users`
   - Add: `Event Count` (for CTAs)
   - Add: `Conversion Rate`

4. **Filter:**
   - Event name = `click_cta_mid_science` OR `click_cta_footer`

5. **Visualize:**
   - Choose: **Table** or **Bar Chart**
   - Sort by: Event Count (descending)

6. **Save:**
   - Name: `Traffic Source CTA Performance`

#### Step 5: Configure Card 4 - Device Performance

**Purpose:** See if mobile or desktop drives more CTAs

1. **Create new exploration**
2. **Set Dimensions:**
   - Add: `Device Category`

3. **Set Metrics:**
   - Add: `Users`
   - Add: `Event Count`
   - Add: `Conversion Rate`

4. **Filter:**
   - Event name = `click_cta_mid_science` OR `click_cta_footer`

5. **Visualize:**
   - Choose: **Pie Chart** or **Table**

6. **Save:**
   - Name: `Device Performance - CTA Clicks`

#### Step 6: Configure Card 5 - Conversion Funnel

**Purpose:** See the journey from Science page to CTA click

1. **Create new exploration**
2. **Set Dimensions:**
   - Add: `Page Title`

3. **Set Metrics:**
   - Add: `Users`
   - Add: `Event Count`

4. **No filter** (show all page views)

5. **Visualize:**
   - Choose: **Funnel Exploration**
   - Step 1: Page = `/science`
   - Step 2: Event = `click_cta_mid_science` OR `click_cta_footer`

6. **Save:**
   - Name: `Science Page to CTA Conversion Funnel`

---

## Part 3: Creating Looker Studio Dashboard (Optional)

### Why Looker Studio?

Looker Studio is Google's free dashboard tool that connects to GA4 and creates beautiful, shareable reports.

### Step-by-Step Looker Studio Setup

#### Step 1: Create New Report

1. Go to: https://lookerstudio.google.com
2. Click **Create** (top left)
3. Select **Blank Report**
4. Name: `OptiBio - CTA Performance Dashboard`

#### Step 2: Connect GA4 Data Source

1. Click **Data** (top left)
2. Click **Create New Data Source**
3. Select **Google Analytics 4**
4. Select your OptiBio property
5. Click **Create**

#### Step 3: Add Scorecard - Total CTA Clicks

1. Click **Insert** (top menu)
2. Select **Scorecard**
3. Drag to canvas
4. **Metric:** Event Count
5. **Filter:** Event name = `click_cta_mid_science` OR `click_cta_footer`
6. **Title:** "Total CTA Clicks"

#### Step 4: Add Table - CTA Breakdown

1. Click **Insert** → **Table**
2. **Dimensions:** Event Name
3. **Metrics:** Event Count, Users
4. **Filter:** Event name = `click_cta_mid_science` OR `click_cta_footer`
5. **Title:** "CTA Performance Breakdown"

#### Step 5: Add Chart - Clicks Over Time

1. Click **Insert** → **Time Series Chart**
2. **Dimension:** Date
3. **Metric:** Event Count
4. **Filter:** Event name = `click_cta_mid_science` OR `click_cta_footer`
5. **Title:** "CTA Clicks Over Time"

#### Step 6: Add Chart - Device Breakdown

1. Click **Insert** → **Pie Chart**
2. **Dimension:** Device Category
3. **Metric:** Event Count
4. **Filter:** Event name = `click_cta_mid_science` OR `click_cta_footer`
5. **Title:** "CTA Clicks by Device"

#### Step 7: Customize & Share

1. **Add title:** "OptiBio - CTA Performance Dashboard"
2. **Add date range:** Last 30 days
3. **Style:** Use OptiBio colors (Navy #1E3A5F, Gold #C9A961)
4. **Share:** Click **Share** (top right) → Make shareable link

---

## Part 4: Troubleshooting

### Issue 1: No Events Appearing in Realtime

**Symptoms:**
- GA4 Realtime shows 0 events
- No `click_cta_mid_science` events firing

**Diagnosis:**
1. **Check cookie consent:** Did you click "Accept All"?
2. **Check console:** Open DevTools → Console
   - Should see: `GA4 loaded successfully`
   - If not: Cookie consent not working

3. **Check network:** Go to Network tab
   - Should see requests to `www.googletagmanager.com`
   - If not: GA4 script not loading

**Solutions:**
1. **Clear localStorage:** 
   - Open DevTools → Application → Local Storage
   - Delete `optibio-cookie-consent`
   - Hard refresh (Ctrl+Shift+R)

2. **Check Measurement ID:**
   - Verify: G-BMT4HP6FX1 is correct
   - Check in GA4 Admin → Data Streams

3. **Disable ad blockers:**
   - Ad blockers can block GA4
   - Try in incognito mode

4. **Wait 24 hours:**
   - GA4 can take time to process events
   - Check again tomorrow

### Issue 2: Events Firing But Dashboard Shows 0

**Symptoms:**
- Realtime shows events
- Dashboard/Exploration shows 0 events

**Diagnosis:**
1. **Check filters:** Are filters too restrictive?
2. **Check date range:** Is report looking at correct dates?
3. **Check event name:** Is spelling exactly correct? (case-sensitive)

**Solutions:**
1. **Remove filters:** Start with no filters
2. **Expand date range:** Try last 7 days
3. **Check event name spelling:** Must be exact match

### Issue 3: Audience Size is 0

**Symptoms:**
- Created audience but no users
- Audience size shows 0 after 24 hours

**Diagnosis:**
1. **Check events are firing:** Use Realtime to verify
2. **Check audience conditions:** Are they correct?
3. **Check membership duration:** Is it set correctly?

**Solutions:**
1. **Verify events first:** Make sure events are firing in Realtime
2. **Check audience conditions:** Event name must match exactly
3. **Wait longer:** GA4 can take 48 hours to populate

### Issue 4: Dashboard Metrics Don't Match

**Symptoms:**
- Realtime shows 10 events
- Dashboard shows 5 events

**Diagnosis:**
1. **Check filters:** Dashboard filters might exclude some events
2. **Check date range:** Dashboard might be looking at different time period
3. **Check time zone:** GA4 uses UTC by default

**Solutions:**
1. **Remove all filters:** See if numbers match
2. **Check date range:** Use "Today" to match Realtime
3. **Check time zone:** Set to your local time zone

---

## Part 5: Monitoring Checklist

### Daily Monitoring

- [ ] Check GA4 Realtime for events
- [ ] Verify at least 1 CTA click per day
- [ ] Monitor audience sizes
- [ ] Check for errors in console

### Weekly Monitoring

- [ ] Review CTA Performance Summary
- [ ] Compare Mid-Page vs Footer performance
- [ ] Analyze traffic source breakdown
- [ ] Check device performance
- [ ] Review conversion funnel

### Monthly Monitoring

- [ ] Generate Looker Studio report
- [ ] Compare to previous month
- [ ] Identify top traffic sources
- [ ] Optimize underperforming CTAs
- [ ] Plan next month's campaigns

---

## Part 6: Key Metrics to Track

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Daily CTA Clicks | 10-20 | — | — |
| Mid-Page CTR | 2-4% | — | — |
| Footer CTR | 0.5-1% | — | — |
| Mobile Conversion | 60%+ | — | — |
| Organic Traffic CTR | 3-5% | — | — |
| Paid Traffic CTR | 4-6% | — | — |

---

## Part 7: Next Steps

1. ✅ Test event tracking in Realtime (5 minutes)
2. ✅ Create GA4 Explorations (15 minutes)
3. ✅ Create Looker Studio dashboard (20 minutes)
4. ✅ Monitor for 24 hours (passive)
5. ✅ Review results and optimize (30 minutes)
6. ✅ Set up automated reports (email weekly)

---

## Support & Resources

- **GA4 Realtime Help:** https://support.google.com/analytics/answer/9271265
- **GA4 Explorations:** https://support.google.com/analytics/answer/9579450
- **Looker Studio Help:** https://support.google.com/looker-studio
- **Event Tracking Guide:** https://support.google.com/analytics/answer/9322688

