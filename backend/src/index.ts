import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { configurePassport } from './config/passport';
import { testConnection, runMigrations } from './config/database';
import { validateConfig } from './config/environment';

// Load environment variables
dotenv.config();

// Validate configuration
validateConfig();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:5173',
  credentials: true,
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env['SESSION_SECRET'] || 'your-super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env['NODE_ENV'] === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
configurePassport();

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Request ID middleware for tracking
app.use((req, _res, next) => {
  req.id = Math.random().toString(36).substring(7);
  next();
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// API versioning
app.use('/api/v1', (req, _res, next) => {
  logger.info(`API v1 request: ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Run database migrations
    await runMigrations();

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/api/health`);
      logger.info(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
      logger.info(`🗄️ Database: Connected and migrations completed`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
