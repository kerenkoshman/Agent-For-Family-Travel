import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { logger } from '../utils/logger';

// Mock user database - replace with actual database calls
const users: Record<string, any> = {};

export interface GoogleUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  googleId?: string;
}

/**
 * Configure Passport.js with Google OAuth strategy
 */
export const configurePassport = () => {
  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser((id: string, done) => {
    const user = users[id];
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  });

  // Google OAuth Strategy - only configure if credentials are available
  if (process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env['GOOGLE_CLIENT_ID']!,
          clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
          callbackURL: '/api/auth/google/callback',
          scope: ['profile', 'email'],
        },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          logger.info('Google OAuth callback received for profile:', profile.id);

          // Extract user information from Google profile
          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName;
          const lastName = profile.name?.familyName;
          const avatar = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('Email not provided by Google'), undefined);
          }

          // Check if user already exists
          let user = Object.values(users).find(u => u.email === email);

          if (user) {
            // Update existing user with latest Google info
            user.googleId = profile.id;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.avatar = avatar || user.avatar;
            
            logger.info('Updated existing user:', user.email);
            return done(null, user);
          }

          // Create new user
          const newUser: GoogleUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            avatar: avatar || undefined,
            googleId: profile.id,
          };

          users[newUser.id] = newUser;
          
          logger.info('Created new user:', newUser.email);
          return done(null, newUser);
        } catch (error) {
          logger.error('Error in Google OAuth strategy:', error);
          return done(error, undefined);
        }
      }
    )
  );
    logger.info('Passport.js configured with Google OAuth strategy');
  } else {
    logger.warn('Google OAuth credentials not configured. Google login will not work.');
  }
};

/**
 * Get user by ID (for testing/debugging)
 */
export const getUserById = (id: string): GoogleUser | null => {
  return users[id] || null;
};

/**
 * Get user by email (for testing/debugging)
 */
export const getUserByEmail = (email: string): GoogleUser | null => {
  return Object.values(users).find(u => u.email === email) || null;
};

/**
 * Get all users (for testing/debugging)
 */
export const getAllUsers = (): GoogleUser[] => {
  return Object.values(users);
};
