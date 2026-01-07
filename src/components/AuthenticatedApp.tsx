
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewManager from '@/components/ViewManager';
import { useAppHandlers } from '@/hooks/useAppHandlers';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { MunCommittee, LiveMunSession } from '@/data/munCommittees';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface AuthenticatedAppProps {
  isAuthenticated: boolean;
  requireAuth?: (callback: () => void) => void;
  eventSlug?: string;
}

const AuthenticatedApp = ({ isAuthenticated, requireAuth, eventSlug }: AuthenticatedAppProps) => {
  const { user, signOut } = useCustomAuth();
  const navigate = useNavigate();
  
  // Helper function to get event by slug
  const getEventBySlug = (slug: string) => {
    const eventMap: { [key: string]: any } = {
      'sym-mun': {
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
    };
    return eventMap[slug] || null;
  };
  
  // Check for profile completion
  useEffect(() => {
    // Only redirect if explicitly false (to avoid redirecting while loading or if undefined)
    if (isAuthenticated && user && user.is_profile_completed === false) {
      navigate('/profile-setup');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Use user data from custom auth
  const userRole = (user?.user_role as 'student' | 'teacher') || 'student';
  const userTokens = user?.tokens || 156;
  
  // Function to update user role (placeholder for now)
  const setUserRole = (newRole: 'student' | 'teacher') => {
    // TODO: Implement role update via API
    console.log('Role change requested:', newRole);
  };
  
  // Function to update user tokens (placeholder for now)
  const setUserTokens = (newTokens: number) => {
    // TODO: Implement token update via API
    console.log('Token update requested:', newTokens);
  };
  
  const [currentView, setCurrentView] = useState<string>(() => {
    // If eventSlug is provided, navigate to event detail view
    if (eventSlug) {
      return 'event-detail';
    }
    return 'dashboard';
  });
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedCommittee, setSelectedCommittee] = useState<MunCommittee | null>(null);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveMunSession | null>(null);
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');
  const [selectedProcedureType, setSelectedProcedureType] = useState<'UNA-USA' | 'Indian Parliamentary' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedDebateFormat, setSelectedDebateFormat] = useState<'1v1' | '3v3'>('1v1');
  const [selectedDebate, setSelectedDebate] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(() => {
    // If eventSlug is provided, set the event
    if (eventSlug) {
      return getEventBySlug(eventSlug);
    }
    return null;
  });
  const [instantDebateConfig, setInstantDebateConfig] = useState<{
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  } | null>(null);
  const [chanakyaDebateConfig, setChanakyaDebateConfig] = useState<{
    topic: string;
    topicType: 'custom' | 'scenario';
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty: 'easy' | 'medium' | 'hard';
    customTopic?: string;
    scenario?: string;
  } | null>(null);

  // Use the requireAuth function passed from parent, or create a default one
  const authHandler = requireAuth || ((callback: () => void) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    callback();
  });

  const handlers = useAppHandlers({
    setCurrentView,
    setSelectedDifficulty,
    setSelectedTheme,
    setSelectedTopic,
    setDebateType,
    setSelectedCommittee,
    setSelectedLiveSession,
    setSelectedProcedureType,
    setUserTokens,
    setSelectedLanguage,
    setSelectedDebateFormat,
    setSelectedDebate,
    setSelectedEvent,
    setInstantDebateConfig,
    setChanakyaDebateConfig
  });

  const handleGetPremium = () => {
    authHandler(() => setCurrentView('pricing'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation component removed as requested */}
      
      <main className="animate-fade-in">
        <ViewManager
          currentView={currentView}
          userRole={userRole}
          userTokens={userTokens}
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          selectedTheme={selectedTheme}
          selectedCommittee={selectedCommittee}
          selectedLiveSession={selectedLiveSession}
          debateType={debateType}
          selectedProcedureType={selectedProcedureType}
          selectedLanguage={selectedLanguage}
          selectedDebateFormat={selectedDebateFormat}
          selectedDebate={selectedDebate}
          selectedEvent={selectedEvent}
          instantDebateConfig={instantDebateConfig}
          chanakyaDebateConfig={chanakyaDebateConfig}
          handlers={handlers}
          requireAuth={authHandler}
          isAuthenticated={isAuthenticated}
        />
      </main>
    </div>
  );
};

export default AuthenticatedApp;
