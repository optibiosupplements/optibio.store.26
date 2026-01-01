# ============================================
# OPTIBIO CLOUD RUN DOCKERFILE
# ============================================
# Multi-stage build optimized for Google Cloud Run
# Fixes: Port binding, static assets, ESM modules, healthcheck

# ============================================
# STAGE 1: BUILD
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.4.1

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
# - Client: Vite builds to dist/public
# - Server: esbuild bundles to dist/index.js
RUN pnpm run build

# Verify build outputs exist
RUN ls -la dist/ && \
    test -f dist/index.js && \
    test -d dist/public && \
    test -f dist/public/index.html && \
    echo "✅ Build verification passed"

# ============================================
# STAGE 2: PRODUCTION
# ============================================
FROM node:22-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.4.1

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy database schema (required for runtime migrations)
COPY drizzle ./drizzle

# Copy shared types (if referenced by server code)
COPY shared ./shared

# Create non-root user for security (Cloud Run best practice)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port 8080 (Cloud Run default)
# Cloud Run will override with PORT environment variable
EXPOSE 8080

# Environment variable documentation (set these in Cloud Run)
# Required:
# - DATABASE_URL: MySQL connection string
# - JWT_SECRET: Session signing secret
# - STRIPE_SECRET_KEY: Stripe API key
# - STRIPE_WEBHOOK_SECRET: Stripe webhook signing secret
# Optional:
# - NODE_ENV: production (default)
# - PORT: 8080 (Cloud Run sets this automatically)

# Health check for container orchestration
# Uses wget instead of node require() for ESM compatibility
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/api/trpc/auth.me || exit 1

# Start production server
# Cloud Run will set PORT environment variable
CMD ["node", "dist/index.js"]
