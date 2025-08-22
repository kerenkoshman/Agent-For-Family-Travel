const { apiServiceManager } = require('./dist/services/api/ApiServiceManager');

async function testMockAPIs() {
  console.log('🧪 Testing Mock API Integration...\n');

  try {
    // Test TripAdvisor API
    console.log('📍 Testing TripAdvisor Attractions...');
    const attractions = await apiServiceManager.searchAttractions({
      location: 'Paris, France',
      limit: 5
    });
    console.log(`✅ Found ${attractions.data?.length || 0} attractions`);
    if (attractions.data?.[0]) {
      console.log(`   Example: ${attractions.data[0].name} (${attractions.data[0].rating}⭐)`);
    }

    // Test Google Places API
    console.log('\n🏛️ Testing Google Places...');
    const places = await apiServiceManager.searchPlaces({
      query: 'museums',
      location: 'Paris, France'
    });
    console.log(`✅ Found ${places.data?.length || 0} places`);
    if (places.data?.[0]) {
      console.log(`   Example: ${places.data[0].name} (${places.data[0].rating}⭐)`);
    }

    // Test Skyscanner API
    console.log('\n✈️ Testing Skyscanner Flights...');
    const flights = await apiServiceManager.searchFlights({
      origin: 'LAX',
      destination: 'JFK',
      departureDate: '2024-06-01',
      adults: 2
    });
    console.log(`✅ Found ${flights.data?.length || 0} flights`);
    if (flights.data?.[0]) {
      console.log(`   Example: ${flights.data[0].airline} - $${flights.data[0].price}`);
    }

    // Test Booking.com API
    console.log('\n🏨 Testing Booking.com Accommodations...');
    const accommodations = await apiServiceManager.searchAccommodations({
      location: 'New York',
      checkIn: '2024-06-01',
      checkOut: '2024-06-05',
      adults: 2
    });
    console.log(`✅ Found ${accommodations.data?.length || 0} accommodations`);
    if (accommodations.data?.[0]) {
      console.log(`   Example: ${accommodations.data[0].name} - $${accommodations.data[0].price}/night`);
    }

    // Test Weather API
    console.log('\n🌤️ Testing Weather API...');
    const weather = await apiServiceManager.getCurrentWeather({
      location: 'Paris, France'
    });
    console.log(`✅ Weather data retrieved`);
    if (weather.data) {
      console.log(`   Current: ${weather.data.temperature}°C, ${weather.data.description}`);
    }

    // Test Health Check
    console.log('\n🏥 Testing API Health Check...');
    const health = await apiServiceManager.healthCheck();
    console.log('✅ Health check completed');
    console.log('   Status:', Object.keys(health).filter(key => key !== 'timestamp').map(key => `${key}: ${health[key]}`).join(', '));

    console.log('\n🎉 All mock API tests completed successfully!');
    console.log('💡 The system is using mock data by default to avoid paid API calls.');
    console.log('🔑 To use real APIs, set valid API keys in your environment variables.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMockAPIs();
