import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface BookingAccommodation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  propertyType: string;
  amenities: string[];
  images: string[];
  description: string;
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  bookingUrl: string;
  availableRooms: number;
}

export interface BookingSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
  currency?: string;
  limit?: number;
  offset?: number;
  sort?: 'price' | 'rating' | 'distance' | 'popularity';
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string[];
  amenities?: string[];
}

export interface BookingAvailabilityParams {
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
  currency?: string;
}

export class BookingClient extends BaseApiClient {
  constructor(apiKey: string) {
    super('https://booking-com.p.rapidapi.com/v1', apiKey, 'booking');
  }

  async searchAccommodations(params: BookingSearchParams): Promise<ApiResponse<BookingAccommodation[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAccommodations(params));
    }

    const queryParams = new URLSearchParams({
      dest_id: params.location,
      checkin_date: params.checkIn,
      checkout_date: params.checkOut,
      adults_number: (params.adults || 2).toString(),
      ...(params.children && { children_number: params.children.toString() }),
      ...(params.rooms && { room_number: params.rooms.toString() }),
      currency: params.currency || 'USD',
      units: 'metric',
      locale: 'en-us',
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
      ...(params.sort && { sort: params.sort }),
      ...(params.minPrice && { min_price: params.minPrice.toString() }),
      ...(params.maxPrice && { max_price: params.maxPrice.toString() }),
    });

    return this.get<BookingAccommodation[]>(`/hotels/search?${queryParams}`, {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
    });
  }

  async getAccommodationDetails(accommodationId: string): Promise<ApiResponse<BookingAccommodation>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAccommodationDetails(accommodationId));
    }

    return this.get<BookingAccommodation>(`/hotels/data?hotel_id=${accommodationId}`, {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
    });
  }

  async checkAvailability(params: BookingAvailabilityParams): Promise<ApiResponse<BookingAccommodation>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAvailability(params));
    }

    const queryParams = new URLSearchParams({
      hotel_id: params.accommodationId,
      checkin_date: params.checkIn,
      checkout_date: params.checkOut,
      adults_number: (params.adults || 2).toString(),
      ...(params.children && { children_number: params.children.toString() }),
      ...(params.rooms && { room_number: params.rooms.toString() }),
      currency: params.currency || 'USD',
      units: 'metric',
      locale: 'en-us',
    });

    return this.get<BookingAccommodation>(`/hotels/check-availability?${queryParams}`, {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
    });
  }

  async getPopularDestinations(): Promise<ApiResponse<string[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockPopularDestinations());
    }

    return this.get<string[]>('/hotels/locations', {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
    });
  }

  // Mock data methods
  private getMockAccommodations(params: BookingSearchParams): BookingAccommodation[] {
    return [
      {
        id: 'hotel_1',
        name: 'Grand Hotel & Spa',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.0060,
        rating: 4.5,
        reviewCount: 1250,
        price: 250,
        currency: 'USD',
        propertyType: 'Hotel',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        images: ['https://example.com/hotel1.jpg'],
        description: 'Luxury hotel in the heart of the city',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        cancellationPolicy: 'Free cancellation until 24 hours before check-in',
        bookingUrl: 'https://booking.com/hotel1',
        availableRooms: 5,
      },
      {
        id: 'hotel_2',
        name: 'Cozy Boutique Hotel',
        address: '456 Park Avenue',
        city: 'New York',
        country: 'USA',
        latitude: 40.7589,
        longitude: -73.9851,
        rating: 4.2,
        reviewCount: 890,
        price: 180,
        currency: 'USD',
        propertyType: 'Boutique Hotel',
        amenities: ['WiFi', 'Restaurant', 'Bar'],
        images: ['https://example.com/hotel2.jpg'],
        description: 'Charming boutique hotel with personalized service',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        cancellationPolicy: 'Free cancellation until 48 hours before check-in',
        bookingUrl: 'https://booking.com/hotel2',
        availableRooms: 3,
      },
      {
        id: 'hotel_3',
        name: 'Family Resort & Suites',
        address: '789 Beach Road',
        city: 'New York',
        country: 'USA',
        latitude: 40.7505,
        longitude: -73.9934,
        rating: 4.0,
        reviewCount: 650,
        price: 320,
        currency: 'USD',
        propertyType: 'Resort',
        amenities: ['WiFi', 'Pool', 'Kids Club', 'Restaurant', 'Spa', 'Beach Access'],
        images: ['https://example.com/hotel3.jpg'],
        description: 'Perfect for families with spacious suites and activities',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        cancellationPolicy: 'Free cancellation until 72 hours before check-in',
        bookingUrl: 'https://booking.com/hotel3',
        availableRooms: 8,
      },
    ];
  }

  private getMockAccommodationDetails(accommodationId: string): BookingAccommodation {
    return {
      id: accommodationId,
      name: 'Grand Hotel & Spa',
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060,
      rating: 4.5,
      reviewCount: 1250,
      price: 250,
      currency: 'USD',
      propertyType: 'Hotel',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge', 'Valet Parking'],
      images: [
        'https://example.com/hotel1_1.jpg',
        'https://example.com/hotel1_2.jpg',
        'https://example.com/hotel1_3.jpg',
      ],
      description: 'Luxury hotel in the heart of the city with world-class amenities and service',
      checkIn: '15:00',
      checkOut: '11:00',
      cancellationPolicy: 'Free cancellation until 24 hours before check-in',
      bookingUrl: 'https://booking.com/hotel1',
      availableRooms: 5,
    };
  }

  private getMockAvailability(params: BookingAvailabilityParams): BookingAccommodation {
    return {
      id: params.accommodationId,
      name: 'Grand Hotel & Spa',
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060,
      rating: 4.5,
      reviewCount: 1250,
      price: 250,
      currency: 'USD',
      propertyType: 'Hotel',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      images: ['https://example.com/hotel1.jpg'],
      description: 'Luxury hotel in the heart of the city',
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      cancellationPolicy: 'Free cancellation until 24 hours before check-in',
      bookingUrl: 'https://booking.com/hotel1',
      availableRooms: 3,
    };
  }

  private getMockPopularDestinations(): string[] {
    return [
      'New York, USA',
      'London, UK',
      'Paris, France',
      'Tokyo, Japan',
      'Sydney, Australia',
      'Rome, Italy',
      'Barcelona, Spain',
      'Amsterdam, Netherlands',
      'Berlin, Germany',
      'Vienna, Austria',
    ];
  }
}
