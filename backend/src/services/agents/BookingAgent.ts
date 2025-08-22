import { BaseAgent, AgentContext, AgentResult } from './BaseAgent';
import { SkyscannerClient } from '../api/SkyscannerClient';

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: number; // in minutes
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  familyFriendly: boolean;
  baggageAllowance: {
    checked: number;
    carryOn: number;
  };
}

export interface AccommodationOption {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'apartment' | 'villa' | 'hostel';
  rating: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    distanceFromCenter: number; // in km
  };
  amenities: string[];
  familyFriendly: boolean;
  roomTypes: {
    type: string;
    capacity: number;
    price: {
      perNight: number;
      currency: string;
    };
    available: boolean;
  }[];
  totalPrice: {
    amount: number;
    currency: string;
    breakdown: {
      roomRate: number;
      taxes: number;
      fees: number;
    };
  };
  images: string[];
  cancellationPolicy: string;
}

export interface BookingRecommendation {
  flights: {
    outbound: FlightOption;
    inbound?: FlightOption;
  };
  accommodation: AccommodationOption;
  totalCost: {
    flights: number;
    accommodation: number;
    total: number;
    currency: string;
  };
  savings: {
    amount: number;
    percentage: number;
  };
  bookingDeadline: string;
}

export interface BookingResult {
  recommendations: BookingRecommendation[];
  bestOption: BookingRecommendation;
  alternatives: BookingRecommendation[];
  priceComparison: {
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    currency: string;
  };
}

export class BookingAgent extends BaseAgent {
  private skyscannerClient: SkyscannerClient;

  constructor(context: AgentContext) {
    super('BookingAgent', context);
    this.skyscannerClient = new SkyscannerClient();
  }

  async execute(): Promise<AgentResult<BookingResult>> {
    const startTime = Date.now();
    
    try {
      this.logExecution('Starting booking search process');

      if (!this.validateContext()) {
        return this.handleError(new Error('Invalid context'), 'validation');
      }

      if (!this.context.destination || !this.context.dates) {
        return this.handleError(new Error('Missing destination or dates'), 'validation');
      }

      // Step 1: Search for flights
      const flights = await this.searchFlights();
      
      // Step 2: Search for accommodations
      const accommodations = await this.searchAccommodations();
      
      // Step 3: Create booking combinations
      const recommendations = this.createBookingCombinations(flights, accommodations);
      
      // Step 4: Find the best option
      const bestOption = this.findBestOption(recommendations);
      
      // Step 5: Calculate price statistics
      const priceComparison = this.calculatePriceComparison(recommendations);
      
      const result: BookingResult = {
        recommendations,
        bestOption,
        alternatives: recommendations.filter(r => r !== bestOption).slice(0, 3),
        priceComparison,
      };

      const processingTime = Date.now() - startTime;
      
      this.logExecution('Booking search completed successfully', {
        recommendationsCount: recommendations.length,
        processingTime,
      });

      return this.createSuccessResult(result, {
        processingTime,
        confidence: 0.9,
      });

    } catch (error) {
      return this.handleError(error as Error, 'booking execution');
    }
  }

  private async searchFlights(): Promise<FlightOption[]> {
    this.logExecution('Searching for flights');

    // For now, return sample flight data
    // In a real implementation, this would call Skyscanner API
    const flights: FlightOption[] = [
      {
        id: 'flight-1',
        airline: 'Delta Airlines',
        flightNumber: 'DL1234',
        departure: {
          airport: 'JFK',
          time: '09:00',
          date: this.context.dates!.start.toISOString().split('T')[0],
        },
        arrival: {
          airport: 'MCO',
          time: '12:30',
          date: this.context.dates!.start.toISOString().split('T')[0],
        },
        duration: 210, // 3.5 hours
        stops: 0,
        price: {
          amount: 250,
          currency: 'USD',
        },
        cabinClass: 'economy',
        familyFriendly: true,
        baggageAllowance: {
          checked: 1,
          carryOn: 1,
        },
      },
      {
        id: 'flight-2',
        airline: 'American Airlines',
        flightNumber: 'AA5678',
        departure: {
          airport: 'JFK',
          time: '14:00',
          date: this.context.dates!.start.toISOString().split('T')[0],
        },
        arrival: {
          airport: 'MCO',
          time: '17:15',
          date: this.context.dates!.start.toISOString().split('T')[0],
        },
        duration: 195, // 3.25 hours
        stops: 0,
        price: {
          amount: 220,
          currency: 'USD',
        },
        cabinClass: 'economy',
        familyFriendly: true,
        baggageAllowance: {
          checked: 1,
          carryOn: 1,
        },
      },
    ];

    return flights;
  }

  private async searchAccommodations(): Promise<AccommodationOption[]> {
    this.logExecution('Searching for accommodations');

    // For now, return sample accommodation data
    // In a real implementation, this would call Booking.com or similar APIs
    const accommodations: AccommodationOption[] = [
      {
        id: 'hotel-1',
        name: 'Disney\'s Grand Floridian Resort & Spa',
        type: 'resort',
        rating: 4.8,
        location: {
          address: '4401 Floridian Way, Lake Buena Vista, FL 32830',
          city: 'Orlando',
          country: 'United States',
          coordinates: { lat: 28.4177, lng: -81.5812 },
          distanceFromCenter: 2.5,
        },
        amenities: ['Pool', 'Spa', 'Restaurant', 'Kids Club', 'Shuttle Service'],
        familyFriendly: true,
        roomTypes: [
          {
            type: 'Deluxe Room',
            capacity: 4,
            price: {
              perNight: 450,
              currency: 'USD',
            },
            available: true,
          },
        ],
        totalPrice: {
          amount: 3150, // 7 nights
          currency: 'USD',
          breakdown: {
            roomRate: 2800,
            taxes: 280,
            fees: 70,
          },
        },
        images: ['https://example.com/grand-floridian-1.jpg'],
        cancellationPolicy: 'Free cancellation until 24 hours before check-in',
      },
      {
        id: 'hotel-2',
        name: 'Holiday Inn Express & Suites Orlando',
        type: 'hotel',
        rating: 4.2,
        location: {
          address: '1234 International Drive, Orlando, FL 32819',
          city: 'Orlando',
          country: 'United States',
          distanceFromCenter: 5.0,
        },
        amenities: ['Pool', 'Breakfast', 'Free WiFi', 'Parking'],
        familyFriendly: true,
        roomTypes: [
          {
            type: 'Family Suite',
            capacity: 6,
            price: {
              perNight: 180,
              currency: 'USD',
            },
            available: true,
          },
        ],
        totalPrice: {
          amount: 1260, // 7 nights
          currency: 'USD',
          breakdown: {
            roomRate: 1200,
            taxes: 48,
            fees: 12,
          },
        },
        images: ['https://example.com/holiday-inn-1.jpg'],
        cancellationPolicy: 'Free cancellation until 48 hours before check-in',
      },
    ];

    return accommodations;
  }

  private createBookingCombinations(flights: FlightOption[], accommodations: AccommodationOption[]): BookingRecommendation[] {
    const recommendations: BookingRecommendation[] = [];

    for (const flight of flights) {
      for (const accommodation of accommodations) {
        const totalCost = flight.price.amount * 2 + accommodation.totalPrice.amount; // Round trip
        const averagePrice = (totalCost + 2000) / 2; // Rough average
        const savings = averagePrice - totalCost;

        recommendations.push({
          flights: {
            outbound: flight,
            inbound: flight, // For simplicity, using same flight for return
          },
          accommodation,
          totalCost: {
            flights: flight.price.amount * 2,
            accommodation: accommodation.totalPrice.amount,
            total: totalCost,
            currency: 'USD',
          },
          savings: {
            amount: savings,
            percentage: (savings / averagePrice) * 100,
          },
          bookingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        });
      }
    }

    return recommendations.sort((a, b) => a.totalCost.total - b.totalCost.total);
  }

  private findBestOption(recommendations: BookingRecommendation[]): BookingRecommendation {
    // For now, return the cheapest option
    // In a real implementation, this would consider multiple factors like:
    // - Family friendliness
    // - Convenience
    // - Reviews
    // - Cancellation policies
    return recommendations[0];
  }

  private calculatePriceComparison(recommendations: BookingRecommendation[]): {
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    currency: string;
  } {
    const prices = recommendations.map(r => r.totalCost.total);
    const total = prices.reduce((sum, price) => sum + price, 0);
    
    return {
      averagePrice: Math.round(total / prices.length),
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      currency: 'USD',
    };
  }
}
