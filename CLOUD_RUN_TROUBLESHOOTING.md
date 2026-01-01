# Cloud Run Deployment Troubleshooting

## Current Error Analysis

Based on the Cloud Run dashboard screenshot showing the error on **Dec 31, 2025 at 10:16:32 PM**, the deployment is failing with the following error:

> **generic-failed_precondition**: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended.

## Root Cause Analysis

The error indicates that Cloud Run is unable to verify that your container is listening on port 8080 within the startup timeout period. This can occur for several reasons, which we will systematically address.

### Potential Causes

The server code in `server/_core/index.ts` is **already correctly configured** to listen on `process.env.PORT` and bind to `0.0.0.0`. However, the deployment is still failing, which suggests one of the following issues:

1. **Build artifacts missing or incomplete** - The container may not have the compiled server code or client assets
2. **Runtime dependencies missing** - Production dependencies may not be installed correctly in the container
3. **Environment variables not set** - Required environment variables may be missing, causing the server to crash on startup
4. **Health check timing out** - The server may be starting slowly, exceeding Cloud Run's startup timeout
5. **Dockerfile configuration issues** - The Dockerfile may not be copying all necessary files

## Diagnostic Steps

### Step 1: Verify Local Build

First, verify that the build process works correctly on your local machine:

```bash
cd /home/ubuntu/optibio-ecommerce

# Clean previous build
rm -rf dist

# Run full build
pnpm run build

# Verify build outputs
ls -la dist/
ls -la dist/public/

# Check for required files
test -f dist/index.js && echo "✅ Server bundle exists"
test -f dist/public/index.html && echo "✅ Client index.html exists"
test -d dist/public/assets && echo "✅ Client assets exist"
```

All three checks should pass. If any fail, the build process has issues that need to be resolved before deploying.

### Step 2: Test Production Server Locally

Test the production build locally to ensure the server starts correctly:

```bash
# Set required environment variables
export NODE_ENV=production
export PORT=8080
export DATABASE_URL="your-database-url"
export JWT_SECRET="your-jwt-secret-min-32-chars"
export STRIPE_SECRET_KEY="sk_test_your_key"
export STRIPE_WEBHOOK_SECRET="whsec_your_secret"

# Start the server
node dist/index.js
```

You should see the following logs within 2-3 seconds:

```
[Server] Listening on 0.0.0.0:8080
[Server] Environment: production
[Server] Process ID: [some number]
[Database] Connection established
[Static] Production assets mounted
```

If the server doesn't start or crashes, check the error messages carefully. Common issues include:

- **Missing environment variables** - The server may crash if required variables are not set
- **Database connection errors** - While the server should start without a database, some operations may fail
- **Module resolution errors** - Dependencies may not be correctly bundled or installed

### Step 3: Test with Docker Locally

Build and run the Docker container locally to replicate the Cloud Run environment:

```bash
# Build the Docker image
docker build -t optibio-test .

# Run the container with environment variables
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e STRIPE_SECRET_KEY="sk_test_key" \
  -e STRIPE_WEBHOOK_SECRET="whsec_secret" \
  optibio-test
```

The container should start and you should be able to access the application at `http://localhost:8080`. If the container fails to start, check the Docker logs:

```bash
docker logs [container-id]
```

### Step 4: Verify Dockerfile Configuration

Review the Dockerfile to ensure all necessary files are being copied to the container. The critical sections are:

```dockerfile
# In the builder stage - verify build outputs
RUN pnpm run build
RUN ls -la dist/ && \
    test -f dist/index.js && \
    test -d dist/public && \
    test -f dist/public/index.html && \
    echo "✅ Build verification passed"

# In the production stage - copy all artifacts
COPY --from=builder /app/dist ./dist
COPY drizzle ./drizzle
COPY shared ./shared
```

If the build verification step fails during Docker build, the issue is in the build process itself, not the deployment.

## Common Issues and Solutions

### Issue 1: Missing Environment Variables

**Symptom**: Container starts but crashes immediately with errors about undefined environment variables

**Solution**: Ensure all required environment variables are set in Cloud Run:

```bash
gcloud run deploy optibio-ecommerce \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=mysql://...,JWT_SECRET=...,STRIPE_SECRET_KEY=sk_...,STRIPE_WEBHOOK_SECRET=whsec_..."
```

**Required variables**:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret (minimum 32 characters)
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

### Issue 2: Build Artifacts Not Copied

**Symptom**: Container starts but returns 503 errors or "Could not find the build directory" messages

**Solution**: Verify the Dockerfile copies the `dist` directory correctly. The updated Dockerfile includes verification steps:

```dockerfile
# Verify build outputs exist
RUN ls -la dist/ && \
    test -f dist/index.js && \
    test -d dist/public && \
    test -f dist/public/index.html && \
    echo "✅ Build verification passed"
```

If this verification fails during `docker build`, the build process is not generating the expected output structure.

### Issue 3: Slow Startup Exceeding Timeout

**Symptom**: Server starts locally but times out on Cloud Run

**Solution**: The server code has been optimized to start immediately without blocking on database or Vite initialization. However, if startup is still slow, you can increase the Cloud Run startup timeout:

```bash
gcloud run services update optibio-ecommerce \
  --timeout 300 \
  --region us-central1
```

Additionally, check if the database connection is causing delays. The server should log:

```
[Server] Listening on 0.0.0.0:8080
[Database] Connection established
```

If the database log appears several seconds after the server log, the database connection may be slow. Consider using a connection pool or increasing the database timeout.

### Issue 4: Health Check Failing

**Symptom**: Server starts but Cloud Run reports health check failures

**Solution**: The Dockerfile includes a health check that verifies the `/api/trpc/auth.me` endpoint responds:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/api/trpc/auth.me || exit 1
```

Test this endpoint locally to ensure it responds correctly:

```bash
curl http://localhost:8080/api/trpc/auth.me
```

Expected response: `{"result":{"data":null}}` (for unauthenticated requests)

If the endpoint returns an error, check the server logs for issues with the tRPC router configuration.

### Issue 5: Port Binding Issues

**Symptom**: Logs show "EADDRINUSE" or "Port already in use" errors

**Solution**: This has been fixed in the current server configuration. The server now:
- Uses `process.env.PORT || 8080` to read the port from Cloud Run
- Binds to `0.0.0.0` instead of `localhost` (required for container networking)
- Logs the exact host and port on startup for verification

Verify the server logs show:

```
[Server] Listening on 0.0.0.0:8080
```

If the logs show a different host (e.g., `localhost` or `127.0.0.1`), the server configuration needs to be updated.

## Deployment Checklist

Before deploying to Cloud Run, verify the following:

- [ ] **Local build succeeds**: `pnpm run build` completes without errors
- [ ] **Build outputs exist**: `dist/index.js` and `dist/public/index.html` are present
- [ ] **Local server starts**: `node dist/index.js` starts without errors
- [ ] **Docker build succeeds**: `docker build -t optibio-test .` completes without errors
- [ ] **Docker container runs**: `docker run -p 8080:8080 optibio-test` starts successfully
- [ ] **Environment variables set**: All required variables are configured in Cloud Run
- [ ] **Health check passes**: `/api/trpc/auth.me` endpoint responds correctly

## Next Steps

If you have completed all diagnostic steps and the deployment still fails:

1. **Check Cloud Run logs** for detailed error messages:
   ```bash
   gcloud run services logs read optibio-ecommerce --region us-central1 --limit 100
   ```

2. **Enable detailed logging** by adding more console.log statements to the server startup code

3. **Test with minimal configuration** by temporarily removing optional features (database, Stripe) to isolate the issue

4. **Compare with working deployment** - The screenshot shows a successful deployment on Dec 31, 2025 at 9:44:27 PM ("Deploy minimal test server"). Review the differences between that deployment and the failing one.

## Recommended Fix Based on Screenshot

The screenshot shows that a previous deployment succeeded at 9:44:27 PM, but the current deployment at 10:16:32 PM is failing. This suggests that recent changes introduced the issue.

**Recommended action**: Review the changes made between the two deployments and revert any modifications that may have affected the server startup process. The most likely culprits are:

1. Changes to `server/_core/index.ts` (server entry point)
2. Changes to `package.json` scripts (build or start commands)
3. Changes to `Dockerfile` (build or runtime configuration)
4. Missing environment variables in the new deployment

Compare the working deployment configuration with the failing one to identify the differences.

---

**Document Version**: 1.0  
**Last Updated**: December 31, 2025  
**Author**: Manus AI
