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
  // SECURITY MIDDLEWARE
  // ============================================>
  
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
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "8080", 10);

  server.listen({ port, host: '0.0.0.0' }, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);
