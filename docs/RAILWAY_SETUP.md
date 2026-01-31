# Railway Database Setup Guide

This guide walks you through setting up a MySQL database on Railway for the OptiBio e-commerce platform. Railway provides a simple, developer-friendly platform for hosting databases with automatic backups, monitoring, and scaling.

---

## Prerequisites

Before you begin, ensure you have:

- A Railway account (sign up at [railway.app](https://railway.app))
- The `database-schema.sql` file (located in the project root)
- Access to the OptiBio GitHub repository

---

## Step 1: Create Railway Project

Railway organizes resources into projects. Each project can contain multiple services (database, backend, frontend, etc.).

### Create New Project

1. **Log in to Railway** at [railway.app](https://railway.app)
2. Click **"New Project"** button on the dashboard
3. Select **"Provision MySQL"** from the template options
4. Railway will automatically create a MySQL 8.0 instance

### Project Configuration

Once created, you will see:

- **Project name**: Rename to `optibio-production` (click the project name to edit)
- **Environment**: Default is `production` (you can create `staging` later)
- **MySQL service**: Running and ready to accept connections

---

## Step 2: Access Database Credentials

Railway automatically generates secure database credentials. You will need these for your application.

### View Connection Details

1. Click on the **MySQL service** in your project
2. Navigate to the **"Connect"** tab
3. You will see connection details:

```
MYSQL_URL=mysql://root:password@containers-us-west-xxx.railway.app:6379/railway
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6379
MYSQLUSER=root
MYSQLPASSWORD=generated-secure-password
MYSQLDATABASE=railway
```

### Copy Connection String

The most important value is `MYSQL_URL`. This is your complete connection string in the format:

```
mysql://username:password@host:port/database
```

**Save this value** - you will need it for Vercel deployment.

---

## Step 3: Import Database Schema

Now that your MySQL instance is running, import the OptiBio schema to create all necessary tables.

### Option A: Using Railway CLI (Recommended)

Railway provides a command-line interface for direct database access.

**Install Railway CLI:**

```bash
npm install -g @railway/cli
```

**Login to Railway:**

```bash
railway login
```

**Link to your project:**

```bash
railway link
# Select: optibio-production
```

**Import schema:**

```bash
railway run mysql -u root -p < database-schema.sql
# Enter the password from MYSQLPASSWORD when prompted
```

### Option B: Using MySQL Workbench

If you prefer a GUI tool, use MySQL Workbench to connect and import.

**Connection settings:**

- **Hostname**: Value from `MYSQLHOST`
- **Port**: Value from `MYSQLPORT`
- **Username**: Value from `MYSQLUSER`
- **Password**: Value from `MYSQLPASSWORD`

**Import steps:**

1. Open MySQL Workbench
2. Create new connection with the settings above
3. Go to **Server** → **Data Import**
4. Select **"Import from Self-Contained File"**
5. Choose `database-schema.sql`
6. Click **"Start Import"**

### Option C: Using Railway Web Terminal

Railway provides a web-based terminal for quick commands.

1. In Railway dashboard, click your **MySQL service**
2. Go to **"Data"** tab
3. Click **"Query"** button
4. Copy and paste the contents of `database-schema.sql`
5. Click **"Run"**

---

## Step 4: Verify Schema Import

After importing, verify that all tables were created successfully.

### Check Tables

Run this query in Railway's Query tab or MySQL Workbench:

```sql
SHOW TABLES;
```

You should see 14 tables:

- `users`
- `products`
- `productVariants`
- `productBatches`
- `subscriptionPlans`
- `subscriptions`
- `addresses`
- `orders`
- `orderItems`
- `cartItems`
- `discountCodes`
- `presale_reservations`
- `presale_campaign`
- `waitlist`

### Verify Initial Data

Check that default subscription plans were created:

```sql
SELECT * FROM subscriptionPlans;
```

You should see 3 plans: Monthly, Quarterly, and Annual.

---

## Step 5: Configure Database for Production

Railway databases come pre-configured with sensible defaults, but you should verify these settings for production use.

### Enable SSL Connections

Railway MySQL instances support SSL by default. To enforce SSL connections:

1. In Railway dashboard, go to your MySQL service
2. Click **"Settings"** tab
3. Under **"Environment Variables"**, add:

```
MYSQL_REQUIRE_SSL=true
```

### Set Connection Limits

For production workloads, configure connection pooling:

```
MYSQL_MAX_CONNECTIONS=100
```

### Enable Query Logging (Optional)

For debugging during initial deployment:

```
MYSQL_GENERAL_LOG=1
```

**Note**: Disable this after initial testing as it impacts performance.

---

## Step 6: Create Database Backups

Railway automatically backs up your database, but you should configure backup retention.

### Automatic Backups

Railway creates daily backups automatically. To configure:

1. Go to your MySQL service
2. Click **"Settings"** tab
3. Scroll to **"Backups"** section
4. Set retention period (default: 7 days, max: 30 days)

### Manual Backup

To create an on-demand backup before major changes:

1. Go to **"Data"** tab
2. Click **"Backup Now"** button
3. Backup will appear in the **"Backups"** list

### Restore from Backup

If you need to restore:

1. Go to **"Backups"** tab
2. Find the backup you want to restore
3. Click **"Restore"** button
4. Confirm the restoration

**Warning**: Restoring will overwrite current data. Always create a new backup before restoring.

---

## Step 7: Set Up Monitoring

Railway provides built-in monitoring for database performance and health.

### View Metrics

1. Go to your MySQL service
2. Click **"Metrics"** tab
3. You will see:
   - **CPU usage**: Should stay below 70% under normal load
   - **Memory usage**: Monitor for memory leaks
   - **Disk usage**: Ensure adequate space for growth
   - **Network I/O**: Track query performance

### Set Up Alerts

Configure alerts for critical issues:

1. Go to **"Settings"** → **"Notifications"**
2. Add webhook URL (optional: integrate with Slack, Discord, or email)
3. Set thresholds:
   - CPU > 80% for 5 minutes
   - Memory > 90%
   - Disk > 85%

---

## Step 8: Connect to Vercel

Once your database is ready, you need to provide the connection string to Vercel.

### Copy Connection String

From Railway's **"Connect"** tab, copy the `MYSQL_URL` value.

### Add to Vercel

1. Go to your Vercel project settings
2. Navigate to **"Environment Variables"**
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your `MYSQL_URL` from Railway
   - **Environment**: Select `Production`, `Preview`, and `Development`

4. Click **"Save"**

### Test Connection

After deploying to Vercel, test the database connection:

```bash
# In your Vercel deployment logs, look for:
[Database] Connected successfully to Railway MySQL
```

If you see connection errors, verify:
- Connection string is correct
- SSL is enabled (Railway requires SSL)
- Vercel has network access to Railway (should work by default)

---

## Step 9: Seed Initial Data (Optional)

If you want to add sample products for testing, create a seed script.

### Create Seed File

Create `scripts/seed-db.mjs`:

```javascript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// Insert sample product
await db.insert(schema.products).values({
  name: "KSM-66 Ashwagandha",
  slug: "ksm-66-ashwagandha",
  description: "Premium full-spectrum ashwagandha extract",
  priceInCents: 4900,
  stockQuantity: 1000,
  isActive: true,
  isFeatured: true,
});

console.log("✅ Database seeded successfully");
await connection.end();
```

### Run Seed Script

```bash
DATABASE_URL="your-railway-connection-string" node scripts/seed-db.mjs
```

---

## Troubleshooting

### Connection Refused

**Error**: `ECONNREFUSED` or `Connection refused`

**Solution**:
- Verify Railway MySQL service is running (check dashboard)
- Ensure connection string is correct
- Check if your IP is blocked (Railway allows all IPs by default)

### SSL Certificate Error

**Error**: `SSL connection error` or `certificate verify failed`

**Solution**:
- Add `?ssl={"rejectUnauthorized":false}` to connection string (development only)
- For production, download Railway's SSL certificate from the dashboard

### Timeout Errors

**Error**: `Connection timeout` or `Query timeout`

**Solution**:
- Check Railway service status (may be sleeping on free tier)
- Increase connection timeout in your application
- Verify network connectivity

### Schema Import Failed

**Error**: `Table already exists` or `Syntax error`

**Solution**:
- Drop existing tables first: `DROP DATABASE railway; CREATE DATABASE railway;`
- Verify SQL file is valid MySQL syntax
- Check MySQL version compatibility (Railway uses 8.0+)

---

## Cost Estimation

Railway pricing is usage-based. Here is an estimate for OptiBio:

| Resource | Free Tier | Paid (Estimated) |
|----------|-----------|------------------|
| **Database Storage** | 1GB | $0.25/GB/month |
| **Compute** | $5 credit/month | $10-20/month |
| **Bandwidth** | Included | Included |
| **Backups** | 7 days | 30 days |

**Expected monthly cost**: $10-15 for first 6 months, scaling to $20-30 as traffic grows.

---

## Next Steps

Once your Railway database is set up and connected:

1. ✅ **Deploy to Vercel** - Follow the `VERCEL_DEPLOYMENT.md` guide
2. ✅ **Configure Stripe webhooks** - Point to your Vercel domain
3. ✅ **Test end-to-end** - Place a test order and verify database updates
4. ✅ **Monitor performance** - Check Railway metrics after first week

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

---

**Author**: Manus AI  
**Last Updated**: November 11, 2025  
**Version**: 1.0
