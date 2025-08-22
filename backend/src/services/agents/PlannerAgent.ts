import { BaseAgent, AgentContext, AgentResult } from './BaseAgent';
import { GooglePlacesClient } from '../api/GooglePlacesClient';
import { TripAdvisorClient } from '../api/TripAdvisorClient';

export interface DestinationSuggestion {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  familyScore: number;
  budgetRange: {
    min: number;
    max: number;
  };
  bestTimeToVisit: string[];
  activities: string[];
  imageUrl?: string;
}

export interface ActivityRecommendation {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'activity' | 'entertainment';
  description: string;
  familyFriendly: boolean;
  ageRange: {
    min: number;
    max: number;
  };
  duration: number; // in minutes
  cost: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  imageUrl?: string;
}

export interface PlanningResult {
  destinations: DestinationSuggestion[];
  activities: ActivityRecommendation[];
  recommendations: {
    bestDestination: DestinationSuggestion;
    topActivities: ActivityRecommendation[];
    budgetBreakdown: {
      accommodation: number;
      activities: number;
      food: number;
      transportation: number;
      total: number;
    };
  };
}

export class PlannerAgent extends BaseAgent {
  private placesClient: GooglePlacesClient;
  private tripAdvisorClient: TripAdvisorClient;

  constructor(context: AgentContext) {
    super('PlannerAgent', context);
    this.placesClient = new GooglePlacesClient();
    this.tripAdvisorClient = new TripAdvisorClient();
  }

  async execute(): Promise<AgentResult<PlanningResult>> {
    const startTime = Date.now();
    
    try {
      this.logExecution('Starting trip planning process');

      if (!this.validateContext()) {
        return this.handleError(new Error('Invalid context'), 'validation');
      }

      // Step 1: Generate destination suggestions
      const destinations = await this.suggestDestinations();
      
      // Step 2: Get activity recommendations for the best destination
      if (destinations.length === 0) {
        return this.handleError(new Error('No destinations found'), 'destination search');
      }
      
      const bestDestination = destinations[0]; // For now, take the first one
      if (!bestDestination) {
        return this.handleError(new Error('No valid destination found'), 'destination selection');
      }
      
      const activities = await this.getActivityRecommendations(bestDestination);
      
      // Step 3: Calculate budget breakdown
      const budgetBreakdown = this.calculateBudgetBreakdown(bestDestination, activities);
      
      // Step 4: Create final recommendations
      const result: PlanningResult = {
        destinations,
        activities,
        recommendations: {
          bestDestination,
          topActivities: activities.slice(0, 5), // Top 5 activities
          budgetBreakdown,
        },
      };

      const processingTime = Date.now() - startTime;
      
      this.logExecution('Trip planning completed successfully', {
        destinationsCount: destinations.length,
        activitiesCount: activities.length,
        processingTime,
      });

      return this.createSuccessResult(result, {
        processingTime,
        confidence: 0.85,
      });

    } catch (error) {
      return this.handleError(error as Error, 'planning execution');
    }
  }

  private async suggestDestinations(): Promise<DestinationSuggestion[]> {
    this.logExecution('Generating destination suggestions');

    // For now, return some popular family destinations
    // In a real implementation, this would use AI/ML models and external APIs
    const destinations: DestinationSuggestion[] = [
      {
        id: 'disney-world',
        name: 'Walt Disney World Resort',
        location: {
          city: 'Orlando',
          country: 'United States',
          coordinates: { lat: 28.4177, lng: -81.5812 },
        },
        description: 'The most magical place on earth with attractions for all ages',
        familyScore: 9.5,
        budgetRange: { min: 3000, max: 8000 },
        bestTimeToVisit: ['March', 'April', 'September', 'October'],
        activities: ['Theme Parks', 'Character Meet & Greets', 'Water Parks', 'Shopping'],
        imageUrl: 'https://example.com/disney-world.jpg',
      },
      {
        id: 'paris',
        name: 'Paris',
        location: {
          city: 'Paris',
          country: 'France',
          coordinates: { lat: 48.8566, lng: 2.3522 },
        },
        description: 'The City of Light with iconic landmarks and rich culture',
        familyScore: 8.0,
        budgetRange: { min: 4000, max: 10000 },
        bestTimeToVisit: ['April', 'May', 'September', 'October'],
        activities: ['Eiffel Tower', 'Louvre Museum', 'Disneyland Paris', 'Seine River Cruise'],
        imageUrl: 'https://example.com/paris.jpg',
      },
      {
        id: 'tokyo',
        name: 'Tokyo',
        location: {
          city: 'Tokyo',
          country: 'Japan',
          coordinates: { lat: 35.6762, lng: 139.6503 },
        },
        description: 'A fascinating blend of traditional culture and modern technology',
        familyScore: 7.5,
        budgetRange: { min: 5000, max: 12000 },
        bestTimeToVisit: ['March', 'April', 'October', 'November'],
        activities: ['Tokyo Disneyland', 'Senso-ji Temple', 'Tokyo Skytree', 'Tsukiji Market'],
        imageUrl: 'https://example.com/tokyo.jpg',
      },
    ];

    // Filter by budget if specified
    if (this.context.budget) {
      return destinations.filter(dest => 
        dest.budgetRange.min <= this.context.budget! * 1.5 // Allow 50% buffer and check min budget
      );
    }

    return destinations;
  }

  private async getActivityRecommendations(destination: DestinationSuggestion): Promise<ActivityRecommendation[]> {
    this.logExecution('Getting activity recommendations', { destination: destination.name });

    // For now, return sample activities
    // In a real implementation, this would call TripAdvisor and Google Places APIs
    const activities: ActivityRecommendation[] = [
      {
        id: 'activity-1',
        name: 'Main Theme Park Visit',
        type: 'attraction',
        description: 'Full day at the main theme park with all attractions',
        familyFriendly: true,
        ageRange: { min: 3, max: 99 },
        duration: 480, // 8 hours
        cost: { min: 100, max: 150, currency: 'USD' },
        location: {
          address: 'Main Theme Park, Orlando, FL',
          coordinates: { lat: 28.4177, lng: -81.5812 },
        },
        rating: 4.8,
        imageUrl: 'https://example.com/theme-park.jpg',
      },
      {
        id: 'activity-2',
        name: 'Character Dining Experience',
        type: 'restaurant',
        description: 'Interactive dining with beloved characters',
        familyFriendly: true,
        ageRange: { min: 2, max: 12 },
        duration: 90,
        cost: { min: 50, max: 80, currency: 'USD' },
        location: {
          address: 'Character Restaurant, Orlando, FL',
        },
        rating: 4.6,
        imageUrl: 'https://example.com/character-dining.jpg',
      },
      {
        id: 'activity-3',
        name: 'Water Park Adventure',
        type: 'activity',
        description: 'Splash and slide at the water park',
        familyFriendly: true,
        ageRange: { min: 5, max: 99 },
        duration: 360, // 6 hours
        cost: { min: 60, max: 90, currency: 'USD' },
        location: {
          address: 'Water Park, Orlando, FL',
        },
        rating: 4.5,
        imageUrl: 'https://example.com/water-park.jpg',
      },
    ];

    return activities;
  }

  private calculateBudgetBreakdown(destination: DestinationSuggestion, activities: ActivityRecommendation[]): {
    accommodation: number;
    activities: number;
    food: number;
    transportation: number;
    total: number;
  } {
    const totalBudget = this.context.budget || destination.budgetRange.max;
    
    // Calculate activity costs
    const activityCost = activities.reduce((sum, activity) => sum + activity.cost.max, 0);
    
    // Estimate other costs (these would be more sophisticated in a real implementation)
    const accommodation = totalBudget * 0.4; // 40% for accommodation
    const food = totalBudget * 0.25; // 25% for food
    const transportation = totalBudget * 0.15; // 15% for transportation
    const activitiesCost = Math.min(activityCost, totalBudget * 0.2); // 20% for activities
    
    return {
      accommodation: Math.round(accommodation),
      activities: Math.round(activitiesCost),
      food: Math.round(food),
      transportation: Math.round(transportation),
      total: Math.round(accommodation + activitiesCost + food + transportation),
    };
  }
}
