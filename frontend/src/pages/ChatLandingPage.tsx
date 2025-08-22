import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, ArrowRight, Bot, Users, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ChatLandingPage = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Conversations',
      description: 'Natural chat interface that understands your family\'s needs and preferences.',
    },
    {
      icon: MapPin,
      title: 'Smart Destination Discovery',
      description: 'Get personalized recommendations based on your family\'s interests and budget.',
    },
    {
      icon: Calendar,
      title: 'Intelligent Itinerary Planning',
      description: 'AI creates detailed day-by-day schedules suitable for all family members.',
    },
    {
      icon: Users,
      title: 'Family-Focused Advice',
      description: 'Expert tips and recommendations specifically tailored for families with children.',
    },
  ];

  const conversationExamples = [
    {
      user: "We want to go to Europe with our 2 kids (ages 8 and 5) this summer. Budget around $8000.",
      assistant: "Great choice! Europe is perfect for families. For $8000, I'd recommend starting with 2-3 countries. Would you prefer cities (Paris, Rome) or more nature-focused destinations? Also, what interests your family - museums, outdoor activities, or theme parks?"
    },
    {
      user: "We love outdoor activities and want to see some historical sites too.",
      assistant: "Perfect! I'd suggest Switzerland and Italy. Switzerland for outdoor adventures (hiking, lakes) and Italy for history (Rome, Florence). Here's a 12-day itinerary: 4 days in Switzerland, 8 in Italy. Should I start planning the details?"
    },
    {
      user: "That sounds amazing! Can you include some kid-friendly activities?",
      assistant: "Absolutely! I'll include: Swiss chocolate factory tours, Lake Como boat rides, Rome's gladiator school for kids, and Florence's interactive museums. Plus family-friendly hotels and restaurants. Ready to create your full itinerary?"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-responsive py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">AI Travel Assistant</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Plan Your Family Trip Through{' '}
                <span className="text-yellow-300">Natural Conversation</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
                Just chat with our AI assistant like you would with a travel expert. 
                Tell us about your family, and we'll create the perfect trip together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/chat-plan"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Start Chatting Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/chat-dashboard"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-semibold"
                >
                  View Conversations
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Chat Interface Preview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">AI Assistant is online</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-white/20 rounded-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm">Hi! I'm here to help plan your family trip. Where would you like to go?</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-white text-primary-700 rounded-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm">We want to visit Europe with our kids this summer!</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white/20 rounded-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm">Excellent choice! How many children and what are their ages?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversation Example */}
      <section className="py-24 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              See How Easy It Is
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Just have a natural conversation with our AI assistant. No forms, no complicated steps - 
              just tell us what you want and we'll plan your perfect family trip.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary-200">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {conversationExamples.map((example, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-primary-600 text-white rounded-2xl px-4 py-3 max-w-md">
                          <p className="text-sm">{example.user}</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-3 max-w-md">
                          <p className="text-sm">{example.assistant}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Chat-Based Planning?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional travel planning is complicated. Our chat interface makes it simple, 
              natural, and enjoyable - just like talking to a knowledgeable travel friend.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="container-responsive text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Plan Your Family Adventure?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of families who have discovered the joy of AI-powered travel planning. 
              Start your conversation today and create memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat-plan"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Chatting Now
              </Link>
              <Link
                to="/plan-trip"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-semibold"
              >
                Traditional Planning
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatLandingPage;
