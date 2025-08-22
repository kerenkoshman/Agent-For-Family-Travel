import { Link } from 'react-router-dom';
import { ArrowRight, Plane, MapPin, Users, Sparkles, Shield, Clock } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Smart recommendations tailored to your family\'s interests, ages, and preferences.',
    },
    {
      icon: MapPin,
      title: 'Personalized Itineraries',
      description: 'Detailed daily schedules with activities suitable for all family members.',
    },
    {
      icon: Plane,
      title: 'Seamless Booking',
      description: 'Find and book flights, accommodations, and activities all in one place.',
    },
    {
      icon: Users,
      title: 'Family-Focused',
      description: 'Designed specifically for families with children of all ages.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your family\'s data is protected with enterprise-grade security.',
    },
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'Plan your perfect family trip in minutes, not hours.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-responsive py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Plan Perfect Family Trips with{' '}
                <span className="text-yellow-300">AI Magic</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
                Your AI-powered travel companion that creates personalized itineraries, 
                finds family-friendly activities, and handles all the planning details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/chat-plan"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Chat with AI Assistant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/plan-trip"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-6 py-4 text-lg font-semibold"
                >
                  Traditional Planning
                </Link>
                <Link
                  to="/login"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">AI Agent is planning your trip...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                    <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for the Perfect Family Trip
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial inspiration to final booking, our AI agents handle every aspect 
              of your family vacation planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 hover:shadow-medium transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planning your family trip has never been easier. Our AI agents work together 
              to create the perfect experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tell Us About Your Family
              </h3>
              <p className="text-gray-600">
                Share your family's interests, ages, budget, and travel preferences. 
                Our AI learns what makes your family unique.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI Agents Plan Your Trip
              </h3>
              <p className="text-gray-600">
                Our specialized agents work together to suggest destinations, 
                create itineraries, and find the best deals for your family.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Book & Enjoy Your Trip
              </h3>
              <p className="text-gray-600">
                Review your personalized itinerary, make any adjustments, 
                and book everything with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Plan Your Next Family Adventure?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust our AI to create unforgettable travel experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat-plan"
              className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Chat with AI Assistant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/plan-trip"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-6 py-4 text-lg font-semibold"
            >
              Traditional Planning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
