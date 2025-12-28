# Vercel Deployment Guide

This guide walks you through deploying the OptiBio e-commerce platform to Vercel, a modern hosting platform optimized for Next.js and React applications. Vercel provides automatic deployments from GitHub, edge functions, and global CDN distribution.

---

## Prerequisites

Before you begin, ensure you have completed:

- ✅ Railway database setup (see `RAILWAY_SETUP.md`)
- ✅ GitHub repository access (optibiosupplements/optibio-ecommerce)
- ✅ Stripe account with API keys
- ✅ Domain access (optibiosupplements.com DNS settings)

---

## Step 1: Create Vercel Account

Vercel offers a generous free tier suitable for launching OptiBio.

### Sign Up

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended for seamless integration)
4. Authorize Vercel to access your GitHub account
5. Select **"Hobby"** plan (free tier)

### Install Vercel GitHub App

During signup, Vercel will ask to install its GitHub app:

1. Click **"Install"**
2. Choose **"Only select repositories"**
3. Select: `optibiosupplements/optibio-ecommerce`
4. Click **"Install & Authorize"**

---

## Step 2: Import GitHub Repository

Now that Vercel has access to your repository, import the project.

### Create New Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. You will see your GitHub repositories listed
3. Find **"optibiosupplements/optibio-ecommerce"**
4. Click **"Import"**

### Configure Build Settings

Vercel auto-detects the framework and build settings. Verify these values:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `.` (project root) |
| **Build Command** | `pnpm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |
| **Node Version** | 22.x |

**Do not deploy yet** - you need to add environment variables first.

---

## Step 3: Configure Environment Variables

OptiBio requires several environment variables for database, authentication, and payment processing.

### Required Environment Variables

Click **"Environment Variables"** section and add each of the following:

#### Database Connection

```
DATABASE_URL
```
**Value**: Your Railway MySQL connection string (from Railway dashboard)  
**Example**: `mysql://root:password@containers-us-west-xxx.railway.app:6379/railway`

#### JWT Secret

```
JWT_SECRET
```
**Value**: Generate a secure random string (32+ characters)  
**Generate**: `openssl rand -base64 32` or use [randomkeygen.com](https://randomkeygen.com)

#### Manus OAuth (Already configured)

```
VITE_APP_ID
OAUTH_SERVER_URL
VITE_OAUTH_PORTAL_URL
OWNER_OPEN_ID
OWNER_NAME
```

**Values**: Copy from your current Manus project settings (these remain the same)

#### Stripe Integration

```
STRIPE_SECRET_KEY
```
**Value**: Your Stripe secret key (starts with `sk_live_` or `sk_test_`)  
**Location**: Stripe Dashboard → Developers → API Keys

```
STRIPE_WEBHOOK_SECRET
```
**Value**: Your Stripe webhook signing secret (starts with `whsec_`)  
**Location**: Stripe Dashboard → Developers → Webhooks (create after deployment)

```
VITE_STRIPE_PUBLISHABLE_KEY
```
**Value**: Your Stripe publishable key (starts with `pk_live_` or `pk_test_`)  
**Location**: Stripe Dashboard → Developers → API Keys

#### Application Branding

```
VITE_APP_TITLE
```
**Value**: `OptiBio - Premium Ashwagandha KSM-66 Supplements`

```
VITE_APP_LOGO
```
**Value**: `/optibio-logo-v3.png`

#### Built-in Services (Optional - for Manus features)

```
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_URL
```

**Values**: Copy from current Manus project if you want to keep Manus notification features

### Environment Scope

For each variable, select which environments it applies to:

- ✅ **Production**: Live site (optibiosupplements.com)
- ✅ **Preview**: Pull request previews
- ✅ **Development**: Local development (optional)

**Recommendation**: Enable all three for consistency.

---

## Step 4: Deploy to Vercel

With environment variables configured, you are ready to deploy.

### Initial Deployment

1. Scroll to the bottom of the import page
2. Click **"Deploy"**
3. Vercel will:
   - Clone your repository
   - Install dependencies (`pnpm install`)
   - Run build command (`pnpm run build`)
   - Deploy to global CDN

### Monitor Build Progress

You will see real-time build logs:

```
Installing dependencies...
✓ Dependencies installed (45s)

Building application...
✓ Client built successfully
✓ Server built successfully

Deploying to edge network...
✓ Deployment complete
```

**Build time**: Typically 2-3 minutes for first deployment.

### Deployment URL

Once complete, Vercel provides a preview URL:

```
https://optibio-ecommerce-abc123.vercel.app
```

**Test this URL** before connecting your custom domain.

---

## Step 5: Configure Stripe Webhooks

Stripe needs to send payment events (successful charges, subscription renewals, etc.) to your Vercel deployment.

### Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **"Add endpoint"**
4. Enter your Vercel URL + webhook path:

```
https://optibio-ecommerce-abc123.vercel.app/api/stripe/webhook
```

(Replace with your actual Vercel URL)

### Select Events

Choose which events Stripe should send:

- ✅ `checkout.session.completed` - Order placed
- ✅ `invoice.payment_succeeded` - Subscription renewed
- ✅ `invoice.payment_failed` - Payment failed
- ✅ `customer.subscription.deleted` - Subscription cancelled
- ✅ `customer.subscription.updated` - Subscription changed

### Get Webhook Secret

After creating the endpoint:

1. Click on the webhook you just created
2. Scroll to **"Signing secret"**
3. Click **"Reveal"** to see the secret (starts with `whsec_`)
4. Copy this value

### Update Vercel Environment Variable

1. Go back to Vercel dashboard
2. Navigate to your project → **Settings** → **Environment Variables**
3. Find `STRIPE_WEBHOOK_SECRET`
4. Click **"Edit"**
5. Paste the webhook secret
6. Click **"Save"**

### Redeploy

After updating environment variables:

1. Go to **Deployments** tab
2. Click the three dots (**...**) on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

## Step 6: Connect Custom Domain

Now that your site is working on the Vercel preview URL, connect your custom domain.

### Add Domain to Vercel

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `optibiosupplements.com`
4. Click **"Add"**

Vercel will show DNS configuration instructions.

### Update DNS Records (GoDaddy)

You have two options for DNS configuration:

#### Option A: A Records (Recommended)

Add these A records in GoDaddy:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 600 |
| A | www | 76.76.21.98 | 600 |

#### Option B: CNAME Record

Alternatively, use a CNAME:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | cname.vercel-dns.com | 600 |
| CNAME | www | cname.vercel-dns.com | 600 |

**Note**: Some DNS providers do not support CNAME for root domains (@). Use A records if CNAME fails.

### Verify Domain

After updating DNS (propagation takes 5-60 minutes):

1. Return to Vercel dashboard → **Domains**
2. You will see a status indicator:
   - 🟡 **Pending**: DNS not propagated yet
   - 🟢 **Valid**: Domain connected successfully

3. Vercel automatically provisions an SSL certificate (Let's Encrypt)

### Test Custom Domain

Once status is **Valid**, visit:

```
https://optibiosupplements.com
```

You should see your OptiBio store!

---

## Step 7: Update Stripe Webhook URL

Now that your custom domain is connected, update the Stripe webhook to use the production URL.

### Edit Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Webhooks**
2. Click on your existing webhook
3. Click **"..."** → **"Update details"**
4. Change URL to:

```
https://optibiosupplements.com/api/stripe/webhook
```

5. Click **"Update endpoint"**

### Test Webhook

Stripe provides a webhook testing tool:

1. On the webhook page, click **"Send test webhook"**
2. Select event: `checkout.session.completed`
3. Click **"Send test webhook"**
4. Check **"Response"** tab - should show `200 OK`

If you see errors, check Vercel function logs (see Troubleshooting section).

---

## Step 8: Enable Automatic Deployments

Vercel automatically deploys when you push to GitHub, but you should configure deployment settings.

### Configure Git Integration

1. Go to **Settings** → **Git**
2. Verify these settings:

| Setting | Value |
|---------|-------|
| **Production Branch** | `main` |
| **Deploy Previews** | Enabled (for pull requests) |
| **Auto-deploy** | Enabled |

### Deployment Workflow

With these settings:

- **Push to `main`** → Automatic production deployment
- **Open pull request** → Preview deployment with unique URL
- **Merge PR** → Automatic production deployment

### Preview Deployments

Every pull request gets a unique preview URL:

```
https://optibio-ecommerce-git-feature-abc-team.vercel.app
```

This allows you to test changes before merging to production.

---

## Step 9: Configure Performance Optimizations

Vercel provides several performance features to optimize your site.

### Enable Edge Functions

Edge functions run your API routes closer to users globally.

1. Go to **Settings** → **Functions**
2. Set **Region**: `All` (global edge network)
3. Set **Max Duration**: `10s` (for webhook processing)

### Enable Image Optimization

Vercel automatically optimizes images, but you should configure caching:

1. Go to **Settings** → **General**
2. Scroll to **"Image Optimization"**
3. Set **Device Sizes**: `640, 750, 828, 1080, 1200, 1920, 2048, 3840`
4. Set **Image Sizes**: `16, 32, 48, 64, 96, 128, 256, 384`

### Enable Compression

Vercel automatically compresses responses, but verify:

1. Go to **Settings** → **General**
2. Ensure **"Compression"** is enabled (should be by default)

---

## Step 10: Set Up Monitoring & Analytics

Monitor your deployment to catch issues early.

### Vercel Analytics

Vercel provides built-in analytics:

1. Go to **Analytics** tab
2. You will see:
   - **Page views**: Traffic to each page
   - **Top pages**: Most visited pages
   - **Top referrers**: Where traffic comes from
   - **Devices**: Desktop vs mobile breakdown

### Function Logs

Monitor serverless function execution:

1. Go to **Functions** tab
2. Click on any function (e.g., `/api/stripe/webhook`)
3. View logs in real-time:
   - Request duration
   - Status codes
   - Error messages

### Error Tracking

For production error tracking, integrate Sentry:

1. Sign up at [sentry.io](https://sentry.io)
2. Create new project: **"OptiBio Production"**
3. Get DSN (Data Source Name)
4. Add to Vercel environment variables:

```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

5. Install Sentry SDK:

```bash
pnpm add @sentry/react @sentry/node
```

6. Initialize in `client/src/main.tsx` and `server/index.ts`

---

## Troubleshooting

### Build Failures

**Error**: `Build failed` or `Command failed with exit code 1`

**Solution**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript has no errors: `pnpm run typecheck`
- Test build locally: `pnpm run build`

### Database Connection Errors

**Error**: `ECONNREFUSED` or `Connection timeout`

**Solution**:
- Verify `DATABASE_URL` environment variable is correct
- Check Railway database is running
- Ensure SSL is enabled in connection string
- Test connection from Vercel function logs

### Stripe Webhook Failures

**Error**: `Webhook signature verification failed`

**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Check webhook URL is correct (https://optibiosupplements.com/api/stripe/webhook)
- Ensure webhook is sending to production URL, not preview URL

### Domain Not Connecting

**Error**: `Domain verification failed` or `DNS not configured`

**Solution**:
- Wait 30-60 minutes for DNS propagation
- Use [whatsmydns.net](https://whatsmydns.net) to check DNS status
- Verify A records point to Vercel IPs (76.76.21.21 and 76.76.21.98)
- Clear browser cache and try incognito mode

### 404 Errors on API Routes

**Error**: `404 Not Found` for `/api/*` endpoints

**Solution**:
- Verify `server/index.ts` exports are correct
- Check Vercel function logs for errors
- Ensure `vercel.json` configuration is correct (if present)
- Redeploy after fixing

---

## Cost Estimation

Vercel pricing is based on usage. Here is an estimate for OptiBio:

| Resource | Hobby (Free) | Pro (Paid) |
|----------|--------------|------------|
| **Bandwidth** | 100GB/month | 1TB/month |
| **Build Minutes** | 6,000 min/month | 24,000 min/month |
| **Serverless Executions** | 100GB-hours | 1,000GB-hours |
| **Edge Functions** | 500,000 requests | 1M requests |
| **Domains** | Unlimited | Unlimited |
| **Team Members** | 1 | Unlimited |

**Expected cost**: $0/month (Hobby tier) for first 6 months, upgrade to Pro ($20/month) as traffic grows.

---

## Next Steps

Once your Vercel deployment is live:

1. ✅ **Test end-to-end** - Place a test order and verify everything works
2. ✅ **Set up GPT Codex collaboration** - Follow `GPT_CODEX_GUIDE.md`
3. ✅ **Monitor performance** - Check Vercel analytics daily for first week
4. ✅ **Configure alerts** - Set up Sentry for error tracking

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)

---

**Author**: Manus AI  
**Last Updated**: November 11, 2025  
**Version**: 1.0
