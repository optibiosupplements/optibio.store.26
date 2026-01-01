#!/bin/bash

# OptiBio E-Commerce - Google Cloud Migration Script
# This script prepares the codebase for Google Cloud deployment

set -e

echo "🚀 Starting Google Cloud migration..."

# Step 1: Update imports to use portable implementations
echo "📝 Step 1: Updating imports to use portable implementations..."

# Replace notification imports
find server -type f -name "*.ts" -exec sed -i 's|from "\.\/_core\/notification"|from "./_core/notification-portable"|g' {} +
find server -type f -name "*.ts" -exec sed -i 's|from "\.\./\_core\/notification"|from "../_core/notification-portable"|g' {} +

echo "✅ Updated notification imports"

# Step 2: Remove Manus-specific dependencies
echo "📝 Step 2: Removing Manus-specific dependencies..."

# Remove vite-plugin-manus-runtime from package.json
if command -v jq &> /dev/null; then
  jq 'del(.devDependencies."vite-plugin-manus-runtime")' package.json > package.json.tmp
  mv package.json.tmp package.json
  echo "✅ Removed vite-plugin-manus-runtime from package.json"
else
  echo "⚠️  jq not installed. Please manually remove 'vite-plugin-manus-runtime' from package.json"
fi

# Step 3: Update vite.config.ts
echo "📝 Step 3: Updating vite.config.ts..."

if [ -f "client/vite.config.ts" ]; then
  # Comment out manus-runtime plugin
  sed -i 's|import manusRuntime from|// import manusRuntime from|g' client/vite.config.ts
  sed -i 's|manusRuntime()|// manusRuntime()|g' client/vite.config.ts
  echo "✅ Updated vite.config.ts"
fi

# Step 4: Create environment variable checklist
echo "📝 Step 4: Creating environment variable checklist..."

cat > ENVIRONMENT_CHECKLIST.md << 'EOF'
# Environment Variables Checklist for Google Cloud

Before deploying to Google Cloud, ensure the following environment variables are configured:

## Required Variables

- [ ] `DATABASE_URL` - MySQL connection string
- [ ] `JWT_SECRET` - Secret key for JWT signing
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key for S3
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3
- [ ] `AWS_REGION` - AWS region (e.g., us-east-1)
- [ ] `AWS_S3_BUCKET` - S3 bucket name

## Optional Variables

- [ ] `SENDGRID_API_KEY` - SendGrid API key for email notifications
- [ ] `MAILGUN_API_KEY` - Mailgun API key (alternative to SendGrid)
- [ ] `MAILGUN_DOMAIN` - Mailgun domain
- [ ] `GOOGLE_ANALYTICS_ID` - Google Analytics measurement ID
- [ ] `FACEBOOK_PIXEL_ID` - Facebook Pixel ID

## Configuration Commands

Add secrets to Google Cloud Secret Manager:

```bash
gcloud secrets create DATABASE_URL --data-file=- <<< "mysql://..."
gcloud secrets create JWT_SECRET --data-file=- <<< "$(openssl rand -base64 32)"
gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "sk_test_..."
gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_..."
gcloud secrets create AWS_ACCESS_KEY_ID --data-file=- <<< "AKIA..."
gcloud secrets create AWS_SECRET_ACCESS_KEY --data-file=- <<< "..."
gcloud secrets create AWS_S3_BUCKET --data-file=- <<< "optibio-uploads"
gcloud secrets create VITE_STRIPE_PUBLISHABLE_KEY --data-file=- <<< "pk_test_..."
```
EOF

echo "✅ Created ENVIRONMENT_CHECKLIST.md"

# Step 5: Install dependencies
echo "📝 Step 5: Installing dependencies..."
pnpm install

# Step 6: Build project
echo "📝 Step 6: Building project..."
pnpm build

echo ""
echo "✅ Migration preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review ENVIRONMENT_CHECKLIST.md and configure all required environment variables"
echo "2. Review GOOGLE_CLOUD_MIGRATION.md for detailed migration instructions"
echo "3. Set up Google Cloud SQL database and import data"
echo "4. Configure Firebase App Hosting"
echo "5. Deploy with: firebase deploy --only apphosting"
echo ""
echo "⚠️  Important: Test authentication, payments, and file uploads after deployment"
