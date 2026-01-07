import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Globe, Users, Trophy, Award, ChevronRight, MapPin, Clock, DollarSign, Info, ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import LiveDebateSelection from '@/components/LiveDebateSelection';
import CreateCommittee from '@/components/CreateCommittee';
import PricingPage from '@/components/PricingPage';
import Resources from '@/components/Resources';
import ScoresTokens from '@/components/ScoresTokens';
import PublicSpeakingActivities from '@/components/PublicSpeakingActivities';
import DebatesHub from '@/components/DebatesHub';
import HumanDebateRoom from '@/components/HumanDebateRoom';
import DebateHistoryViewer from '@/components/DebateHistoryViewer';
import DebateDetailView from '../DebateDetailView.js';
import EventDetailView from '../EventDetailView.js';
import InstantDebateSetup from '@/components/InstantDebateSetup';
import InstantDebateRoom from '@/components/InstantDebateRoom';
import ChanakyaDebateSetup from '@/components/ChanakyaDebateSetup';
import ChanakyaDebateRoom from '@/components/ChanakyaDebateRoom';
import AICoach from '@/components/AICoach';
import { ErrorBoundary } from '../ErrorBoundary';
import OneOnOneDebateHub from '@/components/debate/one-on-one/OneOnOneDebateHub';
import ProgressTracking from '@/components/ProgressTracking';

interface UtilityViewsProps {
  currentView: string;
  userTokens: number;
  selectedDebate?: any;
  selectedEvent?: any;
  instantDebateConfig: {
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  } | null;
  chanakyaDebateConfig: {
    topic: string;
    topicType: 'custom' | 'scenario';
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty: 'easy' | 'medium' | 'hard';
    customTopic?: string;
    scenario?: string;
  } | null;
  handlers: {
    handleLiveDebateFormatSelect: (format: '1v1' | '3v3', language: string) => void;
    handleBackToDashboard: () => void;
    handleViewDebate?: (debate: any) => void;
    handleBackToDebateHistory?: () => void;
    handleInstantDebateStart: (config: any) => void;
    handleInstantDebateBack: () => void;
    handleInstantDebateComplete: (config: any, messages: any[]) => void;
    handleChanakyaDebateStart: (config: any) => void;
    handleChanakyaDebateBack: () => void;
    handleChanakyaDebateComplete: (config: any, messages: any[]) => void;
    handleViewEvent?: (event: any) => void;
    handleBackToEvents?: () => void;
    handleProgressTracking?: () => void;
  };
}

const UtilityViews = ({ currentView, userTokens, selectedDebate, selectedEvent, instantDebateConfig, chanakyaDebateConfig, handlers }: UtilityViewsProps) => {
  const [copiedEventId, setCopiedEventId] = useState<number | null>(null);

  const getEventSlug = (eventTitle: string): string => {
    return eventTitle.toLowerCase().replace(/\s+/g, '-');
  };

  const getEventLink = (event: any): string => {
    const slug = getEventSlug(event.title);
    return `${window.location.origin}/event/${slug}`;
  };

  const copyToClipboard = (text: string, eventId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedEventId(eventId);
    setTimeout(() => setCopiedEventId(null), 2000);
  };

  // Event data
  const events = [
    {
      id: 1,
      title: "SYM MUN",
      emoji: "🤖",
      shortDesc: "World's First AI-Powered Model United Nations",
      partner: "In association with Career Launcher",
      date: "Coming Soon",
      format: "Hybrid Event",
      participants: "Open to All",
      status: "Registration Open",
      statusColor: "green",
      price: 1800,
      theme: "from-blue-50 via-indigo-50 to-white",
      gradientColor: "from-blue-500 to-indigo-600",
      iconBg: "from-blue-500 to-indigo-600",
      badges: [
        { text: "UNSC", color: "bg-blue-100 text-blue-800" },
        { text: "WHO", color: "bg-green-100 text-green-800" },
        { text: "Free Training", color: "bg-purple-100 text-purple-800" }
      ],
      fullDescription: "Experience the revolutionary SYM MUN - the world's first AI-powered Model United Nations conference. Combining traditional diplomatic training with cutting-edge AI technology to provide unprecedented learning opportunities.",
      whyAiPowered: [
        {
          title: "Live Assistance During Prep",
          description: "Get AI support for research, speeches, and POIs in real-time",
          icon: "🎯"
        },
        {
          title: "Performance Insights",
          description: "Receive detailed analysis on confidence, structure, and diplomacy",
          icon: "📊"
        },
        {
          title: "Faster Learning",
          description: "Beginners learn faster, experienced delegates gain competitive edge",
          icon: "⚡"
        }
      ],
      committees: [
        {
          name: "UNSC",
          fullName: "United Nations Security Council",
          description: "Crisis diplomacy, real-time negotiations, power politics.",
          icon: "🌐"
        },
        {
          name: "WHO",
          fullName: "World Health Organization",
          description: "Public health, outbreak response, policy + collaboration.",
          icon: "🏥"
        }
      ],
      freeTraining: {
        title: "Free Training Program",
        subtitle: "Beginner to Pro",
        features: [
          "MUN rules + procedure",
          "Country research + position paper support",
          "Speech writing techniques",
          "Mock committee practice sessions"
        ]
      },
      typeformFields: [
        "Full Name",
        "Phone (WhatsApp)",
        "Email",
        "School/College/Organisation",
        "City",
        "Grade/Year (optional)",
        "Committee Preference: UNSC / WHO / Any",
        "Experience Level: Beginner / Intermediate / Advanced",
        "Have you attended MUN before? Yes/No",
        "Consent: I agree to receive event updates from SYM"
      ],
      faqs: [
        {
          question: "Who can participate?",
          answer: "SYM MUN is open to students of all levels - from high school to college. Whether you're a complete beginner or an experienced delegate, you're welcome!"
        },
        {
          question: "Do I need experience?",
          answer: "No prior MUN experience is required. We provide comprehensive free training covering everything from basics to advanced techniques."
        },
        {
          question: "Is training really free?",
          answer: "Yes! All registered participants get access to our complete training program including orientation, procedure training, research support, and mock sessions - completely free."
        },
        {
          question: "How do I get my country/allotment?",
          answer: "After successful registration, you'll receive your country allotment and committee details via email and WhatsApp within 48 hours."
        }
      ],
      features: [
        "AI-powered debate assistance",
        "Real-time performance analytics",
        "Professional diplomatic training",
        "Interactive committee simulations",
        "Certificate of participation"
      ],
      schedule: [
        { time: "TBA", event: "Opening Ceremony & Registration" },
        { time: "TBA", event: "Committee Sessions Begin" },
        { time: "TBA", event: "Crisis Committees" },
        { time: "TBA", event: "Closing Ceremony & Awards" }
      ],
      registrationFee: "₹1800",
      contact: "contact@speakyourmind.in"
    }
  ];



  switch (currentView) {
    case 'ai-coach':
      return <AICoach onBack={handlers.handleBackToDashboard} />;

    case 'one-on-one':
      return <OneOnOneDebateHub onBack={handlers.handleBackToDashboard} />;

    case 'progress-tracking':
      return <ProgressTracking onBack={handlers.handleBackToDashboard} />;
      
    case 'live-debate-selection':
      return (
        <LiveDebateSelection
          onFormatSelect={handlers.handleLiveDebateFormatSelect}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'create-debate-room':
      return <CreateCommittee onBack={handlers.handleBackToDashboard} />;

    case 'events':
      return (
        <>
        <div className="min-h-screen bg-gray-950 relative overflow-hidden">
          {/* Cyberpunk Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
          
          <div className="relative max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-cyan-400/20 border border-cyan-400/30 rounded-2xl">
                    <Calendar className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold font-orbitron neon-text">
                      Debate Events
                    </h1>
                    <p className="text-gray-300 text-lg font-inter">Discover upcoming tournaments and competitions</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handlers.handleBackToDashboard}
                className="btn-neon-secondary"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>

            {/* Events Grid */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold font-orbitron neon-text">
                  Upcoming Events
                </h2>
                <p className="text-gray-300 text-lg font-inter max-w-2xl mx-auto">
                  Join our vibrant community of debaters in these exciting events
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
                {events.map((event) => (
                  <div key={event.id} className="card-neon group hover:shadow-neon transition-all duration-500 cursor-pointer hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-xl"></div>
                    
                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-cyan-400/30 p-3 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                            <Globe className="h-8 w-8 text-cyan-400" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {event.badges.map((badge, index) => (
                            <span key={index} className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-xs font-medium">
                              {badge.text}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 mb-2 font-orbitron">
                        {event.emoji} {event.title}
                      </h3>
                      
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-base leading-relaxed font-inter mb-3">
                        {event.shortDesc}
                      </p>
                      
                      {event.partner && (
                        <p className="text-cyan-400 text-sm font-medium mb-4 font-inter">
                          {event.partner}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative z-10 px-6 pb-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          <div className="relative mr-3">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></div>
                          </div>
                          <span className="font-medium">{event.date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          <Globe className="h-4 w-4 text-cyan-400 mr-3" />
                          <span className="font-medium">{event.format}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handlers.handleViewEvent && handlers.handleViewEvent(event)}
                          className="flex-1 btn-neon-secondary text-sm font-medium"
                        >
                          View Committees
                        </button>
                        <button 
                          onClick={() => handlers.handleViewEvent && handlers.handleViewEvent(event)}
                          className="flex-1 btn-neon-primary text-sm font-medium"
                        >
                          Register Now
                        </button>
                        <button
                          onClick={() => copyToClipboard(getEventLink(event), event.id)}
                          className="btn-neon-secondary p-2 text-sm font-medium"
                          title="Copy event link"
                        >
                          {copiedEventId === event.id ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Share2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
      );

    case 'debates-hub':
      return <DebatesHub onBack={handlers.handleBackToDashboard} />;

    case 'pricing':
      return <PricingPage onBack={handlers.handleBackToDashboard} />;

    case 'resources':
      return <Resources onBack={handlers.handleBackToDashboard} />;

    case 'scores':
      return <ScoresTokens userTokens={userTokens} onBack={handlers.handleBackToDashboard} />;

    case 'public-speaking':
      return <PublicSpeakingActivities onBack={handlers.handleBackToDashboard} />;

    case 'human-debate':
      return (
        <ErrorBoundary>
          <HumanDebateRoom
            topic="Sample Human Debate Topic"
            onExit={handlers.handleBackToDashboard}
          />
        </ErrorBoundary>
      );

    case 'debate-history':
      return (
        <DebateHistoryViewer
          onBack={handlers.handleBackToDashboard}
          onViewDebate={(debate: any) => {
            if (handlers.handleViewDebate) {
              handlers.handleViewDebate(debate);
            }
          }}
        />
      );

    case 'debate-detail':
      return selectedDebate ? (
        <DebateDetailView
          debate={selectedDebate}
          onBack={() => {
            if (handlers.handleBackToDebateHistory) {
              handlers.handleBackToDebateHistory();
            }
          }}
        />
      ) : null;

    case 'event-detail':
      return (
        <>
          {selectedEvent ? (
            <EventDetailView
              event={selectedEvent}
              onBack={() => {
                if (handlers.handleBackToEvents) {
                  handlers.handleBackToEvents();
                }
              }}
              onRegister={(event) => {
                setSelectedEventForRegistration(event);
                setRegistrationModalOpen(true);
              }}
            />
          ) : (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Event Selected</h2>
                <p className="text-gray-600 mb-6">Please select an event to view details.</p>
                <button
                  onClick={() => handlers.handleBackToEvents && handlers.handleBackToEvents()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Back to Events
                </button>
              </div>
            </div>
          )}
        </>
      );

    case 'instant-debate-setup':
      return (
        <InstantDebateSetup
          onStartDebate={(config) => {
            console.log('Starting instant debate with config:', config);
            handlers.handleInstantDebateStart(config);
          }}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'instant-debate-room':
      return (
        <InstantDebateRoom
          config={instantDebateConfig || {
            topic: 'Sample Topic',
            userPosition: 'for',
            firstSpeaker: 'user'
          }}
          onBack={handlers.handleInstantDebateBack}
          onComplete={(config, messages) => {
            console.log('Instant debate completed:', { config, messages });
            handlers.handleInstantDebateComplete(config, messages);
          }}
        />
      );

    case 'chanakya-debate-setup':
      return (
        <ChanakyaDebateSetup
          onStartDebate={(config) => {
            console.log('Starting Chanakya debate with config:', config);
            handlers.handleChanakyaDebateStart(config);
          }}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'chanakya-debate-room':
      return (
        <ChanakyaDebateRoom
          config={chanakyaDebateConfig || {
            topic: 'Sample Topic',
            topicType: 'custom',
            userPosition: 'for',
            firstSpeaker: 'user',
            difficulty: 'medium'
          }}
          onBack={handlers.handleChanakyaDebateBack}
          onComplete={(config, messages) => {
            console.log('Chanakya debate completed:', { config, messages });
            handlers.handleChanakyaDebateComplete(config, messages);
          }}
        />
      );

    default:
      return null;
  }
};

export default UtilityViews;
