import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, Edit, Download, Share2 } from 'lucide-react';


interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  participants: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  description: string;
  itinerary: ItineraryDay[];
  accommodation: Accommodation;
  transportation: Transportation[];
  activities: Activity[];
}

interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: number;
  type: 'attraction' | 'restaurant' | 'transport' | 'accommodation';
}

interface Accommodation {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  cost: number;
  bookingReference: string;
}

interface Transportation {
  type: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  cost: number;
  bookingReference: string;
}

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'accommodation' | 'transportation'>('overview');

  useEffect(() => {
    // TODO: Fetch trip data from API
    const fetchTrip = async () => {
      try {
        // Mock data for now
        const mockTrip: Trip = {
          id: id || '1',
          title: 'Family Beach Vacation',
          destination: 'Maui, Hawaii',
          startDate: '2024-06-15',
          endDate: '2024-06-22',
          budget: 5000,
          participants: 4,
          status: 'confirmed',
          description: 'A wonderful family vacation to the beautiful island of Maui. We\'ll explore beaches, go snorkeling, and enjoy local cuisine.',
          itinerary: [
            {
              day: 1,
              date: '2024-06-15',
              activities: [
                {
                  id: '1',
                  name: 'Arrival at Kahului Airport',
                  description: 'Flight arrival and car rental pickup',
                  startTime: '14:00',
                  endTime: '15:00',
                  location: 'Kahului Airport',
                  cost: 0,
                  type: 'transport'
                },
                {
                  id: '2',
                  name: 'Check-in at Resort',
                  description: 'Settle into our oceanfront resort',
                  startTime: '16:00',
                  endTime: '17:00',
                  location: 'Maui Beach Resort',
                  cost: 0,
                  type: 'accommodation'
                }
              ]
            }
          ],
          accommodation: {
            name: 'Maui Beach Resort',
            address: '123 Beach Road, Lahaina, HI 96761',
            checkIn: '2024-06-15',
            checkOut: '2024-06-22',
            cost: 2100,
            bookingReference: 'MBR-2024-001'
          },
          transportation: [
            {
              type: 'Flight',
              from: 'Los Angeles',
              to: 'Kahului',
              departure: '2024-06-15 10:00',
              arrival: '2024-06-15 14:00',
              cost: 1200,
              bookingReference: 'AA-12345'
            }
          ],
          activities: [
            {
              id: '3',
              name: 'Snorkeling at Molokini',
              description: 'Half-day snorkeling tour to the famous Molokini crater',
              startTime: '08:00',
              endTime: '12:00',
              location: 'Molokini Crater',
              cost: 200,
              type: 'attraction'
            }
          ]
        };
        
        setTrip(mockTrip);
      } catch (error) {
        console.error('Failed to fetch trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {trip.destination}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="btn-secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button className="btn-secondary">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-xl font-semibold text-gray-900">${trip.budget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-xl font-semibold text-gray-900">{trip.participants}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-semibold text-gray-900">
                {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-xl font-semibold text-gray-900">{trip.activities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'itinerary', label: 'Itinerary' },
            { id: 'accommodation', label: 'Accommodation' },
            { id: 'transportation', label: 'Transportation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div>
            <div className="card mb-6">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Trip Description</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-600">{trip.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Activities</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {trip.activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{activity.startTime} - {activity.endTime}</p>
                          <p className="text-sm text-gray-500">{activity.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <button className="w-full btn-primary">
                      View Full Itinerary
                    </button>
                    <button className="w-full btn-secondary">
                      Book Additional Activities
                    </button>
                    <button className="w-full btn-secondary">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {trip.itinerary.map((day) => (
              <div key={day.day} className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Day {day.day} - {formatDate(day.date)}</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{activity.startTime} - {activity.endTime}</span>
                            <span>•</span>
                            <span>{activity.location}</span>
                            {activity.cost > 0 && (
                              <>
                                <span>•</span>
                                <span>${activity.cost}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'accommodation' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Accommodation Details</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{trip.accommodation.name}</h4>
                  <p className="text-gray-600 mb-4">{trip.accommodation.address}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{formatDate(trip.accommodation.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{formatDate(trip.accommodation.checkOut)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-medium">${trip.accommodation.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Ref:</span>
                      <span className="font-medium">{trip.accommodation.bookingReference}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Hotel Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transportation' && (
          <div className="space-y-6">
            {trip.transportation.map((transport, index) => (
              <div key={index} className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">{transport.type}</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">{transport.from}</p>
                            <p className="text-sm text-gray-600">{transport.departure}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">{transport.to}</p>
                            <p className="text-sm text-gray-600">{transport.arrival}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-medium">${transport.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Ref:</span>
                        <span className="font-medium">{transport.bookingReference}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailPage;
