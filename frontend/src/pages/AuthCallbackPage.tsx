import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(errorParam);
          setStatus('error');
          return;
        }

        if (!token || !userParam) {
          setError('Missing authentication data');
          setStatus('error');
          return;
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Update auth context
        login(userData);

        setStatus('success');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);

      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Failed to process authentication');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [searchParams, login, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your authentication.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign In Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Welcome to Family Trip Agent. Redirecting you to your dashboard...
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign In Failed
            </h2>
            <p className="text-gray-600 mb-4">
              {error || 'An error occurred during authentication.'}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">FT</span>
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Family Trip Agent
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
