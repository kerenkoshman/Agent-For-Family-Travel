import { logger } from '../../utils/logger';

describe('Logger Utility', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;

  let logOutput: string[] = [];
  let errorOutput: string[] = [];
  let warnOutput: string[] = [];
  let infoOutput: string[] = [];

  beforeEach(() => {
    logOutput = [];
    errorOutput = [];
    warnOutput = [];
    infoOutput = [];

    // Mock console methods
    console.log = jest.fn((...args) => {
      logOutput.push(args.join(' '));
    });
    console.error = jest.fn((...args) => {
      errorOutput.push(args.join(' '));
    });
    console.warn = jest.fn((...args) => {
      warnOutput.push(args.join(' '));
    });
    console.info = jest.fn((...args) => {
      infoOutput.push(args.join(' '));
    });
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
  });

  describe('info', () => {
    it('should log info messages', () => {
      const message = 'Test info message';
      logger.info(message);

      expect(console.info).toHaveBeenCalled();
      expect(infoOutput[0]).toContain(message);
    });

    it('should log info messages with metadata', () => {
      const message = 'Test info message';
      const metadata = { userId: '123', action: 'login' };
      
      logger.info(message, metadata);

      expect(console.info).toHaveBeenCalled();
      expect(infoOutput[0]).toContain(message);
      expect(infoOutput[0]).toContain('123');
      expect(infoOutput[0]).toContain('login');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const message = 'Test warning message';
      logger.warn(message);

      expect(console.warn).toHaveBeenCalled();
      expect(warnOutput[0]).toContain(message);
    });

    it('should log warning messages with metadata', () => {
      const message = 'Test warning message';
      const metadata = { userId: '123', action: 'login', reason: 'rate_limit' };
      
      logger.warn(message, metadata);

      expect(console.warn).toHaveBeenCalled();
      expect(warnOutput[0]).toContain(message);
      expect(warnOutput[0]).toContain('rate_limit');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(console.error).toHaveBeenCalled();
      expect(errorOutput[0]).toContain(message);
    });

    it('should log error messages with error object', () => {
      const message = 'Test error message';
      const error = new Error('Something went wrong');
      
      logger.error(message, error);

      expect(console.error).toHaveBeenCalled();
      expect(errorOutput[0]).toContain(message);
      expect(errorOutput[0]).toContain('Something went wrong');
    });

    it('should log error messages with metadata', () => {
      const message = 'Test error message';
      const error = new Error('Something went wrong');
      const metadata = { userId: '123', action: 'api_call', endpoint: '/api/test' };
      
      logger.error(message, error, metadata);

      expect(console.error).toHaveBeenCalled();
      expect(errorOutput[0]).toContain(message);
      expect(errorOutput[0]).toContain('Something went wrong');
      expect(errorOutput[0]).toContain('api_call');
      expect(errorOutput[0]).toContain('/api/test');
    });
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const message = 'Test debug message';
      logger.debug(message);

      expect(console.log).toHaveBeenCalled();
      expect(logOutput[0]).toContain(message);

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const message = 'Test debug message';
      logger.debug(message);

      expect(console.log).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('log levels', () => {
    it('should respect log level configuration', () => {
      const message = 'Test message';
      
      logger.info(message);
      logger.warn(message);
      logger.error(message);

      expect(infoOutput.length).toBe(1);
      expect(warnOutput.length).toBe(1);
      expect(errorOutput.length).toBe(1);
    });
  });

  describe('structured logging', () => {
    it('should format structured logs correctly', () => {
      const message = 'API request';
      const metadata = {
        method: 'GET',
        url: '/api/test',
        statusCode: 200,
        responseTime: 150,
        userId: 'user-123',
      };

      logger.info(message, metadata);

      expect(infoOutput[0]).toContain(message);
      expect(infoOutput[0]).toContain('GET');
      expect(infoOutput[0]).toContain('/api/test');
      expect(infoOutput[0]).toContain('200');
      expect(infoOutput[0]).toContain('150');
      expect(infoOutput[0]).toContain('user-123');
    });
  });

  describe('error stack traces', () => {
    it('should include stack traces for errors', () => {
      const message = 'Database connection failed';
      const error = new Error('Connection timeout');
      error.stack = 'Error: Connection timeout\n    at Database.connect (/app/db.js:10:15)';
      
      logger.error(message, error);

      expect(errorOutput[0]).toContain(message);
      expect(errorOutput[0]).toContain('Connection timeout');
      expect(errorOutput[0]).toContain('Database.connect');
    });
  });

  describe('performance logging', () => {
    it('should log performance metrics', () => {
      const message = 'Database query completed';
      const metadata = {
        operation: 'SELECT',
        table: 'users',
        duration: 45,
        rows: 1000,
      };

      logger.info(message, metadata);

      expect(infoOutput[0]).toContain(message);
      expect(infoOutput[0]).toContain('SELECT');
      expect(infoOutput[0]).toContain('users');
      expect(infoOutput[0]).toContain('45');
      expect(infoOutput[0]).toContain('1000');
    });
  });
});
