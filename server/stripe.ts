import Stripe from "stripe";
import { ENV } from "./_core/env";

// Development override: Use these test keys in development
// Replace with your actual Stripe test keys from dashboard
const STRIPE_TEST_SECRET_KEY = "sk_test_51RbNWiS1rUgT26327evVpoEc2pk04YpeCGtt4ylXTdyywQT3SB9nzsAmePQUURxuqH1fGMdMsfdpGxm25aose9o900apTg0YaU";
const STRIPE_TEST_PUBLISHABLE_KEY = "pk_test_51RbNWiS1rUgT2632O3dpneWIux9kupoM4CaAJYgO6yse2FrbhxF1Ga7Vq199Ads0O5edbQTe9Agqwrk3EMtyFvqb000HZNbZe";

// Use development override in development, otherwise use ENV
const isDevelopment = process.env.NODE_ENV === 'development';
const stripeSecretKey = isDevelopment ? STRIPE_TEST_SECRET_KEY : ENV.stripeSecretKey;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

// Export the publishable key for use in other parts of the app
// In production, this should be set via VITE_STRIPE_PUBLISHABLE_KEY environment variable
export const STRIPE_PUBLISHABLE_KEY = isDevelopment ? STRIPE_TEST_PUBLISHABLE_KEY : (process.env.VITE_STRIPE_PUBLISHABLE_KEY || STRIPE_TEST_PUBLISHABLE_KEY);
