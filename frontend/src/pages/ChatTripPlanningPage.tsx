import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface, { ChatMessage } from '@/components/ChatInterface';
import { tripService, TripPlanningRequest } from '@/services/tripService';

const ChatTripPlanningPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your Family Trip Assistant. I'll help you plan the perfect vacation for your family.

To get started, tell me:
• Where you'd like to go
• When you want to travel
• How many people (adults and children)
• Your budget
• What interests your family

You can share this information however you'd like - I'll ask follow-up questions to gather all the details I need!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const addMessage = (content: string, role: 'user' | 'assistant', isLoading = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      isLoading,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const updateLastMessage = (content: string, isLoading = false) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content,
          isLoading,
        };
      }
      return newMessages;
    });
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage(message, 'user');
    
    setIsLoading(true);
    
    try {
      // Add loading message
      const loadingMessage = addMessage('', 'assistant', true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process the message and generate response
      const response = await processUserMessage(message);
      
      // Update the loading message with the actual response
      updateLastMessage(response, false);
      
      // If we have enough information, start planning
      if (tripData && isReadyToPlan()) {
        await startTripPlanning();
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      updateLastMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserMessage = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Extract information from the message
    const extractedInfo = extractTripInfo(message);
    
    // Update trip data
    setTripData(prev => ({ ...prev, ...extractedInfo }));
    
    // Generate appropriate response based on what we have
    return generateResponse(extractedInfo, tripData);
  };

  const extractTripInfo = (message: string) => {
    const info: any = {};
    const lowerMessage = message.toLowerCase();
    
    // First, try to extract structured format like "destination (tel aviv) travel dates (august) family size (5) budget (1500$)"
    const structuredPattern = /destination\s*\(([^)]+)\)\s*travel dates?\s*\(([^)]+)\)\s*family size\s*\((\d+)\)\s*budget\s*\(([^)]+)\)/i;
    const structuredMatch = message.match(structuredPattern);
    
    if (structuredMatch) {
      info.destination = structuredMatch[1].trim();
      const dateValue = structuredMatch[2].trim().toLowerCase();
      const familySize = parseInt(structuredMatch[3]);
      const budgetValue = structuredMatch[4].trim();
      
      // Process date
      const monthMap: { [key: string]: string } = {
        'january': '2024-01-01', 'february': '2024-02-01', 'march': '2024-03-01',
        'april': '2024-04-01', 'may': '2024-05-01', 'june': '2024-06-01',
        'july': '2024-07-01', 'august': '2024-08-01', 'september': '2024-09-01',
        'october': '2024-10-01', 'november': '2024-11-01', 'december': '2024-12-01',
        'jan': '2024-01-01', 'feb': '2024-02-01', 'mar': '2024-03-01',
        'apr': '2024-04-01', 'jun': '2024-06-01', 'jul': '2024-07-01',
        'aug': '2024-08-01', 'sep': '2024-09-01', 'oct': '2024-10-01',
        'nov': '2024-11-01', 'dec': '2024-12-01'
      };
      
      info.startDate = monthMap[dateValue] || dateValue;
      info.endDate = monthMap[dateValue] || dateValue;
      info.familySize = familySize;
      
      // Process budget
      const budgetMatch = budgetValue.match(/(\d+)/);
      if (budgetMatch) {
        info.budget = parseInt(budgetMatch[1]);
      }
      
      console.log('Structured match found:', info);
      return info;
    }
    
    // Extract destination - handle multiple formats
    let destinationMatch = message.match(/destination\s*\(([^)]+)\)/i);
    if (!destinationMatch) {
      destinationMatch = message.match(/(?:go to|visit|travel to|destination|place)\s+([^,\.]+)/i);
    }
    if (destinationMatch) {
      info.destination = destinationMatch[1].trim();
    }
    
    // Extract dates - handle multiple formats
    let dateMatch = message.match(/travel dates?\s*\(([^)]+)\)/i);
    if (!dateMatch) {
      dateMatch = message.match(/(?:from|between)\s+([^,\.]+)\s+(?:to|until)\s+([^,\.]+)/i);
    }
    if (dateMatch) {
      const dateValue = dateMatch[1].trim().toLowerCase();
      
      // Handle month names
      const monthMap: { [key: string]: string } = {
        'january': '2024-01-01',
        'february': '2024-02-01',
        'march': '2024-03-01',
        'april': '2024-04-01',
        'may': '2024-05-01',
        'june': '2024-06-01',
        'july': '2024-07-01',
        'august': '2024-08-01',
        'september': '2024-09-01',
        'october': '2024-10-01',
        'november': '2024-11-01',
        'december': '2024-12-01',
        'jan': '2024-01-01',
        'feb': '2024-02-01',
        'mar': '2024-03-01',
        'apr': '2024-04-01',
        'jun': '2024-06-01',
        'jul': '2024-07-01',
        'aug': '2024-08-01',
        'sep': '2024-09-01',
        'oct': '2024-10-01',
        'nov': '2024-11-01',
        'dec': '2024-12-01'
      };
      
      if (dateValue.includes(' to ') || dateValue.includes('-')) {
        // Handle date ranges
        const dateRange = dateValue.split(/\s+(?:to|-)\s+/);
        const startDate = monthMap[dateRange[0]] || dateRange[0];
        const endDate = monthMap[dateRange[1]] || dateRange[1] || startDate;
        info.startDate = startDate;
        info.endDate = endDate;
      } else {
        // Single date or month
        const processedDate = monthMap[dateValue] || dateValue;
        info.startDate = processedDate;
        info.endDate = processedDate;
      }
    }
    
    // Extract family size - handle multiple formats
    let familyMatch = message.match(/family size\s*\((\d+)\)/i);
    if (!familyMatch) {
      familyMatch = message.match(/(\d+)\s+(?:people|family members|adults?)/i);
    }
    if (familyMatch) {
      info.familySize = parseInt(familyMatch[1]);
    }
    
    // Extract children
    const childrenMatch = message.match(/(\d+)\s+children?/i);
    if (childrenMatch) {
      info.children = parseInt(childrenMatch[1]);
    }
    
    // Extract budget - handle multiple formats
    let budgetMatch = message.match(/budget\s*\(\$?(\d+(?:,\d+)?)\)/i);
    if (!budgetMatch) {
      budgetMatch = message.match(/\$?(\d+(?:,\d+)?)\s*(?:dollars?|budget)/i);
    }
    if (!budgetMatch) {
      // Also look for budget in the format "1500$"
      budgetMatch = message.match(/(\d+)\$/i);
    }
    if (budgetMatch) {
      info.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    }
    
    // Extract interests
    const interests = ['beach', 'mountain', 'city', 'museum', 'adventure', 'food', 'history', 'nature', 'shopping', 'theme park', 'sport', 'culture'];
    const foundInterests = interests.filter(interest => lowerMessage.includes(interest));
    if (foundInterests.length > 0) {
      info.interests = foundInterests;
    }
    
    // Debug logging
    console.log('Extracted info:', info);
    
    return info;
  };

  const generateResponse = (newInfo: any, currentData: any): string => {
    const combinedData = { ...currentData, ...newInfo };
    
    // Debug logging
    console.log('Combined data:', combinedData);
    
    // Check what information we're missing
    const missing = [];
    if (!combinedData.destination) missing.push('destination');
    if (!combinedData.startDate || !combinedData.endDate) missing.push('travel dates');
    if (!combinedData.familySize) missing.push('family size');
    if (!combinedData.budget) missing.push('budget');
    
    if (missing.length > 0) {
      const missingList = missing.join(', ');
      return `Thanks for sharing that information! To help me plan your perfect trip, I still need to know about: ${missingList}.

Could you please provide these details?`;
    }
    
    // If we have all the basics, ask for more details
    if (!combinedData.interests || combinedData.interests.length === 0) {
      return `Great! I have all the basic information. Now tell me what interests your family - do you enjoy beaches, mountains, cities, museums, adventure activities, food experiences, historical sites, nature, shopping, theme parks, sports, or cultural experiences?`;
    }
    
    // If we have all the basics, ask for more details
    if (!combinedData.interests || combinedData.interests.length === 0) {
      return `Great! I have the basics. Now tell me what interests your family - do you enjoy beaches, mountains, cities, museums, adventure activities, food experiences, historical sites, nature, shopping, theme parks, sports, or cultural experiences?`;
    }
    
    // If we have everything, confirm and offer to start planning
    return `Perfect! I have all the information I need to start planning your family trip:

• Destination: ${combinedData.destination}
• Travel dates: ${combinedData.startDate} to ${combinedData.endDate}
• Family size: ${combinedData.familySize} people
• Budget: $${combinedData.budget?.toLocaleString()}
${combinedData.interests?.length > 0 ? `• Interests: ${combinedData.interests.join(', ')}` : ''}

Would you like me to start creating your personalized trip plan now?`;
  };

  const isReadyToPlan = (): boolean => {
    return tripData && 
           tripData.destination && 
           tripData.startDate && 
           tripData.endDate && 
           tripData.familySize && 
           tripData.budget;
  };

  const startTripPlanning = async () => {
    setIsLoading(true);
    
    try {
      const loadingMessage = addMessage('Creating your personalized trip plan...', 'assistant', true);
      
      // Prepare the trip planning request
      const tripRequest: TripPlanningRequest = {
        familyProfile: {
          adults: tripData.familySize - (tripData.children || 0),
          children: tripData.children || 0,
          ages: [], // TODO: Extract ages from conversation
          interests: tripData.interests || [],
          dietaryRestrictions: [],
        },
        destination: tripData.destination,
        budget: tripData.budget,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        tripType: 'family',
        accommodationType: 'hotel',
        transportation: 'flight',
        travelStyle: 'relaxed',
      };

      // Call the trip service
      const result = await tripService.planTrip(tripRequest);
      
      if (result.success) {
        // Store the trip data
        const tripId = `trip-${Date.now()}`;
        localStorage.setItem(`trip-${tripId}`, JSON.stringify(result.data));
        
        // Update the loading message with success
        updateLastMessage(`Excellent! I've created your personalized trip plan. Here's what I've prepared for you:

${result.data?.summary || 'Your trip plan is ready!'}

I'll now take you to your trip details page where you can see the full itinerary, recommendations, and booking options.`, false);
        
        // Navigate to chat trip detail page after a short delay
        setTimeout(() => {
          navigate(`/chat-trip/${tripId}`);
        }, 3000);
        
      } else {
        throw new Error(result.error || 'Trip planning failed');
      }
      
    } catch (error) {
      console.error('Failed to plan trip:', error);
      updateLastMessage('Sorry, I encountered an error while creating your trip plan. Please try again or contact support.', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Family Trip Assistant</h1>
            <p className="text-sm text-gray-600">Let's plan your perfect family vacation together</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI Assistant Online</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface
          onSendMessage={handleSendMessage}
          messages={messages}
          isLoading={isLoading}
          placeholder="Tell me about your dream family trip..."
        />
      </div>
    </div>
  );
};

export default ChatTripPlanningPage;
