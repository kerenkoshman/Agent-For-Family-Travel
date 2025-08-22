import { BaseAgent, AgentContext, AgentResult } from './BaseAgent';
import { PlannerAgent, PlanningResult } from './PlannerAgent';
import { BookingAgent, BookingResult } from './BookingAgent';
import { SchedulerAgent, ItineraryResult } from './SchedulerAgent';
import { UIAgent, UIResult } from './UIAgent';
import { logger } from '../../utils/logger';

export interface TripPlanningRequest {
  userId: string;
  familyProfile?: {
    adults: number;
    children: number;
    ages: number[];
    interests: string[];
    dietaryRestrictions?: string[];
  };
  tripPreferences: {
    destination?: string;
    budget: number;
    dates: {
      start: Date;
      end: Date;
    };
    tripType: 'relaxation' | 'adventure' | 'culture' | 'family' | 'mixed';
    accommodationType: 'hotel' | 'resort' | 'apartment' | 'villa';
    transportation: 'flight' | 'car' | 'train' | 'bus';
  };
  constraints?: {
    accessibility?: boolean;
    petFriendly?: boolean;
    allInclusive?: boolean;
  };
}

export interface TripPlanningResult {
  planning: PlanningResult;
  booking: BookingResult;
  itinerary: ItineraryResult;
  ui: UIResult;
  summary: {
    totalCost: number;
    savings: number;
    tripDuration: number;
    destination: string;
    status: 'planned' | 'booked' | 'completed';
    confidence: number;
  };
  metadata: {
    processingTime: number;
    agentsUsed: string[];
    timestamp: string;
  };
}

export interface AgentStatus {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  result?: any;
  error?: string;
}

export class SmolAgent extends BaseAgent {
  private agents: {
    planner: PlannerAgent;
    booking: BookingAgent;
    scheduler: SchedulerAgent;
    ui: UIAgent;
  };
  private agentStatuses: Map<string, AgentStatus>;

  constructor(context: AgentContext) {
    super('SmolAgent', context);
    
    this.agents = {
      planner: new PlannerAgent(context),
      booking: new BookingAgent(context),
      scheduler: new SchedulerAgent(context),
      ui: new UIAgent(context),
    };
    
    this.agentStatuses = new Map();
    this.initializeAgentStatuses();
  }

  async execute(): Promise<AgentResult<TripPlanningResult>> {
    const startTime = Date.now();
    
    try {
      this.logExecution('Starting complete trip planning process');

      if (!this.validateContext()) {
        return this.handleError(new Error('Invalid context'), 'validation');
      }

      // Step 1: Planning Phase
      this.updateAgentStatus('planner', 'running', 0);
      const planningResult = await this.executePlanningPhase();
      this.updateAgentStatus('planner', 'completed', 100, planningResult);

      // Step 2: Booking Phase
      this.updateAgentStatus('booking', 'running', 0);
      const bookingResult = await this.executeBookingPhase();
      this.updateAgentStatus('booking', 'completed', 100, bookingResult);

      // Step 3: Scheduling Phase
      this.updateAgentStatus('scheduler', 'running', 0);
      const itineraryResult = await this.executeSchedulingPhase();
      this.updateAgentStatus('scheduler', 'completed', 100, itineraryResult);

      // Step 4: UI Preparation Phase
      this.updateAgentStatus('ui', 'running', 0);
      const uiResult = await this.executeUIPhase();
      this.updateAgentStatus('ui', 'completed', 100, uiResult);

      // Step 5: Compile Final Result
      const finalResult = this.compileFinalResult(
        planningResult,
        bookingResult,
        itineraryResult,
        uiResult
      );

      const processingTime = Date.now() - startTime;
      
      this.logExecution('Complete trip planning process finished successfully', {
        processingTime,
        totalCost: finalResult.summary.totalCost,
        destination: finalResult.summary.destination,
      });

      return this.createSuccessResult(finalResult, {
        processingTime,
        confidence: 0.92,
      });

    } catch (error) {
      this.logExecution('Trip planning process failed', { error: error.message });
      return this.handleError(error as Error, 'trip planning execution');
    }
  }

  private async executePlanningPhase(): Promise<PlanningResult> {
    this.logExecution('Executing planning phase');
    
    try {
      const result = await this.agents.planner.execute();
      
      if (!result.success) {
        throw new Error(`Planning phase failed: ${result.error}`);
      }
      
      this.updateAgentStatus('planner', 'running', 50);
      return result.data as PlanningResult;
      
    } catch (error) {
      this.updateAgentStatus('planner', 'failed', 0, undefined, error.message);
      throw error;
    }
  }

  private async executeBookingPhase(): Promise<BookingResult> {
    this.logExecution('Executing booking phase');
    
    try {
      const result = await this.agents.booking.execute();
      
      if (!result.success) {
        throw new Error(`Booking phase failed: ${result.error}`);
      }
      
      this.updateAgentStatus('booking', 'running', 50);
      return result.data as BookingResult;
      
    } catch (error) {
      this.updateAgentStatus('booking', 'failed', 0, undefined, error.message);
      throw error;
    }
  }

  private async executeSchedulingPhase(): Promise<ItineraryResult> {
    this.logExecution('Executing scheduling phase');
    
    try {
      const result = await this.agents.scheduler.execute();
      
      if (!result.success) {
        throw new Error(`Scheduling phase failed: ${result.error}`);
      }
      
      this.updateAgentStatus('scheduler', 'running', 50);
      return result.data as ItineraryResult;
      
    } catch (error) {
      this.updateAgentStatus('scheduler', 'failed', 0, undefined, error.message);
      throw error;
    }
  }

  private async executeUIPhase(): Promise<UIResult> {
    this.logExecution('Executing UI preparation phase');
    
    try {
      const result = await this.agents.ui.execute();
      
      if (!result.success) {
        throw new Error(`UI preparation phase failed: ${result.error}`);
      }
      
      this.updateAgentStatus('ui', 'running', 50);
      return result.data as UIResult;
      
    } catch (error) {
      this.updateAgentStatus('ui', 'failed', 0, undefined, error.message);
      throw error;
    }
  }

  private compileFinalResult(
    planning: PlanningResult,
    booking: BookingResult,
    itinerary: ItineraryResult,
    ui: UIResult
  ): TripPlanningResult {
    this.logExecution('Compiling final trip planning result');

    const totalCost = booking.bestOption.totalCost.total;
    const savings = booking.bestOption.savings.amount;
    const tripDuration = itinerary.summary.totalDays;
    const destination = planning.recommendations.bestDestination.name;

    return {
      planning,
      booking,
      itinerary,
      ui,
      summary: {
        totalCost,
        savings,
        tripDuration,
        destination,
        status: 'planned',
        confidence: 0.92,
      },
      metadata: {
        processingTime: Date.now(),
        agentsUsed: ['planner', 'booking', 'scheduler', 'ui'],
        timestamp: new Date().toISOString(),
      },
    };
  }

  private initializeAgentStatuses(): void {
    this.agentStatuses.set('planner', {
      name: 'Planner Agent',
      status: 'idle',
      progress: 0,
    });
    
    this.agentStatuses.set('booking', {
      name: 'Booking Agent',
      status: 'idle',
      progress: 0,
    });
    
    this.agentStatuses.set('scheduler', {
      name: 'Scheduler Agent',
      status: 'idle',
      progress: 0,
    });
    
    this.agentStatuses.set('ui', {
      name: 'UI Agent',
      status: 'idle',
      progress: 0,
    });
  }

  private updateAgentStatus(
    agentName: string,
    status: 'idle' | 'running' | 'completed' | 'failed',
    progress: number,
    result?: any,
    error?: string
  ): void {
    const agentStatus = this.agentStatuses.get(agentName);
    if (agentStatus) {
      agentStatus.status = status;
      agentStatus.progress = progress;
      agentStatus.result = result;
      agentStatus.error = error;
      
      this.logExecution(`Agent status updated: ${agentName}`, {
        status,
        progress,
        hasResult: !!result,
        hasError: !!error,
      });
    }
  }

  public getAgentStatuses(): AgentStatus[] {
    return Array.from(this.agentStatuses.values());
  }

  public getAgentStatus(agentName: string): AgentStatus | undefined {
    return this.agentStatuses.get(agentName);
  }

  public async planTrip(request: TripPlanningRequest): Promise<AgentResult<TripPlanningResult>> {
    // Create a new context with the request data
    const context: AgentContext = {
      userId: request.userId,
      familyProfile: request.familyProfile,
      tripPreferences: request.tripPreferences,
      budget: request.tripPreferences.budget,
      dates: request.tripPreferences.dates,
      destination: request.tripPreferences.destination,
    };

    // Create a new SmolAgent instance with the updated context
    const smolAgent = new SmolAgent(context);
    
    // Execute the planning process
    return await smolAgent.execute();
  }

  public getProgress(): {
    overall: number;
    agents: AgentStatus[];
  } {
    const agents = this.getAgentStatuses();
    const completedAgents = agents.filter(a => a.status === 'completed').length;
    const overall = (completedAgents / agents.length) * 100;

    return {
      overall: Math.round(overall),
      agents,
    };
  }
}
