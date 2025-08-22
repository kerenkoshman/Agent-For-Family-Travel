import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
      };
      id?: string;
    }
  }
}

export interface JWTPayload {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid authentication token' 
    });
  }

  try {
    const secret = process.env['JWT_SECRET'] || 'your-jwt-secret-key';
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      avatar: decoded.avatar,
    };
    
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return res.status(403).json({ 
      error: 'Invalid token',
      message: 'The provided token is invalid or expired' 
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const secret = process.env['JWT_SECRET'] || 'your-jwt-secret-key';
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      avatar: decoded.avatar,
    };
    
    next();
  } catch (error) {
    logger.warn('Optional auth failed, continuing without user:', error);
    next(); // Continue without authentication
  }
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}): string => {
  const secret = process.env['JWT_SECRET'] || 'your-jwt-secret-key';
  const expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    },
    secret,
    { expiresIn }
  );
};

/**
 * Verify if user is authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource' 
    });
  }
  next();
};
