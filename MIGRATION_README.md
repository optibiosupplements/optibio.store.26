# OptiBio E-Commerce - Google Cloud Migration Package

Welcome to the OptiBio Google Cloud migration package! This README provides an overview of all migration resources and guides you through the migration process.

---

## 📦 What's Included

This migration package contains everything you need to migrate the OptiBio e-commerce application from Manus hosting to Google Cloud App Hosting:

### **Configuration Files**
- `apphosting.yaml` - Google Cloud App Hosting configuration
- `package.json` - Updated dependencies (Manus-specific packages removed)

### **Portable Implementations**
- `server/_core/auth-portable.ts` - JWT authentication (replaces Manus OAuth)
- `server/_core/notification-portable.ts` - Email notifications (replaces Manus notifications)
- `server/storage.ts` - AWS S3 storage (already portable, no changes needed)

### **Migration Scripts**
- `scripts/migrate-to-google-cloud.sh` - Automated migration script

### **Documentation**
- `GOOGLE_CLOUD_MIGRATION.md` - Complete migration overview
- `docs/DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
- `docs/ENVIRONMENT_SETUP.md` - Environment variable configuration guide
- `docs/FIREBASE_AUTH_INTEGRATION.md` - Firebase Authentication setup (optional)
- `MIGRATION_README.md` - This file

---

## 🚀 Quick Start (5 Steps)

### **Step 1: Review Migration Overview**
Read `GOOGLE_CLOUD_MIGRATION.md` to understand:
- What's changing (Manus → Google Cloud)
- Service replacements (OAuth, storage, notifications)
- Estimated timeline (10-20 hours)
- Cost comparison ($16-75/month)

### **Step 2: Configure Environment Variables**
Follow `docs/ENVIRONMENT_SETUP.md` to set up:
- Database connection (Cloud SQL or external MySQL)
- JWT secret (for session management)
- Stripe keys (payments)
- AWS S3 credentials (file storage)
- Optional: SendGrid (email), Firebase Auth, Analytics

### **Step 3: Run Migration Script**
```bash
chmod +x scripts/migrate-to-google-cloud.sh
./scripts/migrate-to-google-cloud.sh
```

This script will:
- Update imports to use portable implementations
- Remove Manus-specific dependencies
- Build the project
- Create environment variable checklist

### **Step 4: Deploy to Google Cloud**
Follow `docs/DEPLOYMENT_GUIDE.md` for detailed instructions:
```bash
# Initialize Firebase
firebase init apphosting

# Deploy
firebase deploy --only apphosting
```

### **Step 5: Test & Monitor**
- Test critical flows (auth, payments, uploads)
- Monitor logs for errors
- Update Stripe webhook URL
- Configure custom domain (optional)

---

## 📋 Migration Checklist

### **Pre-Migration**
- [ ] Review all documentation
- [ ] Create Google Cloud project
- [ ] Set up Firebase project
- [ ] Install Firebase CLI (`npm install -g firebase-tools`)
- [ ] Install gcloud CLI
- [ ] Export database from Manus
- [ ] Create AWS S3 bucket
- [ ] Gather all API keys (Stripe, AWS, etc.)

### **Migration**
- [ ] Run migration script (`./scripts/migrate-to-google-cloud.sh`)
- [ ] Configure all environment variables
- [ ] Set up Cloud SQL database
- [ ] Import database backup
- [ ] Configure S3 bucket with CORS
- [ ] Initialize Firebase App Hosting
- [ ] Deploy application

### **Post-Migration**
- [ ] Update Stripe webhook URL
- [ ] Test user registration/login
- [ ] Test product browsing and checkout
- [ ] Test file uploads (reviews, images)
- [ ] Configure custom domain
- [ ] Set up monitoring and alerts
- [ ] Update DNS to point to new domain
- [ ] Decommission Manus hosting

---

## 🔄 Service Replacements

### **Authentication**
**Before (Manus):** Manus OAuth  
**After (Google Cloud):** Firebase Auth or custom JWT

**Implementation:**
- Option A: Firebase Authentication (recommended) - See `docs/FIREBASE_AUTH_INTEGRATION.md`
- Option B: Custom JWT - Use `server/_core/auth-portable.ts`

### **File Storage**
**Before (Manus):** Manus S3 (pre-configured)  
**After (Google Cloud):** AWS S3 (manual configuration)

**No code changes required** - The storage layer (`server/storage.ts`) already uses AWS SDK. You only need to:
1. Create S3 bucket
2. Configure IAM user
3. Add AWS credentials to environment variables

### **Notifications**
**Before (Manus):** Manus notification system  
**After (Google Cloud):** SendGrid, Mailgun, or AWS SES

**Implementation:**
- Use `server/_core/notification-portable.ts` as template
- Install email service SDK (e.g., `@sendgrid/mail`)
- Implement `notifyOwner()` and `notifyCustomer()` functions

### **Database**
**Before (Manus):** Manus-provided MySQL/TiDB  
**After (Google Cloud):** Cloud SQL MySQL or external provider

**Migration:**
1. Export database from Manus (`mysqldump`)
2. Create Cloud SQL instance
3. Import backup to Cloud SQL
4. Update `DATABASE_URL` environment variable

---

## 📊 Cost Comparison

### **Manus Hosting (Current)**
- Included in Manus subscription
- No separate infrastructure costs
- **Total: Included in subscription**

### **Google Cloud App Hosting (New)**
| Service | Cost |
|---------|------|
| Cloud Run (1M requests/month) | ~$5-10 |
| Cloud SQL (db-f1-micro) | ~$10-15 |
| Cloud Storage (10GB) | ~$0.20 |
| AWS S3 (file uploads) | ~$1-5 |
| **Total** | **~$16-30/month** |

**Additional Costs:**
- Stripe: 2.9% + $0.30 per transaction
- SendGrid: Free (up to 100 emails/day), then $19.95/month
- Custom domain: ~$12/year

---

## ⏱️ Estimated Timeline

| Phase | Duration | Complexity |
|-------|----------|------------|
| **1. Environment Setup** | 2-4 hours | Medium |
| Database migration, secret configuration | | |
| **2. Service Replacements** | 4-8 hours | High |
| Auth, notifications, storage setup | | |
| **3. Deployment** | 1-2 hours | Medium |
| Firebase init, deploy, DNS | | |
| **4. Testing** | 2-4 hours | Medium |
| Critical flows, bug fixes | | |
| **5. Monitoring** | 1-2 hours | Low |
| Alerts, logs, performance | | |
| **Total** | **10-20 hours** | **High** |

---

## 🛠️ Key Files Modified

### **Configuration**
- `apphosting.yaml` - Added runConfig with explicit run command
- `package.json` - Removed `vite-plugin-manus-runtime`

### **New Files**
- `server/_core/auth-portable.ts` - Portable JWT authentication
- `server/_core/notification-portable.ts` - Portable notification system
- `scripts/migrate-to-google-cloud.sh` - Migration automation script

### **Files to Update (Post-Migration)**
- `server/_core/context.ts` - Switch to portable auth
- `server/abandoned-cart-scheduler.ts` - Use portable notifications
- `server/webhooks.ts` - Use portable notifications

---

## 🔐 Security Considerations

### **Secrets Management**
- **Never commit secrets to version control**
- Use Google Cloud Secret Manager for production
- Rotate secrets regularly (JWT: 90 days, API keys: 180 days)

### **Database Security**
- Use SSL/TLS for database connections
- Restrict database access to Cloud Run IP ranges
- Enable Cloud SQL IAM authentication (recommended)

### **API Security**
- Enable rate limiting (already configured in Express)
- Use HTTPS only (enforced by Firebase Hosting)
- Validate Stripe webhook signatures (already implemented)

### **IAM Permissions**
- Grant minimum required permissions
- Use service accounts for application access
- Enable Cloud Audit Logs for monitoring

---

## 🐛 Troubleshooting

### **Common Issues**

#### **Build fails with TypeScript errors**
```bash
pnpm check
# Fix errors, then rebuild
pnpm build
```

#### **Database connection timeout**
- Verify Cloud SQL instance is running
- Use Unix socket connection string: `mysql://user:pass@/db?host=/cloudsql/project:region:instance`

#### **Stripe webhook fails**
- Update webhook URL in Stripe Dashboard
- Update `STRIPE_WEBHOOK_SECRET` with new secret

#### **S3 uploads fail**
- Verify IAM user has `s3:PutObject` permission
- Check bucket CORS configuration

#### **Application crashes on startup**
```bash
# View logs
gcloud run services logs read optibio-ecommerce --region=us-central1 --limit=50
```

---

## 📞 Support

### **Documentation**
- `GOOGLE_CLOUD_MIGRATION.md` - Migration overview
- `docs/DEPLOYMENT_GUIDE.md` - Deployment instructions
- `docs/ENVIRONMENT_SETUP.md` - Environment configuration
- `docs/FIREBASE_AUTH_INTEGRATION.md` - Firebase Auth setup

### **External Resources**
- **Google Cloud Docs**: https://cloud.google.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Stack Overflow**: https://stackoverflow.com

### **Community**
- **Google Cloud Community**: https://www.googlecloudcommunity.com
- **Firebase Community**: https://firebase.google.com/community

---

## ✅ Success Criteria

Your migration is successful when:

- [ ] Application is accessible at `https://your-app.web.app`
- [ ] Users can register and login
- [ ] Products are browsable
- [ ] Checkout with Stripe works
- [ ] Order confirmation emails are sent
- [ ] File uploads work (reviews, images)
- [ ] Admin dashboard is accessible
- [ ] No errors in Cloud Run logs
- [ ] Response times are acceptable (<2 seconds)
- [ ] Custom domain is configured (optional)

---

## 🎯 Next Steps After Migration

1. **Monitor Performance**
   - Check Cloud Run logs daily for first week
   - Set up uptime monitoring
   - Configure error alerts

2. **Optimize Costs**
   - Review Cloud Run scaling settings
   - Optimize database tier (upgrade from db-f1-micro if needed)
   - Enable Cloud CDN for static assets

3. **Enhance Security**
   - Enable Cloud Armor (DDoS protection)
   - Set up Cloud Identity-Aware Proxy (IAP)
   - Configure security headers

4. **Improve Performance**
   - Enable HTTP/2 and HTTP/3
   - Optimize images (WebP format)
   - Implement service worker for offline support

5. **Set Up CI/CD**
   - Configure GitHub Actions for automated deployments
   - Add automated testing pipeline
   - Implement staging environment

---

## 📝 Rollback Plan

If migration fails, you can rollback to Manus hosting:

1. **Update DNS** to point back to Manus domain
2. **Restore database** from backup (if modified)
3. **Re-enable Manus OAuth** in code
4. **Redeploy** on Manus platform

**Important:** Keep Manus hosting active for at least 48 hours after migration to ensure smooth transition.

---

## 🎉 Congratulations!

You're now ready to migrate OptiBio to Google Cloud App Hosting. Follow the guides in order, test thoroughly, and don't hesitate to consult the documentation if you encounter issues.

**Good luck with your migration!** 🚀

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0  
**Package Maintainer:** OptiBio Development Team
