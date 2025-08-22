import { logger } from '../../utils/logger';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ApiCacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(defaultTTL?: number) {
    this.defaultTTL = defaultTTL || this.defaultTTL;
    logger.info(`API Cache Service initialized with TTL: ${this.defaultTTL}ms`);
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Entry has expired, remove it
      this.cache.delete(key);
      logger.debug(`Cache entry expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return entry.data;
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
    logger.debug(`Cache set: ${key} (TTL: ${entry.ttl}ms)`);
  }

  /**
   * Remove a value from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} expired cache entries`);
    }

    return cleanedCount;
  }

  /**
   * Generate a cache key from parameters
   */
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${prefix}:${sortedParams}`;
  }

  /**
   * Get cache entry with automatic cleanup
   */
  getWithCleanup<T>(key: string): T | null {
    // Clean up expired entries periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup
      this.cleanup();
    }

    return this.get<T>(key);
  }
}

// Export singleton instance
export const apiCache = new ApiCacheService();
