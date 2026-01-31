# Environment Configuration Guide for Google Cloud

This document provides detailed instructions for configuring all required environment variables for the OptiBio e-commerce application on Google Cloud App Hosting.

---

## Quick Start Checklist

- [ ] Database connection configured
- [ ] JWT secret generated
- [ ] Stripe keys configured
- [ ] AWS S3 credentials configured
- [ ] Firebase Auth configured (if using)
- [ ] Email service configured (optional)
- [ ] Analytics configured (optional)

---

## Required Environment Variables

### 1. Database Configuration

#### **DATABASE_URL**

**Purpose:** MySQL/TiDB database connection string

**Format for external MySQL:**
```bash
mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}
```

**Format for Google Cloud SQL:**
```bash
mysql://username:password@/database?host=/cloudsql/project-id:region:instance-name
```

**Example:**
```bash
mysql://optibio_user:SecurePass123@db.example.com:3306/optibio_production?ssl={"rejectUnauthorized":true}
```

**Setup Command:**
```bash
gcloud secrets create DATABASE_URL --data-file=- <<< "mysql://username:password@host:port/database"
```

---

### 2. Authentication & Session

#### **JWT_SECRET**

**Purpose:** Secret key for signing JWT tokens (session management)

**Requirements:**
- Minimum 32 characters
- High entropy (random)
- Never commit to version control

**Generate:**
```bash
openssl rand -base64 32
```

**Example Output:**
```
8xK9mP2nQ5rT7vW0yZ3aB6cD9eF1gH4jK
```

**Setup Command:**
```bash
JWT_SECRET=$(openssl rand -base64 32)
gcloud secrets create JWT_SECRET --data-file=- <<< "$JWT_SECRET"
```

---

### 3. Stripe Payment Integration

#### **STRIPE_SECRET_KEY**

**Purpose:** Server-side Stripe API key for processing payments

**Where to Find:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy **Secret key** (starts with `sk_test_` or `sk_live_`)

**Test Mode:**
```bash
sk_test_51ABC123...
```

**Live Mode:**
```bash
sk_live_51XYZ789...
```

**Setup Command:**
```bash
gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "sk_test_your_key_here"
```

---

#### **STRIPE_WEBHOOK_SECRET**

**Purpose:** Verify webhook signatures from Stripe

**Where to Find:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > Webhooks**
3. Click **Add endpoint**
4. Enter URL: `https://your-app.web.app/api/webhooks/stripe`
5. Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
6. Copy **Signing secret** (starts with `whsec_`)

**Example:**
```bash
whsec_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Setup Command:**
```bash
gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_your_secret_here"
```

---

#### **VITE_STRIPE_PUBLISHABLE_KEY**

**Purpose:** Client-side Stripe key for Stripe.js

**Where to Find:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)

**Example:**
```bash
pk_test_51ABC123...
```

**Setup Command:**
```bash
gcloud secrets create VITE_STRIPE_PUBLISHABLE_KEY --data-file=- <<< "pk_test_your_key_here"
```

---

### 4. AWS S3 Storage

#### **AWS_ACCESS_KEY_ID**

**Purpose:** AWS access key for S3 uploads

**Where to Find:**
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Navigate to **Users > Your User > Security credentials**
3. Click **Create access key**
4. Copy **Access key ID**

**Example:**
```bash
AKIAIOSFODNN7EXAMPLE
```

**Setup Command:**
```bash
gcloud secrets create AWS_ACCESS_KEY_ID --data-file=- <<< "AKIA..."
```

---

#### **AWS_SECRET_ACCESS_KEY**

**Purpose:** AWS secret key for S3 uploads

**Where to Find:**
- Shown once during access key creation
- Store securely (cannot be retrieved later)

**Example:**
```bash
wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Setup Command:**
```bash
gcloud secrets create AWS_SECRET_ACCESS_KEY --data-file=- <<< "your_secret_key_here"
```

---

#### **AWS_REGION**

**Purpose:** AWS region for S3 bucket

**Common Values:**
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)

**Setup (in apphosting.yaml):**
```yaml
- variable: AWS_REGION
  value: us-east-1
```

---

#### **AWS_S3_BUCKET**

**Purpose:** S3 bucket name for file uploads

**Requirements:**
- Must be globally unique
- Lowercase letters, numbers, hyphens only
- 3-63 characters

**Example:**
```bash
optibio-uploads-production
```

**Setup Command:**
```bash
gcloud secrets create AWS_S3_BUCKET --data-file=- <<< "optibio-uploads-production"
```

---

### 5. Application Branding

#### **VITE_APP_TITLE**

**Purpose:** Application title (shown in browser tab, meta tags)

**Setup (in apphosting.yaml):**
```yaml
- variable: VITE_APP_TITLE
  value: "OptiBio® Supplements"
```

---

#### **VITE_APP_LOGO**

**Purpose:** Logo URL (used in header, emails, meta tags)

**Setup (in apphosting.yaml):**
```yaml
- variable: VITE_APP_LOGO
  value: "https://optibiosupplements.com/logo.png"
```

---

## Optional Environment Variables

### 6. Email Service (SendGrid)

#### **SENDGRID_API_KEY**

**Purpose:** Send transactional emails (order confirmations, password resets)

**Where to Find:**
1. Go to [SendGrid Dashboard](https://app.sendgrid.com)
2. Navigate to **Settings > API Keys**
3. Click **Create API Key**
4. Select **Full Access** or **Restricted Access** (Mail Send only)

**Example:**
```bash
SG.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Setup Command:**
```bash
gcloud secrets create SENDGRID_API_KEY --data-file=- <<< "SG.your_key_here"
```

---

### 7. Analytics

#### **GOOGLE_ANALYTICS_ID**

**Purpose:** Google Analytics 4 tracking

**Where to Find:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Admin > Data Streams**
3. Copy **Measurement ID** (starts with `G-`)

**Example:**
```bash
G-XXXXXXXXXX
```

**Setup (in apphosting.yaml):**
```yaml
- variable: VITE_GOOGLE_ANALYTICS_ID
  value: "G-XXXXXXXXXX"
```

---

#### **FACEBOOK_PIXEL_ID**

**Purpose:** Facebook Pixel tracking for ads

**Where to Find:**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Navigate to **Data Sources > Pixels**
3. Copy **Pixel ID**

**Example:**
```bash
1234567890123456
```

**Setup (in apphosting.yaml):**
```yaml
- variable: VITE_FACEBOOK_PIXEL_ID
  value: "1234567890123456"
```

---

## Firebase Authentication (Optional)

If using Firebase Auth instead of custom JWT:

### **FIREBASE_PROJECT_ID**
```bash
gcloud secrets create FIREBASE_PROJECT_ID --data-file=- <<< "your-project-id"
```

### **FIREBASE_CLIENT_EMAIL**
```bash
gcloud secrets create FIREBASE_CLIENT_EMAIL --data-file=- <<< "firebase-adminsdk@your-project.iam.gserviceaccount.com"
```

### **FIREBASE_PRIVATE_KEY**
```bash
gcloud secrets create FIREBASE_PRIVATE_KEY --data-file=- <<< "-----BEGIN PRIVATE KEY-----\n..."
```

### **VITE_FIREBASE_API_KEY**
```yaml
- variable: VITE_FIREBASE_API_KEY
  value: "AIzaSyABC123..."
```

---

## Complete Setup Script

Run this script to configure all secrets at once:

```bash
#!/bin/bash

# Database
gcloud secrets create DATABASE_URL --data-file=- <<< "mysql://user:pass@host:port/db"

# JWT
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

# Optional: SendGrid
# gcloud secrets create SENDGRID_API_KEY --data-file=- <<< "SG...."

echo "✅ All secrets configured!"
```

---

## Verification

After configuring all secrets, verify they are set:

```bash
gcloud secrets list
```

Expected output:
```
NAME                          CREATED              REPLICATION_POLICY  LOCATIONS
AWS_ACCESS_KEY_ID            2025-12-31T10:00:00  automatic           -
AWS_SECRET_ACCESS_KEY        2025-12-31T10:00:00  automatic           -
AWS_S3_BUCKET                2025-12-31T10:00:00  automatic           -
DATABASE_URL                 2025-12-31T10:00:00  automatic           -
JWT_SECRET                   2025-12-31T10:00:00  automatic           -
STRIPE_SECRET_KEY            2025-12-31T10:00:00  automatic           -
STRIPE_WEBHOOK_SECRET        2025-12-31T10:00:00  automatic           -
VITE_STRIPE_PUBLISHABLE_KEY  2025-12-31T10:00:00  automatic           -
```

---

## Security Best Practices

1. **Never commit secrets to version control**
   - Use `.gitignore` to exclude `.env` files
   - Use Google Cloud Secret Manager for production

2. **Rotate secrets regularly**
   - JWT_SECRET: Every 90 days
   - API keys: Every 180 days
   - Database passwords: Every 180 days

3. **Use different secrets for test and production**
   - Test: `sk_test_...`, `pk_test_...`
   - Production: `sk_live_...`, `pk_live_...`

4. **Restrict IAM permissions**
   - Grant minimum required permissions
   - Use service accounts for application access

5. **Monitor secret access**
   - Enable Cloud Audit Logs
   - Set up alerts for unauthorized access

---

## Troubleshooting

### **Error: Secret not found**
```bash
# List all secrets
gcloud secrets list

# Check if secret exists
gcloud secrets describe SECRET_NAME
```

### **Error: Permission denied**
```bash
# Grant Secret Manager access
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/secretmanager.secretAccessor"
```

### **Error: Invalid DATABASE_URL format**
```bash
# Test connection
mysql -h HOST -P PORT -u USER -p DATABASE
```

---

## Next Steps

After configuring environment variables:

1. **Update apphosting.yaml** with all variable references
2. **Deploy application** with `firebase deploy --only apphosting`
3. **Test critical flows** (auth, payments, file uploads)
4. **Monitor logs** for configuration errors
5. **Set up alerts** for production issues

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0
