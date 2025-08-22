import { db } from '../config/database';
import { 
  users, 
  familyProfiles, 
  familyMembers, 
  trips, 
  itineraries, 
  activities, 
  accommodations, 
  flights,
  userPreferences,
  apiCache 
} from '../models/schema';
import { logger } from './logger';

export const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');

    // Clear existing data
    await clearDatabase();

    // Seed users
    const sampleUsers = await seedUsers();
    logger.info(`Created ${sampleUsers.length} users`);

    // Seed family profiles
    const sampleFamilies = await seedFamilyProfiles(sampleUsers);
    logger.info(`Created ${sampleFamilies.length} family profiles`);

    // Seed family members
    const sampleMembers = await seedFamilyMembers(sampleFamilies);
    logger.info(`Created ${sampleMembers.length} family members`);

    // Seed trips
    const sampleTrips = await seedTrips(sampleFamilies);
    logger.info(`Created ${sampleTrips.length} trips`);

    // Seed itineraries
    const sampleItineraries = await seedItineraries(sampleTrips);
    logger.info(`Created ${sampleItineraries.length} itineraries`);

    // Seed activities
    const sampleActivities = await seedActivities(sampleItineraries);
    logger.info(`Created ${sampleActivities.length} activities`);

    // Seed accommodations
    const sampleAccommodations = await seedAccommodations(sampleTrips);
    logger.info(`Created ${sampleAccommodations.length} accommodations`);

    // Seed flights
    const sampleFlights = await seedFlights(sampleTrips);
    logger.info(`Created ${sampleFlights.length} flights`);

    // Seed user preferences
    const samplePreferences = await seedUserPreferences(sampleUsers);
    logger.info(`Created ${samplePreferences.length} user preferences`);

    // Seed API cache
    const sampleCache = await seedApiCache();
    logger.info(`Created ${sampleCache.length} API cache entries`);

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  logger.info('Clearing existing data...');
  
  await db.delete(apiCache);
  await db.delete(userPreferences);
  await db.delete(flights);
  await db.delete(accommodations);
  await db.delete(activities);
  await db.delete(itineraries);
  await db.delete(trips);
  await db.delete(familyMembers);
  await db.delete(familyProfiles);
  await db.delete(users);
};

const seedUsers = async () => {
  const userData = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      googleId: 'google_123456789',
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      googleId: 'google_987654321',
    },
    {
      email: 'mike.wilson@example.com',
      firstName: 'Mike',
      lastName: 'Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      googleId: 'google_456789123',
    },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();
  return insertedUsers;
};

const seedFamilyProfiles = async (sampleUsers: any[]) => {
  const familyData = [
    {
      userId: sampleUsers[0].id,
      name: 'The Doe Family',
      description: 'A family of four who loves adventure and exploring new places',
      budget: '8000.00',
      travelStyle: 'comfort',
      preferredDestinations: ['Beach Destinations', 'Mountain Retreats', 'Cultural Sites'],
      interests: ['Adventure', 'Food', 'History', 'Nature'],
      accessibility: false,
      petFriendly: false,
      dietaryRestrictions: ['None'],
    },
    {
      userId: sampleUsers[1].id,
      name: 'The Smith Family',
      description: 'A family of three who enjoys luxury travel and fine dining',
      budget: '15000.00',
      travelStyle: 'luxury',
      preferredDestinations: ['Family Resorts', 'City Breaks', 'Historical Places'],
      interests: ['Food', 'Culture', 'Relaxation', 'Shopping'],
      accessibility: false,
      petFriendly: true,
      dietaryRestrictions: ['Vegetarian'],
    },
    {
      userId: sampleUsers[2].id,
      name: 'The Wilson Family',
      description: 'A budget-conscious family who loves outdoor activities',
      budget: '5000.00',
      travelStyle: 'budget',
      preferredDestinations: ['Nature Parks', 'Adventure Locations', 'Mountain Retreats'],
      interests: ['Adventure', 'Sports', 'Nature', 'Photography'],
      accessibility: true,
      petFriendly: false,
      dietaryRestrictions: ['Gluten-Free'],
    },
  ];

  const insertedFamilies = await db.insert(familyProfiles).values(familyData).returning();
  return insertedFamilies;
};

const seedFamilyMembers = async (sampleFamilies: any[]) => {
  const memberData = [
    // Doe Family
    {
      familyId: sampleFamilies[0].id,
      name: 'John Doe',
      age: 35,
      relationship: 'Self',
      interests: ['Adventure', 'Photography', 'Technology'],
    },
    {
      familyId: sampleFamilies[0].id,
      name: 'Sarah Doe',
      age: 32,
      relationship: 'Spouse',
      interests: ['Food', 'Shopping', 'Culture'],
    },
    {
      familyId: sampleFamilies[0].id,
      name: 'Emma Doe',
      age: 8,
      relationship: 'Child',
      interests: ['Theme Parks', 'Animals', 'Art'],
    },
    {
      familyId: sampleFamilies[0].id,
      name: 'Liam Doe',
      age: 5,
      relationship: 'Child',
      interests: ['Sports', 'Games', 'Nature'],
    },
    // Smith Family
    {
      familyId: sampleFamilies[1].id,
      name: 'Jane Smith',
      age: 28,
      relationship: 'Self',
      interests: ['Food', 'Culture', 'Relaxation'],
    },
    {
      familyId: sampleFamilies[1].id,
      name: 'David Smith',
      age: 30,
      relationship: 'Spouse',
      interests: ['History', 'Photography', 'Music'],
    },
    {
      familyId: sampleFamilies[1].id,
      name: 'Sophia Smith',
      age: 6,
      relationship: 'Child',
      interests: ['Art', 'Animals', 'Games'],
    },
    // Wilson Family
    {
      familyId: sampleFamilies[2].id,
      name: 'Mike Wilson',
      age: 40,
      relationship: 'Self',
      interests: ['Adventure', 'Sports', 'Technology'],
    },
    {
      familyId: sampleFamilies[2].id,
      name: 'Lisa Wilson',
      age: 38,
      relationship: 'Spouse',
      interests: ['Nature', 'Photography', 'Fitness'],
    },
    {
      familyId: sampleFamilies[2].id,
      name: 'Alex Wilson',
      age: 12,
      relationship: 'Child',
      interests: ['Sports', 'Adventure', 'Technology'],
    },
  ];

  const insertedMembers = await db.insert(familyMembers).values(memberData).returning();
  return insertedMembers;
};

const seedTrips = async (sampleFamilies: any[]) => {
  const tripData = [
    {
      familyId: sampleFamilies[0].id,
      title: 'Hawaiian Paradise',
      description: 'A week-long family vacation to the beautiful islands of Hawaii',
      destination: 'Maui, Hawaii',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      budget: '8000.00',
      status: 'confirmed',
      totalCost: '7200.00',
    },
    {
      familyId: sampleFamilies[1].id,
      title: 'European Adventure',
      description: 'Exploring the rich history and culture of Europe',
      destination: 'Paris, France',
      startDate: new Date('2024-07-10'),
      endDate: new Date('2024-07-20'),
      budget: '15000.00',
      status: 'planning',
      totalCost: '0.00',
    },
    {
      familyId: sampleFamilies[2].id,
      title: 'Rocky Mountain Escape',
      description: 'Outdoor adventure in the beautiful Rocky Mountains',
      destination: 'Denver, Colorado',
      startDate: new Date('2024-08-05'),
      endDate: new Date('2024-08-12'),
      budget: '5000.00',
      status: 'confirmed',
      totalCost: '4200.00',
    },
  ];

  const insertedTrips = await db.insert(trips).values(tripData).returning();
  return insertedTrips;
};

const seedItineraries = async (sampleTrips: any[]) => {
  const itineraryData = [
    // Hawaii Trip - Day 1
    {
      tripId: sampleTrips[0].id,
      dayNumber: 1,
      date: new Date('2024-06-15'),
      notes: 'Arrival day - settle in and explore the resort',
    },
    // Hawaii Trip - Day 2
    {
      tripId: sampleTrips[0].id,
      dayNumber: 2,
      date: new Date('2024-06-16'),
      notes: 'Beach day and snorkeling adventure',
    },
    // Hawaii Trip - Day 3
    {
      tripId: sampleTrips[0].id,
      dayNumber: 3,
      date: new Date('2024-06-17'),
      notes: 'Road to Hana tour',
    },
    // Paris Trip - Day 1
    {
      tripId: sampleTrips[1].id,
      dayNumber: 1,
      date: new Date('2024-07-10'),
      notes: 'Arrival and Eiffel Tower visit',
    },
    // Paris Trip - Day 2
    {
      tripId: sampleTrips[1].id,
      dayNumber: 2,
      date: new Date('2024-07-11'),
      notes: 'Louvre Museum and Seine River cruise',
    },
    // Colorado Trip - Day 1
    {
      tripId: sampleTrips[2].id,
      dayNumber: 1,
      date: new Date('2024-08-05'),
      notes: 'Arrival and hiking preparation',
    },
    // Colorado Trip - Day 2
    {
      tripId: sampleTrips[2].id,
      dayNumber: 2,
      date: new Date('2024-08-06'),
      notes: 'Rocky Mountain National Park exploration',
    },
  ];

  const insertedItineraries = await db.insert(itineraries).values(itineraryData).returning();
  return insertedItineraries;
};

const seedActivities = async (sampleItineraries: any[]) => {
  const activityData = [
    // Hawaii Day 1 Activities
    {
      itineraryId: sampleItineraries[0].id,
      name: 'Airport Transfer',
      description: 'Transfer from Kahului Airport to resort',
      type: 'transport',
      location: 'Kahului Airport',
      startTime: new Date('2024-06-15T14:00:00'),
      endTime: new Date('2024-06-15T15:00:00'),
      cost: '0.00',
    },
    {
      itineraryId: sampleItineraries[0].id,
      name: 'Resort Check-in',
      description: 'Check into Maui Beach Resort',
      type: 'accommodation',
      location: 'Maui Beach Resort',
      startTime: new Date('2024-06-15T16:00:00'),
      endTime: new Date('2024-06-15T17:00:00'),
      cost: '0.00',
    },
    // Hawaii Day 2 Activities
    {
      itineraryId: sampleItineraries[1].id,
      name: 'Snorkeling at Molokini',
      description: 'Half-day snorkeling tour to the famous Molokini crater',
      type: 'attraction',
      location: 'Molokini Crater',
      startTime: new Date('2024-06-16T08:00:00'),
      endTime: new Date('2024-06-16T12:00:00'),
      cost: '200.00',
      bookingReference: 'MOL-001',
    },
    // Paris Day 1 Activities
    {
      itineraryId: sampleItineraries[3].id,
      name: 'Eiffel Tower Visit',
      description: 'Visit the iconic Eiffel Tower',
      type: 'attraction',
      location: 'Eiffel Tower',
      startTime: new Date('2024-07-10T14:00:00'),
      endTime: new Date('2024-07-10T16:00:00'),
      cost: '50.00',
      bookingReference: 'EIF-001',
    },
    // Colorado Day 2 Activities
    {
      itineraryId: sampleItineraries[6].id,
      name: 'Rocky Mountain Hiking',
      description: 'Guided hiking tour in Rocky Mountain National Park',
      type: 'attraction',
      location: 'Rocky Mountain National Park',
      startTime: new Date('2024-08-06T09:00:00'),
      endTime: new Date('2024-08-06T15:00:00'),
      cost: '150.00',
      bookingReference: 'RMH-001',
    },
  ];

  const insertedActivities = await db.insert(activities).values(activityData).returning();
  return insertedActivities;
};

const seedAccommodations = async (sampleTrips: any[]) => {
  const accommodationData = [
    {
      tripId: sampleTrips[0].id,
      name: 'Maui Beach Resort',
      address: '123 Beach Road, Lahaina, HI 96761',
      checkIn: new Date('2024-06-15T16:00:00'),
      checkOut: new Date('2024-06-22T11:00:00'),
      cost: '2100.00',
      bookingReference: 'MBR-2024-001',
    },
    {
      tripId: sampleTrips[1].id,
      name: 'Hotel de Paris',
      address: '456 Champs-Élysées, Paris, France',
      checkIn: new Date('2024-07-10T15:00:00'),
      checkOut: new Date('2024-07-20T11:00:00'),
      cost: '3500.00',
      bookingReference: 'HDP-2024-001',
    },
    {
      tripId: sampleTrips[2].id,
      name: 'Mountain View Lodge',
      address: '789 Mountain Road, Denver, CO 80202',
      checkIn: new Date('2024-08-05T14:00:00'),
      checkOut: new Date('2024-08-12T11:00:00'),
      cost: '1200.00',
      bookingReference: 'MVL-2024-001',
    },
  ];

  const insertedAccommodations = await db.insert(accommodations).values(accommodationData).returning();
  return insertedAccommodations;
};

const seedFlights = async (sampleTrips: any[]) => {
  const flightData = [
    {
      tripId: sampleTrips[0].id,
      type: 'departure',
      airline: 'American Airlines',
      flightNumber: 'AA123',
      from: 'Los Angeles',
      to: 'Kahului',
      departure: new Date('2024-06-15T10:00:00'),
      arrival: new Date('2024-06-15T14:00:00'),
      cost: '1200.00',
      bookingReference: 'AA-12345',
    },
    {
      tripId: sampleTrips[0].id,
      type: 'return',
      airline: 'American Airlines',
      flightNumber: 'AA124',
      from: 'Kahului',
      to: 'Los Angeles',
      departure: new Date('2024-06-22T15:00:00'),
      arrival: new Date('2024-06-22T19:00:00'),
      cost: '1200.00',
      bookingReference: 'AA-12346',
    },
    {
      tripId: sampleTrips[1].id,
      type: 'departure',
      airline: 'Air France',
      flightNumber: 'AF456',
      from: 'New York',
      to: 'Paris',
      departure: new Date('2024-07-10T08:00:00'),
      arrival: new Date('2024-07-10T20:00:00'),
      cost: '2500.00',
      bookingReference: 'AF-45678',
    },
    {
      tripId: sampleTrips[2].id,
      type: 'departure',
      airline: 'United Airlines',
      flightNumber: 'UA789',
      from: 'San Francisco',
      to: 'Denver',
      departure: new Date('2024-08-05T09:00:00'),
      arrival: new Date('2024-08-05T11:00:00'),
      cost: '400.00',
      bookingReference: 'UA-78901',
    },
  ];

  const insertedFlights = await db.insert(flights).values(flightData).returning();
  return insertedFlights;
};

const seedUserPreferences = async (sampleUsers: any[]) => {
  const preferenceData = [
    {
      userId: sampleUsers[0].id,
      language: 'en',
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      profileVisibility: 'public',
      shareTripData: true,
      allowAnalytics: true,
      allowCookies: true,
    },
    {
      userId: sampleUsers[1].id,
      language: 'en',
      currency: 'EUR',
      timezone: 'Europe/Paris',
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: true,
      profileVisibility: 'friends',
      shareTripData: false,
      allowAnalytics: true,
      allowCookies: true,
    },
    {
      userId: sampleUsers[2].id,
      language: 'en',
      currency: 'USD',
      timezone: 'America/Denver',
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      profileVisibility: 'private',
      shareTripData: true,
      allowAnalytics: false,
      allowCookies: true,
    },
  ];

  const insertedPreferences = await db.insert(userPreferences).values(preferenceData).returning();
  return insertedPreferences;
};

const seedApiCache = async () => {
  const cacheData = [
    {
      key: 'tripadvisor_maui_attractions',
      data: {
        attractions: [
          { id: '1', name: 'Molokini Crater', rating: 4.5, reviews: 1200 },
          { id: '2', name: 'Road to Hana', rating: 4.8, reviews: 2100 },
          { id: '3', name: 'Haleakala National Park', rating: 4.7, reviews: 1800 },
        ],
      },
      source: 'tripadvisor',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    {
      key: 'google_places_paris_restaurants',
      data: {
        restaurants: [
          { id: '1', name: 'Le Comptoir du Relais', rating: 4.6, price_level: 3 },
          { id: '2', name: 'L\'Astrance', rating: 4.8, price_level: 4 },
          { id: '3', name: 'Septime', rating: 4.7, price_level: 3 },
        ],
      },
      source: 'google',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
    },
    {
      key: 'skyscanner_denver_flights',
      data: {
        flights: [
          { id: '1', airline: 'United Airlines', price: 400, duration: '2h 15m' },
          { id: '2', airline: 'Southwest Airlines', price: 350, duration: '2h 30m' },
          { id: '3', airline: 'American Airlines', price: 450, duration: '2h 10m' },
        ],
      },
      source: 'skyscanner',
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
    },
  ];

  const insertedCache = await db.insert(apiCache).values(cacheData).returning();
  return insertedCache;
};
