import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { tripService, TripPlanningRequest } from '@/services/tripService';


const TripPlanningPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    familySize: 4,
    childrenAges: [8, 5],
    interests: [] as string[],
    budget: 5000,
    destination: 'Walt Disney World Resort, Orlando',
    startDate: '',
    endDate: '',
    travelStyle: 'relaxed',
  });

  const totalSteps = 4;

  const interests = [
    'Beaches', 'Mountains', 'Cities', 'Museums', 'Adventure', 'Food', 
    'History', 'Nature', 'Shopping', 'Theme Parks', 'Sports', 'Culture'
  ];

  const travelStyles = [
    { value: 'relaxed', label: 'Relaxed', description: 'Peaceful and laid-back experiences' },
    { value: 'adventure', label: 'Adventure', description: 'Active and exciting activities' },
    { value: 'cultural', label: 'Cultural', description: 'Educational and historical sites' },
    { value: 'luxury', label: 'Luxury', description: 'Premium accommodations and experiences' },
  ];

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 3) {
      // Step 3 is trip details - validate required fields
      if (!formData.destination || formData.destination.trim() === '') {
        alert('Please enter a destination for your trip.');
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        alert('Please select start and end dates for your trip.');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form and start AI planning
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.destination || formData.destination.trim() === '') {
      alert('Please enter a destination for your trip.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert('Please select start and end dates for your trip.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the trip planning request
      const tripRequest: TripPlanningRequest = {
        familyProfile: {
          adults: formData.familySize - formData.childrenAges.length,
          children: formData.childrenAges.length,
          ages: formData.childrenAges,
          interests: formData.interests,
          dietaryRestrictions: [], // TODO: Add dietary restrictions to form
        },
        destination: formData.destination.trim(),
        budget: formData.budget,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tripType: 'family',
        accommodationType: 'hotel',
        transportation: 'flight',
        travelStyle: formData.travelStyle,
      };

      console.log('Submitting trip planning request:', tripRequest);

      // Call the trip service to start AI planning
      const result = await tripService.planTrip(tripRequest);
      
      if (result.success) {
        console.log('AI planning completed successfully:', result);
        
        // Store the trip data in localStorage for now (in a real app, this would go to a database)
        const tripId = `trip-${Date.now()}`;
        localStorage.setItem(`trip-${tripId}`, JSON.stringify(result.data));
        
        // Navigate to trip detail page
        navigate(`/trip/${tripId}`);
      } else {
        throw new Error(result.error || 'AI planning failed');
      }
    } catch (error) {
      console.error('Failed to start AI planning:', error);
      alert('Failed to start AI planning. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests;
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateFormData('interests', updatedInterests);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tell us about your family</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Size
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => updateFormData('familySize', Math.max(1, formData.familySize - 1))}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 rounded-full"
                    >
                      -
                    </Button>
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                      {formData.familySize}
                    </span>
                    <Button
                      onClick={() => updateFormData('familySize', formData.familySize + 1)}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children's Ages (if any)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.childrenAges.map((age, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => {
                            const newAges = [...formData.childrenAges];
                            newAges[index] = parseInt(e.target.value) || 0;
                            updateFormData('childrenAges', newAges);
                          }}
                          className="w-16 input text-center"
                          min="0"
                          max="18"
                        />
                        <span className="text-gray-600">years old</span>
                      </div>
                    ))}
                    <Button
                      onClick={() => updateFormData('childrenAges', [...formData.childrenAges, 5])}
                      variant="secondary"
                      size="sm"
                    >
                      Add Child
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What interests your family?</h3>
              <p className="text-gray-600 mb-4">Select all that apply to help us create personalized recommendations.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      formData.interests.includes(interest)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                    placeholder="e.g., Paris, France"
                    className="input"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter your desired destination</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={formData.budget}
                      onChange={(e) => updateFormData('budget', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$1,000</span>
                      <span className="font-semibold">${formData.budget.toLocaleString()}</span>
                      <span>$20,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Style</h3>
              <p className="text-gray-600 mb-4">How would you like to experience your destination?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {travelStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateFormData('travelStyle', style.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      formData.travelStyle === style.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <h4 className="text-lg font-semibold text-gray-900">Ready to Start Planning!</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Our AI agents will analyze your preferences and create a personalized trip plan 
                with recommendations for destinations, activities, and accommodations.
              </p>
              <div className="text-sm text-gray-600">
                <p>• Family size: {formData.familySize} people</p>
                <p>• Budget: ${formData.budget.toLocaleString()}</p>
                <p>• Interests: {formData.interests.join(', ') || 'None selected'}</p>
                {formData.destination && <p>• Destination: {formData.destination}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Plan Your Family Trip</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {currentStep === totalSteps ? (
                <>
                  {isSubmitting ? 'Starting AI Planning...' : 'Start AI Planning'}
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripPlanningPage;
