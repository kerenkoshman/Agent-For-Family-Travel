import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const TripPlanningPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    familySize: 4,
    childrenAges: [8, 5],
    interests: [] as string[],
    budget: 5000,
    destination: '',
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

  const handleSubmit = () => {
    // TODO: Submit to backend and start AI planning
    console.log('Form submitted:', formData);
    navigate('/dashboard');
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
                    <button
                      onClick={() => updateFormData('familySize', Math.max(1, formData.familySize - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                      {formData.familySize}
                    </span>
                    <button
                      onClick={() => updateFormData('familySize', formData.familySize + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500"
                    >
                      +
                    </button>
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
                    <button
                      onClick={() => updateFormData('childrenAges', [...formData.childrenAges, 5])}
                      className="btn-secondary btn-sm"
                    >
                      Add Child
                    </button>
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
                    Destination (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                    placeholder="e.g., Paris, France"
                    className="input"
                  />
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
        <div className="card p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentStep === totalSteps ? (
                <>
                  Start AI Planning
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanningPage;
