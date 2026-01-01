# OptiBio E-Commerce - Google Cloud App Hosting Migration Guide

## Overview

This guide provides step-by-step instructions for migrating the OptiBio e-commerce application from Manus hosting infrastructure to Google Cloud App Hosting (Firebase).

---

## Prerequisites

Before starting the migration, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **Firebase Project** created
3. **Firebase CLI** installed (`npm install -g firebase-tools`)
4. **MySQL Database** (Google Cloud SQL or external provider)
5. **AWS S3 Bucket** for file storage (or migrate to Google Cloud Storage)
6. **Stripe Account** with API keys
7. **Domain Name** (optional, for custom domain)

---

## Phase 1: Environment Setup

### 1.1 Required Environment Variables

The following environment variables must be configured in Google Cloud Console:

#### **Database Configuration**
```bash
DATABASE_URL=mysql://username:password@host:port/optibio_db?ssl={"rejectUnauthorized":true}
```

For Google Cloud SQL, use the Unix socket format:
```bash
DATABASE_URL=mysql://user:password@/database?host=/cloudsql/project:region:instance
```

#### **Authentication & Session**
```bash
JWT_SECRET=<generate-with-openssl-rand-base64-32>
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

#### **Stripe Payment Integration**
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### **AWS S3 Storage**
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=optibio-uploads
```

#### **Application Branding**
```bash
VITE_APP_TITLE=OptiBio® Supplements
VITE_APP_LOGO=https://optibiosupplements.com/logo.png
```

---

## Phase 2: Service Replacements

### 2.1 Authentication System

**Current:** Manus OAuth (proprietary)  
**Replacement Options:**

#### **Option A: Firebase Authentication (Recommended)**
```bash
npm install firebase firebase-admin
```

Update `server/_core/context.ts` to use Firebase Auth:
```typescript
import admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Verify Firebase ID token
const token = req.headers.authorization?.split('Bearer ')[1];
if (token) {
  const decodedToken = await admin.auth().verifyIdToken(token);
  user = await getUserByFirebaseUid(decodedToken.uid);
}
```

#### **Option B: Custom JWT Authentication**
Keep the existing JWT implementation but remove Manus OAuth callback:
- Remove `/api/oauth/callback` route
- Implement custom login endpoint with email/password
- Use existing JWT session management

### 2.2 File Storage

**Current:** Manus S3 (with pre-configured credentials)  
**Replacement:** AWS S3 (requires manual configuration)

The storage implementation in `server/storage.ts` already uses AWS SDK. You only need to:
1. Create an S3 bucket
2. Configure IAM user with S3 permissions
3. Add AWS credentials to environment variables (see Phase 1.1)

**No code changes required** - the storage layer is already portable.

### 2.3 Notification System

**Current:** Manus notification system (`server/_core/notification.ts`)  
**Replacement Options:**

#### **Option A: Email Notifications (SendGrid)**
```bash
npm install @sendgrid/mail
```

Replace `notifyOwner()` calls:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function notifyOwner({ title, content }: { title: string; content: string }) {
  await sgMail.send({
    to: 'owner@optibiosupplements.com',
    from: 'noreply@optibiosupplements.com',
    subject: title,
    text: content,
    html: `<p>${content}</p>`,
  });
}
```

#### **Option B: Firebase Cloud Messaging**
Use Firebase Admin SDK for push notifications.

### 2.4 Remove Manus-Specific Dependencies

Remove the following from `package.json`:
```json
"vite-plugin-manus-runtime": "^0.0.56"
```

Remove from `client/vite.config.ts`:
```typescript
// Remove this import and plugin usage
import manusRuntime from 'vite-plugin-manus-runtime';
```

---

## Phase 3: Database Migration

### 3.1 Export Database from Manus

```bash
# Connect to Manus database and export
mysqldump -h <manus-db-host> -u <user> -p optibio_db > optibio_backup.sql
```

### 3.2 Create Google Cloud SQL Instance

```bash
gcloud sql instances create optibio-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1
```

### 3.3 Import Database

```bash
gcloud sql import sql optibio-db gs://your-bucket/optibio_backup.sql \
  --database=optibio_db
```

### 3.4 Update Database Schema

Run Drizzle migrations:
```bash
pnpm db:push
```

---

## Phase 4: Deployment

### 4.1 Initialize Firebase App Hosting

```bash
firebase login
firebase init apphosting
```

### 4.2 Configure Secrets in Google Cloud

```bash
# Add secrets to Google Cloud Secret Manager
gcloud secrets create DATABASE_URL --data-file=- <<< "mysql://..."
gcloud secrets create JWT_SECRET --data-file=- <<< "your-jwt-secret"
gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "sk_test_..."
gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_..."
gcloud secrets create AWS_ACCESS_KEY_ID --data-file=- <<< "AKIA..."
gcloud secrets create AWS_SECRET_ACCESS_KEY --data-file=- <<< "..."
```

### 4.3 Update apphosting.yaml

The `apphosting.yaml` file is already configured with:
- Resource allocation (1 CPU, 512MB RAM)
- Run command (`node dist/index.js`)
- Environment variable references

### 4.4 Deploy to Google Cloud

```bash
firebase deploy --only apphosting
```

---

## Phase 5: Post-Deployment Configuration

### 5.1 Update Stripe Webhook URL

In Stripe Dashboard:
1. Go to **Developers > Webhooks**
2. Update webhook endpoint to: `https://your-app.web.app/api/webhooks/stripe`
3. Copy new webhook secret and update `STRIPE_WEBHOOK_SECRET`

### 5.2 Configure Custom Domain

```bash
firebase hosting:channel:deploy production --only hosting
firebase hosting:sites:list
firebase hosting:sites:update optibio --custom-domain optibiosupplements.com
```

### 5.3 Update CORS Settings

If using a custom domain, update CORS in `server/_core/index.ts`:
```typescript
app.use(cors({
  origin: ['https://optibiosupplements.com', 'https://www.optibiosupplements.com'],
  credentials: true,
}));
```

### 5.4 Test Critical Flows

- [ ] User registration/login
- [ ] Product browsing
- [ ] Add to cart
- [ ] Checkout with Stripe
- [ ] Order confirmation email
- [ ] Subscription billing
- [ ] Admin dashboard access

---

## Phase 6: Monitoring & Rollback

### 6.1 Enable Cloud Logging

```bash
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### 6.2 Set Up Alerts

Configure alerts for:
- High error rates
- Slow response times
- Database connection failures
- Stripe webhook failures

### 6.3 Rollback Plan

If issues occur:
```bash
# Rollback to previous version
firebase apphosting:rollback

# Or redeploy specific version
firebase deploy --only apphosting --version <previous-version>
```

---

## Estimated Migration Timeline

| Phase | Duration | Complexity |
|-------|----------|------------|
| Environment Setup | 2-4 hours | Medium |
| Service Replacements | 4-8 hours | High |
| Database Migration | 1-2 hours | Low |
| Deployment | 1-2 hours | Medium |
| Post-Deployment | 2-4 hours | Medium |
| **Total** | **10-20 hours** | **High** |

---

## Cost Comparison

### Manus Hosting (Current)
- Included in Manus subscription
- No separate infrastructure costs

### Google Cloud App Hosting (New)
- **Cloud Run**: ~$5-20/month (depending on traffic)
- **Cloud SQL**: ~$10-50/month (db-f1-micro to db-n1-standard-1)
- **Cloud Storage**: ~$1-5/month (for static assets)
- **Total**: **$16-75/month**

---

## Support & Troubleshooting

### Common Issues

#### **Issue: Database connection timeout**
**Solution:** Ensure Cloud SQL instance allows connections from Cloud Run. Use Unix socket connection string.

#### **Issue: Stripe webhook signature verification fails**
**Solution:** Update `STRIPE_WEBHOOK_SECRET` with the new webhook secret from Stripe Dashboard.

#### **Issue: S3 uploads fail with 403 Forbidden**
**Solution:** Verify IAM user has `s3:PutObject` permission on the bucket.

#### **Issue: Build fails with TypeScript errors**
**Solution:** Run `pnpm check` locally to identify type errors before deploying.

---

## Next Steps

After successful migration:

1. **Monitor performance** for 48 hours
2. **Update DNS** to point to new Google Cloud domain
3. **Decommission Manus hosting** (after confirming stability)
4. **Update documentation** with new deployment procedures
5. **Train team** on Google Cloud Console and Firebase CLI

---

## Rollback to Manus

If migration fails and you need to rollback:

1. Update DNS to point back to Manus domain
2. Restore database from backup (if modified)
3. Re-enable Manus OAuth in code
4. Redeploy on Manus platform

---

## Contact & Support

For migration assistance:
- **Google Cloud Support**: https://cloud.google.com/support
- **Firebase Support**: https://firebase.google.com/support
- **Stripe Support**: https://support.stripe.com

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0
