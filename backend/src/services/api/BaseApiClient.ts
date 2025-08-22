import { logger } from '../../utils/logger';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export abstract class BaseApiClient {
  protected baseUrl: string;
  protected apiKey: string;
  protected timeout: number;
  protected retries: number;

  constructor(baseUrl: string, apiKey: string, timeout = 10000, retries = 3) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
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
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add API key if not already present
    if (!requestHeaders['Authorization'] && !requestHeaders['X-API-Key']) {
      requestHeaders['X-API-Key'] = this.apiKey;
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
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        logger.info(`API Response: ${method} ${url} - Status: ${response.status}`);

        return {
          success: true,
          data,
          statusCode: response.status,
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
    return this.makeRequest<T>(endpoint, { method: 'GET', headers });
  }

  protected async post<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', headers, body });
  }

  protected async put<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', headers, body });
  }

  protected async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers });
  }

  protected validateApiKey(): boolean {
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      logger.warn('API key not configured - using mock data');
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
