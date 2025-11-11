# DNS Configuration Quick Reference

**Domain:** optibiosupplements.com  
**Registrar:** GoDaddy  
**Target:** Manus Platform

---

## DNS Records to Add

### ⚠️ IMPORTANT: You Need BOTH Records!

**Record 1 (`@`):** Makes `optibiosupplements.com` work (no www)  
**Record 2 (`www`):** Makes `www.optibiosupplements.com` work (with www)

**Most people type the domain WITHOUT www, so both are required!**

---

### Option 1: CNAME (Try This First)

```
Type: CNAME
Name: @
Value: cname.manus.space
TTL: 1 Hour

Type: CNAME
Name: www
Value: cname.manus.space
TTL: 1 Hour
```

**Note:** GoDaddy may reject CNAME for `@`. If so, use Option 2.

---

### Option 2: A Records (Use This If CNAME Fails for `@`)

```
Type: A
Name: @
Value: 104.18.26.246
TTL: 1 Hour

Type: A
Name: @
Value: 104.18.27.246
TTL: 1 Hour

Type: CNAME
Name: www
Value: cname.manus.space
TTL: 1 Hour
```

---

## GoDaddy Steps

1. Login to GoDaddy
2. Go to: My Products → Domains
3. Click: optibiosupplements.com
4. Click: "DNS" or "Manage DNS"
5. Delete old Shopify records (A and CNAME)
6. Add new Manus records (see above)
7. Click "Save"
8. Wait 5-15 minutes

---

## Verification

After DNS propagation:
- Visit: https://optibiosupplements.com (incognito mode)
- Should see: New Manus site (not Shopify)
- Check: Green padlock (SSL working)

---

## Rollback (If Needed)

To revert to Shopify:
1. Change DNS back to Shopify values
2. Wait 5-15 minutes
3. Shopify site will be live again

---

**Status:** Waiting for user to complete GoDaddy DNS update  
**Next:** Verify propagation and test site
