import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface TripAdvisorAttraction {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  category: string;
  priceLevel: string;
  description: string;
  images: string[];
  openingHours: string[];
  phone: string;
  website: string;
  features: string[];
}

export interface TripAdvisorRestaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  priceLevel: string;
  description: string;
  images: string[];
  openingHours: string[];
  phone: string;
  website: string;
  dietaryOptions: string[];
}

export interface TripAdvisorSearchParams {
  location: string;
  category?: 'attractions' | 'restaurants';
  limit?: number;
  offset?: number;
  sort?: 'rating' | 'relevance' | 'distance';
  priceLevel?: string;
  rating?: number;
}

export class TripAdvisorClient extends BaseApiClient {
  constructor(apiKey: string) {
    super('https://api.content.tripadvisor.com/api/v1', apiKey, 'tripadvisor');
  }

  async searchAttractions(params: TripAdvisorSearchParams): Promise<ApiResponse<TripAdvisorAttraction[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAttractions());
    }

    const queryParams = new URLSearchParams({
      location: params.location,
      category: 'attractions',
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      sort: params.sort || 'rating',
      ...(params.priceLevel && { priceLevel: params.priceLevel }),
      ...(params.rating && { rating: params.rating.toString() }),
    });

    return this.get<TripAdvisorAttraction[]>(`/locations/search?${queryParams}`);
  }

  async searchRestaurants(params: TripAdvisorSearchParams): Promise<ApiResponse<TripAdvisorRestaurant[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockRestaurants());
    }

    const queryParams = new URLSearchParams({
      location: params.location,
      category: 'restaurants',
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      sort: params.sort || 'rating',
      ...(params.priceLevel && { priceLevel: params.priceLevel }),
      ...(params.rating && { rating: params.rating.toString() }),
    });

    return this.get<TripAdvisorRestaurant[]>(`/locations/search?${queryParams}`);
  }

  async getAttractionDetails(attractionId: string): Promise<ApiResponse<TripAdvisorAttraction>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAttractionDetails(attractionId));
    }

    return this.get<TripAdvisorAttraction>(`/location/${attractionId}/details`);
  }

  async getRestaurantDetails(restaurantId: string): Promise<ApiResponse<TripAdvisorRestaurant>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockRestaurantDetails(restaurantId));
    }

    return this.get<TripAdvisorRestaurant>(`/location/${restaurantId}/details`);
  }

  async getPopularAttractions(location: string): Promise<ApiResponse<TripAdvisorAttraction[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockPopularAttractions());
    }

    const queryParams = new URLSearchParams({
      location,
      category: 'attractions',
      sort: 'rating',
      limit: '10',
    });

    return this.get<TripAdvisorAttraction[]>(`/locations/popular?${queryParams}`);
  }

  private getMockAttractions(): TripAdvisorAttraction[] {
    return [
      {
        id: '1',
        name: 'Eiffel Tower',
        address: 'Champ de Mars, 5 Avenue Anatole France',
        city: 'Paris',
        country: 'France',
        latitude: 48.8584,
        longitude: 2.2945,
        rating: 4.5,
        reviewCount: 125000,
        category: 'Landmark',
        priceLevel: '$$',
        description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
        images: [
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
        ],
        openingHours: ['9:00 AM - 11:45 PM'],
        phone: '+33 892 70 12 39',
        website: 'https://www.toureiffel.paris',
        features: ['Observation Deck', 'Restaurant', 'Gift Shop', 'Guided Tours'],
      },
      {
        id: '2',
        name: 'Louvre Museum',
        address: 'Rue de Rivoli',
        city: 'Paris',
        country: 'France',
        latitude: 48.8606,
        longitude: 2.3376,
        rating: 4.6,
        reviewCount: 98000,
        category: 'Museum',
        priceLevel: '$$',
        description: 'World\'s largest art museum and a historic monument.',
        images: [
          'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        ],
        openingHours: ['9:00 AM - 6:00 PM'],
        phone: '+33 1 40 20 50 50',
        website: 'https://www.louvre.fr',
        features: ['Art Collections', 'Guided Tours', 'Café', 'Gift Shop'],
      },
      {
        id: '3',
        name: 'Molokini Crater',
        address: 'Off the coast of Maui',
        city: 'Maui',
        country: 'United States',
        latitude: 20.6311,
        longitude: -156.4956,
        rating: 4.8,
        reviewCount: 8500,
        category: 'Natural Attraction',
        priceLevel: '$$$',
        description: 'Crescent-shaped volcanic crater perfect for snorkeling.',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        ],
        openingHours: ['6:00 AM - 6:00 PM'],
        phone: '+1 808-661-3641',
        website: 'https://www.molokini.com',
        features: ['Snorkeling', 'Scuba Diving', 'Boat Tours', 'Wildlife Viewing'],
      },
    ];
  }

  private getMockRestaurants(): TripAdvisorRestaurant[] {
    return [
      {
        id: '1',
        name: 'Le Comptoir du Relais',
        address: '9 Carrefour de l\'Odéon',
        city: 'Paris',
        country: 'France',
        latitude: 48.8534,
        longitude: 2.3376,
        rating: 4.6,
        reviewCount: 3200,
        cuisine: ['French', 'Bistro'],
        priceLevel: '$$$',
        description: 'Cozy bistro serving traditional French cuisine.',
        images: [
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        ],
        openingHours: ['12:00 PM - 2:30 PM', '7:00 PM - 11:00 PM'],
        phone: '+33 1 43 29 12 05',
        website: 'https://www.hotel-paris-relais-saint-germain.com',
        dietaryOptions: ['Vegetarian', 'Gluten-Free'],
      },
      {
        id: '2',
        name: 'L\'Astrance',
        address: '4 Rue Beethoven',
        city: 'Paris',
        country: 'France',
        latitude: 48.8584,
        longitude: 2.2945,
        rating: 4.8,
        reviewCount: 1800,
        cuisine: ['French', 'Fine Dining'],
        priceLevel: '$$$$',
        description: 'Michelin-starred restaurant offering innovative French cuisine.',
        images: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        ],
        openingHours: ['12:00 PM - 2:00 PM', '7:30 PM - 10:00 PM'],
        phone: '+33 1 40 50 84 40',
        website: 'https://www.lastrance.com',
        dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free'],
      },
    ];
  }

  private getMockAttractionDetails(id: string): TripAdvisorAttraction {
    const attractions = this.getMockAttractions();
    return attractions.find(a => a.id === id) || attractions[0];
  }

  private getMockRestaurantDetails(id: string): TripAdvisorRestaurant {
    const restaurants = this.getMockRestaurants();
    return restaurants.find(r => r.id === id) || restaurants[0];
  }

  private getMockPopularAttractions(): TripAdvisorAttraction[] {
    return this.getMockAttractions().slice(0, 5);
  }
}
