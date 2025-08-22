import { BookingAgent } from '../../services/agents/BookingAgent';
import { FlightSearchParams, AccommodationSearchParams, BookingRequest } from '../../types';

describe('BookingAgent', () => {
  let bookingAgent: BookingAgent;

  beforeEach(() => {
    bookingAgent = new BookingAgent();
  });

  describe('searchFlights', () => {
    it('should search for flights with valid parameters', async () => {
      const searchParams: FlightSearchParams = {
        origin: 'JFK',
        destination: 'CDG',
        departureDate: '2024-06-01',
        returnDate: '2024-06-08',
        passengers: {
          adults: 2,
          children: 1,
          infants: 0,
        },
        cabinClass: 'economy',
        currency: 'USD',
      };

      const flights = await bookingAgent.searchFlights(searchParams);

      expect(flights).toBeDefined();
      expect(Array.isArray(flights)).toBe(true);
      expect(flights.length).toBeGreaterThan(0);

      flights.forEach(flight => {
        expect(flight).toHaveProperty('id');
        expect(flight).toHaveProperty('airline');
        expect(flight).toHaveProperty('flightNumber');
        expect(flight).toHaveProperty('origin');
        expect(flight).toHaveProperty('destination');
        expect(flight).toHaveProperty('departureTime');
        expect(flight).toHaveProperty('arrivalTime');
        expect(flight).toHaveProperty('duration');
        expect(flight).toHaveProperty('price');
        expect(flight).toHaveProperty('cabinClass');
        expect(flight).toHaveProperty('stops');
        expect(flight).toHaveProperty('availableSeats');
      });
    });

    it('should handle one-way flights', async () => {
      const searchParams: FlightSearchParams = {
        origin: 'LAX',
        destination: 'LHR',
        departureDate: '2024-07-15',
        passengers: {
          adults: 1,
          children: 0,
          infants: 0,
        },
        cabinClass: 'business',
        currency: 'USD',
      };

      const flights = await bookingAgent.searchFlights(searchParams);

      expect(flights).toBeDefined();
      expect(Array.isArray(flights)).toBe(true);
      expect(flights.length).toBeGreaterThan(0);

      flights.forEach(flight => {
        expect(flight.origin).toBe('LAX');
        expect(flight.destination).toBe('LHR');
        expect(flight.cabinClass).toBe('business');
      });
    });

    it('should filter flights by price range', async () => {
      const searchParams: FlightSearchParams = {
        origin: 'SFO',
        destination: 'NRT',
        departureDate: '2024-08-01',
        returnDate: '2024-08-15',
        passengers: {
          adults: 2,
          children: 0,
          infants: 0,
        },
        cabinClass: 'economy',
        currency: 'USD',
        maxPrice: 1500,
      };

      const flights = await bookingAgent.searchFlights(searchParams);

      flights.forEach(flight => {
        expect(flight.price).toBeLessThanOrEqual(1500);
      });
    });
  });

  describe('searchAccommodations', () => {
    it('should search for accommodations with valid parameters', async () => {
      const searchParams: AccommodationSearchParams = {
        destination: 'Paris, France',
        checkIn: '2024-06-01',
        checkOut: '2024-06-08',
        guests: {
          adults: 2,
          children: 2,
          infants: 0,
        },
        rooms: 1,
        accommodationType: ['hotel'],
        priceRange: { min: 100, max: 300 },
        currency: 'USD',
        amenities: ['wifi', 'breakfast', 'family-friendly'],
      };

      const accommodations = await bookingAgent.searchAccommodations(searchParams);

      expect(accommodations).toBeDefined();
      expect(Array.isArray(accommodations)).toBe(true);
      expect(accommodations.length).toBeGreaterThan(0);

      accommodations.forEach(accommodation => {
        expect(accommodation).toHaveProperty('id');
        expect(accommodation).toHaveProperty('name');
        expect(accommodation).toHaveProperty('type');
        expect(accommodation).toHaveProperty('location');
        expect(accommodation).toHaveProperty('rating');
        expect(accommodation).toHaveProperty('price');
        expect(accommodation).toHaveProperty('amenities');
        expect(accommodation).toHaveProperty('images');
        expect(accommodation).toHaveProperty('availability');
        expect(accommodation).toHaveProperty('familyFriendly');
      });
    });

    it('should filter accommodations by family-friendly criteria', async () => {
      const searchParams: AccommodationSearchParams = {
        destination: 'Orlando, FL',
        checkIn: '2024-07-01',
        checkOut: '2024-07-08',
        guests: {
          adults: 2,
          children: 3,
          infants: 0,
        },
        rooms: 2,
        accommodationType: ['resort', 'hotel'],
        priceRange: { min: 150, max: 500 },
        currency: 'USD',
        amenities: ['pool', 'kids-club', 'family-friendly'],
        familyFriendly: true,
      };

      const accommodations = await bookingAgent.searchAccommodations(searchParams);

      accommodations.forEach(accommodation => {
        expect(accommodation.familyFriendly).toBe(true);
        expect(accommodation.price).toBeLessThanOrEqual(500);
        expect(accommodation.price).toBeGreaterThanOrEqual(150);
      });
    });
  });

  describe('getFlightDetails', () => {
    it('should return detailed flight information', async () => {
      const flightId = 'flight-123';

      const flightDetails = await bookingAgent.getFlightDetails(flightId);

      expect(flightDetails).toBeDefined();
      expect(flightDetails).toHaveProperty('id', flightId);
      expect(flightDetails).toHaveProperty('airline');
      expect(flightDetails).toHaveProperty('flightNumber');
      expect(flightDetails).toHaveProperty('origin');
      expect(flightDetails).toHaveProperty('destination');
      expect(flightDetails).toHaveProperty('departureTime');
      expect(flightDetails).toHaveProperty('arrivalTime');
      expect(flightDetails).toHaveProperty('duration');
      expect(flightDetails).toHaveProperty('price');
      expect(flightDetails).toHaveProperty('cabinClass');
      expect(flightDetails).toHaveProperty('stops');
      expect(flightDetails).toHaveProperty('availableSeats');
      expect(flightDetails).toHaveProperty('baggageAllowance');
      expect(flightDetails).toHaveProperty('mealService');
      expect(flightDetails).toHaveProperty('entertainment');
    });

    it('should handle non-existent flights gracefully', async () => {
      const flightId = 'non-existent-flight';

      await expect(bookingAgent.getFlightDetails(flightId))
        .rejects.toThrow('Flight not found');
    });
  });

  describe('getAccommodationDetails', () => {
    it('should return detailed accommodation information', async () => {
      const accommodationId = 'hotel-456';

      const accommodationDetails = await bookingAgent.getAccommodationDetails(accommodationId);

      expect(accommodationDetails).toBeDefined();
      expect(accommodationDetails).toHaveProperty('id', accommodationId);
      expect(accommodationDetails).toHaveProperty('name');
      expect(accommodationDetails).toHaveProperty('type');
      expect(accommodationDetails).toHaveProperty('location');
      expect(accommodationDetails).toHaveProperty('rating');
      expect(accommodationDetails).toHaveProperty('price');
      expect(accommodationDetails).toHaveProperty('amenities');
      expect(accommodationDetails).toHaveProperty('images');
      expect(accommodationDetails).toHaveProperty('availability');
      expect(accommodationDetails).toHaveProperty('familyFriendly');
      expect(accommodationDetails).toHaveProperty('policies');
      expect(accommodationDetails).toHaveProperty('reviews');
      expect(accommodationDetails).toHaveProperty('contact');
    });
  });

  describe('checkAvailability', () => {
    it('should check flight availability', async () => {
      const flightId = 'flight-123';
      const passengers = {
        adults: 2,
        children: 1,
        infants: 0,
      };

      const availability = await bookingAgent.checkFlightAvailability(flightId, passengers);

      expect(availability).toBeDefined();
      expect(availability).toHaveProperty('available');
      expect(availability).toHaveProperty('availableSeats');
      expect(availability).toHaveProperty('price');
      expect(availability).toHaveProperty('lastUpdated');
    });

    it('should check accommodation availability', async () => {
      const accommodationId = 'hotel-456';
      const dates = {
        checkIn: '2024-06-01',
        checkOut: '2024-06-08',
      };
      const guests = {
        adults: 2,
        children: 2,
        infants: 0,
      };

      const availability = await bookingAgent.checkAccommodationAvailability(
        accommodationId,
        dates,
        guests
      );

      expect(availability).toBeDefined();
      expect(availability).toHaveProperty('available');
      expect(availability).toHaveProperty('price');
      expect(availability).toHaveProperty('rooms');
      expect(availability).toHaveProperty('lastUpdated');
    });
  });

  describe('createBooking', () => {
    it('should create a flight booking', async () => {
      const bookingRequest: BookingRequest = {
        type: 'flight',
        flightId: 'flight-123',
        passengers: [
          {
            type: 'adult',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-01',
            passportNumber: 'AB123456',
          },
          {
            type: 'child',
            firstName: 'Jane',
            lastName: 'Doe',
            dateOfBirth: '2015-01-01',
            passportNumber: 'CD789012',
          },
        ],
        contactInfo: {
          email: 'john.doe@example.com',
          phone: '+1234567890',
        },
      };

      const booking = await bookingAgent.createBooking(bookingRequest);

      expect(booking).toBeDefined();
      expect(booking).toHaveProperty('id');
      expect(booking).toHaveProperty('type', 'flight');
      expect(booking).toHaveProperty('status');
      expect(booking).toHaveProperty('confirmationNumber');
      expect(booking).toHaveProperty('totalPrice');
      expect(booking).toHaveProperty('createdAt');
    });

    it('should create an accommodation booking', async () => {
      const bookingRequest: BookingRequest = {
        type: 'accommodation',
        accommodationId: 'hotel-456',
        dates: {
          checkIn: '2024-06-01',
          checkOut: '2024-06-08',
        },
        guests: {
          adults: 2,
          children: 2,
          infants: 0,
        },
        contactInfo: {
          email: 'john.doe@example.com',
          phone: '+1234567890',
        },
        specialRequests: 'Early check-in if possible',
      };

      const booking = await bookingAgent.createBooking(bookingRequest);

      expect(booking).toBeDefined();
      expect(booking).toHaveProperty('id');
      expect(booking).toHaveProperty('type', 'accommodation');
      expect(booking).toHaveProperty('status');
      expect(booking).toHaveProperty('confirmationNumber');
      expect(booking).toHaveProperty('totalPrice');
      expect(booking).toHaveProperty('createdAt');
    });
  });

  describe('getBookingStatus', () => {
    it('should return booking status', async () => {
      const bookingId = 'booking-789';

      const status = await bookingAgent.getBookingStatus(bookingId);

      expect(status).toBeDefined();
      expect(status).toHaveProperty('id', bookingId);
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('lastUpdated');
      expect(status).toHaveProperty('details');
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      const bookingId = 'booking-789';
      const reason = 'Change of plans';

      const cancellation = await bookingAgent.cancelBooking(bookingId, reason);

      expect(cancellation).toBeDefined();
      expect(cancellation).toHaveProperty('id', bookingId);
      expect(cancellation).toHaveProperty('status', 'cancelled');
      expect(cancellation).toHaveProperty('refundAmount');
      expect(cancellation).toHaveProperty('cancellationFee');
      expect(cancellation).toHaveProperty('cancelledAt');
    });
  });
});
