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

  // Start listening immediately so the server doesn't hang
  const port = Number(process.env.PORT) || 8080;
  const host = '0.0.0.0';
  app.listen(port, host, () => { 
    console.log(`Server is running aggressively on http://${host}:${port}`); 
  });

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================>
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://optibiosupplements.com',
    'https://www.optibiosupplements.com',
    ...(process.env.VITE_APP_URL ? [process.env.VITE_APP_URL] : []),
  ].filter(Boolean);
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (isDevelopment) {
        if (origin.includes('localhost') || origin.includes('manus.computer') || origin.includes('manusvm.computer')) {
          return callback(null, true);
        }
      }
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
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
  }));
  
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use('/api/trpc', apiLimiter);
  app.use('/api/oauth', authLimiter);
  
  // ============================================
  // END SECURITY MIDDLEWARE
  // ============================================
  
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
  
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Run DB connection and related setup in the background
  try {
    registerOAuthRoutes(app);
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
  } catch (e) {
    console.error('Error during post-listen setup (DB, etc), but server is running:', e);
  }

  // Vite for development, static files for production
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
}

startServer().catch(console.error);