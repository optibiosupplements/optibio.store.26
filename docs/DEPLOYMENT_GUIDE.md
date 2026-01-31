# OptiBio E-Commerce - Google Cloud Deployment Guide

This guide provides step-by-step instructions for deploying the OptiBio e-commerce application to Google Cloud App Hosting.

---

## Prerequisites

Before starting deployment, ensure you have:

- [ ] **Google Cloud Account** with billing enabled
- [ ] **Firebase Project** created
- [ ] **Firebase CLI** installed (`npm install -g firebase-tools`)
- [ ] **gcloud CLI** installed and authenticated
- [ ] **MySQL Database** (Google Cloud SQL or external)
- [ ] **AWS S3 Bucket** configured
- [ ] **Stripe Account** with API keys
- [ ] **All environment variables** documented (see ENVIRONMENT_SETUP.md)

---

## Step 1: Prepare Local Environment

### 1.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 1.2 Login to Firebase

```bash
firebase login
```

### 1.3 Verify Google Cloud Project

```bash
gcloud config list
gcloud projects list
```

---

## Step 2: Run Migration Script

The migration script prepares the codebase for Google Cloud deployment by:
- Updating imports to use portable implementations
- Removing Manus-specific dependencies
- Creating environment variable checklist

```bash
cd /path/to/optibio-ecommerce
chmod +x scripts/migrate-to-google-cloud.sh
./scripts/migrate-to-google-cloud.sh
```

Expected output:
```
🚀 Starting Google Cloud migration...
📝 Step 1: Updating imports to use portable implementations...
✅ Updated notification imports
📝 Step 2: Removing Manus-specific dependencies...
✅ Removed vite-plugin-manus-runtime from package.json
📝 Step 3: Updating vite.config.ts...
✅ Updated vite.config.ts
📝 Step 4: Creating environment variable checklist...
✅ Created ENVIRONMENT_CHECKLIST.md
📝 Step 5: Installing dependencies...
📝 Step 6: Building project...
✅ Migration preparation complete!
```

---

## Step 3: Configure Database

### Option A: Google Cloud SQL (Recommended)

#### 3.1 Create Cloud SQL Instance

```bash
gcloud sql instances create optibio-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_SECURE_PASSWORD
```

#### 3.2 Create Database

```bash
gcloud sql databases create optibio_production \
  --instance=optibio-db
```

#### 3.3 Create Database User

```bash
gcloud sql users create optibio_user \
  --instance=optibio-db \
  --password=YOUR_SECURE_PASSWORD
```

#### 3.4 Export Database from Manus

```bash
# Connect to Manus database
mysqldump -h <manus-db-host> -u <user> -p optibio_db > optibio_backup.sql
```

#### 3.5 Import to Cloud SQL

```bash
# Upload backup to Cloud Storage
gsutil cp optibio_backup.sql gs://your-bucket/

# Import to Cloud SQL
gcloud sql import sql optibio-db \
  gs://your-bucket/optibio_backup.sql \
  --database=optibio_production
```

#### 3.6 Get Connection String

```bash
# For Unix socket (recommended for Cloud Run)
mysql://optibio_user:password@/optibio_production?host=/cloudsql/PROJECT_ID:REGION:optibio-db

# For TCP connection
mysql://optibio_user:password@INSTANCE_IP:3306/optibio_production?ssl={"rejectUnauthorized":true}
```

### Option B: External MySQL Provider

Use your existing MySQL provider (AWS RDS, DigitalOcean, etc.) and configure the connection string:

```bash
mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}
```

---

## Step 4: Configure Secrets

### 4.1 Create All Required Secrets

```bash
# Database
gcloud secrets create DATABASE_URL --data-file=- <<< "mysql://user:pass@host:port/db"

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
gcloud secrets create JWT_SECRET --data-file=- <<< "$JWT_SECRET"

# Stripe
gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "sk_test_..."
gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_..."
gcloud secrets create VITE_STRIPE_PUBLISHABLE_KEY --data-file=- <<< "pk_test_..."

# AWS S3
gcloud secrets create AWS_ACCESS_KEY_ID --data-file=- <<< "AKIA..."
gcloud secrets create AWS_SECRET_ACCESS_KEY --data-file=- <<< "..."
gcloud secrets create AWS_S3_BUCKET --data-file=- <<< "optibio-uploads"
```

### 4.2 Grant Secret Access to Cloud Run

```bash
# Get Cloud Run service account
SERVICE_ACCOUNT=$(gcloud run services describe optibio-ecommerce \
  --region=us-central1 \
  --format='value(spec.template.spec.serviceAccountName)')

# Grant access to all secrets
for SECRET in DATABASE_URL JWT_SECRET STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET \
  VITE_STRIPE_PUBLISHABLE_KEY AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_S3_BUCKET; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor"
done
```

---

## Step 5: Configure S3 Bucket

### 5.1 Create S3 Bucket

```bash
aws s3 mb s3://optibio-uploads-production --region us-east-1
```

### 5.2 Configure CORS

Create `cors.json`:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-app.web.app", "https://optibiosupplements.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Apply CORS:
```bash
aws s3api put-bucket-cors --bucket optibio-uploads-production --cors-configuration file://cors.json
```

### 5.3 Create IAM User for S3 Access

```bash
# Create IAM user
aws iam create-user --user-name optibio-s3-uploader

# Attach S3 policy
aws iam attach-user-policy \
  --user-name optibio-s3-uploader \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# Create access key
aws iam create-access-key --user-name optibio-s3-uploader
```

Save the `AccessKeyId` and `SecretAccessKey` for environment configuration.

---

## Step 6: Initialize Firebase App Hosting

### 6.1 Initialize Firebase

```bash
firebase init apphosting
```

Follow the prompts:
- **Select project:** Choose your Firebase project
- **GitHub repository:** Connect your repository
- **Root directory:** Leave blank (use project root)
- **Build command:** `pnpm build`
- **Output directory:** `dist`

### 6.2 Verify apphosting.yaml

Ensure `apphosting.yaml` is properly configured:

```yaml
env:
  - variable: NODE_ENV
    value: production
  - variable: DATABASE_URL
    secret: DATABASE_URL
  - variable: JWT_SECRET
    secret: JWT_SECRET
  - variable: STRIPE_SECRET_KEY
    secret: STRIPE_SECRET_KEY
  - variable: STRIPE_WEBHOOK_SECRET
    secret: STRIPE_WEBHOOK_SECRET
  - variable: VITE_STRIPE_PUBLISHABLE_KEY
    secret: VITE_STRIPE_PUBLISHABLE_KEY
  - variable: AWS_ACCESS_KEY_ID
    secret: AWS_ACCESS_KEY_ID
  - variable: AWS_SECRET_ACCESS_KEY
    secret: AWS_SECRET_ACCESS_KEY
  - variable: AWS_REGION
    value: us-east-1
  - variable: AWS_S3_BUCKET
    secret: AWS_S3_BUCKET
  - variable: VITE_APP_TITLE
    value: "OptiBio® Supplements"
  - variable: VITE_APP_LOGO
    value: "https://optibiosupplements.com/logo.png"

runConfig:
  cpu: 1
  memoryMiB: 512
  runCommand: node dist/index.js
```

---

## Step 7: Deploy to Google Cloud

### 7.1 Build Project Locally (Test)

```bash
pnpm install
pnpm build
```

Verify build output:
- `dist/` directory contains `index.js`
- `dist/client/` directory contains static assets

### 7.2 Deploy to Firebase App Hosting

```bash
firebase deploy --only apphosting
```

Expected output:
```
=== Deploying to 'your-project'...

i  apphosting: deploying to Firebase App Hosting
✔  apphosting: build completed successfully
✔  apphosting: deployment completed successfully

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-app.web.app
```

### 7.3 Monitor Deployment

```bash
# View logs
firebase apphosting:logs

# Or use gcloud
gcloud run services logs read optibio-ecommerce --region=us-central1
```

---

## Step 8: Post-Deployment Configuration

### 8.1 Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > Webhooks**
3. Update webhook endpoint URL to: `https://your-app.web.app/api/webhooks/stripe`
4. Copy new **Signing secret** and update `STRIPE_WEBHOOK_SECRET`:

```bash
gcloud secrets versions add STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_new_secret"
```

### 8.2 Run Database Migrations

```bash
# SSH into Cloud Run instance (or run locally against Cloud SQL)
pnpm db:push
```

### 8.3 Test Critical Flows

- [ ] **Homepage loads** (https://your-app.web.app)
- [ ] **User registration** works
- [ ] **User login** works
- [ ] **Product browsing** works
- [ ] **Add to cart** works
- [ ] **Checkout with Stripe** works
- [ ] **Order confirmation email** sent
- [ ] **Subscription billing** works
- [ ] **File uploads** work (reviews, images)
- [ ] **Admin dashboard** accessible

### 8.4 Configure Custom Domain (Optional)

```bash
# Add custom domain
firebase hosting:channel:deploy production
firebase hosting:sites:update optibio --custom-domain optibiosupplements.com
```

Follow DNS configuration instructions provided by Firebase.

---

## Step 9: Monitoring & Alerts

### 9.1 Enable Cloud Logging

```bash
gcloud logging read "resource.type=cloud_run_revision" \
  --limit 50 \
  --format json
```

### 9.2 Set Up Uptime Checks

```bash
gcloud monitoring uptime create optibio-health-check \
  --resource-type=uptime-url \
  --host=your-app.web.app \
  --path=/api/health
```

### 9.3 Configure Alerts

Create alert policies for:
- **High error rate** (>5% of requests)
- **Slow response time** (>2 seconds)
- **Database connection failures**
- **Stripe webhook failures**

---

## Step 10: Performance Optimization

### 10.1 Enable CDN

Firebase Hosting automatically uses Google's CDN for static assets.

### 10.2 Configure Caching

Update `client/public/_headers`:
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
```

### 10.3 Optimize Images

```bash
# Install image optimization tools
npm install -g sharp-cli

# Optimize product images
sharp -i client/public/images/*.jpg -o client/public/images/ -f webp
```

---

## Rollback Procedure

If deployment fails or issues occur:

### Option 1: Rollback via Firebase Console

1. Go to **Firebase Console > App Hosting**
2. Click **Rollback** next to the previous version

### Option 2: Rollback via CLI

```bash
firebase apphosting:rollback
```

### Option 3: Redeploy Previous Version

```bash
git checkout <previous-commit-hash>
firebase deploy --only apphosting
```

---

## Troubleshooting

### **Issue: Build fails with TypeScript errors**

**Solution:**
```bash
pnpm check
# Fix TypeScript errors
pnpm build
```

### **Issue: Database connection timeout**

**Solution:**
- Verify Cloud SQL instance is running
- Check firewall rules allow Cloud Run connections
- Use Unix socket connection string for Cloud SQL

### **Issue: Stripe webhook signature verification fails**

**Solution:**
- Update `STRIPE_WEBHOOK_SECRET` with new secret from Stripe Dashboard
- Verify webhook URL matches deployment URL

### **Issue: S3 uploads fail with 403 Forbidden**

**Solution:**
- Verify IAM user has `s3:PutObject` permission
- Check bucket CORS configuration
- Verify AWS credentials are correct

### **Issue: Application crashes on startup**

**Solution:**
```bash
# View logs
gcloud run services logs read optibio-ecommerce --region=us-central1 --limit=50

# Common causes:
# - Missing environment variable
# - Database connection failure
# - Invalid JWT_SECRET
```

---

## Cost Estimation

### Google Cloud App Hosting

| Resource | Usage | Cost |
|----------|-------|------|
| Cloud Run | 1M requests/month | ~$5-10 |
| Cloud SQL (db-f1-micro) | 24/7 uptime | ~$10-15 |
| Cloud Storage | 10GB storage | ~$0.20 |
| Cloud Build | 120 builds/month | Free |
| **Total** | | **~$15-25/month** |

### Additional Services

| Service | Cost |
|---------|------|
| AWS S3 | ~$1-5/month |
| Stripe | 2.9% + $0.30 per transaction |
| SendGrid | Free (up to 100 emails/day) |
| **Total** | **~$16-30/month + transaction fees** |

---

## Next Steps

After successful deployment:

1. **Monitor performance** for 48 hours
2. **Update DNS** to point to Google Cloud domain
3. **Enable production Stripe keys** (switch from test to live)
4. **Set up automated backups** for database
5. **Configure CI/CD pipeline** for automated deployments
6. **Train team** on Google Cloud Console and Firebase CLI
7. **Decommission Manus hosting** (after confirming stability)

---

## Support Resources

- **Google Cloud Support**: https://cloud.google.com/support
- **Firebase Support**: https://firebase.google.com/support
- **Stripe Support**: https://support.stripe.com
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/google-cloud-platform

---

## Deployment Checklist

- [ ] Local build succeeds (`pnpm build`)
- [ ] All environment variables configured
- [ ] Database migrated and accessible
- [ ] S3 bucket configured with CORS
- [ ] Stripe webhook URL updated
- [ ] Firebase App Hosting initialized
- [ ] Application deployed (`firebase deploy`)
- [ ] Critical flows tested (auth, payments, uploads)
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts configured
- [ ] Performance optimizations applied
- [ ] Team trained on new infrastructure

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0
