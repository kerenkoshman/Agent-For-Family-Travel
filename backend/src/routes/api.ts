import { Router } from 'express';
import { apiServiceManager } from '../services/api/ApiServiceManager';
import { logger } from '../utils/logger';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const healthStatus = await apiServiceManager.healthCheck();
    res.json({
      success: true,
      data: healthStatus,
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
});

// TripAdvisor API endpoints
router.get('/attractions', async (req, res) => {
  try {
    const { location, limit, sort, priceLevel, rating } = req.query;
    
    const result = await apiServiceManager.searchAttractions({
      location: location as string,
      limit: limit ? parseInt(limit as string) : 20,
      sort: (sort as 'rating' | 'relevance' | 'distance') || 'rating',
      priceLevel: priceLevel as string || undefined,
      rating: rating ? parseFloat(rating as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    logger.error('Search attractions failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search attractions',
    });
  }
});

router.get('/restaurants', async (req, res) => {
  try {
    const { location, limit, sort, priceLevel, rating, cuisine } = req.query;
    
    const result = await apiServiceManager.searchRestaurants({
      location: location as string,
      limit: limit ? parseInt(limit as string) : 20,
      sort: (sort as 'rating' | 'relevance' | 'distance') || 'rating',
      priceLevel: priceLevel as string || undefined,
      rating: rating ? parseFloat(rating as string) : undefined,
      cuisine: cuisine as string || undefined,
    });

    res.json(result);
  } catch (error) {
    logger.error('Search restaurants failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search restaurants',
    });
  }
});

// Google Places API endpoints
router.get('/places', async (req, res) => {
  try {
    const { query, location, radius, type, keyword, minPrice, maxPrice, openNow } = req.query;
    
    const result = await apiServiceManager.searchPlaces({
      query: query as string || undefined,
      location: location as string || undefined,
      radius: radius ? parseInt(radius as string) : undefined,
      type: type as string || undefined,
      keyword: keyword as string || undefined,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      openNow: openNow === 'true',
    });

    res.json(result);
  } catch (error) {
    logger.error('Search places failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search places',
    });
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    const result = await apiServiceManager.getGeocode(address as string);
    res.json(result);
  } catch (error) {
    logger.error('Geocoding failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to geocode address',
    });
  }
});

// Skyscanner API endpoints
router.get('/flights', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults, children, infants, cabinClass, currency } = req.query;
    
    const result = await apiServiceManager.searchFlights({
      origin: origin as string,
      destination: destination as string,
      departureDate: departureDate as string,
      returnDate: returnDate as string || undefined,
      adults: adults ? parseInt(adults as string) : 1,
      children: children ? parseInt(children as string) : undefined,
      infants: infants ? parseInt(infants as string) : undefined,
      cabinClass: cabinClass as 'economy' | 'premium_economy' | 'business' | 'first' || 'economy',
      currency: currency as string || 'USD',
    });

    res.json(result);
  } catch (error) {
    logger.error('Search flights failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search flights',
    });
  }
});

router.get('/airports', async (req, res) => {
  try {
    const { query } = req.query;
    
    const result = await apiServiceManager.searchAirports(query as string);
    res.json(result);
  } catch (error) {
    logger.error('Search airports failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search airports',
    });
  }
});

// Booking.com API endpoints
router.get('/accommodations', async (req, res) => {
  try {
    const { location, checkIn, checkOut, adults, children, rooms, currency, limit, sort, minPrice, maxPrice } = req.query;
    
    const result = await apiServiceManager.searchAccommodations({
      location: location as string,
      checkIn: checkIn as string,
      checkOut: checkOut as string,
      adults: adults ? parseInt(adults as string) : 2,
      children: children ? parseInt(children as string) : undefined,
      rooms: rooms ? parseInt(rooms as string) : 1,
      currency: currency as string || 'USD',
      limit: limit ? parseInt(limit as string) : 20,
      sort: (sort as 'price' | 'rating' | 'distance' | 'popularity') || 'rating',
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    logger.error('Search accommodations failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search accommodations',
    });
  }
});

router.get('/accommodations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await apiServiceManager.getAccommodationDetails(id);
    res.json(result);
  } catch (error) {
    logger.error('Get accommodation details failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get accommodation details',
    });
  }
});

// Weather API endpoints
router.get('/weather/current', async (req, res) => {
  try {
    const { location, units, lang } = req.query;
    
    const result = await apiServiceManager.getCurrentWeather({
      location: location as string,
      units: units as 'metric' | 'imperial',
      lang: lang as string,
    });

    res.json(result);
  } catch (error) {
    logger.error('Get current weather failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get current weather',
    });
  }
});

router.get('/weather/forecast', async (req, res) => {
  try {
    const { location, units, lang } = req.query;
    
    const result = await apiServiceManager.getWeatherForecast({
      location: location as string,
      units: units as 'metric' | 'imperial',
      lang: lang as string,
    });

    res.json(result);
  } catch (error) {
    logger.error('Get weather forecast failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weather forecast',
    });
  }
});

router.get('/weather/coordinates', async (req, res) => {
  try {
    const { lat, lon, units } = req.query;
    
    const result = await apiServiceManager.getWeatherByCoordinates(
      parseFloat(lat as string),
      parseFloat(lon as string),
      units as string
    );

    res.json(result);
  } catch (error) {
    logger.error('Get weather by coordinates failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weather by coordinates',
    });
  }
});

// Recommendations endpoint
router.post('/recommendations', async (req, res) => {
  try {
    const { familyProfile, preferences, budget, dates } = req.body;
    
    const result = await apiServiceManager.getTravelRecommendations({
      familyProfile,
      preferences,
      budget,
      dates,
    });

    res.json(result);
  } catch (error) {
    logger.error('Generate recommendations failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
    });
  }
});

export default router;
