# GoDaddy DNS Configuration - Step-by-Step Visual Guide

**Domain:** optibiosupplements.com  
**Goal:** Point domain to Manus platform

---

## 🎯 What You're Doing

**Currently:** Domain points to Shopify  
**After DNS update:** Domain points to Manus  
**Time required:** 5 minutes to update, 15 minutes to propagate

---

## 📋 Step-by-Step Instructions

### Step 1: Access DNS Management

1. **Log in to GoDaddy.com**
2. **Click** "My Products" (top menu)
3. **Find** "optibiosupplements.com" in your domain list
4. **Click** the three dots (...) or "DNS" button next to the domain
5. **Select** "Manage DNS"

**You should now see a list of DNS records**

---

### Step 2: Delete Old Shopify Records

Look for these records and **DELETE them**:

**Old Record 1 (Shopify A record):**
```
Type: A
Name: @
Value: 23.227.38.65 (or similar Shopify IP)
```
**Action:** Click the trash/delete icon → Confirm deletion

**Old Record 2 (Shopify CNAME - if exists):**
```
Type: CNAME
Name: www
Value: shops.myshopify.com (or similar)
```
**Action:** Click the trash/delete icon → Confirm deletion

**⚠️ Important:** Delete ALL A and CNAME records for `@` and `www` before adding new ones!

---

### Step 3: Add New Manus A Records

**Click "Add" or "Add Record" button**

#### Add Record #1:

1. **Type:** Select "A" from dropdown
2. **Name:** Type `@` (this means root domain)
3. **Value:** Type `104.18.26.246`
4. **TTL:** Select "1 Hour" or "3600 seconds"
5. **Click "Save"**

#### Add Record #2:

1. **Click "Add" again**
2. **Type:** Select "A" from dropdown
3. **Name:** Type `@` (same as before)
4. **Value:** Type `104.18.27.246`
5. **TTL:** Select "1 Hour" or "3600 seconds"
6. **Click "Save"**

**Note:** Yes, you need TWO A records with the same name (`@`) but different IP addresses. This is normal!

---

### Step 4: Add CNAME Record for www

**Click "Add" or "Add Record" button again**

1. **Type:** Select "CNAME" from dropdown
2. **Name:** Type `www`
3. **Value:** Type `cname.manus.space`
4. **TTL:** Select "1 Hour" or "3600 seconds"
5. **Click "Save"**

---

### Step 5: Verify Your DNS Records

**Your DNS records should now look like this:**

```
┌─────────┬──────┬──────────────────┬────────┐
│ Type    │ Name │ Value            │ TTL    │
├─────────┼──────┼──────────────────┼────────┤
│ A       │ @    │ 104.18.26.246    │ 1 Hour │
│ A       │ @    │ 104.18.27.246    │ 1 Hour │
│ CNAME   │ www  │ cname.manus.space│ 1 Hour │
└─────────┴──────┴──────────────────┴────────┘
```

**Total:** 3 records

**If you see this, you're done with GoDaddy!** ✅

---

### Step 6: Save All Changes

1. **Look for a "Save" or "Save All" button** (usually at the top or bottom of the page)
2. **Click "Save"**
3. **Confirm** if prompted

**GoDaddy may show a message like:** "Changes saved successfully" or "DNS records updated"

---

## ⏰ Step 7: Wait for DNS Propagation

**Time:** 5-15 minutes (sometimes up to 1 hour)

**What's happening:** DNS servers around the world are updating to point to Manus instead of Shopify

**What to do:** 
- ☕ Take a coffee break
- 📧 Check your email
- ⏰ Come back in 15 minutes

**Don't worry if the site doesn't load immediately!** This is normal.

---

## ✅ Step 8: Verify It Worked

**After 15 minutes:**

1. **Open a new incognito/private browser window** (this bypasses cache)
2. **Go to:** `https://optibiosupplements.com`
3. **You should see:** Your new Manus site (not Shopify)
4. **Check:** Green padlock icon (SSL working)

**Also test:**
- `https://www.optibiosupplements.com` (with www)
- Both should work!

---

## 🔍 How to Check DNS Status

**Use online DNS checker:**
1. Go to: https://dnschecker.org
2. Enter: `optibiosupplements.com`
3. Select: "A" record type
4. Click "Search"

**What you should see:**
- IP addresses: `104.18.26.246` and `104.18.27.246`
- Green checkmarks around the world

**If you still see Shopify IP (23.227.38.65):**
- DNS hasn't propagated yet
- Wait another 10 minutes
- Try again

---

## 🚨 Troubleshooting

### Problem 1: GoDaddy won't let me add two A records with same name

**Solution:** This is actually fine! GoDaddy allows it. Make sure you're clicking "Add" after each record, not "Replace".

### Problem 2: "Record already exists" error

**Solution:** You need to delete the old record first. Go back to Step 2.

### Problem 3: Can't find "Add Record" button

**Solution:** Look for buttons labeled:
- "Add"
- "Add Record"
- "+ Add"
- "New Record"

Usually at the top or bottom of the DNS records list.

### Problem 4: Site still shows Shopify after 30 minutes

**Solution:** 
1. Clear your browser cache
2. Try incognito mode
3. Try a different device
4. Check DNS propagation at dnschecker.org

### Problem 5: "DNS_PROBE_FINISHED_NXDOMAIN" error

**Solution:** DNS hasn't propagated yet. Wait 15 more minutes.

---

## 📊 DNS Propagation Timeline

```
0 min:  You save changes in GoDaddy
5 min:  Some DNS servers have updated
15 min: Most DNS servers have updated (site should work)
1 hour: All DNS servers globally have updated
```

---

## 🔙 How to Rollback (If Needed)

**If something goes wrong and you want to go back to Shopify:**

1. **Go back to GoDaddy DNS Management**
2. **Delete the Manus A records** (104.18.26.246 and 104.18.27.246)
3. **Delete the Manus CNAME record** (cname.manus.space)
4. **Add back Shopify A record:**
   - Type: A
   - Name: @
   - Value: 23.227.38.65
5. **Add back Shopify CNAME:**
   - Type: CNAME
   - Name: www
   - Value: shops.myshopify.com
6. **Save changes**
7. **Wait 15 minutes**
8. **Shopify site will be live again**

---

## ✅ Checklist

Before you start:
- [ ] Logged in to GoDaddy
- [ ] Found optibiosupplements.com in domain list
- [ ] Opened DNS Management

DNS Configuration:
- [ ] Deleted old Shopify A record
- [ ] Deleted old Shopify CNAME record (if exists)
- [ ] Added A record: @ → 104.18.26.246
- [ ] Added A record: @ → 104.18.27.246
- [ ] Added CNAME record: www → cname.manus.space
- [ ] Saved all changes in GoDaddy

Verification:
- [ ] Waited 15 minutes
- [ ] Tested https://optibiosupplements.com in incognito mode
- [ ] Tested https://www.optibiosupplements.com
- [ ] Verified green padlock (SSL working)
- [ ] Site shows new Manus platform (not Shopify)

---

## 📞 Need Help?

**If you're stuck:**
1. Take a screenshot of your GoDaddy DNS records
2. Share it with me
3. I'll tell you exactly what to fix

**Common questions:**
- "Do I really need two A records?" → Yes!
- "Why @ and www?" → @ is root domain, www is subdomain. Both needed.
- "How long does it take?" → 5-15 minutes usually
- "Can I undo this?" → Yes! See rollback section above.

---

**Last Updated:** November 11, 2025  
**Status:** Waiting for user to complete DNS configuration  
**Next Step:** Verify DNS propagation and test live site
