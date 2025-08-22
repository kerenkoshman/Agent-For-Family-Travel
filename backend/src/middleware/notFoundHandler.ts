import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const message = `Route ${req.originalUrl} not found`;

  logger.warn({
    message: 'Route not found',
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      requestId: (req as any).id,
    },
  });

  res.status(404).json({
    success: false,
    message,
    error: 'Not Found',
    path: req.originalUrl,
  });
};
