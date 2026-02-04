import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { handleStripeWebhook } from "../webhooks";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // ============================================
  // CANONICAL URL REDIRECT (www → non-www)
  // ============================================
  // This MUST be the VERY FIRST middleware to ensure:
  // 1. Session cookies work correctly (same domain)
  // 2. Shopping cart persists across all visits
  // 3. Login state is unified
  // 4. SEO signals are consolidated (no duplicate content)
  // Redirects www.optibiosupplements.com → optibiosupplements.com
  app.use((req, res, next) => {
    const host = req.headers.host || '';
    const forwardedHost = req.headers['x-forwarded-host'] as string || '';
    const effectiveHost = forwardedHost || host;
    
    // Log all incoming requests for debugging
    if (effectiveHost.includes('optibiosupplements')) {
      console.log(`[Request] Host: ${effectiveHost}, Path: ${req.originalUrl}, X-Forwarded-Host: ${forwardedHost}`);
    }
    
    // Check if this is a www request that needs redirecting
    const isWwwRequest = effectiveHost.startsWith('www.');
    const isDevEnvironment = effectiveHost.includes('localhost') || 
                             effectiveHost.includes('manus') || 
                             effectiveHost.includes('127.0.0.1');
    
    if (isWwwRequest && !isDevEnvironment) {
      const newHost = effectiveHost.replace(/^www\./, '');
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const redirectUrl = `${protocol}://${newHost}${req.originalUrl}`;
      
      console.log(`[REDIRECT 301] www → non-www: ${effectiveHost}${req.originalUrl} → ${redirectUrl}`);
      
      // Set cache headers to ensure browsers remember this redirect
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
      res.setHeader('Vary', 'Host');
      
      // 301 Permanent Redirect for SEO
      return res.redirect(301, redirectUrl);
    }
    
    next();
  });
  
  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================
  
  // 1. CORS - Restrict API access to your domain only
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://optibiosupplements.com',
    'https://www.optibiosupplements.com',
    // Add Manus domains (they use dynamic subdomains)
    ...(process.env.VITE_APP_URL ? [process.env.VITE_APP_URL] : []),
  ].filter(Boolean);
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);
      
      // In development, allow all localhost and Manus preview domains
      if (isDevelopment) {
        if (origin.includes('localhost') || 
            origin.includes('manus.computer') || 
            origin.includes('manusvm.computer')) {
          return callback(null, true);
        }
      }
      
      // In production, strictly check allowed origins
      if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  // 2. Security Headers - Helmet.js
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://client.crisp.chat"],
        frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
        connectSrc: ["'self'", "https://api.stripe.com", "https://client.crisp.chat", "wss://client.relay.crisp.chat"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny', // Prevent clickjacking
    },
    noSniff: true, // Prevent MIME-sniffing
    xssFilter: true, // Enable XSS filter
  }));
  
  // 3. Rate Limiting - Prevent scraping and DDoS
  
  // General API rate limit (100 requests per 15 minutes per IP)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Strict rate limit for authentication endpoints (5 attempts per 15 minutes)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Checkout rate limit (10 attempts per 15 minutes)
  const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many checkout attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Apply rate limiters to specific routes
  app.use('/api/trpc', apiLimiter);
  app.use('/api/oauth', authLimiter);
  
  // ============================================
  // END SECURITY MIDDLEWARE
  // ============================================
  
  // Stripe webhook endpoint (must be before body parser middleware)
  // Stripe requires raw body for signature verification
  // Support both /api/webhooks/stripe and /api/stripe/webhook for compatibility
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );
  
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ============================================
  // CLOUD RUN COMPLIANCE: NON-BLOCKING STARTUP
  // ============================================
  
  // CRITICAL: Start server IMMEDIATELY before any blocking operations
  // Use process.env.PORT (Cloud Run requirement) with 0.0.0.0 binding
  const PORT = parseInt(process.env.PORT || "8080", 10);
  const HOST = "0.0.0.0";
  
  server.listen(PORT, HOST, () => {
    // CRITICAL: Log exact port and host for Cloud Logging verification
    console.log(`[Server] Listening on ${HOST}:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`[Server] Process ID: ${process.pid}`);
  });

  // ============================================
  // POST-STARTUP: ASYNC INITIALIZATION
  // ============================================
  
  // Initialize database connection AFTER server starts (non-blocking)
  // This prevents timeout errors if DB is slow or unavailable
  (async () => {
    try {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (db) {
        console.log("[Database] Connection established");
      } else {
        console.warn("[Database] Not configured - running without database");
      }
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      console.warn("[Database] Server will continue in degraded mode");
      // Server stays online even if DB fails
    }
  })();
  
  // Initialize email scheduler AFTER server starts
  // This ensures database is ready before scheduling emails
  (async () => {
    try {
      // Wait a bit for database to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { startEmailScheduler } = await import("../email-scheduler");
      startEmailScheduler();
    } catch (error) {
      console.error("[EmailScheduler] Failed to start:", error);
      console.warn("[EmailScheduler] Server will continue without email automation");
    }
  })();
  
  // Setup Vite or static serving AFTER server starts
  // This prevents blocking if Vite setup is slow
  (async () => {
    try {
      if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
        console.log("[Vite] Development server ready");
      } else {
        serveStatic(app);
        console.log("[Static] Production assets mounted");
      }
    } catch (error) {
      console.error("[Frontend] Failed to setup:", error);
      // Serve a basic maintenance page if frontend setup fails
      app.use("*", (req, res) => {
        res.status(503).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>OptiBio - Maintenance</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%);
                  color: white;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  max-width: 500px;
                }
                h1 {
                  font-size: 2.5rem;
                  margin-bottom: 1rem;
                  color: #C9A961;
                }
                p {
                  font-size: 1.125rem;
                  line-height: 1.6;
                  opacity: 0.9;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>OptiBio</h1>
                <p>We're performing maintenance to serve you better.</p>
                <p>Please check back in a few minutes.</p>
              </div>
            </body>
          </html>
        `);
      });
    }
  })();
}

startServer().catch((error) => {
  console.error("[Server] Fatal startup error:", error);
  process.exit(1);
});
