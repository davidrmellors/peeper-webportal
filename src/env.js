/**
 * Environment Configuration
 * 
 * Manages and validates environment variables using Zod.
 * Includes:
 * - Firebase configuration
 * - Clerk authentication keys
 * - SendGrid API configuration
 * - Environment-specific settings
 * 
 * Uses t3-oss/env-nextjs for type-safe environment variables
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    FIREBASE_DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SENDGRID_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
