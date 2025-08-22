import { logger } from '../../utils/logger';
import { apiCache } from './ApiCacheService';
import { rateLimitService } from './RateLimitService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  cached?: boolean;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
    limit: number;
  };
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  useCache?: boolean;
  cacheTTL?: number;
  apiName?: string;
  rateLimitIdentifier?: string;
}

export abstract class BaseApiClient {
  protected baseUrl: string;
  protected apiKey: string;
  protected timeout: number;
  protected retries: number;
  protected apiName: string;

  constructor(baseUrl: string, apiKey: string, apiName: string, timeout = 10000, retries = 3) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiName = apiName;
    this.timeout = timeout;
    this.retries = retries;
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = this.retries,
      useCache = true,
      cacheTTL,
      rateLimitIdentifier = 'default',
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add API key if not already present
    if (!requestHeaders['Authorization'] && !requestHeaders['X-API-Key']) {
      requestHeaders['X-API-Key'] = this.apiKey;
    }

    // Check cache for GET requests
    if (method === 'GET' && useCache) {
      const cacheKey = apiCache.generateKey(`${this.apiName}:${endpoint}`, { headers: requestHeaders, body });
      const cachedData = apiCache.getWithCleanup<T>(cacheKey);
      
      if (cachedData) {
        logger.info(`Cache hit for ${this.apiName}: ${endpoint}`);
        return {
          success: true,
          data: cachedData,
          statusCode: 200,
          cached: true,
        };
      }
    }

    // Check rate limiting
    if (!rateLimitService.isAllowed(this.apiName, rateLimitIdentifier)) {
      logger.warn(`Rate limit exceeded for ${this.apiName}:${rateLimitIdentifier}`);
      await rateLimitService.waitForReset(this.apiName, rateLimitIdentifier);
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info(`API Request: ${method} ${url} (attempt ${attempt}/${retries})`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        } as RequestInit);

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json() as T;

        logger.info(`API Response: ${method} ${url} - Status: ${response.status}`);

        // Cache successful GET responses
        if (method === 'GET' && useCache) {
          const cacheKey = apiCache.generateKey(`${this.apiName}:${endpoint}`, { headers: requestHeaders, body });
          apiCache.set(cacheKey, data, cacheTTL);
        }

        const rateLimitInfo = rateLimitService.getLimitInfo(this.apiName, rateLimitIdentifier);

        return {
          success: true,
          data,
          statusCode: response.status,
          rateLimitInfo: rateLimitInfo || undefined,
        };
      } catch (error) {
        lastError = error as Error;
        logger.warn(`API Request failed (attempt ${attempt}/${retries}): ${error}`);

        if (attempt === retries) {
          break;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    logger.error(`API Request failed after ${retries} attempts: ${lastError}`);
    return {
      success: false,
      error: lastError?.message || 'Request failed',
      statusCode: 500,
    };
  }

  protected async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers: headers || {} });
  }

  protected async post<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', headers: headers || {}, body });
  }

  protected async put<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', headers: headers || {}, body });
  }

  protected async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers: headers || {} });
  }

  protected validateApiKey(): boolean {
    // Always use mock data by default to avoid paid API calls
    if (!this.apiKey || this.apiKey === 'your_api_key_here' || this.apiKey.includes('your_')) {
      logger.info(`Using mock data for ${this.apiName} - API key not configured or using placeholder`);
      return false;
    }
    return true;
  }

  protected getMockData<T>(mockData: T): ApiResponse<T> {
    logger.info('Using mock data for API request');
    return {
      success: true,
      data: mockData,
      statusCode: 200,
    };
  }
}
