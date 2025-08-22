import { TripAdvisorClient, TripAdvisorSearchParams } from './TripAdvisorClient';
import { GooglePlacesClient, GooglePlacesSearchParams, GooglePlacesNearbyParams } from './GooglePlacesClient';
import { SkyscannerClient, SkyscannerSearchParams } from './SkyscannerClient';
import { logger } from '../../utils/logger';

export interface SearchAttractionsParams {
  location: string;
  limit?: number;
  sort?: 'rating' | 'relevance' | 'distance';
  priceLevel?: string;
  rating?: number;
}

export interface SearchRestaurantsParams {
  location: string;
  limit?: number;
  sort?: 'rating' | 'relevance' | 'distance';
  priceLevel?: string;
  rating?: number;
  cuisine?: string;
}

export interface SearchFlightsParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
}

export interface SearchPlacesParams {
  query?: string;
  location?: string;
  radius?: number;
  type?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  openNow?: boolean;
}

export class ApiServiceManager {
  private tripAdvisorClient: TripAdvisorClient;
  private googlePlacesClient: GooglePlacesClient;
  private skyscannerClient: SkyscannerClient;

  constructor() {
    const tripAdvisorApiKey = process.env['TRIPADVISOR_API_KEY'] || 'your_tripadvisor_api_key_here';
    const googlePlacesApiKey = process.env['GOOGLE_PLACES_API_KEY'] || 'your_google_places_api_key_here';
    const skyscannerApiKey = process.env['SKYSCANNER_API_KEY'] || 'your_skyscanner_api_key_here';

    this.tripAdvisorClient = new TripAdvisorClient(tripAdvisorApiKey);
    this.googlePlacesClient = new GooglePlacesClient(googlePlacesApiKey);
    this.skyscannerClient = new SkyscannerClient(skyscannerApiKey);

    logger.info('API Service Manager initialized');
  }

  // TripAdvisor API Methods
  async searchAttractions(params: SearchAttractionsParams) {
    logger.info(`Searching attractions for location: ${params.location}`);
    
    const searchParams: TripAdvisorSearchParams = {
      location: params.location,
      category: 'attractions',
      limit: params.limit || 20,
      sort: params.sort || 'rating',
      priceLevel: params.priceLevel,
      rating: params.rating,
    };

    return this.tripAdvisorClient.searchAttractions(searchParams);
  }

  async searchRestaurants(params: SearchRestaurantsParams) {
    logger.info(`Searching restaurants for location: ${params.location}`);
    
    const searchParams: TripAdvisorSearchParams = {
      location: params.location,
      category: 'restaurants',
      limit: params.limit || 20,
      sort: params.sort || 'rating',
      priceLevel: params.priceLevel,
      rating: params.rating,
    };

    return this.tripAdvisorClient.searchRestaurants(searchParams);
  }

  async getPopularAttractions(location: string) {
    logger.info(`Getting popular attractions for location: ${location}`);
    return this.tripAdvisorClient.getPopularAttractions(location);
  }

  async getAttractionDetails(attractionId: string) {
    logger.info(`Getting attraction details for ID: ${attractionId}`);
    return this.tripAdvisorClient.getAttractionDetails(attractionId);
  }

  async getRestaurantDetails(restaurantId: string) {
    logger.info(`Getting restaurant details for ID: ${restaurantId}`);
    return this.tripAdvisorClient.getRestaurantDetails(restaurantId);
  }

  // Google Places API Methods
  async searchPlaces(params: SearchPlacesParams) {
    logger.info(`Searching places with query: ${params.query || 'nearby search'}`);
    
    const searchParams: GooglePlacesSearchParams = {
      query: params.query,
      location: params.location,
      radius: params.radius,
      type: params.type,
      keyword: params.keyword,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      openNow: params.openNow,
    };

    return this.googlePlacesClient.searchPlaces(searchParams);
  }

  async getNearbyPlaces(params: GooglePlacesNearbyParams) {
    logger.info(`Getting nearby places for location: ${params.location}`);
    return this.googlePlacesClient.getNearbyPlaces(params);
  }

  async getPlaceDetails(placeId: string) {
    logger.info(`Getting place details for ID: ${placeId}`);
    return this.googlePlacesClient.getPlaceDetails(placeId);
  }

  async getPlacePhotos(placeId: string, maxWidth = 800) {
    logger.info(`Getting place photos for ID: ${placeId}`);
    return this.googlePlacesClient.getPlacePhotos(placeId, maxWidth);
  }

  async autocompletePlaces(input: string, location?: string, radius?: number) {
    logger.info(`Autocompleting places for input: ${input}`);
    return this.googlePlacesClient.autocompletePlaces(input, location, radius);
  }

  async getGeocode(address: string) {
    logger.info(`Getting geocode for address: ${address}`);
    return this.googlePlacesClient.getGeocode(address);
  }

  // Skyscanner API Methods
  async searchFlights(params: SearchFlightsParams) {
    logger.info(`Searching flights from ${params.origin} to ${params.destination}`);
    
    const searchParams: SkyscannerSearchParams = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults || 1,
      children: params.children,
      infants: params.infants,
      cabinClass: params.cabinClass || 'economy',
      currency: params.currency || 'USD',
    };

    return this.skyscannerClient.searchFlights(searchParams);
  }

  async getFlightPrices(params: SearchFlightsParams) {
    logger.info(`Getting flight prices from ${params.origin} to ${params.destination}`);
    
    const searchParams: SkyscannerSearchParams = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults || 1,
      children: params.children,
      infants: params.infants,
      cabinClass: params.cabinClass || 'economy',
      currency: params.currency || 'USD',
    };

    return this.skyscannerClient.getFlightPrices(searchParams);
  }

  async searchAirports(query: string) {
    logger.info(`Searching airports for query: ${query}`);
    return this.skyscannerClient.searchAirports(query);
  }

  async getPopularRoutes(origin: string) {
    logger.info(`Getting popular routes from origin: ${origin}`);
    return this.skyscannerClient.getPopularRoutes(origin);
  }

  async getFlightDetails(flightId: string) {
    logger.info(`Getting flight details for ID: ${flightId}`);
    return this.skyscannerClient.getFlightDetails(flightId);
  }

  // Combined Search Methods
  async searchDestinationData(location: string, options: {
    attractions?: boolean;
    restaurants?: boolean;
    places?: boolean;
    limit?: number;
  } = {}) {
    logger.info(`Performing comprehensive destination search for: ${location}`);
    
    const results: any = {};
    const limit = options.limit || 10;

    try {
      // Search attractions
      if (options.attractions !== false) {
        const attractionsResult = await this.searchAttractions({
          location,
          limit,
          sort: 'rating',
        });
        results.attractions = attractionsResult;
      }

      // Search restaurants
      if (options.restaurants !== false) {
        const restaurantsResult = await this.searchRestaurants({
          location,
          limit,
          sort: 'rating',
        });
        results.restaurants = restaurantsResult;
      }

      // Search places
      if (options.places !== false) {
        const placesResult = await this.searchPlaces({
          location,
          radius: 5000,
          type: 'tourist_attraction',
        });
        results.places = placesResult;
      }

      return {
        success: true,
        data: results,
        location,
      };
    } catch (error) {
      logger.error('Error in comprehensive destination search:', error);
      return {
        success: false,
        error: 'Failed to search destination data',
        location,
      };
    }
  }

  async getTravelRecommendations(familyPreferences: {
    interests: string[];
    budget: number;
    travelStyle: string;
    preferredDestinations: string[];
    accessibility: boolean;
    petFriendly: boolean;
    dietaryRestrictions: string[];
  }) {
    logger.info('Generating travel recommendations based on family preferences');
    
    try {
      // This would integrate with AI/ML services for personalized recommendations
      // For now, return mock recommendations
      const recommendations = {
        destinations: [
          {
            name: 'Paris, France',
            reason: 'Matches your interest in culture and history',
            estimatedCost: 5000,
            familyFriendly: true,
          },
          {
            name: 'Maui, Hawaii',
            reason: 'Perfect for adventure and nature lovers',
            estimatedCost: 8000,
            familyFriendly: true,
          },
          {
            name: 'Denver, Colorado',
            reason: 'Great for outdoor activities and mountain adventures',
            estimatedCost: 4000,
            familyFriendly: true,
          },
        ],
        activities: [
          {
            name: 'Eiffel Tower Visit',
            location: 'Paris, France',
            type: 'attraction',
            familyFriendly: true,
            estimatedCost: 50,
          },
          {
            name: 'Snorkeling at Molokini',
            location: 'Maui, Hawaii',
            type: 'adventure',
            familyFriendly: true,
            estimatedCost: 200,
          },
        ],
      };

      return {
        success: true,
        data: recommendations,
      };
    } catch (error) {
      logger.error('Error generating travel recommendations:', error);
      return {
        success: false,
        error: 'Failed to generate recommendations',
      };
    }
  }

  // Health check method
  async healthCheck() {
    logger.info('Performing API health check');
    
    const healthStatus = {
      tripAdvisor: false,
      googlePlaces: false,
      skyscanner: false,
      timestamp: new Date().toISOString(),
    };

    try {
      // Test TripAdvisor API
      const taResult = await this.getPopularAttractions('Paris');
      healthStatus.tripAdvisor = taResult.success;
    } catch (error) {
      logger.warn('TripAdvisor API health check failed:', error);
    }

    try {
      // Test Google Places API
      const gpResult = await this.getGeocode('Paris, France');
      healthStatus.googlePlaces = gpResult.success;
    } catch (error) {
      logger.warn('Google Places API health check failed:', error);
    }

    try {
      // Test Skyscanner API
      const skResult = await this.searchAirports('LAX');
      healthStatus.skyscanner = skResult.success;
    } catch (error) {
      logger.warn('Skyscanner API health check failed:', error);
    }

    return healthStatus;
  }
}

// Export singleton instance
export const apiServiceManager = new ApiServiceManager();
