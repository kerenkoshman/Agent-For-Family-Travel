import { UIAgent } from '../../services/agents/UIAgent';
import { Trip, Itinerary, DashboardData } from '../../types';

describe('UIAgent', () => {
  let uiAgent: UIAgent;

  beforeEach(() => {
    uiAgent = new UIAgent();
  });

  describe('prepareDashboardData', () => {
    it('should prepare dashboard data from trips', async () => {
      const trips: Trip[] = [
        {
          id: 'trip-1',
          familyId: 'family-1',
          title: 'Paris Family Trip',
          description: 'A wonderful family trip to Paris',
          destination: 'Paris, France',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-07'),
          budget: 5000,
          currency: 'USD',
          status: 'planning',
          preferences: {
            accommodationType: ['hotel'],
            transportationType: ['public'],
            activityTypes: ['cultural'],
            diningPreferences: ['local'],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'trip-2',
          familyId: 'family-1',
          title: 'Tokyo Adventure',
          description: 'Exploring Tokyo with the family',
          destination: 'Tokyo, Japan',
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-08-10'),
          budget: 8000,
          currency: 'USD',
          status: 'completed',
          preferences: {
            accommodationType: ['hotel'],
            transportationType: ['public'],
            activityTypes: ['cultural', 'food'],
            diningPreferences: ['local'],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const dashboardData = await uiAgent.prepareDashboardData(trips);

      expect(dashboardData).toBeDefined();
      expect(dashboardData).toHaveProperty('totalTrips');
      expect(dashboardData).toHaveProperty('activeTrips');
      expect(dashboardData).toHaveProperty('completedTrips');
      expect(dashboardData).toHaveProperty('totalBudget');
      expect(dashboardData).toHaveProperty('upcomingTrips');
      expect(dashboardData).toHaveProperty('recentTrips');
      expect(dashboardData).toHaveProperty('destinations');
      expect(dashboardData).toHaveProperty('stats');

      expect(dashboardData.totalTrips).toBe(2);
      expect(dashboardData.activeTrips).toBe(1);
      expect(dashboardData.completedTrips).toBe(1);
      expect(dashboardData.totalBudget).toBe(13000);
    });

    it('should handle empty trips array', async () => {
      const trips: Trip[] = [];

      const dashboardData = await uiAgent.prepareDashboardData(trips);

      expect(dashboardData.totalTrips).toBe(0);
      expect(dashboardData.activeTrips).toBe(0);
      expect(dashboardData.completedTrips).toBe(0);
      expect(dashboardData.totalBudget).toBe(0);
      expect(dashboardData.upcomingTrips).toEqual([]);
      expect(dashboardData.recentTrips).toEqual([]);
    });
  });

  describe('formatItineraryForDisplay', () => {
    it('should format itinerary for UI display', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-1',
        tripId: 'trip-1',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            itineraryId: 'itinerary-1',
            name: 'Visit Eiffel Tower',
            description: 'Iconic landmark of Paris',
            type: 'attraction',
            location: 'Champ de Mars, Paris',
            latitude: 48.8584,
            longitude: 2.2945,
            startTime: new Date('2024-06-01T10:00:00Z'),
            endTime: new Date('2024-06-01T12:00:00Z'),
            duration: 120,
            cost: 25,
            currency: 'USD',
            familyFriendly: true,
            rating: 4.5,
          },
          {
            id: 'activity-2',
            itineraryId: 'itinerary-1',
            name: 'Lunch at Local Restaurant',
            description: 'Traditional French cuisine',
            type: 'dining',
            location: 'Le Marais, Paris',
            latitude: 48.8566,
            longitude: 2.3522,
            startTime: new Date('2024-06-01T12:30:00Z'),
            endTime: new Date('2024-06-01T14:00:00Z'),
            duration: 90,
            cost: 60,
            currency: 'USD',
            familyFriendly: true,
            rating: 4.2,
          },
        ],
        totalDuration: 210,
        totalCost: 85,
        transportation: [
          {
            from: 'Hotel',
            to: 'Eiffel Tower',
            mode: 'walking',
            duration: 15,
            cost: 0,
          },
          {
            from: 'Eiffel Tower',
            to: 'Restaurant',
            mode: 'metro',
            duration: 20,
            cost: 2.5,
          },
        ],
        notes: 'First day exploring Paris',
      };

      const formatted = await uiAgent.formatItineraryForDisplay(itinerary);

      expect(formatted).toBeDefined();
      expect(formatted).toHaveProperty('id');
      expect(formatted).toHaveProperty('dayNumber');
      expect(formatted).toHaveProperty('date');
      expect(formatted).toHaveProperty('activities');
      expect(formatted).toHaveProperty('totalDuration');
      expect(formatted).toHaveProperty('totalCost');
      expect(formatted).toHaveProperty('transportation');
      expect(formatted).toHaveProperty('notes');
      expect(formatted).toHaveProperty('formattedDate');
      expect(formatted).toHaveProperty('formattedDuration');
      expect(formatted).toHaveProperty('formattedCost');
      expect(formatted).toHaveProperty('activityCount');

      expect(formatted.activityCount).toBe(2);
      expect(formatted.formattedDuration).toContain('3h 30m');
      expect(formatted.formattedCost).toContain('$85');
    });
  });

  describe('generateExportData', () => {
    it('should generate PDF export data', async () => {
      const trip: Trip = {
        id: 'trip-1',
        familyId: 'family-1',
        title: 'Paris Family Trip',
        description: 'A wonderful family trip to Paris',
        destination: 'Paris, France',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07'),
        budget: 5000,
        currency: 'USD',
        status: 'planning',
        preferences: {
          accommodationType: ['hotel'],
          transportationType: ['public'],
          activityTypes: ['cultural'],
          diningPreferences: ['local'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const itineraries: Itinerary[] = [
        {
          id: 'itinerary-1',
          tripId: 'trip-1',
          dayNumber: 1,
          date: new Date('2024-06-01'),
          activities: [],
          totalDuration: 0,
          totalCost: 0,
          transportation: [],
          notes: 'First day',
        },
      ];

      const pdfData = await uiAgent.generateExportData(trip, itineraries, 'pdf');

      expect(pdfData).toBeDefined();
      expect(pdfData).toHaveProperty('format', 'pdf');
      expect(pdfData).toHaveProperty('data');
      expect(pdfData).toHaveProperty('filename');
      expect(pdfData.filename).toContain('Paris Family Trip');
      expect(pdfData.filename).toContain('.pdf');
    });

    it('should generate JSON export data', async () => {
      const trip: Trip = {
        id: 'trip-1',
        familyId: 'family-1',
        title: 'Paris Family Trip',
        description: 'A wonderful family trip to Paris',
        destination: 'Paris, France',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07'),
        budget: 5000,
        currency: 'USD',
        status: 'planning',
        preferences: {
          accommodationType: ['hotel'],
          transportationType: ['public'],
          activityTypes: ['cultural'],
          diningPreferences: ['local'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const itineraries: Itinerary[] = [];

      const jsonData = await uiAgent.generateExportData(trip, itineraries, 'json');

      expect(jsonData).toBeDefined();
      expect(jsonData).toHaveProperty('format', 'json');
      expect(jsonData).toHaveProperty('data');
      expect(jsonData).toHaveProperty('filename');
      expect(jsonData.filename).toContain('Paris Family Trip');
      expect(jsonData.filename).toContain('.json');
    });

    it('should handle unsupported export formats', async () => {
      const trip: Trip = {
        id: 'trip-1',
        familyId: 'family-1',
        title: 'Test Trip',
        description: 'Test trip',
        destination: 'Test Destination',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07'),
        budget: 1000,
        currency: 'USD',
        status: 'planning',
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const itineraries: Itinerary[] = [];

      await expect(uiAgent.generateExportData(trip, itineraries, 'unsupported'))
        .rejects.toThrow('Unsupported export format');
    });
  });

  describe('createSharingLink', () => {
    it('should create a sharing link for a trip', async () => {
      const tripId = 'trip-123';
      const permissions = {
        canView: true,
        canEdit: false,
        canShare: false,
      };

      const sharingLink = await uiAgent.createSharingLink(tripId, permissions);

      expect(sharingLink).toBeDefined();
      expect(sharingLink).toHaveProperty('id');
      expect(sharingLink).toHaveProperty('tripId', tripId);
      expect(sharingLink).toHaveProperty('url');
      expect(sharingLink).toHaveProperty('permissions');
      expect(sharingLink).toHaveProperty('expiresAt');
      expect(sharingLink).toHaveProperty('createdAt');

      expect(sharingLink.url).toContain('share');
      expect(sharingLink.url).toContain(tripId);
      expect(sharingLink.permissions).toEqual(permissions);
    });

    it('should create a sharing link with expiration', async () => {
      const tripId = 'trip-456';
      const permissions = {
        canView: true,
        canEdit: true,
        canShare: true,
      };
      const expiresIn = 7; // 7 days

      const sharingLink = await uiAgent.createSharingLink(tripId, permissions, expiresIn);

      expect(sharingLink.expiresAt).toBeDefined();
      expect(new Date(sharingLink.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('generateVisualizationData', () => {
    it('should generate chart data for trip statistics', async () => {
      const trips: Trip[] = [
        {
          id: 'trip-1',
          familyId: 'family-1',
          title: 'Paris Trip',
          destination: 'Paris, France',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-07'),
          budget: 5000,
          currency: 'USD',
          status: 'completed',
          preferences: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'trip-2',
          familyId: 'family-1',
          title: 'Tokyo Trip',
          destination: 'Tokyo, Japan',
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-08-10'),
          budget: 8000,
          currency: 'USD',
          status: 'completed',
          preferences: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const chartData = await uiAgent.generateVisualizationData(trips, 'budget');

      expect(chartData).toBeDefined();
      expect(chartData).toHaveProperty('type', 'budget');
      expect(chartData).toHaveProperty('labels');
      expect(chartData).toHaveProperty('datasets');
      expect(Array.isArray(chartData.labels)).toBe(true);
      expect(Array.isArray(chartData.datasets)).toBe(true);
      expect(chartData.labels.length).toBe(2);
    });

    it('should generate destination map data', async () => {
      const trips: Trip[] = [
        {
          id: 'trip-1',
          familyId: 'family-1',
          title: 'Paris Trip',
          destination: 'Paris, France',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-07'),
          budget: 5000,
          currency: 'USD',
          status: 'completed',
          preferences: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mapData = await uiAgent.generateVisualizationData(trips, 'destinations');

      expect(mapData).toBeDefined();
      expect(mapData).toHaveProperty('type', 'destinations');
      expect(mapData).toHaveProperty('locations');
      expect(Array.isArray(mapData.locations)).toBe(true);
      expect(mapData.locations.length).toBe(1);
      expect(mapData.locations[0]).toHaveProperty('name');
      expect(mapData.locations[0]).toHaveProperty('coordinates');
    });
  });

  describe('validateUIData', () => {
    it('should validate valid UI data', async () => {
      const uiData = {
        trips: [],
        user: {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
        },
      };

      const validation = await uiAgent.validateUIData(uiData);

      expect(validation).toBeDefined();
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('issues');
      expect(validation.isValid).toBe(true);
    });

    it('should identify invalid UI data', async () => {
      const uiData = {
        trips: null, // Invalid: should be array
        user: {
          id: 'user-1',
          email: 'invalid-email', // Invalid email
          firstName: '', // Invalid: empty
          lastName: 'Doe',
        },
        preferences: {
          theme: 'invalid-theme', // Invalid theme
          language: 'en',
          notifications: 'not-boolean', // Invalid: should be boolean
        },
      };

      const validation = await uiAgent.validateUIData(uiData);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
    });
  });
});
