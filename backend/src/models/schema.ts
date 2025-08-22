import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, decimal, varchar, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (Google OAuth data)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').unique().notNull(),
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Family profiles table
export const familyProfiles = pgTable('family_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  preferences: jsonb('preferences').$type<{
    interests: string[];
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    travelStyle: string[];
    dietaryRestrictions: string[];
    accessibility: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Family members table
export const familyMembers = pgTable('family_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').references(() => familyProfiles.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  relationship: text('relationship').notNull(), // parent, child, grandparent, etc.
  interests: jsonb('interests').$type<string[]>(),
  dietaryRestrictions: jsonb('dietary_restrictions').$type<string[]>(),
  accessibility: jsonb('accessibility').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trips table
export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').references(() => familyProfiles.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  destination: text('destination').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: text('status').default('planning').notNull(), // planning, booked, completed, cancelled
  preferences: jsonb('preferences').$type<{
    accommodationType: string[];
    transportationType: string[];
    activityTypes: string[];
    diningPreferences: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Itineraries table
export const itineraries = pgTable('itineraries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  dayNumber: integer('day_number').notNull(),
  date: date('date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Activities table
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // attraction, restaurant, transportation, accommodation, custom
  location: text('location').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in minutes
  cost: decimal('cost', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  bookingReference: text('booking_reference'),
  externalId: text('external_id'), // ID from external APIs (TripAdvisor, Google Places, etc.)
  externalData: jsonb('external_data'), // Raw data from external APIs
  isBooked: boolean('is_booked').default(false),
  isConfirmed: boolean('is_confirmed').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Accommodations table
export const accommodations = pgTable('accommodations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // hotel, resort, apartment, house, etc.
  address: text('address').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  checkInDate: date('check_in_date').notNull(),
  checkOutDate: date('check_out_date').notNull(),
  roomType: text('room_type'),
  numberOfRooms: integer('number_of_rooms').default(1),
  numberOfGuests: integer('number_of_guests').notNull(),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  bookingReference: text('booking_reference'),
  externalId: text('external_id'), // ID from Booking.com or other booking platforms
  externalData: jsonb('external_data'), // Raw data from external APIs
  amenities: jsonb('amenities').$type<string[]>(),
  isBooked: boolean('is_booked').default(false),
  isConfirmed: boolean('is_confirmed').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Flights table
export const flights = pgTable('flights', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // departure, return
  airline: text('airline').notNull(),
  flightNumber: text('flight_number').notNull(),
  departureAirport: text('departure_airport').notNull(),
  arrivalAirport: text('arrival_airport').notNull(),
  departureTime: timestamp('departure_time').notNull(),
  arrivalTime: timestamp('arrival_time').notNull(),
  duration: integer('duration'), // in minutes
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  bookingReference: text('booking_reference'),
  externalId: text('external_id'), // ID from Skyscanner or other flight APIs
  externalData: jsonb('external_data'), // Raw data from external APIs
  isBooked: boolean('is_booked').default(false),
  isConfirmed: boolean('is_confirmed').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trip sharing table
export const tripShares = pgTable('trip_shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  shareToken: text('share_token').unique().notNull(),
  shareType: text('share_type').notNull(), // public, private, email
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// API cache table for external API responses
export const apiCache = pgTable('api_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  data: jsonb('data').notNull(),
  source: text('source').notNull(), // tripadvisor, google_places, skyscanner, booking
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  familyProfiles: many(familyProfiles),
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
  shares: many(tripShares),
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
}));
