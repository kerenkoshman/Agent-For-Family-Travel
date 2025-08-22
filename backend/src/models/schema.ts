import { pgTable, text, integer, boolean, timestamp, decimal, jsonb, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatar: text('avatar'),
  googleId: text('google_id').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  googleIdIdx: index('users_google_id_idx').on(table.googleId),
}));

// Family profiles table
export const familyProfiles = pgTable('family_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  travelStyle: text('travel_style').notNull().default('comfort'),
  preferredDestinations: jsonb('preferred_destinations').$type<string[]>(),
  interests: jsonb('interests').$type<string[]>(),
  accessibility: boolean('accessibility').default(false),
  petFriendly: boolean('pet_friendly').default(false),
  dietaryRestrictions: jsonb('dietary_restrictions').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('family_profiles_user_id_idx').on(table.userId),
}));

// Family members table
export const familyMembers = pgTable('family_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => familyProfiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  relationship: text('relationship').notNull(),
  interests: jsonb('interests').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  familyIdIdx: index('family_members_family_id_idx').on(table.familyId),
}));

// Trips table
export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => familyProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  destination: text('destination').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('planning'), // planning, confirmed, completed, cancelled
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  familyIdIdx: index('trips_family_id_idx').on(table.familyId),
  statusIdx: index('trips_status_idx').on(table.status),
  destinationIdx: index('trips_destination_idx').on(table.destination),
}));

// Itineraries table
export const itineraries = pgTable('itineraries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  dayNumber: integer('day_number').notNull(),
  date: timestamp('date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('itineraries_trip_id_idx').on(table.tripId),
  dayNumberIdx: index('itineraries_day_number_idx').on(table.dayNumber),
}));

// Activities table
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  itineraryId: uuid('itinerary_id').notNull().references(() => itineraries.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // attraction, restaurant, transport, accommodation
  location: text('location').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  cost: decimal('cost', { precision: 10, scale: 2 }).default('0'),
  bookingReference: text('booking_reference'),
  externalId: text('external_id'), // For API integrations
  metadata: jsonb('metadata'), // Additional data from APIs
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  itineraryIdIdx: index('activities_itinerary_id_idx').on(table.itineraryId),
  typeIdx: index('activities_type_idx').on(table.type),
  externalIdIdx: index('activities_external_id_idx').on(table.externalId),
}));

// Accommodations table
export const accommodations = pgTable('accommodations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
  bookingReference: text('booking_reference'),
  externalId: text('external_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('accommodations_trip_id_idx').on(table.tripId),
  externalIdIdx: index('accommodations_external_id_idx').on(table.externalId),
}));

// Flights table
export const flights = pgTable('flights', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // departure, return, internal
  airline: text('airline').notNull(),
  flightNumber: text('flight_number').notNull(),
  from: text('from').notNull(),
  to: text('to').notNull(),
  departure: timestamp('departure').notNull(),
  arrival: timestamp('arrival').notNull(),
  cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
  bookingReference: text('booking_reference'),
  externalId: text('external_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('flights_trip_id_idx').on(table.tripId),
  typeIdx: index('flights_type_idx').on(table.type),
  externalIdIdx: index('flights_external_id_idx').on(table.externalId),
}));

// Trip shares table
export const tripShares = pgTable('trip_shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  sharedBy: uuid('shared_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sharedWith: text('shared_with').notNull(), // Email address
  permissions: jsonb('permissions').$type<string[]>(), // view, edit, comment
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('trip_shares_trip_id_idx').on(table.tripId),
  sharedByIdx: index('trip_shares_shared_by_idx').on(table.sharedBy),
  sharedWithIdx: index('trip_shares_shared_with_idx').on(table.sharedWith),
}));

// API cache table
export const apiCache = pgTable('api_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  data: jsonb('data').notNull(),
  source: text('source').notNull(), // tripadvisor, google, skyscanner, booking
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  keyIdx: index('api_cache_key_idx').on(table.key),
  sourceIdx: index('api_cache_source_idx').on(table.source),
  expiresAtIdx: index('api_cache_expires_at_idx').on(table.expiresAt),
}));

// User preferences table
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  language: text('language').default('en'),
  currency: text('currency').default('USD'),
  timezone: text('timezone').default('UTC'),
  emailNotifications: boolean('email_notifications').default(true),
  pushNotifications: boolean('push_notifications').default(true),
  marketingEmails: boolean('marketing_emails').default(false),
  profileVisibility: text('profile_visibility').default('public'),
  shareTripData: boolean('share_trip_data').default(true),
  allowAnalytics: boolean('allow_analytics').default(true),
  allowCookies: boolean('allow_cookies').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_preferences_user_id_idx').on(table.userId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  familyProfiles: many(familyProfiles),
  tripShares: many(tripShares),
  userPreferences: many(userPreferences),
}));

export const familyProfilesRelations = relations(familyProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [familyProfiles.userId],
    references: [users.id],
  }),
  familyMembers: many(familyMembers),
  trips: many(trips),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  family: one(familyProfiles, {
    fields: [familyMembers.familyId],
    references: [familyProfiles.id],
  }),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  family: one(familyProfiles, {
    fields: [trips.familyId],
    references: [familyProfiles.id],
  }),
  itineraries: many(itineraries),
  accommodations: many(accommodations),
  flights: many(flights),
  tripShares: many(tripShares),
}));

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  trip: one(trips, {
    fields: [itineraries.tripId],
    references: [trips.id],
  }),
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [activities.itineraryId],
    references: [itineraries.id],
  }),
}));

export const accommodationsRelations = relations(accommodations, ({ one }) => ({
  trip: one(trips, {
    fields: [accommodations.tripId],
    references: [trips.id],
  }),
}));

export const flightsRelations = relations(flights, ({ one }) => ({
  trip: one(trips, {
    fields: [flights.tripId],
    references: [trips.id],
  }),
}));

export const tripSharesRelations = relations(tripShares, ({ one }) => ({
  trip: one(trips, {
    fields: [tripShares.tripId],
    references: [trips.id],
  }),
  sharedBy: one(users, {
    fields: [tripShares.sharedBy],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));
