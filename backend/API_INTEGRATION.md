# API Integration Documentation

## Overview

The Family Trip Agent uses a **mock-first approach** to avoid unexpected costs from paid APIs during development and testing. All external APIs are integrated with comprehensive mock data that provides realistic responses.

## 🎯 Mock Data by Default

**Why Mock Data?**
- ✅ **Cost-effective**: No unexpected API charges during development
- ✅ **Reliable**: Consistent responses for testing
- ✅ **Fast**: No network latency or API rate limits
- ✅ **Safe**: No risk of hitting API quotas or limits

## 📡 Supported APIs

### 1. TripAdvisor API
- **Purpose**: Attractions and restaurant recommendations
- **Mock Features**: 
  - Popular attractions with ratings and reviews
  - Restaurant listings with cuisine types
  - Location-based search results
- **Real API**: TripAdvisor Content API

### 2. Google Places API
- **Purpose**: Place search and geocoding
- **Mock Features**:
  - Place search with categories
  - Geocoding (address to coordinates)
  - Nearby place discovery
- **Real API**: Google Places API

### 3. Skyscanner API
- **Purpose**: Flight search and booking
- **Mock Features**:
  - Flight search with multiple airlines
  - Price comparison
  - Airport information
- **Real API**: Skyscanner Partners API

### 4. Booking.com API
- **Purpose**: Accommodation search and booking
- **Mock Features**:
  - Hotel and accommodation listings
  - Availability checking
  - Price and amenity information
- **Real API**: Booking.com RapidAPI

### 5. Weather API
- **Purpose**: Real-time weather data
- **Mock Features**:
  - Current weather conditions
  - 7-day forecasts
  - Location-based weather data
- **Real API**: OpenWeatherMap API

## 🔧 Configuration

### Environment Variables

The system uses these environment variables (all optional):

```bash
# External API Keys (Optional - Mock data used by default)
TRIPADVISOR_API_KEY=your_tripadvisor_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
SKYSCANNER_API_KEY=your_skyscanner_api_key_here
BOOKING_API_KEY=your_booking_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### How It Works

1. **Default Behavior**: If no API key is provided or if the key contains "your_" (placeholder), mock data is used
2. **Real API Mode**: Only when a valid API key is provided will the system make real API calls
3. **Automatic Fallback**: If a real API call fails, the system automatically falls back to mock data

## 🚀 API Endpoints

All APIs are accessible via RESTful endpoints under `/api/v1/`:

### Attractions & Places
- `GET /api/v1/attractions` - Search attractions
- `GET /api/v1/restaurants` - Search restaurants
- `GET /api/v1/places` - Search places
- `GET /api/v1/geocode` - Geocoding

### Travel
- `GET /api/v1/flights` - Search flights
- `GET /api/v1/airports` - Search airports
- `GET /api/v1/accommodations` - Search accommodations

### Weather
- `GET /api/v1/weather/current` - Current weather
- `GET /api/v1/weather/forecast` - Weather forecast
- `GET /api/v1/weather/coordinates` - Weather by coordinates

### System
- `GET /api/v1/health` - API health check
- `POST /api/v1/recommendations` - Generate travel recommendations

## 🧪 Testing

### Test Mock APIs

Run the test script to verify mock data is working:

```bash
cd backend
npm run build
node test-mock-apis.js
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "attraction_1",
      "name": "Eiffel Tower",
      "address": "Champ de Mars, 5 Avenue Anatole France",
      "city": "Paris",
      "country": "France",
      "rating": 4.5,
      "reviewCount": 1250,
      "category": "Landmark",
      "description": "Iconic iron lattice tower on the Champ de Mars"
    }
  ],
  "cached": false,
  "statusCode": 200
}
```

## 💡 Best Practices

### For Development
1. **Use Mock Data**: No need to set up API keys for development
2. **Test Real APIs**: Set up API keys only when testing real integration
3. **Monitor Usage**: Use the health check endpoint to monitor API status

### For Production
1. **Set Valid API Keys**: Configure real API keys for production use
2. **Monitor Costs**: Keep track of API usage and costs
3. **Implement Caching**: Use the built-in caching to reduce API calls
4. **Rate Limiting**: The system includes rate limiting to prevent quota issues

## 🔒 Security

- API keys are stored in environment variables
- No API keys are committed to version control
- Mock data contains no sensitive information
- Real API calls use proper authentication headers

## 📊 Performance

### Mock Data Performance
- **Response Time**: < 10ms
- **Availability**: 100%
- **Rate Limits**: None

### Real API Performance
- **Response Time**: 100-2000ms (depending on API)
- **Availability**: 99.9% (typical)
- **Rate Limits**: Configurable per API

## 🛠️ Troubleshooting

### Common Issues

1. **Mock Data Not Working**
   - Check that API keys are not set or contain "your_"
   - Verify the API client is properly initialized

2. **Real API Not Working**
   - Verify API keys are valid and active
   - Check API quotas and rate limits
   - Review API documentation for changes

3. **Slow Responses**
   - Enable caching for frequently accessed data
   - Check network connectivity
   - Monitor API response times

### Debug Mode

Enable debug logging to see detailed API information:

```bash
ENABLE_LOGGING=true npm start
```

## 📈 Future Enhancements

- [ ] Add more realistic mock data scenarios
- [ ] Implement API response simulation (delays, errors)
- [ ] Add API usage analytics
- [ ] Create API key rotation system
- [ ] Add more API providers for redundancy
