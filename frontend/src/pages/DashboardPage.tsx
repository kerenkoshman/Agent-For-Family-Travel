import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Plane, Hotel, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with real data from API
  const recentTrips = [
    {
      id: '1',
      title: 'Family Beach Vacation',
      destination: 'Maui, Hawaii',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      status: 'planned',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
      id: '2',
      title: 'City Adventure',
      destination: 'New York City',
      startDate: '2024-07-10',
      endDate: '2024-07-15',
      status: 'booked',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    },
  ];

  const quickActions = [
    {
      title: 'Plan New Trip',
      description: 'Start planning your next family adventure',
      icon: Plus,
      href: '/plan-trip',
      color: 'bg-primary-500',
    },
    {
      title: 'View Calendar',
      description: 'See all your upcoming trips',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-success-500',
    },
    {
      title: 'Family Profile',
      description: 'Update family preferences',
      icon: Users,
      href: '/profile',
      color: 'bg-warning-500',
    },
  ];

  const stats = [
    {
      label: 'Total Trips',
      value: '12',
      icon: Plane,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      label: 'Upcoming Trips',
      value: '3',
      icon: Calendar,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      label: 'Booked Hotels',
      value: '8',
      icon: Hotel,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      label: 'Activities Planned',
      value: '45',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="container-responsive py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'Family'}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to plan your next family adventure? Here's what's happening with your trips.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="card p-6 hover:shadow-medium transition-shadow duration-200 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Trips</h2>
          <Link
            to="/trips"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all trips →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="card overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`badge ${
                    trip.status === 'booked' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {trip.status === 'booked' ? 'Booked' : 'Planning'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {trip.destination}
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <Link
                  to={`/trip/${trip.id}`}
                  className="btn-primary w-full"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agent Status */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your AI Travel Agent is Ready! 🤖
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI agents are working behind the scenes to find the best deals and 
              create personalized recommendations for your family.
            </p>
            <Link
              to="/plan-trip"
              className="btn-primary"
            >
              Start Planning
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
