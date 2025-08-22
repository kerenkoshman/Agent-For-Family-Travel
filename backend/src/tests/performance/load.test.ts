import request from 'supertest';
import app from '../../index';

describe('Performance & Load Tests', () => {
  describe('API Response Times', () => {
    it('should respond to health check within 100ms', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const promises = Array(concurrentRequests).fill(null).map(() =>
        request(app).get('/api/health')
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Average response time should be reasonable
      const averageTime = totalTime / concurrentRequests;
      expect(averageTime).toBeLessThan(200);
    });

    it('should handle database queries efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/v1/tripadvisor/destinations?query=paris')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(500);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on API endpoints', async () => {
      const requests = Array(15).fill(null).map(() =>
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);
      
      // First 10 requests should succeed
      for (let i = 0; i < 10; i++) {
        expect(responses[i].status).toBe(200);
      }
      
      // Remaining requests should be rate limited
      for (let i = 10; i < 15; i++) {
        expect(responses[i].status).toBe(429);
      }
    });

    it('should reset rate limits after time window', async () => {
      // Make requests up to the limit
      for (let i = 0; i < 10; i++) {
        await request(app).get('/api/health').expect(200);
      }
      
      // Next request should be rate limited
      await request(app).get('/api/health').expect(429);
      
      // Wait for rate limit window to reset (mock time)
      jest.advanceTimersByTime(60000); // 1 minute
      
      // Should be able to make requests again
      await request(app).get('/api/health').expect(200);
    });
  });

  describe('Memory Usage', () => {
    it('should not have memory leaks during repeated requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Make many requests
      for (let i = 0; i < 100; i++) {
        await request(app).get('/api/health');
      }
      
      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Database Performance', () => {
    it('should handle database connection pooling efficiently', async () => {
      const concurrentDbRequests = 20;
      const promises = Array(concurrentDbRequests).fill(null).map(() =>
        request(app).get('/api/v1/tripadvisor/destinations?query=paris')
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Database operations should be efficient
      expect(totalTime).toBeLessThan(2000);
    });

    it('should cache database queries appropriately', async () => {
      // First request
      const startTime1 = Date.now();
      await request(app)
        .get('/api/v1/tripadvisor/destinations?query=paris')
        .expect(200);
      const time1 = Date.now() - startTime1;

      // Second request (should be cached)
      const startTime2 = Date.now();
      await request(app)
        .get('/api/v1/tripadvisor/destinations?query=paris')
        .expect(200);
      const time2 = Date.now() - startTime2;

      // Cached request should be faster
      expect(time2).toBeLessThan(time1);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
    });

    it('should handle malformed requests efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .post('/api/agents/plan')
        .send({ invalid: 'data' })
        .expect(400);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(200);
    });
  });

  describe('Security Performance', () => {
    it('should validate input efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/v1/tripadvisor/destinations?query=<script>alert("xss")</script>')
        .expect(400);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
    });

    it('should handle authentication checks efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/protected-endpoint')
        .expect(401);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
    });
  });

  describe('Load Testing', () => {
    it('should handle high load gracefully', async () => {
      const highLoadRequests = 50;
      const promises = Array(highLoadRequests).fill(null).map(() =>
        request(app).get('/api/health')
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // Most requests should succeed (some may be rate limited)
      const successfulRequests = responses.filter(r => r.status === 200).length;
      expect(successfulRequests).toBeGreaterThan(highLoadRequests * 0.8);

      // Average response time should be reasonable
      const averageTime = totalTime / highLoadRequests;
      expect(averageTime).toBeLessThan(300);
    });

    it('should maintain performance under sustained load', async () => {
      const sustainedLoadDuration = 5000; // 5 seconds
      const requestsPerSecond = 10;
      const totalRequests = (sustainedLoadDuration / 1000) * requestsPerSecond;
      
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < totalRequests; i++) {
        promises.push(request(app).get('/api/health'));
        if (i % requestsPerSecond === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // Most requests should succeed
      const successfulRequests = responses.filter(r => r.status === 200).length;
      expect(successfulRequests).toBeGreaterThan(totalRequests * 0.7);

      // Performance should remain consistent
      expect(totalTime).toBeLessThan(sustainedLoadDuration * 1.5);
    });
  });
});
