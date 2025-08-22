export interface FamilyProfile {
  adults: number;
  children: number;
  ages: number[];
  interests: string[];
  dietaryRestrictions: string[];
}

export interface TripPlanningRequest {
  familyProfile: FamilyProfile;
  destination?: string;
  budget: number;
  startDate: string;
  endDate: string;
  tripType: string;
  accommodationType: string;
  transportation: string;
  travelStyle: string;
}

export interface TripPlanningResponse {
  success: boolean;
  data?: {
    planning?: any;
    booking?: any;
    itinerary?: any;
    ui?: any;
    summary?: any;
  };
  error?: string;
  message?: string;
}

export interface AgentStatus {
  success: boolean;
  data?: {
    overall: number;
    agents: Record<string, {
      status: string;
      progress: number;
      error?: string;
    }>;
    timestamp: string;
  };
}

class TripService {
  private baseUrl = '/api';

  async planTrip(request: TripPlanningRequest): Promise<TripPlanningResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/plan-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Trip planning failed:', error);
      throw error;
    }
  }

  async getAgentStatus(userId: string): Promise<AgentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/status?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get agent status:', error);
      throw error;
    }
  }

  async testAgent(agentType: string, userId: string = 'test-user-123'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentType,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to test ${agentType} agent:`, error);
      throw error;
    }
  }
}

export const tripService = new TripService();
