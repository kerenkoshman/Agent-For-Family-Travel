import request from 'supertest';
import app from '../../index';

describe('Security Tests', () => {
  describe('Input Validation & Sanitization', () => {
    it('should prevent SQL injection attacks', async () => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users VALUES ('hacker', 'password'); --",
        "' UNION SELECT * FROM users --",
      ];

      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .get(`/api/v1/tripadvisor/destinations?query=${encodeURIComponent(payload)}`)
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('Invalid input');
      }
    });

    it('should prevent XSS attacks', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(\'xss\')">',
        '<svg onload="alert(\'xss\')">',
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .post('/api/agents/plan')
          .send({
            familyProfile: {
              name: payload,
              preferences: { interests: [payload] },
            },
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('Invalid input');
      }
    });

    it('should prevent NoSQL injection attacks', async () => {
      const nosqlPayloads = [
        { $gt: '' },
        { $ne: null },
        { $where: 'function() { return true; }' },
      ];

      for (const payload of nosqlPayloads) {
        const response = await request(app)
          .post('/api/agents/plan')
          .send({
            familyProfile: {
              name: 'Test',
              preferences: payload,
            },
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      }
    });

    it('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test..test@example.com',
        'test@example..com',
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({ email })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('email');
      }
    });

    it('should validate date formats', async () => {
      const invalidDates = [
        'invalid-date',
        '2024-13-01',
        '2024-00-01',
        '2024-12-32',
      ];

      for (const date of invalidDates) {
        const response = await request(app)
          .post('/api/agents/plan')
          .send({
            tripPreferences: {
              startDate: date,
              endDate: '2024-12-31',
            },
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      }
    });
  });

  describe('Authentication & Authorization', () => {
    it('should require authentication for protected routes', async () => {
      const protectedRoutes = [
        { method: 'GET', path: '/api/trips' },
        { method: 'POST', path: '/api/trips' },
        { method: 'GET', path: '/api/profile' },
        { method: 'PUT', path: '/api/profile' },
      ];

      for (const route of protectedRoutes) {
        const response = await request(app)
          [route.method.toLowerCase()](route.path)
          .expect(401);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('authentication');
      }
    });

    it('should validate JWT tokens properly', async () => {
      const invalidTokens = [
        'invalid-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        'expired.token.here',
      ];

      for (const token of invalidTokens) {
        const response = await request(app)
          .get('/api/trips')
          .set('Authorization', `Bearer ${token}`)
          .expect(401);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('token');
      }
    });

    it('should prevent privilege escalation', async () => {
      // Test that users cannot access other users' data
      const user1Token = 'valid-jwt-token-for-user-1';
      const user2Id = 'user-2-id';

      const response = await request(app)
        .get(`/api/users/${user2Id}/trips`)
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(403);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('forbidden');
    });
  });

  describe('Rate Limiting & DDoS Protection', () => {
    it('should enforce rate limits on authentication endpoints', async () => {
      const authEndpoints = [
        '/api/auth/google',
        '/api/auth/login',
        '/api/auth/register',
      ];

      for (const endpoint of authEndpoints) {
        // Make requests up to the limit
        for (let i = 0; i < 5; i++) {
          await request(app).post(endpoint).expect(400); // Invalid data, but counts toward limit
        }

        // Next request should be rate limited
        const response = await request(app).post(endpoint).expect(429);
        expect(response.body.error).toContain('rate limit');
      }
    });

    it('should prevent brute force attacks', async () => {
      const loginAttempts = Array(10).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrong-password' })
      );

      const responses = await Promise.all(loginAttempts);

      // First few attempts should fail normally
      for (let i = 0; i < 5; i++) {
        expect(responses[i].status).toBe(401);
      }

      // Later attempts should be rate limited
      for (let i = 5; i < 10; i++) {
        expect(responses[i].status).toBe(429);
      }
    });
  });

  describe('Data Validation & Sanitization', () => {
    it('should sanitize user input', async () => {
      const maliciousInput = {
        name: '<script>alert("xss")</script>Test User',
        description: 'Test description with <img src="x" onerror="alert(\'xss\')">',
        preferences: {
          interests: ['<script>alert("xss")</script>beaches'],
        },
      };

      const response = await request(app)
        .post('/api/agents/plan')
        .send({
          familyProfile: maliciousInput,
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('Invalid input');
    });

    it('should validate file uploads', async () => {
      const maliciousFiles = [
        { name: 'virus.exe', type: 'application/x-msdownload' },
        { name: 'script.php', type: 'application/x-httpd-php' },
        { name: 'shell.sh', type: 'application/x-sh' },
      ];

      for (const file of maliciousFiles) {
        const response = await request(app)
          .post('/api/upload')
          .attach('file', Buffer.from('fake content'), file.name)
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('file type');
      }
    });

    it('should prevent path traversal attacks', async () => {
      const pathTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '....//....//....//etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
      ];

      for (const payload of pathTraversalPayloads) {
        const response = await request(app)
          .get(`/api/files/${payload}`)
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('Invalid path');
      }
    });
  });

  describe('CORS & Headers', () => {
    it('should set proper security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
      expect(response.headers).toHaveProperty('strict-transport-security');
    });

    it('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'https://malicious-site.com')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).not.toBe('*');
    });

    it('should prevent clickjacking', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('Error Handling & Information Disclosure', () => {
    it('should not expose sensitive information in error messages', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).not.toContain('stack trace');
      expect(response.body.error).not.toContain('internal');
      expect(response.body.error).not.toContain('database');
    });

    it('should not expose database errors', async () => {
      // Mock database error
      const response = await request(app)
        .get('/api/v1/tripadvisor/destinations?query=paris')
        .expect(500);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).not.toContain('SQL');
      expect(response.body.error).not.toContain('database');
      expect(response.body.error).not.toContain('connection');
    });

    it('should not expose file system paths', async () => {
      const response = await request(app)
        .get('/api/nonexistent-file')
        .expect(404);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).not.toContain('/var/www');
      expect(response.body.error).not.toContain('C:\\');
    });
  });

  describe('API Security', () => {
    it('should validate API keys properly', async () => {
      const invalidApiKeys = [
        'invalid-key',
        '',
        '1234567890',
        'api-key-without-proper-format',
      ];

      for (const apiKey of invalidApiKeys) {
        const response = await request(app)
          .get('/api/v1/tripadvisor/destinations?query=paris')
          .set('X-API-Key', apiKey)
          .expect(401);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('API key');
      }
    });

    it('should prevent parameter pollution', async () => {
      const response = await request(app)
        .get('/api/v1/tripadvisor/destinations?query=paris&query=malicious')
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('duplicate');
    });

    it('should validate request size limits', async () => {
      const largePayload = {
        data: 'x'.repeat(1024 * 1024), // 1MB payload
      };

      const response = await request(app)
        .post('/api/agents/plan')
        .send(largePayload)
        .expect(413);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('too large');
    });
  });
});
