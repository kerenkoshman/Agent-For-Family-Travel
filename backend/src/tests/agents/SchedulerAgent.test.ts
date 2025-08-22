import { SchedulerAgent } from '../../services/agents/SchedulerAgent';
import { Activity, Itinerary, TripPreferences } from '../../types';

describe('SchedulerAgent', () => {
  let schedulerAgent: SchedulerAgent;

  beforeEach(() => {
    schedulerAgent = new SchedulerAgent();
  });

  describe('createItinerary', () => {
    it('should create a complete itinerary from activities', async () => {
      const activities: Activity[] = [
        {
          id: 'activity-1',
          name: 'Visit Eiffel Tower',
          description: 'Iconic landmark of Paris',
          type: 'attraction',
          location: 'Champ de Mars, Paris',
          latitude: 48.8584,
          longitude: 2.2945,
          duration: 120,
          cost: 25,
          currency: 'USD',
          familyFriendly: true,
          rating: 4.5,
        },
        {
          id: 'activity-2',
          name: 'Lunch at Local Restaurant',
          description: 'Traditional French cuisine',
          type: 'dining',
          location: 'Le Marais, Paris',
          latitude: 48.8566,
          longitude: 2.3522,
          duration: 90,
          cost: 60,
          currency: 'USD',
          familyFriendly: true,
          rating: 4.2,
        },
        {
          id: 'activity-3',
          name: 'Louvre Museum',
          description: 'World-famous art museum',
          type: 'museum',
          location: 'Rue de Rivoli, Paris',
          latitude: 48.8606,
          longitude: 2.3376,
          duration: 180,
          cost: 15,
          currency: 'USD',
          familyFriendly: true,
          rating: 4.7,
        },
      ];

      const preferences: TripPreferences = {
        duration: 1,
        groupSize: 4,
        accommodationType: ['hotel'],
        transportationType: ['public', 'walking'],
        activityTypes: ['cultural', 'food'],
        diningPreferences: ['local'],
        startTime: '09:00',
        endTime: '18:00',
      };

      const itinerary = await schedulerAgent.createItinerary(activities, preferences);

      expect(itinerary).toBeDefined();
      expect(itinerary).toHaveProperty('id');
      expect(itinerary).toHaveProperty('dayNumber');
      expect(itinerary).toHaveProperty('date');
      expect(itinerary).toHaveProperty('activities');
      expect(itinerary).toHaveProperty('totalDuration');
      expect(itinerary).toHaveProperty('totalCost');
      expect(itinerary).toHaveProperty('transportation');
      expect(itinerary).toHaveProperty('notes');

      expect(Array.isArray(itinerary.activities)).toBe(true);
      expect(itinerary.activities.length).toBeGreaterThan(0);
      expect(itinerary.totalDuration).toBeGreaterThan(0);
      expect(itinerary.totalCost).toBeGreaterThan(0);
    });

    it('should optimize activity order for efficiency', async () => {
      const activities: Activity[] = [
        {
          id: 'activity-1',
          name: 'Eiffel Tower',
          location: 'Champ de Mars, Paris',
          latitude: 48.8584,
          longitude: 2.2945,
          duration: 120,
          cost: 25,
          type: 'attraction',
          familyFriendly: true,
          rating: 4.5,
        },
        {
          id: 'activity-2',
          name: 'Arc de Triomphe',
          location: 'Place Charles de Gaulle, Paris',
          latitude: 48.8738,
          longitude: 2.2950,
          duration: 60,
          cost: 12,
          type: 'attraction',
          familyFriendly: true,
          rating: 4.3,
        },
        {
          id: 'activity-3',
          name: 'Louvre Museum',
          location: 'Rue de Rivoli, Paris',
          latitude: 48.8606,
          longitude: 2.3376,
          duration: 180,
          cost: 15,
          type: 'museum',
          familyFriendly: true,
          rating: 4.7,
        },
      ];

      const preferences: TripPreferences = {
        duration: 1,
        groupSize: 4,
        transportationType: ['public', 'walking'],
        activityTypes: ['cultural'],
        startTime: '09:00',
        endTime: '18:00',
      };

      const itinerary = await schedulerAgent.createItinerary(activities, preferences);

      // Activities should be ordered by proximity
      expect(itinerary.activities.length).toBe(3);
      expect(itinerary.transportation).toBeDefined();
      expect(itinerary.transportation.length).toBeGreaterThan(0);
    });

    it('should include breaks and rest periods', async () => {
      const activities: Activity[] = [
        {
          id: 'activity-1',
          name: 'Morning Walk',
          duration: 60,
          cost: 0,
          type: 'outdoor',
          familyFriendly: true,
          rating: 4.0,
        },
        {
          id: 'activity-2',
          name: 'Museum Visit',
          duration: 120,
          cost: 20,
          type: 'museum',
          familyFriendly: true,
          rating: 4.5,
        },
        {
          id: 'activity-3',
          name: 'Shopping',
          duration: 90,
          cost: 0,
          type: 'shopping',
          familyFriendly: true,
          rating: 4.0,
        },
      ];

      const preferences: TripPreferences = {
        duration: 1,
        groupSize: 4,
        transportationType: ['walking'],
        activityTypes: ['cultural', 'shopping'],
        startTime: '08:00',
        endTime: '20:00',
        includeBreaks: true,
      };

      const itinerary = await schedulerAgent.createItinerary(activities, preferences);

      expect(itinerary.activities.length).toBeGreaterThan(3); // Should include breaks
      expect(itinerary.notes).toContain('break');
    });
  });

  describe('optimizeSchedule', () => {
    it('should optimize schedule for time efficiency', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-1',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Activity 1',
            startTime: new Date('2024-06-01T10:00:00Z'),
            endTime: new Date('2024-06-01T12:00:00Z'),
            duration: 120,
            cost: 25,
            type: 'attraction',
            familyFriendly: true,
            rating: 4.5,
          },
          {
            id: 'activity-2',
            name: 'Activity 2',
            startTime: new Date('2024-06-01T14:00:00Z'),
            endTime: new Date('2024-06-01T16:00:00Z'),
            duration: 120,
            cost: 30,
            type: 'museum',
            familyFriendly: true,
            rating: 4.3,
          },
        ],
        totalDuration: 240,
        totalCost: 55,
        transportation: [],
        notes: 'Original schedule',
      };

      const optimized = await schedulerAgent.optimizeSchedule(itinerary, 'time');

      expect(optimized).toBeDefined();
      expect(optimized.id).toBe(itinerary.id);
      expect(optimized.activities.length).toBe(itinerary.activities.length);
      expect(optimized.totalDuration).toBeLessThanOrEqual(itinerary.totalDuration);
    });

    it('should optimize schedule for cost efficiency', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-2',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Expensive Activity',
            startTime: new Date('2024-06-01T10:00:00Z'),
            endTime: new Date('2024-06-01T12:00:00Z'),
            duration: 120,
            cost: 100,
            type: 'attraction',
            familyFriendly: true,
            rating: 4.5,
          },
          {
            id: 'activity-2',
            name: 'Cheap Activity',
            startTime: new Date('2024-06-01T14:00:00Z'),
            endTime: new Date('2024-06-01T16:00:00Z'),
            duration: 120,
            cost: 10,
            type: 'museum',
            familyFriendly: true,
            rating: 4.3,
          },
        ],
        totalDuration: 240,
        totalCost: 110,
        transportation: [],
        notes: 'Original schedule',
      };

      const optimized = await schedulerAgent.optimizeSchedule(itinerary, 'cost');

      expect(optimized).toBeDefined();
      expect(optimized.id).toBe(itinerary.id);
      expect(optimized.totalCost).toBeLessThanOrEqual(itinerary.totalCost);
    });
  });

  describe('calculateTravelTime', () => {
    it('should calculate travel time between locations', async () => {
      const location1 = {
        latitude: 48.8584,
        longitude: 2.2945,
        name: 'Eiffel Tower',
      };

      const location2 = {
        latitude: 48.8606,
        longitude: 2.3376,
        name: 'Louvre Museum',
      };

      const travelTime = await schedulerAgent.calculateTravelTime(location1, location2, 'walking');

      expect(travelTime).toBeDefined();
      expect(travelTime).toHaveProperty('duration');
      expect(travelTime).toHaveProperty('distance');
      expect(travelTime).toHaveProperty('mode');
      expect(travelTime.duration).toBeGreaterThan(0);
      expect(travelTime.distance).toBeGreaterThan(0);
    });

    it('should handle different transportation modes', async () => {
      const location1 = {
        latitude: 48.8584,
        longitude: 2.2945,
        name: 'Eiffel Tower',
      };

      const location2 = {
        latitude: 48.8606,
        longitude: 2.3376,
        name: 'Louvre Museum',
      };

      const walkingTime = await schedulerAgent.calculateTravelTime(location1, location2, 'walking');
      const publicTime = await schedulerAgent.calculateTravelTime(location1, location2, 'public');
      const drivingTime = await schedulerAgent.calculateTravelTime(location1, location2, 'driving');

      expect(walkingTime.duration).toBeGreaterThan(0);
      expect(publicTime.duration).toBeGreaterThan(0);
      expect(drivingTime.duration).toBeGreaterThan(0);

      // Walking should take longer than driving for the same distance
      expect(walkingTime.duration).toBeGreaterThan(drivingTime.duration);
    });
  });

  describe('addFlexibility', () => {
    it('should add flexibility to itinerary', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-3',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Morning Activity',
            startTime: new Date('2024-06-01T09:00:00Z'),
            endTime: new Date('2024-06-01T11:00:00Z'),
            duration: 120,
            cost: 25,
            type: 'attraction',
            familyFriendly: true,
            rating: 4.5,
          },
        ],
        totalDuration: 120,
        totalCost: 25,
        transportation: [],
        notes: 'Original schedule',
      };

      const flexible = await schedulerAgent.addFlexibility(itinerary, 0.2); // 20% flexibility

      expect(flexible).toBeDefined();
      expect(flexible.id).toBe(itinerary.id);
      expect(flexible.activities.length).toBeGreaterThanOrEqual(itinerary.activities.length);
      expect(flexible.notes).toContain('flexible');
    });
  });

  describe('createBackupPlan', () => {
    it('should create backup plan for weather issues', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-4',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Outdoor Activity',
            startTime: new Date('2024-06-01T10:00:00Z'),
            endTime: new Date('2024-06-01T12:00:00Z'),
            duration: 120,
            cost: 25,
            type: 'outdoor',
            familyFriendly: true,
            rating: 4.5,
          },
        ],
        totalDuration: 120,
        totalCost: 25,
        transportation: [],
        notes: 'Original schedule',
      };

      const backupPlan = await schedulerAgent.createBackupPlan(itinerary, 'weather');

      expect(backupPlan).toBeDefined();
      expect(backupPlan.id).toBeDefined();
      expect(backupPlan.activities.length).toBeGreaterThan(0);
      expect(backupPlan.notes).toContain('backup');
      expect(backupPlan.notes).toContain('weather');
    });

    it('should create backup plan for activity cancellation', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-5',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Museum Visit',
            startTime: new Date('2024-06-01T10:00:00Z'),
            endTime: new Date('2024-06-01T12:00:00Z'),
            duration: 120,
            cost: 25,
            type: 'museum',
            familyFriendly: true,
            rating: 4.5,
          },
        ],
        totalDuration: 120,
        totalCost: 25,
        transportation: [],
        notes: 'Original schedule',
      };

      const backupPlan = await schedulerAgent.createBackupPlan(itinerary, 'cancellation');

      expect(backupPlan).toBeDefined();
      expect(backupPlan.id).toBeDefined();
      expect(backupPlan.activities.length).toBeGreaterThan(0);
      expect(backupPlan.notes).toContain('backup');
      expect(backupPlan.notes).toContain('cancellation');
    });
  });

  describe('validateSchedule', () => {
    it('should validate a valid schedule', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-6',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Activity 1',
            startTime: new Date('2024-06-01T09:00:00Z'),
            endTime: new Date('2024-06-01T11:00:00Z'),
            duration: 120,
            cost: 25,
            type: 'attraction',
            familyFriendly: true,
            rating: 4.5,
          },
          {
            id: 'activity-2',
            name: 'Activity 2',
            startTime: new Date('2024-06-01T14:00:00Z'),
            endTime: new Date('2024-06-01T16:00:00Z'),
            duration: 120,
            cost: 30,
            type: 'museum',
            familyFriendly: true,
            rating: 4.3,
          },
        ],
        totalDuration: 240,
        totalCost: 55,
        transportation: [],
        notes: 'Valid schedule',
      };

      const validation = await schedulerAgent.validateSchedule(itinerary);

      expect(validation).toBeDefined();
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('issues');
      expect(validation).toHaveProperty('suggestions');
      expect(validation.isValid).toBe(true);
    });

    it('should identify scheduling conflicts', async () => {
      const itinerary: Itinerary = {
        id: 'itinerary-7',
        dayNumber: 1,
        date: new Date('2024-06-01'),
        activities: [
          {
            id: 'activity-1',
            name: 'Activity 1',
            startTime: new Date('2024-06-01T10:00:00Z'),
            endTime: new Date('2024-06-01T12:00:00Z'),
            duration: 120,
            cost: 25,
            type: 'attraction',
            familyFriendly: true,
            rating: 4.5,
          },
          {
            id: 'activity-2',
            name: 'Activity 2',
            startTime: new Date('2024-06-01T11:00:00Z'), // Overlaps with Activity 1
            endTime: new Date('2024-06-01T13:00:00Z'),
            duration: 120,
            cost: 30,
            type: 'museum',
            familyFriendly: true,
            rating: 4.3,
          },
        ],
        totalDuration: 240,
        totalCost: 55,
        transportation: [],
        notes: 'Conflicting schedule',
      };

      const validation = await schedulerAgent.validateSchedule(itinerary);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues.some(issue => issue.includes('conflict'))).toBe(true);
    });
  });
});
