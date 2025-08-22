import { useState } from 'react';
import { Plus, X, Users, DollarSign, Heart } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  interests: string[];
}

interface FamilyPreferences {
  budget: number;
  travelStyle: 'budget' | 'comfort' | 'luxury';
  preferredDestinations: string[];
  interests: string[];
  accessibility: boolean;
  petFriendly: boolean;
  dietaryRestrictions: string[];
}

interface FamilyProfileFormProps {
  initialData?: {
    familyMembers: FamilyMember[];
    preferences: FamilyPreferences;
  };
  onSave: (data: { familyMembers: FamilyMember[]; preferences: FamilyPreferences }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FamilyProfileForm = ({ initialData, onSave, onCancel, isLoading = false }: FamilyProfileFormProps) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    initialData?.familyMembers || [
      { id: '1', name: '', age: 0, relationship: 'Self', interests: [] }
    ]
  );
  
  const [preferences, setPreferences] = useState<FamilyPreferences>(
    initialData?.preferences || {
      budget: 5000,
      travelStyle: 'comfort',
      preferredDestinations: [],
      interests: [],
      accessibility: false,
      petFriendly: false,
      dietaryRestrictions: [],
    }
  );

  const [activeTab, setActiveTab] = useState<'members' | 'preferences'>('members');

  const relationshipOptions = [
    'Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Other'
  ];

  const travelStyleOptions = [
    { value: 'budget', label: 'Budget', description: 'Cost-effective options' },
    { value: 'comfort', label: 'Comfort', description: 'Balanced comfort and cost' },
    { value: 'luxury', label: 'Luxury', description: 'Premium experiences' },
  ];

  const interestOptions = [
    'Beaches', 'Mountains', 'Cities', 'Museums', 'Adventure', 'Food', 
    'History', 'Nature', 'Shopping', 'Theme Parks', 'Sports', 'Culture',
    'Relaxation', 'Photography', 'Music', 'Art', 'Technology', 'Fitness'
  ];

  const destinationOptions = [
    'Beach Destinations', 'Mountain Retreats', 'City Breaks', 'Cultural Sites',
    'Adventure Locations', 'Family Resorts', 'Historical Places', 'Nature Parks'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
    'Halal', 'Kosher', 'Low-Sodium', 'Diabetic-Friendly', 'None'
  ];

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: '',
      age: 0,
      relationship: 'Other',
      interests: [],
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
    }
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const toggleInterest = (memberId: string, interest: string) => {
    setFamilyMembers(familyMembers.map(member => {
      if (member.id === memberId) {
        const interests = member.interests.includes(interest)
          ? member.interests.filter(i => i !== interest)
          : [...member.interests, interest];
        return { ...member, interests };
      }
      return member;
    }));
  };

  const togglePreferenceInterest = (interest: string) => {
    const interests = preferences.interests.includes(interest)
      ? preferences.interests.filter(i => i !== interest)
      : [...preferences.interests, interest];
    setPreferences({ ...preferences, interests });
  };

  const toggleDestination = (destination: string) => {
    const preferredDestinations = preferences.preferredDestinations.includes(destination)
      ? preferences.preferredDestinations.filter(d => d !== destination)
      : [...preferences.preferredDestinations, destination];
    setPreferences({ ...preferences, preferredDestinations });
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const dietaryRestrictions = preferences.dietaryRestrictions.includes(restriction)
      ? preferences.dietaryRestrictions.filter(d => d !== restriction)
      : [...preferences.dietaryRestrictions, restriction];
    setPreferences({ ...preferences, dietaryRestrictions });
  };

  const handleSave = () => {
    onSave({ familyMembers, preferences });
  };

  const isValid = familyMembers.every(member => member.name.trim() && member.age > 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Profile</h1>
        <p className="text-gray-600">
          Tell us about your family to get personalized travel recommendations.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Family Members
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'preferences'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Heart className="w-4 h-4 mr-2" />
            Preferences
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add all family members who will be traveling together.
              </p>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                {familyMembers.map((member, index) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Family Member {index + 1}</h4>
                      {familyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                          className="input"
                          placeholder="Enter name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(member.id, 'age', parseInt(e.target.value) || 0)}
                          className="input"
                          min="0"
                          max="120"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <select
                          value={member.relationship}
                          onChange={(e) => updateFamilyMember(member.id, 'relationship', e.target.value)}
                          className="input"
                        >
                          {relationshipOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {interestOptions.map(interest => (
                          <label key={interest} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={member.interests.includes(interest)}
                              onChange={() => toggleInterest(member.id, interest)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addFamilyMember}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Family Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Budget and Travel Style */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Travel Preferences</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <div className="flex items-center space-x-4">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="1000"
                      value={preferences.budget}
                      onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      ${preferences.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Style
                  </label>
                  <div className="space-y-2">
                    {travelStyleOptions.map(style => (
                      <label key={style.value} className="flex items-center">
                        <input
                          type="radio"
                          name="travelStyle"
                          value={style.value}
                          checked={preferences.travelStyle === style.value}
                          onChange={(e) => setPreferences({ ...preferences, travelStyle: e.target.value as any })}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{style.label}</div>
                          <div className="text-sm text-gray-500">{style.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Family Interests</h3>
              <p className="text-sm text-gray-600 mt-1">
                Select activities and experiences your family enjoys.
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestOptions.map(interest => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.interests.includes(interest)}
                      onChange={() => togglePreferenceInterest(interest)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Preferred Destinations */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Preferred Destinations</h3>
              <p className="text-sm text-gray-600 mt-1">
                What types of destinations does your family prefer?
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destinationOptions.map(destination => (
                  <label key={destination} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.preferredDestinations.includes(destination)}
                      onChange={() => toggleDestination(destination)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{destination}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Special Requirements</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Accessibility Needs</h4>
                    <p className="text-sm text-gray-600">Wheelchair access, mobility assistance, etc.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility}
                    onChange={(e) => setPreferences({ ...preferences, accessibility: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Pet-Friendly</h4>
                    <p className="text-sm text-gray-600">Traveling with pets</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.petFriendly}
                    onChange={(e) => setPreferences({ ...preferences, petFriendly: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Dietary Restrictions</h3>
              <p className="text-sm text-gray-600 mt-1">
                Any dietary requirements for your family?
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryOptions.map(restriction => (
                  <label key={restriction} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.dietaryRestrictions.includes(restriction)}
                      onChange={() => toggleDietaryRestriction(restriction)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{restriction}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid || isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Saving...' : 'Save Family Profile'}
        </button>
      </div>
    </div>
  );
};

export default FamilyProfileForm;
