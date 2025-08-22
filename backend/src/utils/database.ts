import { db } from '../config/database';
import { logger } from './logger';
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

// Database utility functions
export const databaseUtils = {
  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    try {
      await db.delete(apiCache);
      await db.delete(tripShares);
      await db.delete(flights);
      await db.delete(accommodations);
      await db.delete(activities);
      await db.delete(itineraries);
      await db.delete(trips);
      await db.delete(familyMembers);
      await db.delete(familyProfiles);
      await db.delete(users);
      logger.info('All database data cleared');
    } catch (error) {
      logger.error('Error clearing database data:', error);
      throw error;
    }
  },

  // Get database statistics
  async getDatabaseStats(): Promise<{
    users: number;
    familyProfiles: number;
    familyMembers: number;
    trips: number;
    itineraries: number;
    activities: number;
    accommodations: number;
    flights: number;
    tripShares: number;
    apiCache: number;
  }> {
    try {
      const [
        usersCount,
        familyProfilesCount,
        familyMembersCount,
        tripsCount,
        itinerariesCount,
        activitiesCount,
        accommodationsCount,
        flightsCount,
        tripSharesCount,
        apiCacheCount,
      ] = await Promise.all([
        db.select({ count: db.fn.count() }).from(users),
        db.select({ count: db.fn.count() }).from(familyProfiles),
        db.select({ count: db.fn.count() }).from(familyMembers),
        db.select({ count: db.fn.count() }).from(trips),
        db.select({ count: db.fn.count() }).from(itineraries),
        db.select({ count: db.fn.count() }).from(activities),
        db.select({ count: db.fn.count() }).from(accommodations),
        db.select({ count: db.fn.count() }).from(flights),
        db.select({ count: db.fn.count() }).from(tripShares),
        db.select({ count: db.fn.count() }).from(apiCache),
      ]);

      return {
        users: Number(usersCount[0]?.count || 0),
        familyProfiles: Number(familyProfilesCount[0]?.count || 0),
        familyMembers: Number(familyMembersCount[0]?.count || 0),
        trips: Number(tripsCount[0]?.count || 0),
        itineraries: Number(itinerariesCount[0]?.count || 0),
        activities: Number(activitiesCount[0]?.count || 0),
        accommodations: Number(accommodationsCount[0]?.count || 0),
        flights: Number(flightsCount[0]?.count || 0),
        tripShares: Number(tripSharesCount[0]?.count || 0),
        apiCache: Number(apiCacheCount[0]?.count || 0),
      };
    } catch (error) {
      logger.error('Error getting database stats:', error);
      throw error;
    }
  },

  // Seed sample data for development
  async seedSampleData(): Promise<void> {
    try {
      logger.info('Seeding sample data...');

      // Create sample user
      const [sampleUser] = await db
        .insert(users)
        .values({
          googleId: 'sample-google-id-123',
          email: 'sample@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://example.com/avatar.jpg',
        })
        .returning();

      // Create sample family profile
      const [sampleFamily] = await db
        .insert(familyProfiles)
        .values({
          userId: sampleUser.id,
          name: 'The Doe Family',
          description: 'A family of 4 who loves to travel',
          preferences: {
            interests: ['beaches', 'museums', 'adventure'],
            budget: {
              min: 2000,
              max: 8000,
              currency: 'USD',
            },
            travelStyle: ['relaxed', 'cultural'],
            dietaryRestrictions: ['vegetarian'],
            accessibility: ['wheelchair-friendly'],
          },
        })
        .returning();

      // Create sample family members
      await db.insert(familyMembers).values([
        {
          familyId: sampleFamily.id,
          name: 'John Doe',
          age: 35,
          relationship: 'parent',
          interests: ['photography', 'hiking'],
          dietaryRestrictions: ['vegetarian'],
        },
        {
          familyId: sampleFamily.id,
          name: 'Jane Doe',
          age: 32,
          relationship: 'parent',
          interests: ['art', 'cooking'],
          dietaryRestrictions: ['vegetarian'],
        },
        {
          familyId: sampleFamily.id,
          name: 'Emma Doe',
          age: 8,
          relationship: 'child',
          interests: ['animals', 'swimming'],
          dietaryRestrictions: ['vegetarian'],
        },
        {
          familyId: sampleFamily.id,
          name: 'Liam Doe',
          age: 5,
          relationship: 'child',
          interests: ['trains', 'parks'],
          dietaryRestrictions: ['vegetarian'],
        },
      ]);

      logger.info('Sample data seeded successfully');
    } catch (error) {
      logger.error('Error seeding sample data:', error);
      throw error;
    }
  },

  // Clean up expired API cache entries
  async cleanupExpiredCache(): Promise<number> {
    try {
      const result = await db
        .delete(apiCache)
        .where(db.lt(apiCache.expiresAt, new Date()))
        .returning();

      const deletedCount = result.length;
      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} expired cache entries`);
      }

      return deletedCount;
    } catch (error) {
      logger.error('Error cleaning up expired cache:', error);
      throw error;
    }
  },

  // Clean up expired trip shares
  async cleanupExpiredShares(): Promise<number> {
    try {
      const result = await db
        .delete(tripShares)
        .where(db.lt(tripShares.expiresAt, new Date()))
        .returning();

      const deletedCount = result.length;
      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} expired trip shares`);
      }

      return deletedCount;
    } catch (error) {
      logger.error('Error cleaning up expired shares:', error);
      throw error;
    }
  },
};
