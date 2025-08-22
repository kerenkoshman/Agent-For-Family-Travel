import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, Plane, Hotel, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import TripCard from '@/components/TripCard';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';


const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with real data from API
  const recentTrips = [
    {
      id: '1',
      title: 'Family Beach Vacation',
      destination: 'Maui, Hawaii',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      familySize: 4,
      budget: 5000,
      status: 'planning' as const,
      activities: ['Beach Day', 'Snorkeling', 'Luau Dinner'],
    },
    {
      id: '2',
      title: 'City Adventure',
      destination: 'New York City',
      startDate: new Date('2024-07-10'),
      endDate: new Date('2024-07-15'),
      familySize: 4,
      budget: 3500,
      status: 'booked' as const,
      activities: ['Central Park', 'Broadway Show', 'Statue of Liberty'],
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
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
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
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all trips →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onView={(id) => window.location.href = `/trip/${id}`}
              onEdit={(id) => window.location.href = `/trip/${id}/edit`}
              onShare={(id) => console.log('Share trip:', id)}
            />
          ))}
        </div>
      </div>

      {/* AI Agent Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your AI Travel Agent is Ready! 🤖
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI agents are working behind the scenes to find the best deals and 
                create personalized recommendations for your family.
              </p>
              <Link to="/plan-trip">
                <Button variant="primary">
                  Start Planning
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
