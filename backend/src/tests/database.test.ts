import { db } from '../config/database';
import { databaseUtils } from '../utils/database';
import {
  users,
  familyProfiles,
  familyMembers,
  trips,
  itineraries,
  activities,
  accommodations,
  flights,
  tripShares,
  apiCache,
} from '../models';

describe('Database Schema and Operations', () => {
  beforeAll(async () => {
    // Clear any existing test data
    await databaseUtils.clearAllData();
  });

  afterAll(async () => {
    // Clean up test data
    await databaseUtils.clearAllData();
  });

  describe('Users Table', () => {
    it('should create a user successfully', async () => {
      const userData = {
        googleId: 'test-google-id-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'https://example.com/avatar.jpg',
      };

      const [user] = await db.insert(users).values(userData).returning();

      expect(user).toBeDefined();
      expect(user.googleId).toBe(userData.googleId);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should enforce unique googleId constraint', async () => {
      const duplicateUserData = {
        googleId: 'test-google-id-123', // Same as above
        email: 'duplicate@example.com',
        firstName: 'Duplicate',
        lastName: 'User',
      };

      await expect(
        db.insert(users).values(duplicateUserData)
      ).rejects.toThrow();
    });
  });

  describe('Family Profiles Table', () => {
    it('should create a family profile successfully', async () => {
      const [user] = await db.select().from(users).limit(1);
      
      const familyData = {
        userId: user.id,
        name: 'Test Family',
        description: 'A test family for testing',
        preferences: {
          interests: ['beaches', 'mountains'],
          budget: {
            min: 1000,
            max: 5000,
            currency: 'USD',
          },
          travelStyle: ['adventure'],
          dietaryRestrictions: ['vegetarian'],
          accessibility: ['wheelchair-friendly'],
        },
      };

      const [family] = await db.insert(familyProfiles).values(familyData).returning();

      expect(family).toBeDefined();
      expect(family.userId).toBe(user.id);
      expect(family.name).toBe(familyData.name);
      expect(family.preferences).toEqual(familyData.preferences);
    });
  });

  describe('Family Members Table', () => {
    it('should create family members successfully', async () => {
      const [family] = await db.select().from(familyProfiles).limit(1);

      const memberData = {
        familyId: family.id,
        name: 'Test Child',
        age: 10,
        relationship: 'child',
        interests: ['animals', 'games'],
        dietaryRestrictions: ['vegetarian'],
        accessibility: ['wheelchair-friendly'],
      };

      const [member] = await db.insert(familyMembers).values(memberData).returning();

      expect(member).toBeDefined();
      expect(member.familyId).toBe(family.id);
      expect(member.name).toBe(memberData.name);
      expect(member.age).toBe(memberData.age);
      expect(member.relationship).toBe(memberData.relationship);
    });
  });

  describe('Trips Table', () => {
    it('should create a trip successfully', async () => {
      const [family] = await db.select().from(familyProfiles).limit(1);

      const tripData = {
        familyId: family.id,
        title: 'Test Trip to Paris',
        description: 'A wonderful family trip to Paris',
        destination: 'Paris, France',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07'),
        budget: 5000.00,
        currency: 'USD',
        status: 'planning',
        preferences: {
          accommodationType: ['hotel'],
          transportationType: ['public', 'walking'],
          activityTypes: ['cultural', 'food'],
          diningPreferences: ['local', 'family-friendly'],
        },
      };

      const [trip] = await db.insert(trips).values(tripData).returning();

      expect(trip).toBeDefined();
      expect(trip.familyId).toBe(family.id);
      expect(trip.title).toBe(tripData.title);
      expect(trip.destination).toBe(tripData.destination);
      expect(trip.status).toBe('planning');
    });
  });

  describe('Itineraries Table', () => {
    it('should create an itinerary successfully', async () => {
      const [trip] = await db.select().from(trips).limit(1);

      const itineraryData = {
        tripId: trip.id,
        dayNumber: 1,
        date: new Date('2024-06-01'),
        notes: 'First day in Paris',
      };

      const [itinerary] = await db.insert(itineraries).values(itineraryData).returning();

      expect(itinerary).toBeDefined();
      expect(itinerary.tripId).toBe(trip.id);
      expect(itinerary.dayNumber).toBe(1);
      expect(itinerary.date).toEqual(new Date('2024-06-01'));
    });
  });

  describe('Activities Table', () => {
    it('should create an activity successfully', async () => {
      const [itinerary] = await db.select().from(itineraries).limit(1);

      const activityData = {
        itineraryId: itinerary.id,
        name: 'Visit Eiffel Tower',
        description: 'Iconic landmark of Paris',
        type: 'attraction',
        location: 'Champ de Mars, Paris',
        latitude: 48.8584,
        longitude: 2.2945,
        startTime: new Date('2024-06-01T10:00:00Z'),
        endTime: new Date('2024-06-01T12:00:00Z'),
        duration: 120,
        cost: 25.00,
        currency: 'USD',
        externalId: 'eiffel-tower-123',
        isBooked: false,
        isConfirmed: false,
      };

      const [activity] = await db.insert(activities).values(activityData).returning();

      expect(activity).toBeDefined();
      expect(activity.itineraryId).toBe(itinerary.id);
      expect(activity.name).toBe(activityData.name);
      expect(activity.type).toBe('attraction');
      expect(activity.isBooked).toBe(false);
    });
  });

  describe('Database Utilities', () => {
    it('should get database statistics', async () => {
      const stats = await databaseUtils.getDatabaseStats();

      expect(stats).toHaveProperty('users');
      expect(stats).toHaveProperty('familyProfiles');
      expect(stats).toHaveProperty('familyMembers');
      expect(stats).toHaveProperty('trips');
      expect(stats).toHaveProperty('itineraries');
      expect(stats).toHaveProperty('activities');
      expect(stats).toHaveProperty('accommodations');
      expect(stats).toHaveProperty('flights');
      expect(stats).toHaveProperty('tripShares');
      expect(stats).toHaveProperty('apiCache');

      // Should have some data from our tests
      expect(stats.users).toBeGreaterThan(0);
      expect(stats.familyProfiles).toBeGreaterThan(0);
      expect(stats.trips).toBeGreaterThan(0);
    });

    it('should seed sample data successfully', async () => {
      await databaseUtils.seedSampleData();
      
      const stats = await databaseUtils.getDatabaseStats();
      expect(stats.users).toBeGreaterThan(0);
      expect(stats.familyProfiles).toBeGreaterThan(0);
      expect(stats.familyMembers).toBeGreaterThan(0);
    });
  });
});
