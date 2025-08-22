import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, MapPin, Calendar } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="container-responsive">
        <div className="max-w-md mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-6xl font-bold">
                404
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off on its own adventure.
          </p>

          {/* Quick Actions */}
          <div className="space-y-4 mb-8">
            <Link
              to="/"
              className="w-full btn-primary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            
            <Link
              to="/plan-trip"
              className="w-full btn-secondary flex items-center justify-center"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Plan a New Trip
            </Link>
            
            <Link
              to="/dashboard"
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Dashboard
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/plan-trip"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Plan Trip
              </Link>
              <Link
                to="/dashboard"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
