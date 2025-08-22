import request from 'supertest';
import app from '../../index';
import { db } from '../../config/database';
import { databaseUtils } from '../../utils/database';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Clear test data and set up test environment
    await databaseUtils.clearAllData();
  });

  afterAll(async () => {
    // Clean up test data
    await databaseUtils.clearAllData();
  });

  describe('Authentication Endpoints', () => {
    describe('GET /api/auth/google', () => {
      it('should redirect to Google OAuth', async () => {
        const response = await request(app)
          .get('/api/auth/google')
          .expect(302);

        expect(response.header.location).toContain('accounts.google.com');
        expect(response.header.location).toContain('oauth');
      });
    });

    describe('GET /api/auth/google/callback', () => {
      it('should handle OAuth callback with valid code', async () => {
        // Mock OAuth callback with valid code
        const response = await request(app)
          .get('/api/auth/google/callback?code=valid_code')
          .expect(302);

        expect(response.header.location).toContain('callback');
      });

      it('should handle OAuth callback with invalid code', async () => {
        const response = await request(app)
          .get('/api/auth/google/callback?code=invalid_code')
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/auth/logout', () => {
      it('should logout user successfully', async () => {
        const response = await request(app)
          .post('/api/auth/logout')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Logged out successfully');
      });
    });
  });

  describe('TripAdvisor API Endpoints', () => {
    describe('GET /api/v1/tripadvisor/destinations', () => {
      it('should search destinations', async () => {
        const response = await request(app)
          .get('/api/v1/tripadvisor/destinations?query=paris')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should handle empty query', async () => {
        const response = await request(app)
          .get('/api/v1/tripadvisor/destinations')
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('GET /api/v1/tripadvisor/attractions', () => {
      it('should search attractions', async () => {
        const response = await request(app)
          .get('/api/v1/tripadvisor/attractions?location=paris&type=attractions')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('GET /api/v1/tripadvisor/restaurants', () => {
      it('should search restaurants', async () => {
        const response = await request(app)
          .get('/api/v1/tripadvisor/restaurants?location=paris&cuisine=french')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });

  describe('Google Places API Endpoints', () => {
    describe('GET /api/v1/google-places/search', () => {
      it('should search places', async () => {
        const response = await request(app)
          .get('/api/v1/google-places/search?query=eiffel tower&location=paris')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should handle missing query parameter', async () => {
        const response = await request(app)
          .get('/api/v1/google-places/search')
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('GET /api/v1/google-places/details', () => {
      it('should get place details', async () => {
        const response = await request(app)
          .get('/api/v1/google-places/details?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('placeId');
      });
    });

    describe('GET /api/v1/google-places/nearby', () => {
      it('should find nearby places', async () => {
        const response = await request(app)
          .get('/api/v1/google-places/nearby?lat=48.8584&lng=2.2945&radius=1000&type=restaurant')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });

  describe('Skyscanner API Endpoints', () => {
    describe('GET /api/v1/skyscanner/flights', () => {
      it('should search flights', async () => {
        const response = await request(app)
          .get('/api/v1/skyscanner/flights?origin=JFK&destination=CDG&date=2024-06-01')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should handle missing required parameters', async () => {
        const response = await request(app)
          .get('/api/v1/skyscanner/flights?origin=JFK')
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('GET /api/v1/skyscanner/flights/quote', () => {
      it('should get flight quote', async () => {
        const response = await request(app)
          .get('/api/v1/skyscanner/flights/quote?quoteId=test-quote-id')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      });
    });
  });

  describe('Booking.com API Endpoints', () => {
    describe('GET /api/v1/booking/accommodations', () => {
      it('should search accommodations', async () => {
        const response = await request(app)
          .get('/api/v1/booking/accommodations?destination=paris&checkIn=2024-06-01&checkOut=2024-06-08&guests=2')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('GET /api/v1/booking/accommodations/details', () => {
      it('should get accommodation details', async () => {
        const response = await request(app)
          .get('/api/v1/booking/accommodations/details?hotelId=test-hotel-id')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      });
    });
  });

  describe('Weather API Endpoints', () => {
    describe('GET /api/v1/weather/current', () => {
      it('should get current weather', async () => {
        const response = await request(app)
          .get('/api/v1/weather/current?lat=48.8584&lng=2.2945')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('temperature');
        expect(response.body.data).toHaveProperty('description');
      });
    });

    describe('GET /api/v1/weather/forecast', () => {
      it('should get weather forecast', async () => {
        const response = await request(app)
          .get('/api/v1/weather/forecast?lat=48.8584&lng=2.2945&days=5')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });

  describe('Agent Endpoints', () => {
    describe('POST /api/agents/plan', () => {
      it('should create a trip plan', async () => {
        const planRequest = {
          familyProfile: {
            id: 'family-1',
            name: 'Test Family',
            preferences: {
              interests: ['beaches', 'culture'],
              budget: { min: 1000, max: 5000, currency: 'USD' },
              travelStyle: ['relaxation'],
              dietaryRestrictions: [],
              accessibility: [],
            },
          },
          tripPreferences: {
            duration: 7,
            season: 'summer',
            groupSize: 4,
            accommodationType: ['hotel'],
            transportationType: ['public'],
            activityTypes: ['cultural', 'outdoor'],
            diningPreferences: ['local'],
          },
        };

        const response = await request(app)
          .post('/api/agents/plan')
          .send(planRequest)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('destination');
        expect(response.body.data).toHaveProperty('activities');
        expect(response.body.data).toHaveProperty('accommodation');
        expect(response.body.data).toHaveProperty('transportation');
      });

      it('should handle invalid plan request', async () => {
        const invalidRequest = {
          familyProfile: {
            // Missing required fields
          },
        };

        const response = await request(app)
          .post('/api/agents/plan')
          .send(invalidRequest)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/agents/book', () => {
      it('should create bookings', async () => {
        const bookingRequest = {
          flights: [
            {
              flightId: 'flight-123',
              passengers: [
                {
                  type: 'adult',
                  firstName: 'John',
                  lastName: 'Doe',
                  dateOfBirth: '1980-01-01',
                },
              ],
            },
          ],
          accommodations: [
            {
              accommodationId: 'hotel-456',
              dates: {
                checkIn: '2024-06-01',
                checkOut: '2024-06-08',
              },
              guests: {
                adults: 2,
                children: 0,
                infants: 0,
              },
            },
          ],
          contactInfo: {
            email: 'john.doe@example.com',
            phone: '+1234567890',
          },
        };

        const response = await request(app)
          .post('/api/agents/book')
          .send(bookingRequest)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('bookings');
        expect(Array.isArray(response.body.data.bookings)).toBe(true);
      });
    });

    describe('POST /api/agents/schedule', () => {
      it('should create itinerary schedule', async () => {
        const scheduleRequest = {
          activities: [
            {
              id: 'activity-1',
              name: 'Visit Eiffel Tower',
              type: 'attraction',
              location: 'Paris',
              duration: 120,
              cost: 25,
            },
            {
              id: 'activity-2',
              name: 'Lunch at Restaurant',
              type: 'dining',
              location: 'Paris',
              duration: 90,
              cost: 60,
            },
          ],
          preferences: {
            startTime: '09:00',
            endTime: '18:00',
            transportationType: ['public', 'walking'],
            includeBreaks: true,
          },
        };

        const response = await request(app)
          .post('/api/agents/schedule')
          .send(scheduleRequest)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('itinerary');
        expect(response.body.data.itinerary).toHaveProperty('activities');
        expect(response.body.data.itinerary).toHaveProperty('totalDuration');
        expect(response.body.data.itinerary).toHaveProperty('totalCost');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Not found');
    });

    it('should handle rate limiting', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(11).fill(null).map(() =>
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];

      expect(lastResponse.status).toBe(429);
      expect(lastResponse.body).toHaveProperty('error');
      expect(lastResponse.body.error).toContain('rate limit');
    });

    it('should handle API service errors gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/tripadvisor/destinations?query=invalid-query-that-causes-error')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Caching', () => {
    it('should cache API responses', async () => {
      const query = 'paris';
      
      // First request
      const response1 = await request(app)
        .get(`/api/v1/tripadvisor/destinations?query=${query}`)
        .expect(200);

      // Second request (should be cached)
      const response2 = await request(app)
        .get(`/api/v1/tripadvisor/destinations?query=${query}`)
        .expect(200);

      expect(response1.body).toEqual(response2.body);
    });
  });
});
