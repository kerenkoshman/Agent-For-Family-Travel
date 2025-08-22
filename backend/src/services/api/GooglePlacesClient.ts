import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface GooglePlace {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  types: string[];
  priceLevel: number;
  photos: string[];
  openingHours: {
    openNow: boolean;
    periods: any[];
    weekdayText: string[];
  };
  phone: string;
  website: string;
  vicinity: string;
  placeId: string;
}

export interface GooglePlacesSearchParams {
  query?: string;
  location?: string;
  radius?: number;
  type?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  openNow?: boolean;
  rankBy?: 'prominence' | 'distance';
}

export interface GooglePlacesNearbyParams {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  openNow?: boolean;
  rankBy?: 'prominence' | 'distance';
}

export class GooglePlacesClient extends BaseApiClient {
  constructor(apiKey: string) {
    super('https://maps.googleapis.com/maps/api/place', apiKey);
  }

  async searchPlaces(params: GooglePlacesSearchParams): Promise<ApiResponse<GooglePlace[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockPlaces());
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      ...(params.query && { query: params.query }),
      ...(params.location && { location: params.location }),
      ...(params.radius && { radius: params.radius.toString() }),
      ...(params.type && { type: params.type }),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.minPrice && { minprice: params.minPrice.toString() }),
      ...(params.maxPrice && { maxprice: params.maxPrice.toString() }),
      ...(params.openNow && { opennow: 'true' }),
      ...(params.rankBy && { rankby: params.rankBy }),
    });

    return this.get<GooglePlace[]>(`/textsearch/json?${queryParams}`);
  }

  async getNearbyPlaces(params: GooglePlacesNearbyParams): Promise<ApiResponse<GooglePlace[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockNearbyPlaces());
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      location: params.location,
      ...(params.radius && { radius: params.radius.toString() }),
      ...(params.type && { type: params.type }),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.minPrice && { minprice: params.minPrice.toString() }),
      ...(params.maxPrice && { maxprice: params.maxPrice.toString() }),
      ...(params.openNow && { opennow: 'true' }),
      ...(params.rankBy && { rankby: params.rankBy }),
    });

    return this.get<GooglePlace[]>(`/nearbysearch/json?${queryParams}`);
  }

  async getPlaceDetails(placeId: string): Promise<ApiResponse<GooglePlace>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockPlaceDetails(placeId));
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      place_id: placeId,
      fields: 'place_id,name,formatted_address,geometry,rating,user_ratings_total,types,price_level,photos,opening_hours,formatted_phone_number,website,vicinity',
    });

    return this.get<GooglePlace>(`/details/json?${queryParams}`);
  }

  async getPlacePhotos(placeId: string, maxWidth = 800): Promise<ApiResponse<string[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockPlacePhotos());
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      place_id: placeId,
      maxwidth: maxWidth.toString(),
    });

    return this.get<string[]>(`/photo?${queryParams}`);
  }

  async autocompletePlaces(input: string, location?: string, radius?: number): Promise<ApiResponse<any[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAutocompleteResults());
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      input,
      ...(location && { location }),
      ...(radius && { radius: radius.toString() }),
      types: 'establishment',
    });

    return this.get<any[]>(`/autocomplete/json?${queryParams}`);
  }

  async getGeocode(address: string): Promise<ApiResponse<{ lat: number; lng: number }>> {
    if (!this.validateApiKey()) {
      return this.getMockData({ lat: 48.8566, lng: 2.3522 }); // Paris coordinates
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      address,
    });

    return this.get<{ lat: number; lng: number }>(`/geocode/json?${queryParams}`);
  }

  private getMockPlaces(): GooglePlace[] {
    return [
      {
        id: '1',
        name: 'Eiffel Tower',
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        city: 'Paris',
        country: 'France',
        latitude: 48.8584,
        longitude: 2.2945,
        rating: 4.5,
        reviewCount: 125000,
        types: ['tourist_attraction', 'point_of_interest', 'establishment'],
        priceLevel: 2,
        photos: [
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
        ],
        openingHours: {
          openNow: true,
          periods: [],
          weekdayText: ['Monday: 9:00 AM – 11:45 PM', 'Tuesday: 9:00 AM – 11:45 PM'],
        },
        phone: '+33 892 70 12 39',
        website: 'https://www.toureiffel.paris',
        vicinity: 'Champ de Mars',
        placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
      },
      {
        id: '2',
        name: 'Louvre Museum',
        address: 'Rue de Rivoli, 75001 Paris, France',
        city: 'Paris',
        country: 'France',
        latitude: 48.8606,
        longitude: 2.3376,
        rating: 4.6,
        reviewCount: 98000,
        types: ['museum', 'point_of_interest', 'establishment'],
        priceLevel: 2,
        photos: [
          'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        ],
        openingHours: {
          openNow: true,
          periods: [],
          weekdayText: ['Monday: Closed', 'Tuesday: 9:00 AM – 6:00 PM'],
        },
        phone: '+33 1 40 20 50 50',
        website: 'https://www.louvre.fr',
        vicinity: 'Rue de Rivoli',
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      },
    ];
  }

  private getMockNearbyPlaces(): GooglePlace[] {
    return this.getMockPlaces().slice(0, 3);
  }

  private getMockPlaceDetails(placeId: string): GooglePlace {
    const places = this.getMockPlaces();
    return places.find(p => p.placeId === placeId) || places[0];
  }

  private getMockPlacePhotos(): string[] {
    return [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
    ];
  }

  private getMockAutocompleteResults(): any[] {
    return [
      { place_id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', description: 'Eiffel Tower, Paris, France' },
      { place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4', description: 'Louvre Museum, Paris, France' },
      { place_id: 'ChIJPV4oX_65j4ARVW8IJ6IJUYs', description: 'Arc de Triomphe, Paris, France' },
    ];
  }
}
