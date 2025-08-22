import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ChatInterface, { ChatMessage } from '@/components/ChatInterface';
import Button from '@/components/ui/Button';

interface TripData {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  familySize: number;
  budget: number;
  interests: string[];
  summary: string;
  itinerary?: any[];
  recommendations?: any[];
}

const ChatTripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'details'>('chat');

  useEffect(() => {
    // Load trip data from localStorage
    const savedTripData = localStorage.getItem(`trip-${id}`);
    if (savedTripData) {
      setTripData(JSON.parse(savedTripData));
    }

    // Load conversation history
    const savedMessages = localStorage.getItem(`chat-messages-${id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [id]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Save to localStorage
    localStorage.setItem(`chat-messages-${id}`, JSON.stringify(newMessages));
    
    setIsLoading(true);
    
    try {
      // Add loading message
      const loadingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };
      
      const messagesWithLoading = [...newMessages, loadingMessage];
      setMessages(messagesWithLoading);
      
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate response based on message content
      const response = generateResponse(message);
      
      // Update loading message with response
      const finalMessages = messagesWithLoading.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, content: response, isLoading: false }
          : msg
      );
      
      setMessages(finalMessages);
      localStorage.setItem(`chat-messages-${id}`, JSON.stringify(finalMessages));
      
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('schedule')) {
      return `Here's your current itinerary for ${tripData?.destination}:

Day 1: Arrival & Welcome
• Arrive at ${tripData?.destination}
• Check into your family-friendly accommodation
• Welcome dinner at a local restaurant

Day 2: Explore the City
• Morning: City tour suitable for all ages
• Afternoon: Visit family-friendly attractions
• Evening: Relax at your hotel

Day 3: Adventure Day
• Morning: Outdoor activities based on your interests
• Afternoon: Local market visit
• Evening: Family dinner

Would you like me to modify any part of this itinerary or add specific activities?`;
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
      return `Your trip budget is $${tripData?.budget?.toLocaleString()}. Here's a breakdown:

• Accommodation: ~$${Math.round(tripData?.budget * 0.4)} (40%)
• Transportation: ~$${Math.round(tripData?.budget * 0.25)} (25%)
• Activities & Attractions: ~$${Math.round(tripData?.budget * 0.2)} (20%)
• Food & Dining: ~$${Math.round(tripData?.budget * 0.15)} (15%)

I can help you find ways to optimize your budget or suggest alternative options!`;
    }
    
    if (lowerMessage.includes('recommendation') || lowerMessage.includes('suggest')) {
      return `Based on your family's interests in ${tripData?.interests?.join(', ')}, here are my top recommendations for ${tripData?.destination}:

• Family-friendly attractions that everyone will enjoy
• Restaurants with kid-friendly menus
• Activities suitable for your family size of ${tripData?.familySize} people
• Hidden gems that locals love

Would you like me to provide specific recommendations for any particular aspect of your trip?`;
    }
    
    return `I'm here to help you with your trip to ${tripData?.destination}! You can ask me about:

• Your itinerary and schedule
• Budget and cost breakdown
• Recommendations for activities and restaurants
• Travel tips and advice
• Modifications to your current plan

What would you like to know more about?`;
  };

  if (!tripData) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Link to="/chat-plan" className="btn-primary">
            Start New Trip Planning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/chat-dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Trip to {tripData.destination}
              </h1>
              <p className="text-sm text-gray-600">
                {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {activeTab === 'chat' ? (
          <div className="flex-1">
            <ChatInterface
              onSendMessage={handleSendMessage}
              messages={messages}
              isLoading={isLoading}
              placeholder="Ask me about your trip to ${tripData.destination}..."
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Trip Summary */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Summary</h2>
                  <p className="text-gray-600 mb-4">{tripData.summary}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{tripData.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{tripData.familySize} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">${tripData.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              {tripData.interests && tripData.interests.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {tripData.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setActiveTab('chat')}
                      className="w-full bg-primary-600 text-white hover:bg-primary-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ask Questions
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                    >
                      View Itinerary
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                    >
                      Book Activities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTripDetailPage;
