import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MapPin, Clock, Info, Navigation, Coffee, Camera, Bed } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'attraction' | 'meal' | 'transport' | 'accommodation' | 'activity';
  cost?: number;
  bookingReference?: string;
  notes?: string;
  coordinates?: { lat: number; lng: number };
}

interface DayItinerary {
  date: Date;
  dayNumber: number;
  activities: Activity[];
  totalCost: number;
  notes?: string;
}

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
  onActivityClick?: (activity: Activity) => void;
  onEditActivity?: (activity: Activity) => void;
  showCosts?: boolean;
  variant?: 'default' | 'compact';
}

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  onActivityClick,
  onEditActivity,
  showCosts = true,
  variant = 'default'
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'attraction':
        return <Camera className="w-4 h-4" />;
      case 'meal':
        return <Coffee className="w-4 h-4" />;
      case 'transport':
        return <Navigation className="w-4 h-4" />;
      case 'accommodation':
        return <Bed className="w-4 h-4" />;
      case 'activity':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'attraction':
        return 'bg-blue-100 text-blue-800';
      case 'meal':
        return 'bg-green-100 text-green-800';
      case 'transport':
        return 'bg-purple-100 text-purple-800';
      case 'accommodation':
        return 'bg-orange-100 text-orange-800';
      case 'activity':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {itinerary.map((day) => (
          <Card key={day.date.toISOString()}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">
                  Day {day.dayNumber} - {format(day.date, 'EEEE, MMM dd')}
                </h3>
                {showCosts && (
                  <Badge variant="secondary">
                    {formatCurrency(day.totalCost)}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                {day.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    onClick={() => onActivityClick?.(activity)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{activity.title}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{activity.location}</div>
                      {activity.cost && showCosts && (
                        <div className="text-xs font-medium">{formatCurrency(activity.cost)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {itinerary.map((day) => (
        <div key={day.date.toISOString()}>
          {/* Day Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-semibold">
                {day.dayNumber}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Day {day.dayNumber}
                </h2>
                <p className="text-gray-600">{format(day.date, 'EEEE, MMMM dd, yyyy')}</p>
              </div>
            </div>
            {showCosts && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Cost</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(day.totalCost)}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {day.activities.map((activity) => (
                <div key={activity.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-3 h-3 bg-blue-600 rounded-full border-4 border-white shadow-sm transform -translate-x-1/2"></div>
                  
                  {/* Activity Card */}
                  <div className="ml-12">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                {getActivityIcon(activity.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {activity.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              {activity.location}
                            </div>
                            
                            {activity.description && (
                              <p className="text-gray-700 mb-3">{activity.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" size="sm">
                                {activity.type}
                              </Badge>
                              {activity.bookingReference && (
                                <Badge variant="primary" size="sm">
                                  Booked
                                </Badge>
                              )}
                              {activity.cost && showCosts && (
                                <Badge variant="success" size="sm">
                                  {formatCurrency(activity.cost)}
                                </Badge>
                              )}
                            </div>
                            
                            {activity.notes && (
                              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-start">
                                  <Info className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-yellow-800">{activity.notes}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            {onActivityClick && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onActivityClick(activity)}
                              >
                                <Info className="w-4 h-4" />
                              </Button>
                            )}
                            {onEditActivity && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditActivity(activity)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {day.notes && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Day Notes</h4>
              <p className="text-blue-800">{day.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItineraryTimeline;
