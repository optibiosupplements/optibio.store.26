import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * Rate limiting middleware to prevent API abuse
 * Protects against DDoS attacks and excessive usage
 */

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded general API rate limit`);
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded auth rate limit`);
    res.status(429).json({
      error: "Too many authentication attempts, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Moderate rate limiter for checkout/payment endpoints
 * 10 requests per 15 minutes per IP
 * Prevents payment spam and fraud attempts
 */
export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: "Too many checkout attempts, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded checkout rate limit`);
    res.status(429).json({
      error: "Too many checkout attempts, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Lenient rate limiter for public content endpoints
 * 300 requests per 15 minutes per IP
 * Allows browsing but prevents scraping
 */
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    error: "Too many requests, please slow down.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded public rate limit`);
    res.status(429).json({
      error: "Too many requests, please slow down.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Very strict rate limiter for password reset/sensitive operations
 * 3 requests per hour per IP
 */
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    error: "Too many attempts for this sensitive operation, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded sensitive operation rate limit`);
    res.status(429).json({
      error: "Too many attempts for this sensitive operation, please try again later.",
      retryAfter: "1 hour",
    });
  },
});

/**
 * Rate limiter for email sending endpoints
 * 10 emails per hour per IP
 * Prevents email spam
 */
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 emails per hour
  message: {
    error: "Too many emails sent, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded email rate limit`);
    res.status(429).json({
      error: "Too many emails sent, please try again later.",
      retryAfter: "1 hour",
    });
  },
});

/**
 * Rate limiter for cart operations
 * 50 requests per 15 minutes per IP
 * Allows normal shopping but prevents abuse
 */
export const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    error: "Too many cart operations, please slow down.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[Rate Limit] IP ${req.ip} exceeded cart rate limit`);
    res.status(429).json({
      error: "Too many cart operations, please slow down.",
      retryAfter: "15 minutes",
    });
  },
});
