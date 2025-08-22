import { BaseAgent, AgentContext, AgentResult } from './BaseAgent';
import { PlanningResult } from './PlannerAgent';
import { BookingResult } from './BookingAgent';
import { ItineraryResult } from './SchedulerAgent';

export interface DashboardData {
  overview: {
    tripStatus: 'planning' | 'booked' | 'completed';
    totalCost: number;
    savings: number;
    tripDuration: number;
    destination: string;
    dates: {
      start: string;
      end: string;
    };
  };
  planning: {
    destinations: any[];
    activities: any[];
    budgetBreakdown: any;
  };
  booking: {
    flights: any[];
    accommodation: any;
    priceComparison: any;
  };
  itinerary: {
    dailySchedules: any[];
    summary: any;
    travelOptimization: any;
  };
  insights: {
    recommendations: string[];
    tips: string[];
    alerts: string[];
  };
}

export interface ExportFormat {
  type: 'pdf' | 'json' | 'ical' | 'csv';
  data: any;
  filename: string;
  downloadUrl?: string;
}

export interface SharingData {
  shareableLink: string;
  qrCode?: string;
  socialMediaLinks: {
    facebook?: string;
    twitter?: string;
    email?: string;
  };
}

export interface UIResult {
  dashboardData: DashboardData;
  exports: ExportFormat[];
  sharing: SharingData;
  visualizations: {
    charts: any[];
    maps: any[];
    timelines: any[];
  };
}

export class UIAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super('UIAgent', context);
  }

  async execute(): Promise<AgentResult<UIResult>> {
    const startTime = Date.now();
    
    try {
      this.logExecution('Starting UI data preparation');

      if (!this.validateContext()) {
        return this.handleError(new Error('Invalid context'), 'validation');
      }

      // Step 1: Prepare dashboard data
      const dashboardData = await this.prepareDashboardData();
      
      // Step 2: Generate export formats
      const exports = await this.generateExports(dashboardData);
      
      // Step 3: Create sharing data
      const sharing = this.createSharingData();
      
      // Step 4: Prepare visualizations
      const visualizations = this.prepareVisualizations(dashboardData);
      
      const result: UIResult = {
        dashboardData,
        exports,
        sharing,
        visualizations,
      };

      const processingTime = Date.now() - startTime;
      
      this.logExecution('UI data preparation completed successfully', {
        processingTime,
      });

      return this.createSuccessResult(result, {
        processingTime,
        confidence: 0.95,
      });

    } catch (error) {
      return this.handleError(error as Error, 'UI preparation execution');
    }
  }

  private async prepareDashboardData(): Promise<DashboardData> {
    this.logExecution('Preparing dashboard data');

    // For now, create sample dashboard data
    // In a real implementation, this would aggregate data from other agents
    const dashboardData: DashboardData = {
      overview: {
        tripStatus: 'planning',
        totalCost: 4500,
        savings: 800,
        tripDuration: 7,
        destination: 'Walt Disney World Resort, Orlando',
        dates: {
          start: '2024-06-15',
          end: '2024-06-22',
        },
      },
      planning: {
        destinations: [
          {
            id: 'disney-world',
            name: 'Walt Disney World Resort',
            imageUrl: 'https://example.com/disney-world.jpg',
            familyScore: 9.5,
            budgetRange: { min: 3000, max: 8000 },
          },
        ],
        activities: [
          {
            id: 'activity-1',
            name: 'Magic Kingdom Park',
            type: 'attraction',
            cost: { min: 120, max: 150, currency: 'USD' },
            rating: 4.9,
          },
          {
            id: 'activity-2',
            name: 'Character Breakfast',
            type: 'restaurant',
            cost: { min: 60, max: 80, currency: 'USD' },
            rating: 4.7,
          },
        ],
        budgetBreakdown: {
          accommodation: 1800,
          activities: 900,
          food: 1125,
          transportation: 675,
          total: 4500,
        },
      },
      booking: {
        flights: [
          {
            airline: 'Delta Airlines',
            departure: 'JFK → MCO',
            price: 250,
            duration: '3h 30m',
          },
        ],
        accommodation: {
          name: 'Disney\'s Grand Floridian Resort & Spa',
          price: 3150,
          rating: 4.8,
        },
        priceComparison: {
          averagePrice: 5200,
          lowestPrice: 4500,
          highestPrice: 6500,
        },
      },
      itinerary: {
        dailySchedules: [
          {
            day: 1,
            date: '2024-06-15',
            activities: [
              {
                name: 'Magic Kingdom Park',
                startTime: '09:00',
                endTime: '17:00',
                type: 'attraction',
              },
            ],
            totalDuration: 480,
            totalCost: 150,
          },
        ],
        summary: {
          totalDays: 7,
          totalActivities: 12,
          totalCost: 4500,
          averageDailyDuration: 420,
        },
        travelOptimization: {
          totalTravelTime: 180,
          routeEfficiency: 85,
          suggestedTransportation: ['Disney Transportation'],
        },
      },
      insights: {
        recommendations: [
          'Book FastPass+ reservations 60 days in advance',
          'Consider dining plan for better value',
          'Visit during off-peak season for shorter lines',
        ],
        tips: [
          'Arrive at parks 30 minutes before opening',
          'Use My Disney Experience app for real-time updates',
          'Pack ponchos for afternoon rain showers',
        ],
        alerts: [
          'High crowd levels expected on June 18th',
          'Some attractions may be closed for maintenance',
        ],
      },
    };

    return dashboardData;
  }

  private async generateExports(dashboardData: DashboardData): Promise<ExportFormat[]> {
    this.logExecution('Generating export formats');

    const exports: ExportFormat[] = [
      {
        type: 'json',
        data: dashboardData,
        filename: `trip-plan-${this.context.userId}-${Date.now()}.json`,
      },
      {
        type: 'pdf',
        data: this.formatForPDF(dashboardData),
        filename: `trip-itinerary-${this.context.userId}-${Date.now()}.pdf`,
      },
      {
        type: 'ical',
        data: this.formatForICal(dashboardData),
        filename: `trip-calendar-${this.context.userId}-${Date.now()}.ics`,
      },
    ];

    return exports;
  }

  private createSharingData(): SharingData {
    this.logExecution('Creating sharing data');

    const tripId = `trip-${this.context.userId}-${Date.now()}`;
    const baseUrl = process.env['FRONTEND_URL'] || 'http://localhost:5173';
    
    return {
      shareableLink: `${baseUrl}/trip/${tripId}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${baseUrl}/trip/${tripId}`)}`,
      socialMediaLinks: {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/trip/${tripId}`)}`,
        twitter: `https://twitter.com/intent/tweet?text=Check out my family trip plan!&url=${encodeURIComponent(`${baseUrl}/trip/${tripId}`)}`,
        email: `mailto:?subject=Family Trip Plan&body=Check out our trip plan: ${baseUrl}/trip/${tripId}`,
      },
    };
  }

  private prepareVisualizations(dashboardData: DashboardData): {
    charts: any[];
    maps: any[];
    timelines: any[];
  } {
    this.logExecution('Preparing visualizations');

    const charts = [
      {
        type: 'pie',
        title: 'Budget Breakdown',
        data: [
          { label: 'Accommodation', value: dashboardData.planning.budgetBreakdown.accommodation },
          { label: 'Activities', value: dashboardData.planning.budgetBreakdown.activities },
          { label: 'Food', value: dashboardData.planning.budgetBreakdown.food },
          { label: 'Transportation', value: dashboardData.planning.budgetBreakdown.transportation },
        ],
      },
      {
        type: 'bar',
        title: 'Daily Activity Duration',
        data: dashboardData.itinerary.dailySchedules.map(schedule => ({
          label: `Day ${schedule.day}`,
          value: schedule.totalDuration / 60, // Convert to hours
        })),
      },
    ];

    const maps = [
      {
        type: 'destination',
        title: 'Trip Destination',
        center: { lat: 28.4177, lng: -81.5812 }, // Disney World coordinates
        markers: dashboardData.itinerary.dailySchedules.flatMap(schedule =>
          schedule.activities.map(activity => ({
            position: { lat: 28.4177, lng: -81.5812 }, // Sample coordinates
            title: activity.name,
            type: activity.type,
          }))
        ),
      },
    ];

    const timelines = [
      {
        type: 'itinerary',
        title: 'Trip Timeline',
        events: dashboardData.itinerary.dailySchedules.flatMap(schedule =>
          schedule.activities.map(activity => ({
            date: schedule.date,
            time: activity.startTime,
            title: activity.name,
            description: `${activity.startTime} - ${activity.endTime}`,
            type: activity.type,
          }))
        ),
      },
    ];

    return {
      charts,
      maps,
      timelines,
    };
  }

  private formatForPDF(dashboardData: DashboardData): any {
    // Format data specifically for PDF generation
    return {
      title: 'Family Trip Itinerary',
      subtitle: `${dashboardData.overview.destination}`,
      dates: `${dashboardData.overview.dates.start} - ${dashboardData.overview.dates.end}`,
      sections: [
        {
          title: 'Overview',
          content: {
            totalCost: `$${dashboardData.overview.totalCost.toLocaleString()}`,
            savings: `$${dashboardData.overview.savings.toLocaleString()}`,
            duration: `${dashboardData.overview.tripDuration} days`,
          },
        },
        {
          title: 'Daily Itinerary',
          content: dashboardData.itinerary.dailySchedules.map(schedule => ({
            day: schedule.day,
            date: schedule.date,
            activities: schedule.activities.map(activity => ({
              time: `${activity.startTime} - ${activity.endTime}`,
              name: activity.name,
              type: activity.type,
            })),
          })),
        },
        {
          title: 'Budget Breakdown',
          content: dashboardData.planning.budgetBreakdown,
        },
      ],
    };
  }

  private formatForICal(dashboardData: DashboardData): any {
    // Format data for iCal calendar export
    const events = dashboardData.itinerary.dailySchedules.flatMap(schedule =>
      schedule.activities.map(activity => ({
        uid: `activity-${activity.name.toLowerCase().replace(/\s+/g, '-')}`,
        summary: activity.name,
        description: `${activity.type} at ${dashboardData.overview.destination}`,
        start: `${schedule.date}T${activity.startTime}:00`,
        end: `${schedule.date}T${activity.endTime}:00`,
        location: dashboardData.overview.destination,
        categories: [activity.type],
      }))
    );

    return {
      calendar: {
        name: 'Family Trip',
        description: `Trip to ${dashboardData.overview.destination}`,
        events,
      },
    };
  }
}
