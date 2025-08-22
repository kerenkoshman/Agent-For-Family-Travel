// Base Agent
export { BaseAgent, AgentContext, AgentResult } from './BaseAgent';

// Individual Agents
export { PlannerAgent, PlanningResult, DestinationSuggestion, ActivityRecommendation } from './PlannerAgent';
export { BookingAgent, BookingResult, FlightOption, AccommodationOption, BookingRecommendation } from './BookingAgent';
export { SchedulerAgent, ItineraryResult, ScheduledActivity, DailySchedule } from './SchedulerAgent';
export { UIAgent, UIResult, DashboardData, ExportFormat, SharingData } from './UIAgent';

// Main SmolAgent Coordinator
export { SmolAgent, TripPlanningRequest, TripPlanningResult, AgentStatus } from './SmolAgent';
