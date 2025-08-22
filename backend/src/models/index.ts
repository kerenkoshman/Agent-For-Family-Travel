// Export all schema tables
export * from './schema';

// Export types for database operations
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type FamilyProfile = typeof familyProfiles.$inferSelect;
export type NewFamilyProfile = typeof familyProfiles.$inferInsert;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type NewFamilyMember = typeof familyMembers.$inferInsert;

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;

export type Itinerary = typeof itineraries.$inferSelect;
export type NewItinerary = typeof itineraries.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Accommodation = typeof accommodations.$inferSelect;
export type NewAccommodation = typeof accommodations.$inferInsert;

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;

export type TripShare = typeof tripShares.$inferSelect;
export type NewTripShare = typeof tripShares.$inferInsert;

export type ApiCache = typeof apiCache.$inferSelect;
export type NewApiCache = typeof apiCache.$inferInsert;

// Export all tables for database operations
export {
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
} from './schema';
