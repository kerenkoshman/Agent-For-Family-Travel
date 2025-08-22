import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { checkDatabaseHealth } from '../config/database';

const router = Router();

// Basic health check
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Health check requested', {
    requestId: (req as any).id,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
}));

// Detailed health check with system info
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Detailed health check requested', {
    requestId: (req as any).id,
    timestamp: new Date().toISOString(),
  });

  // Check database health
  const dbHealth = await checkDatabaseHealth();

  const healthInfo = {
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      cpu: process.cpuUsage(),
    },
    services: {
      database: dbHealth,
      externalApis: 'unknown', // Will be updated when APIs are configured
    },
  };

  res.status(200).json(healthInfo);
}));

// Readiness check for Kubernetes
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
  // Check database health
  const dbHealth = await checkDatabaseHealth();
  
  // Server is ready if database is healthy
  const isReady = dbHealth.status === 'healthy';

  if (isReady) {
    res.status(200).json({
      success: true,
      message: 'Server is ready',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
      },
    });
  } else {
    res.status(503).json({
      success: false,
      message: 'Server is not ready',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
      },
    });
  }
}));

// Liveness check for Kubernetes
router.get('/live', asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}));

export { router as healthRouter };
