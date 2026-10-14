import { betterAuth } from "better-auth";
import { Pool } from "pg";

// PostgreSQL is suitable for Netlify's serverless runtime. Set DATABASE_URL
// in .env.local for development and in Netlify Environment Variables for deploy.
const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      ssl: databaseUrl.includes("localhost") ? undefined : { rejectUnauthorized: false },
    })
  : null;

export const auth = betterAuth({
  ...(pool ? { database: pool } : {}),
  baseURL: process.env.BETTER_AUTH_URL || undefined,
  // Set a unique, random BETTER_AUTH_SECRET (32+ characters) in production.
  secret: process.env.BETTER_AUTH_SECRET || "local-development-only-secret-change-this-32chars",
  emailAndPassword: { enabled: true },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? { github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET } }
      : {}),
  },
  user: { additionalFields: {} },
});
