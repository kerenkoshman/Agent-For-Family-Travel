import { PlannerAgent } from '../../services/agents/PlannerAgent';
import { FamilyProfile, TripPreferences } from '../../types';

describe('PlannerAgent', () => {
  let plannerAgent: PlannerAgent;

  beforeEach(() => {
    plannerAgent = new PlannerAgent();
  });

  describe('suggestDestinations', () => {
    it('should suggest destinations based on family profile', async () => {
      const familyProfile: FamilyProfile = {
        id: '1',
        userId: 'user1',
        name: 'Test Family',
        description: 'A test family',
        preferences: {
          interests: ['beaches', 'mountains'],
          budget: { min: 1000, max: 5000, currency: 'USD' },
          travelStyle: ['adventure'],
          dietaryRestrictions: ['vegetarian'],
          accessibility: ['wheelchair-friendly'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const preferences: TripPreferences = {
        duration: 7,
        season: 'summer',
        groupSize: 4,
        accommodationType: ['hotel'],
        transportationType: ['public'],
        activityTypes: ['outdoor', 'cultural'],
        diningPreferences: ['local'],
      };

      const destinations = await plannerAgent.suggestDestinations(familyProfile, preferences);

      expect(destinations).toBeDefined();
      expect(Array.isArray(destinations)).toBe(true);
      expect(destinations.length).toBeGreaterThan(0);

      destinations.forEach(destination => {
        expect(destination).toHaveProperty('id');
        expect(destination).toHaveProperty('name');
        expect(destination).toHaveProperty('country');
        expect(destination).toHaveProperty('description');
        expect(destination).toHaveProperty('imageUrl');
        expect(destination).toHaveProperty('rating');
        expect(destination).toHaveProperty('priceRange');
        expect(destination).toHaveProperty('bestTimeToVisit');
        expect(destination).toHaveProperty('familyFriendlyScore');
      });
    });

    it('should filter destinations by budget constraints', async () => {
      const familyProfile: FamilyProfile = {
        id: '1',
        userId: 'user1',
        name: 'Test Family',
        preferences: {
          interests: ['beaches'],
          budget: { min: 1000, max: 2000, currency: 'USD' },
          travelStyle: ['relaxation'],
          dietaryRestrictions: [],
          accessibility: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const preferences: TripPreferences = {
        duration: 5,
        season: 'summer',
        groupSize: 2,
        accommodationType: ['hotel'],
        transportationType: ['public'],
        activityTypes: ['outdoor'],
        diningPreferences: ['local'],
      };

      const destinations = await plannerAgent.suggestDestinations(familyProfile, preferences);

      destinations.forEach(destination => {
        expect(destination.priceRange).toBeLessThanOrEqual(2000);
        expect(destination.priceRange).toBeGreaterThanOrEqual(1000);
      });
    });

    it('should prioritize family-friendly destinations', async () => {
      const familyProfile: FamilyProfile = {
        id: '1',
        userId: 'user1',
        name: 'Test Family',
        preferences: {
          interests: ['theme-parks', 'beaches'],
          budget: { min: 1000, max: 5000, currency: 'USD' },
          travelStyle: ['family'],
          dietaryRestrictions: [],
          accessibility: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const preferences: TripPreferences = {
        duration: 7,
        season: 'summer',
        groupSize: 4,
        accommodationType: ['resort'],
        transportationType: ['rental'],
        activityTypes: ['entertainment'],
        diningPreferences: ['family-friendly'],
      };

      const destinations = await plannerAgent.suggestDestinations(familyProfile, preferences);

      destinations.forEach(destination => {
        expect(destination.familyFriendlyScore).toBeGreaterThanOrEqual(7);
      });
    });
  });

  describe('suggestActivities', () => {
    it('should suggest activities for a destination', async () => {
      const destination = 'Paris, France';
      const familyProfile: FamilyProfile = {
        id: '1',
        userId: 'user1',
        name: 'Test Family',
        preferences: {
          interests: ['culture', 'food'],
          budget: { min: 1000, max: 5000, currency: 'USD' },
          travelStyle: ['cultural'],
          dietaryRestrictions: ['vegetarian'],
          accessibility: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const activities = await plannerAgent.suggestActivities(destination, familyProfile);

      expect(activities).toBeDefined();
      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);

      activities.forEach(activity => {
        expect(activity).toHaveProperty('id');
        expect(activity).toHaveProperty('name');
        expect(activity).toHaveProperty('description');
        expect(activity).toHaveProperty('type');
        expect(activity).toHaveProperty('location');
        expect(activity).toHaveProperty('duration');
        expect(activity).toHaveProperty('cost');
        expect(activity).toHaveProperty('familyFriendly');
        expect(activity).toHaveProperty('rating');
      });
    });

    it('should filter activities by family preferences', async () => {
      const destination = 'Tokyo, Japan';
      const familyProfile: FamilyProfile = {
        id: '1',
        userId: 'user1',
        name: 'Test Family',
        preferences: {
          interests: ['anime', 'technology'],
          budget: { min: 500, max: 3000, currency: 'USD' },
          travelStyle: ['educational'],
          dietaryRestrictions: ['vegetarian'],
          accessibility: ['wheelchair-friendly'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const activities = await plannerAgent.suggestActivities(destination, familyProfile);

      activities.forEach(activity => {
        expect(activity.familyFriendly).toBe(true);
        expect(activity.cost).toBeLessThanOrEqual(3000);
      });
    });
  });

  describe('getDestinationDetails', () => {
    it('should return detailed destination information', async () => {
      const destinationId = 'paris-france';

      const details = await plannerAgent.getDestinationDetails(destinationId);

      expect(details).toBeDefined();
      expect(details).toHaveProperty('id', destinationId);
      expect(details).toHaveProperty('name');
      expect(details).toHaveProperty('description');
      expect(details).toHaveProperty('highlights');
      expect(details).toHaveProperty('weather');
      expect(details).toHaveProperty('transportation');
      expect(details).toHaveProperty('accommodation');
      expect(details).toHaveProperty('safety');
      expect(details).toHaveProperty('familyFriendlyInfo');
    });

    it('should handle non-existent destinations gracefully', async () => {
      const destinationId = 'non-existent-destination';

      await expect(plannerAgent.getDestinationDetails(destinationId))
        .rejects.toThrow('Destination not found');
    });
  });

  describe('getSeasonalRecommendations', () => {
    it('should return seasonal recommendations', async () => {
      const season = 'winter';
      const familyProfile: FamilyProfile = {
        id: '1',
        userId: 'user1',
        name: 'Test Family',
        preferences: {
          interests: ['skiing', 'snow'],
          budget: { min: 2000, max: 8000, currency: 'USD' },
          travelStyle: ['adventure'],
          dietaryRestrictions: [],
          accessibility: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const recommendations = await plannerAgent.getSeasonalRecommendations(season, familyProfile);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('destination');
        expect(rec).toHaveProperty('activities');
        expect(rec).toHaveProperty('accommodation');
        expect(rec).toHaveProperty('transportation');
        expect(rec).toHaveProperty('tips');
      });
    });
  });

  describe('validateTripPlan', () => {
    it('should validate a complete trip plan', async () => {
      const tripPlan = {
        destination: 'Paris, France',
        duration: 7,
        activities: [
          { name: 'Eiffel Tower', duration: 2, cost: 25 },
          { name: 'Louvre Museum', duration: 3, cost: 15 },
        ],
        accommodation: { type: 'hotel', cost: 150 },
        transportation: { type: 'public', cost: 50 },
        totalBudget: 1000,
      };

      const validation = await plannerAgent.validateTripPlan(tripPlan);

      expect(validation).toBeDefined();
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('issues');
      expect(validation).toHaveProperty('suggestions');
      expect(validation).toHaveProperty('totalCost');
      expect(validation).toHaveProperty('budgetRemaining');
    });

    it('should identify budget overruns', async () => {
      const tripPlan = {
        destination: 'Paris, France',
        duration: 7,
        activities: [
          { name: 'Eiffel Tower', duration: 2, cost: 25 },
          { name: 'Louvre Museum', duration: 3, cost: 15 },
        ],
        accommodation: { type: 'luxury-hotel', cost: 500 },
        transportation: { type: 'private', cost: 200 },
        totalBudget: 1000,
      };

      const validation = await plannerAgent.validateTripPlan(tripPlan);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.totalCost).toBeGreaterThan(tripPlan.totalBudget);
    });
  });
});
