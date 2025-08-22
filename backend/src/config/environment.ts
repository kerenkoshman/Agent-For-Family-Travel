import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variable validation
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'SESSION_SECRET',
];

const optionalEnvVars = [
  'FRONTEND_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'TRIPADVISOR_API_KEY',
  'GOOGLE_PLACES_API_KEY',
  'SKYSCANNER_API_KEY',
  'BOOKING_API_KEY',
];

// Check for required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Environment configuration
export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Authentication
  SESSION_SECRET: process.env.SESSION_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // External APIs
  TRIPADVISOR_API_KEY: process.env.TRIPADVISOR_API_KEY,
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
  SKYSCANNER_API_KEY: process.env.SKYSCANNER_API_KEY,
  BOOKING_API_KEY: process.env.BOOKING_API_KEY,

  // Feature flags
  ENABLE_LOGGING: process.env.ENABLE_LOGGING !== 'false',
  ENABLE_CORS: process.env.ENABLE_CORS !== 'false',
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',
} as const;

// Type for environment configuration
export type Config = typeof config;

// Helper functions
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';

// Validate configuration
export const validateConfig = (): void => {
  const missingOptionalVars = optionalEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingOptionalVars.length > 0) {
    console.warn(
      `Warning: Missing optional environment variables: ${missingOptionalVars.join(
        ', '
      )}`
    );
  }
};

// Export default configuration
export default config;
