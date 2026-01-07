import React, { useState } from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { 
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Clock,
  Info,
  ChevronRight,
  Globe,
  Award,
  ArrowLeft,
  Brain,
  TrendingUp,
  Zap,
  BookOpen,
  Target,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import EventRegistrationForm from './EventRegistrationForm.js';

interface EventDetailViewProps {
  event: any;
  onBack: () => void;
  onRegister?: (event: any) => void;
}

export default function EventDetailView({ event, onBack, onRegister }: EventDetailViewProps) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center font-primary">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-50 mb-4">Event Not Found</h2>
          <p className="text-gray-300 mb-6">The event details could not be loaded.</p>
          <button
            onClick={onBack}
            className="btn-neon-primary flex items-center justify-center"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 font-primary">
      {/* Dark Neon Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(217, 70, 239, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)
          `
        }}></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent"></div>
        
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 z-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="btn-neon-secondary flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              {event.badges.map((badge: any, index: number) => (
                <span key={index} className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10">
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 gradient-neon-primary rounded-3xl blur-3xl opacity-50 animate-neon-pulse"></div>
                <div className="relative card-neon-glow p-6">
                  <Globe className="h-20 w-20 text-cyan-400" />
                </div>
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold leading-tight tracking-wide mb-4">
                <span className="neon-text drop-shadow-lg">
                  {event.title}
                </span>
              </h1>
              <p className="text-2xl text-gray-200 font-inter font-light leading-relaxed max-w-3xl mx-auto">
                {event.shortDesc}
              </p>
              {event.partner && (
                <p className="text-lg text-cyan-400 font-medium mt-4 font-inter">
                  {event.partner}
                </p>
              )}
            </div>
            
            <div className="flex justify-center gap-4 pt-4 flex-wrap">
              <a 
                href="#registration" 
                className="btn-neon-primary text-lg font-bold px-8 py-3"
              >
                Register Now
              </a>
              <a 
                href="#committees" 
                className="btn-neon-secondary text-lg font-medium px-8 py-3"
              >
                View Committees
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why AI-Powered Section */}
      {event.whyAiPowered && (
        <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold neon-text mb-4">
              Why AI-Powered?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the future of Model United Nations with intelligent assistance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {event.whyAiPowered.map((item: any, index: number) => (
              <div key={index} className="card-neon hover:card-neon-glow group">
                <div className="p-8 text-center space-y-4">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white font-orbitron group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Committees Section */}
      {event.committees && (
        <div id="committees" className="relative max-w-7xl mx-auto px-6 py-16 z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold neon-text mb-4">
              Committees
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose your arena for diplomatic excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {event.committees.map((committee: any, index: number) => (
              <div key={index} className="card-neon hover:card-neon-glow group">
                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{committee.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-orbitron group-hover:text-cyan-400 transition-colors">
                        {committee.name}
                      </h3>
                      <p className="text-cyan-400 text-sm font-medium">
                        {committee.fullName}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {committee.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Training Section */}
      {event.freeTraining && (
        <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
          <div className="card-neon hover:card-neon-glow">
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-6 py-2 rounded-full bg-purple-500/20 border border-purple-400/50 mb-4">
                  <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="text-purple-400 font-bold">{event.freeTraining.subtitle}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold neon-text mb-4">
                  {event.freeTraining.title}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.freeTraining.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Section */}
      <div id="registration" className="relative max-w-4xl mx-auto px-6 py-16 z-10">
        <div className="card-neon hover:card-neon-glow">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold neon-text mb-4">
                Registration
              </h2>
              <p className="text-gray-300 text-lg">
                Fill out the form to secure your spot
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg border border-cyan-400/30 p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">Required Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.typeformFields && event.typeformFields.map((field: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    <span className="text-gray-300">{field}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <button 
                className="btn-neon-primary text-xl font-bold px-12 py-4 w-full md:w-auto"
                onClick={() => setShowRegistrationForm(true)}
              >
                Open Registration Form
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Registration Fee: <span className="text-cyan-400 font-bold">{event.registrationFee}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      {event.faqs && (
        <div className="relative max-w-4xl mx-auto px-6 py-16 z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold neon-text mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            {event.faqs.map((faq: any, index: number) => (
              <div key={index} className="card-neon hover:card-neon-glow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 font-orbitron">
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Contact */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
        <div className="card-neon text-center">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4 font-orbitron neon-text">
              Get in Touch
            </h3>
            <p className="text-gray-300 mb-4">
              Have questions? Contact us for more information
            </p>
            <p className="text-cyan-400 font-medium text-lg">
              {event.contact}
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <EventRegistrationForm
          eventTitle={event.title}
          onClose={() => setShowRegistrationForm(false)}
        />
      )}
    </div>
  );
}