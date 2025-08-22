import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { MapPin, Calendar, Users, DollarSign, Clock, Edit, Share, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  familySize: number;
  budget: number;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  image?: string;
  description?: string;
  activities?: string[];
}

interface TripCardProps {
  trip: Trip;
  onView: (tripId: string) => void;
  onEdit: (tripId: string) => void;
  onShare: (tripId: string) => void;
  variant?: 'default' | 'compact';
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onView,
  onEdit,
  onShare,
  variant = 'default'
}) => {
  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planning':
        return 'warning';
      case 'booked':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'planning':
        return 'Planning';
      case 'booked':
        return 'Booked';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
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

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(trip.id)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{trip.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{trip.destination}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant={getStatusColor(trip.status)} size="sm">
                {getStatusText(trip.status)}
              </Badge>
              <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(trip.id); }}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Trip Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white opacity-20" />
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant={getStatusColor(trip.status)}>
            {getStatusText(trip.status)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{trip.title}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{trip.destination}</span>
            </div>
            {trip.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">{format(trip.startDate, 'MMM dd')}</div>
              <div className="text-gray-500">to {format(trip.endDate, 'MMM dd, yyyy')}</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">{trip.familySize} people</div>
              <div className="text-gray-500">Family size</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">{formatCurrency(trip.budget)}</div>
              <div className="text-gray-500">Budget</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">
                {Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
              <div className="text-gray-500">Duration</div>
            </div>
          </div>
        </div>

        {/* Activities Preview */}
        {trip.activities && trip.activities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Planned Activities</h4>
            <div className="flex flex-wrap gap-1">
              {trip.activities.slice(0, 3).map((activity, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {activity}
                </Badge>
              ))}
              {trip.activities.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{trip.activities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onView(trip.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(trip.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(trip.id)}
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
