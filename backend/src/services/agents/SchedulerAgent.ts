import { BaseAgent, AgentContext, AgentResult } from './BaseAgent';
import { ActivityRecommendation } from './PlannerAgent';

export interface ScheduledActivity {
  id: string;
  activity: ActivityRecommendation;
  day: number;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in minutes
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  travelTime: {
    fromPrevious: number; // in minutes
    toNext: number; // in minutes
  };
  notes?: string;
  backupPlan?: ActivityRecommendation;
}

export interface DailySchedule {
  day: number;
  date: string;
  activities: ScheduledActivity[];
  totalDuration: number; // in minutes
  totalCost: number;
  breaks: {
    startTime: string;
    endTime: string;
    duration: number;
    type: 'lunch' | 'dinner' | 'rest' | 'travel';
  }[];
  flexibility: 'high' | 'medium' | 'low';
}

export interface ItineraryResult {
  dailySchedules: DailySchedule[];
  summary: {
    totalDays: number;
    totalActivities: number;
    totalCost: number;
    averageDailyDuration: number;
    flexibility: 'high' | 'medium' | 'low';
  };
  recommendations: {
    bestDays: number[];
    restDays: number[];
    backupPlans: ScheduledActivity[];
  };
  travelOptimization: {
    totalTravelTime: number;
    routeEfficiency: number; // percentage
    suggestedTransportation: string[];
  };
}

export class SchedulerAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super('SchedulerAgent', context);
  }

  async execute(): Promise<AgentResult<ItineraryResult>> {
    const startTime = Date.now();
    
    try {
      this.logExecution('Starting itinerary scheduling process');

      if (!this.validateContext()) {
        return this.handleError(new Error('Invalid context'), 'validation');
      }

      if (!this.context.dates || !this.context.destination) {
        return this.handleError(new Error('Missing dates or destination'), 'validation');
      }

      // Step 1: Calculate trip duration
      const tripDuration = this.calculateTripDuration();
      
      // Step 2: Get activities (this would come from PlannerAgent in real implementation)
      const activities = await this.getActivities();
      
      // Step 3: Create daily schedules
      const dailySchedules = this.createDailySchedules(activities, tripDuration);
      
      // Step 4: Optimize travel routes
      const travelOptimization = this.optimizeTravelRoutes(dailySchedules);
      
      // Step 5: Generate summary and recommendations
      const summary = this.generateSummary(dailySchedules);
      const recommendations = this.generateRecommendations(dailySchedules);
      
      const result: ItineraryResult = {
        dailySchedules,
        summary,
        recommendations,
        travelOptimization,
      };

      const processingTime = Date.now() - startTime;
      
      this.logExecution('Itinerary scheduling completed successfully', {
        daysScheduled: dailySchedules.length,
        totalActivities: summary.totalActivities,
        processingTime,
      });

      return this.createSuccessResult(result, {
        processingTime,
        confidence: 0.88,
      });

    } catch (error) {
      return this.handleError(error as Error, 'scheduling execution');
    }
  }

  private calculateTripDuration(): number {
    if (!this.context.dates) return 7; // Default to 7 days
    
    const start = new Date(this.context.dates.start);
    const end = new Date(this.context.dates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  private async getActivities(): Promise<ActivityRecommendation[]> {
    // For now, return sample activities
    // In a real implementation, this would get activities from PlannerAgent
    const activities: ActivityRecommendation[] = [
      {
        id: 'activity-1',
        name: 'Magic Kingdom Park',
        type: 'attraction',
        description: 'Full day at the most magical theme park',
        familyFriendly: true,
        ageRange: { min: 2, max: 99 },
        duration: 480, // 8 hours
        cost: { min: 120, max: 150, currency: 'USD' },
        location: {
          address: 'Magic Kingdom, Walt Disney World Resort, Orlando, FL',
          coordinates: { lat: 28.4177, lng: -81.5812 },
        },
        rating: 4.9,
        imageUrl: 'https://example.com/magic-kingdom.jpg',
      },
      {
        id: 'activity-2',
        name: 'Character Breakfast at Cinderella\'s Royal Table',
        type: 'restaurant',
        description: 'Magical dining experience with Disney princesses',
        familyFriendly: true,
        ageRange: { min: 3, max: 12 },
        duration: 90,
        cost: { min: 60, max: 80, currency: 'USD' },
        location: {
          address: 'Cinderella\'s Royal Table, Magic Kingdom, Orlando, FL',
        },
        rating: 4.7,
        imageUrl: 'https://example.com/cinderella-table.jpg',
      },
      {
        id: 'activity-3',
        name: 'Epcot World Showcase',
        type: 'attraction',
        description: 'Explore cultures from around the world',
        familyFriendly: true,
        ageRange: { min: 5, max: 99 },
        duration: 360, // 6 hours
        cost: { min: 110, max: 140, currency: 'USD' },
        location: {
          address: 'Epcot, Walt Disney World Resort, Orlando, FL',
        },
        rating: 4.6,
        imageUrl: 'https://example.com/epcot.jpg',
      },
      {
        id: 'activity-4',
        name: 'Typhoon Lagoon Water Park',
        type: 'activity',
        description: 'Splash and slide at the tropical water park',
        familyFriendly: true,
        ageRange: { min: 5, max: 99 },
        duration: 300, // 5 hours
        cost: { min: 65, max: 85, currency: 'USD' },
        location: {
          address: 'Typhoon Lagoon, Walt Disney World Resort, Orlando, FL',
        },
        rating: 4.5,
        imageUrl: 'https://example.com/typhoon-lagoon.jpg',
      },
    ];

    return activities;
  }

  private createDailySchedules(activities: ActivityRecommendation[], tripDuration: number): DailySchedule[] {
    const schedules: DailySchedule[] = [];
    
    // Simple scheduling algorithm - distribute activities across days
    const activitiesPerDay = Math.ceil(activities.length / tripDuration);
    
    for (let day = 1; day <= tripDuration; day++) {
      const dayActivities = activities.slice((day - 1) * activitiesPerDay, day * activitiesPerDay);
      const scheduledActivities: ScheduledActivity[] = [];
      
      let currentTime = 9 * 60; // Start at 9 AM (in minutes)
      
      dayActivities.forEach((activity, index) => {
        const scheduledActivity: ScheduledActivity = {
          id: `day-${day}-activity-${index + 1}`,
          activity,
          day,
          startTime: this.minutesToTime(currentTime),
          endTime: this.minutesToTime(currentTime + activity.duration),
          duration: activity.duration,
          location: activity.location,
          travelTime: {
            fromPrevious: index === 0 ? 0 : 30, // 30 minutes travel time between activities
            toNext: index === dayActivities.length - 1 ? 0 : 30,
          },
          notes: this.generateActivityNotes(activity, day),
        };
        
        scheduledActivities.push(scheduledActivity);
        currentTime += activity.duration + 30; // Add travel time
        
        // Add lunch break around noon
        if (currentTime >= 12 * 60 && currentTime < 14 * 60) {
          currentTime = 14 * 60; // Move to 2 PM
        }
      });
      
      const totalDuration = scheduledActivities.reduce((sum, activity) => sum + activity.duration, 0);
      const totalCost = scheduledActivities.reduce((sum, activity) => sum + activity.activity.cost.max, 0);
      
      const breaks = this.generateBreaks(scheduledActivities);
      
      schedules.push({
        day,
        date: this.getDateForDay(day),
        activities: scheduledActivities,
        totalDuration,
        totalCost,
        breaks,
        flexibility: this.calculateFlexibility(scheduledActivities),
      });
    }
    
    return schedules;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private generateActivityNotes(activity: ActivityRecommendation, day: number): string {
    const notes = [];
    
    if (activity.type === 'attraction') {
      notes.push('Arrive early to avoid long lines');
      notes.push('Consider FastPass+ reservations');
    }
    
    if (activity.type === 'restaurant') {
      notes.push('Reservation recommended');
      notes.push('Dress code: casual');
    }
    
    if (activity.type === 'activity') {
      notes.push('Bring swimwear and towels');
      notes.push('Weather dependent');
    }
    
    if (day === 1) {
      notes.push('First day - allow extra time for orientation');
    }
    
    return notes.join('. ');
  }

  private generateBreaks(activities: ScheduledActivity[]): {
    startTime: string;
    endTime: string;
    duration: number;
    type: 'lunch' | 'dinner' | 'rest' | 'travel';
  }[] {
    const breaks = [];
    
    // Add lunch break
    breaks.push({
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      type: 'lunch',
    });
    
    // Add dinner break
    breaks.push({
      startTime: '18:00',
      endTime: '19:00',
      duration: 60,
      type: 'dinner',
    });
    
    return breaks;
  }

  private calculateFlexibility(activities: ScheduledActivity[]): 'high' | 'medium' | 'low' {
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
    
    if (totalDuration < 6 * 60) return 'high'; // Less than 6 hours
    if (totalDuration < 8 * 60) return 'medium'; // Less than 8 hours
    return 'low'; // 8+ hours
  }

  private getDateForDay(day: number): string {
    if (!this.context.dates) return new Date().toISOString().split('T')[0];
    
    const startDate = new Date(this.context.dates.start);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + day - 1);
    
    return targetDate.toISOString().split('T')[0];
  }

  private optimizeTravelRoutes(schedules: DailySchedule[]): {
    totalTravelTime: number;
    routeEfficiency: number;
    suggestedTransportation: string[];
  } {
    let totalTravelTime = 0;
    
    schedules.forEach(schedule => {
      schedule.activities.forEach(activity => {
        totalTravelTime += activity.travelTime.fromPrevious + activity.travelTime.toNext;
      });
    });
    
    // Calculate route efficiency (simplified)
    const routeEfficiency = Math.max(0, 100 - (totalTravelTime / 60)); // Convert to hours and calculate efficiency
    
    const suggestedTransportation = ['Disney Transportation', 'Uber/Lyft', 'Rental Car'];
    
    return {
      totalTravelTime,
      routeEfficiency: Math.round(routeEfficiency),
      suggestedTransportation,
    };
  }

  private generateSummary(schedules: DailySchedule[]): {
    totalDays: number;
    totalActivities: number;
    totalCost: number;
    averageDailyDuration: number;
    flexibility: 'high' | 'medium' | 'low';
  } {
    const totalDays = schedules.length;
    const totalActivities = schedules.reduce((sum, schedule) => sum + schedule.activities.length, 0);
    const totalCost = schedules.reduce((sum, schedule) => sum + schedule.totalCost, 0);
    const averageDailyDuration = schedules.reduce((sum, schedule) => sum + schedule.totalDuration, 0) / totalDays;
    
    // Calculate overall flexibility
    const flexibilityCounts = schedules.reduce((counts, schedule) => {
      counts[schedule.flexibility]++;
      return counts;
    }, { high: 0, medium: 0, low: 0 });
    
    const flexibility = Object.entries(flexibilityCounts).reduce((a, b) => 
      flexibilityCounts[a[0]] > flexibilityCounts[b[0]] ? a : b
    )[0] as 'high' | 'medium' | 'low';
    
    return {
      totalDays,
      totalActivities,
      totalCost,
      averageDailyDuration: Math.round(averageDailyDuration),
      flexibility,
    };
  }

  private generateRecommendations(schedules: DailySchedule[]): {
    bestDays: number[];
    restDays: number[];
    backupPlans: ScheduledActivity[];
  } {
    // Find best days (most activities)
    const bestDays = schedules
      .map((schedule, index) => ({ day: schedule.day, activityCount: schedule.activities.length }))
      .sort((a, b) => b.activityCount - a.activityCount)
      .slice(0, 2)
      .map(item => item.day);
    
    // Find rest days (least activities)
    const restDays = schedules
      .map((schedule, index) => ({ day: schedule.day, activityCount: schedule.activities.length }))
      .sort((a, b) => a.activityCount - b.activityCount)
      .slice(0, 1)
      .map(item => item.day);
    
    // Generate backup plans (simplified)
    const backupPlans: ScheduledActivity[] = [];
    
    return {
      bestDays,
      restDays,
      backupPlans,
    };
  }
}
