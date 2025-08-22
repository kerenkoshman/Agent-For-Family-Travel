import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface SkyscannerFlight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    country: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    city: string;
    country: string;
    time: string;
    terminal?: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabinClass: string;
  bookingLink: string;
  airlineLogo: string;
}

export interface SkyscannerSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
  locale?: string;
}

export interface SkyscannerAirport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface SkyscannerRoute {
  origin: string;
  destination: string;
  price: number;
  currency: string;
  departureDate: string;
}

export class SkyscannerClient extends BaseApiClient {
  constructor(apiKey: string) {
    super('https://partners.api.skyscanner.net/apiservices/v3', apiKey, 'skyscanner');
  }

  async searchFlights(params: SkyscannerSearchParams): Promise<ApiResponse<SkyscannerFlight[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockFlights(params));
    }

    const queryParams = new URLSearchParams({
      originSkyId: params.origin,
      destinationSkyId: params.destination,
      date: params.departureDate,
      ...(params.returnDate && { returnDate: params.returnDate }),
      adults: (params.adults || 1).toString(),
      ...(params.children && { children: params.children.toString() }),
      ...(params.infants && { infants: params.infants.toString() }),
      ...(params.cabinClass && { cabinClass: params.cabinClass }),
      currency: params.currency || 'USD',
      locale: params.locale || 'en-US',
    });

    return this.get<SkyscannerFlight[]>(`/flights/live/search/create?${queryParams}`);
  }

  async getFlightPrices(params: SkyscannerSearchParams): Promise<ApiResponse<SkyscannerFlight[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockFlightPrices(params));
    }

    const queryParams = new URLSearchParams({
      originSkyId: params.origin,
      destinationSkyId: params.destination,
      date: params.departureDate,
      ...(params.returnDate && { returnDate: params.returnDate }),
      adults: (params.adults || 1).toString(),
      currency: params.currency || 'USD',
      locale: params.locale || 'en-US',
    });

    return this.get<SkyscannerFlight[]>(`/flights/live/search/poll?${queryParams}`);
  }

  async searchAirports(query: string): Promise<ApiResponse<SkyscannerAirport[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockAirports(query));
    }

    const queryParams = new URLSearchParams({
      query,
      locale: 'en-US',
    });

    return this.get<SkyscannerAirport[]>(`/autosuggest/flights?${queryParams}`);
  }

  async getPopularRoutes(origin: string): Promise<ApiResponse<SkyscannerRoute[]>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockPopularRoutes());
    }

    const queryParams = new URLSearchParams({
      originSkyId: origin,
      currency: 'USD',
      locale: 'en-US',
    });

    return this.get<SkyscannerRoute[]>(`/flights/browse/routes?${queryParams}`);
  }

  async getFlightDetails(flightId: string): Promise<ApiResponse<SkyscannerFlight>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockFlightDetails(flightId));
    }

    return this.get<SkyscannerFlight>(`/flights/live/search/details?flightId=${flightId}`);
  }

  private getMockFlights(params: SkyscannerSearchParams): SkyscannerFlight[] {
    return [
      {
        id: '1',
        airline: 'American Airlines',
        flightNumber: 'AA123',
        departure: {
          airport: 'LAX',
          city: 'Los Angeles',
          country: 'United States',
          time: '2024-06-15T10:00:00',
          terminal: '5',
        },
        arrival: {
          airport: 'OGG',
          city: 'Kahului',
          country: 'United States',
          time: '2024-06-15T14:00:00',
          terminal: '1',
        },
        duration: '4h 0m',
        stops: 0,
        price: 1200,
        currency: 'USD',
        cabinClass: 'economy',
        bookingLink: 'https://www.aa.com/booking',
        airlineLogo: 'https://example.com/aa-logo.png',
      },
      {
        id: '2',
        airline: 'United Airlines',
        flightNumber: 'UA456',
        departure: {
          airport: 'LAX',
          city: 'Los Angeles',
          country: 'United States',
          time: '2024-06-15T08:30:00',
          terminal: '7',
        },
        arrival: {
          airport: 'OGG',
          city: 'Kahului',
          country: 'United States',
          time: '2024-06-15T12:30:00',
          terminal: '1',
        },
        duration: '4h 0m',
        stops: 0,
        price: 1100,
        currency: 'USD',
        cabinClass: 'economy',
        bookingLink: 'https://www.united.com/booking',
        airlineLogo: 'https://example.com/ua-logo.png',
      },
      {
        id: '3',
        airline: 'Delta Air Lines',
        flightNumber: 'DL789',
        departure: {
          airport: 'LAX',
          city: 'Los Angeles',
          country: 'United States',
          time: '2024-06-15T11:15:00',
          terminal: '3',
        },
        arrival: {
          airport: 'OGG',
          city: 'Kahului',
          country: 'United States',
          time: '2024-06-15T15:15:00',
          terminal: '1',
        },
        duration: '4h 0m',
        stops: 0,
        price: 1300,
        currency: 'USD',
        cabinClass: 'economy',
        bookingLink: 'https://www.delta.com/booking',
        airlineLogo: 'https://example.com/dl-logo.png',
      },
    ];
  }

  private getMockFlightPrices(params: SkyscannerSearchParams): SkyscannerFlight[] {
    return this.getMockFlights(params).map(flight => ({
      ...flight,
      price: Math.floor(flight.price * (0.8 + Math.random() * 0.4)), // Random price variation
    }));
  }

  private getMockAirports(query: string): SkyscannerAirport[] {
    const airports = [
      {
        code: 'LAX',
        name: 'Los Angeles International Airport',
        city: 'Los Angeles',
        country: 'United States',
        latitude: 33.9416,
        longitude: -118.4085,
      },
      {
        code: 'OGG',
        name: 'Kahului Airport',
        city: 'Kahului',
        country: 'United States',
        latitude: 20.8986,
        longitude: -156.4305,
      },
      {
        code: 'JFK',
        name: 'John F. Kennedy International Airport',
        city: 'New York',
        country: 'United States',
        latitude: 40.6413,
        longitude: -73.7781,
      },
      {
        code: 'CDG',
        name: 'Charles de Gaulle Airport',
        city: 'Paris',
        country: 'France',
        latitude: 49.0097,
        longitude: 2.5479,
      },
    ];

    return airports.filter(airport =>
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockPopularRoutes(): SkyscannerRoute[] {
    return [
      {
        origin: 'LAX',
        destination: 'OGG',
        price: 1200,
        currency: 'USD',
        departureDate: '2024-06-15',
      },
      {
        origin: 'JFK',
        destination: 'CDG',
        price: 800,
        currency: 'USD',
        departureDate: '2024-07-10',
      },
      {
        origin: 'SFO',
        destination: 'DEN',
        price: 400,
        currency: 'USD',
        departureDate: '2024-08-05',
      },
    ];
  }

  private getMockFlightDetails(flightId: string): SkyscannerFlight {
    const flights = this.getMockFlights({ origin: 'LAX', destination: 'OGG', departureDate: '2024-06-15' });
    return flights.find(f => f.id === flightId) || flights[0];
  }
}
