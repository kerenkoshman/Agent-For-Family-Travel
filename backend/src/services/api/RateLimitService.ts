import { logger } from '../../utils/logger';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
}

export class RateLimitService {
  private limits: Map<string, { count: number; resetTime: number; limit: number }> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    logger.info('Rate Limit Service initialized');
  }

  /**
   * Add a rate limit configuration for an API
   */
  addConfig(apiName: string, config: RateLimitConfig): void {
    this.configs.set(apiName, config);
    logger.info(`Rate limit config added for ${apiName}: ${config.maxRequests} requests per ${config.windowMs}ms`);
  }

  /**
   * Check if a request is allowed
   */
  isAllowed(apiName: string, identifier: string = 'default'): boolean {
    const config = this.configs.get(apiName);
    if (!config) {
      logger.warn(`No rate limit config found for ${apiName}`);
      return true; // Allow if no config
    }

    const key = `${config.keyPrefix}:${apiName}:${identifier}`;
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      // Reset or create new limit
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        limit: config.maxRequests,
      });
      return true;
    }

    if (limit.count >= limit.limit) {
      logger.warn(`Rate limit exceeded for ${apiName}:${identifier}`);
      return false;
    }

    // Increment count
    limit.count++;
    return true;
  }

  /**
   * Get rate limit information
   */
  getLimitInfo(apiName: string, identifier: string = 'default'): RateLimitInfo | null {
    const config = this.configs.get(apiName);
    if (!config) {
      return null;
    }

    const key = `${config.keyPrefix}:${apiName}:${identifier}`;
    const limit = this.limits.get(key);

    if (!limit) {
      return {
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
        limit: config.maxRequests,
      };
    }

    return {
      remaining: Math.max(0, limit.limit - limit.count),
      resetTime: limit.resetTime,
      limit: limit.limit,
    };
  }

  /**
   * Wait until rate limit resets
   */
  async waitForReset(apiName: string, identifier: string = 'default'): Promise<void> {
    const info = this.getLimitInfo(apiName, identifier);
    if (!info || info.remaining > 0) {
      return;
    }

    const waitTime = info.resetTime - Date.now();
    if (waitTime > 0) {
      logger.info(`Waiting ${waitTime}ms for rate limit reset on ${apiName}:${identifier}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Reset rate limit for an API
   */
  reset(apiName: string, identifier: string = 'default'): void {
    const config = this.configs.get(apiName);
    if (!config) {
      return;
    }

    const key = `${config.keyPrefix}:${apiName}:${identifier}`;
    this.limits.delete(key);
    logger.info(`Rate limit reset for ${apiName}:${identifier}`);
  }

  /**
   * Get all rate limit statistics
   */
  getStats(): Record<string, RateLimitInfo[]> {
    const stats: Record<string, RateLimitInfo[]> = {};

    for (const [apiName, config] of this.configs.entries()) {
      stats[apiName] = [];
      
      for (const [key, limit] of this.limits.entries()) {
        if (key.startsWith(`${config.keyPrefix}:${apiName}:`)) {
          const identifier = key.split(':')[2];
          stats[apiName].push({
            remaining: Math.max(0, limit.limit - limit.count),
            resetTime: limit.resetTime,
            limit: limit.limit,
          });
        }
      }
    }

    return stats;
  }

  /**
   * Clean up expired rate limits
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} expired rate limits`);
    }

    return cleanedCount;
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService();

// Initialize default rate limits for common APIs
rateLimitService.addConfig('tripadvisor', {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'rl',
});

rateLimitService.addConfig('google_places', {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'rl',
});

rateLimitService.addConfig('skyscanner', {
  maxRequests: 50,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'rl',
});

rateLimitService.addConfig('booking', {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'rl',
});

rateLimitService.addConfig('weather', {
  maxRequests: 60,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'rl',
});
