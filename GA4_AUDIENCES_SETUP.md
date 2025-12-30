# GA4 Custom Audiences Setup - OptiBio

## Overview

This guide walks you through creating 3 custom audiences in Google Analytics 4 to track and retarget users based on their CTA engagement on the Science page.

---

## Prerequisites

✅ GA4 Property created: **G-BMT4HP6FX1**  
✅ Cookie consent banner live (users accepting cookies)  
✅ Event tracking active (click_cta_mid_science, click_cta_footer)  
✅ GA4 script loading on user acceptance  

---

## Audience 1: Mid-Page CTA Clickers

**Purpose:** Users who engaged deeply with clinical research and clicked the mid-page CTA  
**Use Case:** Retarget with "Complete Your Order" messaging  
**Expected Size:** 40-60% of CTA clickers (high-intent users)

### Step-by-Step Setup

1. **Open GA4 Admin Panel**
   - Go to: https://analytics.google.com
   - Select your OptiBio property
   - Click **Admin** (bottom left)

2. **Navigate to Audiences**
   - In the left sidebar, under "Data Collection", click **Audiences**

3. **Create New Audience**
   - Click **Create Audience** (blue button)
   - Select **Create new audience**

4. **Configure Audience**
   - **Name:** `Mid-Page CTA Clickers`
   - **Description:** Users who clicked "Start The Protocol" button after viewing clinical data
   - **Audience Source:** Google Analytics 4 property

5. **Set Conditions**
   - Click **Add condition**
   - **Condition Type:** Event
   - **Event name:** `click_cta_mid_science`
   - **Operator:** Equals
   - **Value:** (leave empty - just match the event name)

6. **Set Membership Duration**
   - **Membership duration:** 30 days (default)
   - This means users stay in the audience for 30 days after the event

7. **Review & Create**
   - Click **Create audience**
   - Wait 24-48 hours for audience to populate

### Verification
- Check audience size after 24 hours
- Expected: 5-15 users per day (depending on traffic)
- If 0 users: Check that GA4 script is loading and events are firing

---

## Audience 2: Footer CTA Clickers

**Purpose:** Users who scrolled to bottom and clicked footer CTA  
**Use Case:** Retarget with "Almost There" messaging  
**Expected Size:** 20-40% of CTA clickers (lower-intent users)

### Step-by-Step Setup

1. **Open GA4 Admin Panel**
   - Go to: https://analytics.google.com
   - Select your OptiBio property
   - Click **Admin** (bottom left)

2. **Navigate to Audiences**
   - In the left sidebar, under "Data Collection", click **Audiences**

3. **Create New Audience**
   - Click **Create Audience** (blue button)
   - Select **Create new audience**

4. **Configure Audience**
   - **Name:** `Footer CTA Clickers`
   - **Description:** Users who clicked "Shop Now" button in footer
   - **Audience Source:** Google Analytics 4 property

5. **Set Conditions**
   - Click **Add condition**
   - **Condition Type:** Event
   - **Event name:** `click_cta_footer`
   - **Operator:** Equals
   - **Value:** (leave empty)

6. **Set Membership Duration**
   - **Membership duration:** 30 days (default)

7. **Review & Create**
   - Click **Create audience**
   - Wait 24-48 hours for audience to populate

### Verification
- Check audience size after 24 hours
- Expected: 2-8 users per day (typically smaller than mid-page)
- If 0 users: Verify footer CTA is firing events

---

## Audience 3: All CTA Clickers (Combined)

**Purpose:** Users who clicked ANY CTA (mid-page OR footer)  
**Use Case:** Retarget all engaged users with general messaging  
**Expected Size:** 60-100% of CTA clickers (all engaged users)

### Step-by-Step Setup

1. **Open GA4 Admin Panel**
   - Go to: https://analytics.google.com
   - Select your OptiBio property
   - Click **Admin** (bottom left)

2. **Navigate to Audiences**
   - In the left sidebar, under "Data Collection", click **Audiences**

3. **Create New Audience**
   - Click **Create Audience** (blue button)
   - Select **Create new audience**

4. **Configure Audience**
   - **Name:** `All CTA Clickers`
   - **Description:** Users who clicked either mid-page or footer CTA
   - **Audience Source:** Google Analytics 4 property

5. **Set Conditions (OR Logic)**
   - Click **Add condition**
   - **Condition Type:** Event
   - **Event name:** `click_cta_mid_science`
   - **Operator:** Equals
   
   - Click **Add another condition** (select OR)
   - **Condition Type:** Event
   - **Event name:** `click_cta_footer`
   - **Operator:** Equals

6. **Set Membership Duration**
   - **Membership duration:** 30 days (default)

7. **Review & Create**
   - Click **Create audience**
   - Wait 24-48 hours for audience to populate

### Verification
- Check audience size after 24 hours
- Expected: Size should be roughly equal to Mid-Page + Footer combined
- If 0 users: Check that both events are firing

---

## Audience 4: Science Page Visitors (Optional)

**Purpose:** All users who visited the Science page  
**Use Case:** Retarget non-converters with educational messaging  
**Expected Size:** 100% of Science page traffic

### Step-by-Step Setup

1. **Open GA4 Admin Panel**
   - Go to: https://analytics.google.com
   - Select your OptiBio property
   - Click **Admin** (bottom left)

2. **Navigate to Audiences**
   - In the left sidebar, under "Data Collection", click **Audiences**

3. **Create New Audience**
   - Click **Create Audience** (blue button)
   - Select **Create new audience**

4. **Configure Audience**
   - **Name:** `Science Page Visitors`
   - **Description:** All users who visited the Science page
   - **Audience Source:** Google Analytics 4 property

5. **Set Conditions**
   - Click **Add condition**
   - **Condition Type:** Page path and screen class
   - **Page path and screen class:** `/science`
   - **Operator:** Equals
   - **Value:** `/science`

6. **Set Membership Duration**
   - **Membership duration:** 30 days (default)

7. **Review & Create**
   - Click **Create audience**
   - Wait 24-48 hours for audience to populate

---

## Using Audiences for Retargeting

### Facebook Ads Retargeting

1. **Connect GA4 to Facebook**
   - Go to Facebook Ads Manager
   - Settings → Data Sources → Google Analytics
   - Authorize GA4 connection

2. **Create Custom Audience**
   - Audiences → Create Audience → Custom Audience
   - Select "Google Analytics" as source
   - Choose audience: `Mid-Page CTA Clickers`
   - Create audience

3. **Create Campaign**
   - Create new campaign with objective: Conversions
   - Audience: Custom Audience (Mid-Page CTA Clickers)
   - Ad copy: "Complete Your Order - 90-Day Guarantee"
   - Budget: $500/week

### Google Ads Retargeting

1. **Connect GA4 to Google Ads**
   - Google Ads → Tools → Conversions → Google Analytics 4
   - Authorize GA4 connection

2. **Create Audience**
   - Audiences → New audience → GA4 audience
   - Select: `Mid-Page CTA Clickers`
   - Create audience

3. **Create Campaign**
   - Create new campaign with goal: Conversions
   - Audience: GA4 audience (Mid-Page CTA Clickers)
   - Ad copy: "The Data Doesn't Lie - Complete Your Protocol"
   - Budget: $300/week

---

## Monitoring Audience Performance

### View Audience Metrics

1. **Go to Audiences Report**
   - Analytics → Reports → Audiences
   - Select audience: `Mid-Page CTA Clickers`

2. **Key Metrics to Monitor**
   - **Audience Size:** How many users in audience
   - **Conversion Rate:** % who converted after joining audience
   - **Average Session Duration:** How engaged are they
   - **Bounce Rate:** Are they interested in content

3. **Compare Audiences**
   - Mid-Page Clickers vs Footer Clickers
   - Which converts better?
   - Which has higher engagement?

### Create Comparison Report

1. **Explore → Blank Exploration**
2. **Dimensions:** Audience Name
3. **Metrics:** 
   - Users
   - Conversion Rate
   - Average Session Duration
   - Bounce Rate
4. **Filter:** Event = click_cta_mid_science OR click_cta_footer
5. **Save as Report**

---

## Troubleshooting

### Audience Size is 0

**Problem:** No users in audience after 24 hours

**Solutions:**
1. **Check GA4 is tracking events**
   - Go to Realtime → Events
   - Visit Science page, click CTA
   - Should see event fire in Realtime

2. **Check event name spelling**
   - Audience uses: `click_cta_mid_science`
   - Event must match exactly (case-sensitive)

3. **Check GA4 script is loading**
   - Open DevTools → Console
   - Should see: `GA4 loaded successfully`
   - If not: Check cookie consent is being accepted

4. **Wait longer**
   - GA4 can take 24-48 hours to populate audiences
   - Check again tomorrow

### Audience Size is Too Large

**Problem:** Audience has more users than expected

**Solutions:**
1. **Check audience conditions**
   - Verify event name is correct
   - Make sure you're not capturing unrelated events

2. **Check membership duration**
   - Default is 30 days
   - Reduce to 7 days if audience is too large

3. **Add additional conditions**
   - Combine with page path: `/science`
   - Combine with device category: `mobile`

---

## Best Practices

### Audience Naming Convention
- ✅ `Mid-Page CTA Clickers` (clear, specific)
- ❌ `Audience 1` (vague)
- ❌ `CTA` (too generic)

### Audience Membership Duration
- **Retargeting:** 30 days (standard)
- **Short-term:** 7 days (urgent messaging)
- **Long-term:** 90 days (nurture campaigns)

### Audience Size Targets
- **Minimum:** 100 users (for reliable data)
- **Optimal:** 500-5,000 users (good retargeting size)
- **Maximum:** 50,000+ users (very broad audience)

### Audience Combination
- Use AND logic for narrow audiences (high-intent)
- Use OR logic for broad audiences (awareness)
- Example: (Mid-Page CTA) AND (Mobile) = high-intent mobile users

---

## Next Steps

1. ✅ Create all 4 audiences (Mid-Page, Footer, All CTAs, Science Visitors)
2. ✅ Wait 24-48 hours for data to populate
3. ✅ Monitor audience sizes and metrics
4. ✅ Connect to Facebook Ads for retargeting
5. ✅ Connect to Google Ads for retargeting
6. ✅ Create comparison report
7. ✅ Launch retargeting campaigns

---

## Support

- **GA4 Audiences Help:** https://support.google.com/analytics/answer/9267572
- **Audience Conditions:** https://support.google.com/analytics/answer/9355938
- **Retargeting Guide:** https://support.google.com/analytics/answer/9357868

