import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageCircle, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  tripData?: {
    destination?: string;
    familySize?: number;
    startDate?: string;
    endDate?: string;
  };
}

const ChatDashboardPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('chat-conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  const startNewConversation = () => {
    // Navigate to chat planning page
    window.location.href = '/chat-plan';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.tripData?.destination) {
      return `Trip to ${conversation.tripData.destination}`;
    }
    return conversation.title || 'New Conversation';
  };

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Dashboard</h1>
            <p className="text-gray-600 mt-2">Your AI travel planning conversations</p>
          </div>
          <Button
            onClick={startNewConversation}
            className="bg-primary-600 text-white hover:bg-primary-700 px-6 py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Quick Start Card */}
      <Card className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to plan your next family adventure?
              </h3>
              <p className="text-gray-600 mb-4">
                Chat with our AI assistant to create personalized trip plans, get recommendations, 
                and find the best deals for your family.
              </p>
              <Button
                onClick={startNewConversation}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start New Chat
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-primary-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Conversations
        </h2>
        
        {conversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your first conversation with our AI assistant to plan your family trip.
              </p>
              <Button
                onClick={startNewConversation}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Planning
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getConversationTitle(conversation)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(conversation.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                      
                      {conversation.tripData && (
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {conversation.tripData.destination && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{conversation.tripData.destination}</span>
                            </div>
                          )}
                          {conversation.tripData.familySize && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{conversation.tripData.familySize} people</span>
                            </div>
                          )}
                          {conversation.tripData.startDate && conversation.tripData.endDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(conversation.tripData.startDate).toLocaleDateString()} - {new Date(conversation.tripData.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/chat-plan?conversation=${conversation.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          What you can do with our AI Assistant
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Destination Discovery
              </h3>
              <p className="text-gray-600">
                Get personalized destination recommendations based on your family's interests, 
                budget, and travel style.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Itinerary Planning
              </h3>
              <p className="text-gray-600">
                Create detailed day-by-day itineraries with activities suitable for all family members.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Family-Focused Advice
              </h3>
              <p className="text-gray-600">
                Get tips and recommendations specifically tailored for families with children.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboardPage;
