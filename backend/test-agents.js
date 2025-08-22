const { SmolAgent } = require('./dist/services/agents');

async function testAgents() {
  console.log('🤖 Testing AI Agents...\n');

  try {
    // Create a test context
    const context = {
      userId: 'test-user-123',
      familyProfile: {
        adults: 2,
        children: 2,
        ages: [8, 5],
        interests: ['theme parks', 'adventure', 'family activities'],
        dietaryRestrictions: [],
      },
      tripPreferences: {
        destination: 'Walt Disney World Resort, Orlando',
        budget: 5000,
        dates: {
          start: new Date('2024-06-15'),
          end: new Date('2024-06-22'),
        },
        tripType: 'family',
        accommodationType: 'hotel',
        transportation: 'flight',
      },
      budget: 5000,
      dates: {
        start: new Date('2024-06-15'),
        end: new Date('2024-06-22'),
      },
      destination: 'Walt Disney World Resort, Orlando',
    };

    console.log('📋 Test Context:');
    console.log(`   Destination: ${context.destination}`);
    console.log(`   Budget: $${context.budget}`);
    console.log(`   Family: ${context.familyProfile.adults} adults, ${context.familyProfile.children} children`);
    console.log(`   Interests: ${context.familyProfile.interests.join(', ')}`);
    console.log('');

    // Create and execute SmolAgent
    console.log('🚀 Starting SmolAgent...');
    const smolAgent = new SmolAgent(context);
    
    // Show initial progress
    const initialProgress = smolAgent.getProgress();
    console.log('📊 Initial Progress:');
    console.log(`   Overall: ${initialProgress.overall}%`);
    Object.entries(initialProgress.agents).forEach(([agent, status]) => {
      console.log(`   ${agent}: ${status.status} (${status.progress}%)`);
    });
    console.log('');

    // Execute the agent
    console.log('⚡ Executing AI planning...');
    const result = await smolAgent.execute();

    if (result.success) {
      console.log('✅ AI Planning Completed Successfully!');
      console.log('');
      
      // Show final progress
      const finalProgress = smolAgent.getProgress();
      console.log('📊 Final Progress:');
      console.log(`   Overall: ${finalProgress.overall}%`);
      Object.entries(finalProgress.agents).forEach(([agent, status]) => {
        console.log(`   ${agent}: ${status.status} (${status.progress}%)`);
        if (status.error) {
          console.log(`     Error: ${status.error}`);
        }
      });
      console.log('');

      // Show results summary
      if (result.data?.summary) {
        console.log('📋 Trip Summary:');
        console.log(`   Destination: ${result.data.summary.destination}`);
        console.log(`   Total Cost: $${result.data.summary.totalCost}`);
        console.log(`   Duration: ${result.data.summary.duration} days`);
        console.log(`   Activities: ${result.data.summary.activities?.length || 0} planned`);
        console.log(`   Accommodations: ${result.data.summary.accommodations?.length || 0} found`);
        console.log(`   Flights: ${result.data.summary.flights?.length || 0} options`);
      }

      // Show detailed results
      if (result.data?.planner) {
        console.log('');
        console.log('🎯 Planner Agent Results:');
        console.log(`   Destinations: ${result.data.planner.destinations?.length || 0} suggested`);
        console.log(`   Activities: ${result.data.planner.activities?.length || 0} recommended`);
      }

      if (result.data?.booking) {
        console.log('');
        console.log('🏨 Booking Agent Results:');
        console.log(`   Accommodations: ${result.data.booking.accommodations?.length || 0} found`);
        console.log(`   Flights: ${result.data.booking.flights?.length || 0} options`);
      }

      if (result.data?.scheduler) {
        console.log('');
        console.log('📅 Scheduler Agent Results:');
        console.log(`   Itinerary Days: ${result.data.scheduler.itinerary?.length || 0}`);
      }

      if (result.data?.ui) {
        console.log('');
        console.log('🎨 UI Agent Results:');
        console.log(`   Dashboard Data: ${result.data.ui.dashboard ? 'Generated' : 'Not generated'}`);
        console.log(`   Export Formats: ${result.data.ui.exports ? 'Available' : 'Not available'}`);
      }

    } else {
      console.log('❌ AI Planning Failed:');
      console.log(`   Error: ${result.error}`);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testAgents();
