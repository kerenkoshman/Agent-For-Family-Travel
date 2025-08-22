import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';

import Badge from '@/components/ui/Badge';
import { Search, MapPin, Star } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  familyScore: number;
  bestTimeToVisit: string;
  averageCost: string;
  tags: string[];
}

interface DestinationSelectorProps {
  selectedDestination?: Destination;
  onDestinationSelect: (destination: Destination) => void;
  familySize?: number;
  budget?: string;
  interests?: string[];
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  selectedDestination,
  onDestinationSelect,
  budget = 'medium'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock destinations data
  const destinations: Destination[] = [
    {
      id: '1',
      name: 'Disney World',
      country: 'United States',
      description: 'The most magical place on earth with attractions for all ages.',
      image: '/images/disney-world.jpg',
      rating: 4.8,
      familyScore: 9.5,
      bestTimeToVisit: 'September - November',
      averageCost: '$3000-5000',
      tags: ['theme-park', 'family-friendly', 'entertainment']
    },
    {
      id: '2',
      name: 'Paris',
      country: 'France',
      description: 'The city of love with rich culture, history, and amazing food.',
      image: '/images/paris.jpg',
      rating: 4.6,
      familyScore: 8.2,
      bestTimeToVisit: 'April - June',
      averageCost: '$4000-6000',
      tags: ['culture', 'history', 'food', 'romance']
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      description: 'A perfect blend of traditional culture and modern technology.',
      image: '/images/tokyo.jpg',
      rating: 4.7,
      familyScore: 8.8,
      bestTimeToVisit: 'March - May',
      averageCost: '$3500-5500',
      tags: ['culture', 'technology', 'food', 'family-friendly']
    },
    {
      id: '4',
      name: 'Costa Rica',
      country: 'Costa Rica',
      description: 'Adventure and nature combined with beautiful beaches and wildlife.',
      image: '/images/costa-rica.jpg',
      rating: 4.5,
      familyScore: 8.5,
      bestTimeToVisit: 'December - April',
      averageCost: '$2500-4000',
      tags: ['adventure', 'nature', 'beach', 'wildlife']
    }
  ];

  const allTags = Array.from(new Set(destinations.flatMap(d => d.tags)));

  useEffect(() => {
    let filtered = destinations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(dest =>
        selectedTags.some(tag => dest.tags.includes(tag))
      );
    }

    // Filter by budget
    if (budget === 'low') {
      filtered = filtered.filter(dest => dest.averageCost.includes('2500'));
    } else if (budget === 'high') {
      filtered = filtered.filter(dest => dest.averageCost.includes('6000'));
    }

    setFilteredDestinations(filtered);
  }, [searchQuery, selectedTags, budget]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getFamilyScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
        />
        
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => toggleTag(tag)}
            >
              {tag.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map(destination => (
          <Card
            key={destination.id}
            variant={selectedDestination?.id === destination.id ? 'elevated' : 'default'}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDestination?.id === destination.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onDestinationSelect(destination)}
          >
            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-600">{destination.country}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {destination.rating}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {destination.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Family Score:</span>
                  <span className={`font-medium ${getFamilyScoreColor(destination.familyScore)}`}>
                    {destination.familyScore}/10
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Best Time:</span>
                  <span className="font-medium">{destination.bestTimeToVisit}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Avg Cost:</span>
                  <span className="font-medium">{destination.averageCost}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {destination.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default DestinationSelector;
