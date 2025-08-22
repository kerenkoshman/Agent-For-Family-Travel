import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { tripService } from '@/services/tripService';

const AgentTestPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testTripPlanning = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const tripRequest = {
        familyProfile: {
          adults: 2,
          children: 2,
          ages: [8, 5],
          interests: ['theme parks', 'adventure', 'family activities'],
          dietaryRestrictions: [],
        },
        destination: 'Walt Disney World Resort, Orlando',
        budget: 5000,
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        tripType: 'family',
        accommodationType: 'hotel',
        transportation: 'flight',
        travelStyle: 'adventure',
      };

      const response = await tripService.planTrip(tripRequest);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testIndividualAgent = async (agentType: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await tripService.testAgent(agentType);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-responsive py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Agent Test Page</h1>
        
        <div className="grid gap-6">
          {/* Test Controls */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test AI Agents</h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={testTripPlanning}
                  loading={isLoading}
                  disabled={isLoading}
                  variant="primary"
                >
                  Test Complete Trip Planning
                </Button>
                
                <Button
                  onClick={() => testIndividualAgent('planner')}
                  loading={isLoading}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Test Planner Agent
                </Button>
                
                <Button
                  onClick={() => testIndividualAgent('booking')}
                  loading={isLoading}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Test Booking Agent
                </Button>
                
                <Button
                  onClick={() => testIndividualAgent('scheduler')}
                  loading={isLoading}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Test Scheduler Agent
                </Button>
                
                <Button
                  onClick={() => testIndividualAgent('ui')}
                  loading={isLoading}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Test UI Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Results</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">AI Agents Overview</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-blue-600">🤖 Planner Agent</h3>
                    <p className="text-sm text-gray-600">
                      Analyzes family preferences and suggests destinations, activities, and attractions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600">🏨 Booking Agent</h3>
                    <p className="text-sm text-gray-600">
                      Searches for flights, accommodations, and finds the best deals.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-purple-600">📅 Scheduler Agent</h3>
                    <p className="text-sm text-gray-600">
                      Creates detailed daily itineraries with timing and travel optimization.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-600">🎨 UI Agent</h3>
                    <p className="text-sm text-gray-600">
                      Prepares data for the dashboard and generates export formats.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentTestPage;
