import { Router, Request, Response } from 'express';
import passport from 'passport';
import { generateToken, authenticateToken, requireAuth } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth login
 * @access  Public
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        logger.error('No user found in OAuth callback');
        return res.redirect(`${process.env['FRONTEND_URL']}/login?error=authentication_failed`);
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      });

      logger.info('User authenticated successfully:', user.email);

      // Redirect to frontend with token
      const redirectUrl = `${process.env['FRONTEND_URL']}/auth/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(user))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      logger.error('Error in OAuth callback:', error);
      res.redirect(`${process.env['FRONTEND_URL']}/login?error=token_generation_failed`);
    }
  }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, (req: Request, res: Response) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    logger.info('User logged out:', req.user?.email);
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    logger.error('Error during logout:', error);
    res.status(500).json({ 
      error: 'Logout failed',
      message: 'An error occurred during logout' 
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, requireAuth, (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'No authenticated user found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({ 
      error: 'Failed to get user profile',
      message: 'An error occurred while fetching user profile' 
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'No authenticated user found' 
      });
    }

    // Generate new token
    const newToken = generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    });

    logger.info('Token refreshed for user:', user.email);

    res.json({
      success: true,
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    res.status(500).json({ 
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing the token' 
    });
  }
});

/**
 * @route   GET /api/auth/status
 * @desc    Check authentication status
 * @access  Public
 */
router.get('/status', authenticateToken, (req: Request, res: Response) => {
  if (req.user) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar,
      }
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

export { router as authRouter };
