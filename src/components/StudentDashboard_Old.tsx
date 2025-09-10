
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy, TrendingUp, Users, Star, Award, Target, Zap, Brain, Globe, Mic, BookOpen, Bot, Eye, Settings, History, Calendar, Newspaper, Sparkles, ChevronRight } from 'lucide-react';
import MainMenuCard from '@/components/dashboard/MainMenuCard';
import QuickStatsCard from '@/components/dashboard/QuickStatsCard';
import RecentDebatesCard from '@/components/dashboard/RecentDebatesCard';
import FreudAnalysisCard from '@/components/dashboard/FreudAnalysisCard';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: () => void;
  onDebateLive: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
  onViewTokens: () => void;
  onPublicSpeaking: () => void;
  onDebatesHub: () => void;
  onHumanDebate: () => void;
  onDebateHistory: () => void;
  onInstantDebate: () => void;
  onAICoach: () => void;
}

const StudentDashboard = ({ 
  userTokens, 
  onStartDebate, 
  onDebateLive,
  onJoinMUN, 
  onCreateDebateRoom, 
  onViewEvents, 
  onResources, 
  onViewTokens,
  onPublicSpeaking,
  onDebatesHub,
  onHumanDebate,
  onDebateHistory,
  onInstantDebate,
  onAICoach
}: StudentDashboardProps) => {
  // Mock data for enhanced dashboard
  const stats = {
    debatesCompleted: 24,
    winRate: 78,
    totalParticipants: 156,
    averageScore: 85,
    streakDays: 7,
    rank: 'Gold'
  };

  const recentAchievements = [
    { title: 'First Win', description: 'Won your first debate', icon: Trophy, color: 'text-yellow-600' },
    { title: 'Streak Master', description: '7-day debate streak', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Social Butterfly', description: 'Debated with 50+ people', icon: Users, color: 'text-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <Brain className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MyDebate.AI
              </span>
            </h1>
            
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Master the art of debate with AI-powered coaching, live competitions, and real-time feedback. 
              Your journey to becoming a world-class debater starts here.
            </p>

            {/* Enhanced Tokens Display */}
            <div className="flex justify-center mt-8">
              <Card className="card-shadow-lg border-0 bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105" onClick={onViewTokens}>
                <CardContent className="p-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                      <div className="relative p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                        <Coins className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{userTokens}</p>
                      <p className="text-lg text-indigo-100 font-medium">Debate Tokens</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                      <div className="relative p-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Quick Stats Overview */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Performance</h2>
            <p className="text-gray-600">Track your debate journey and achievements</p>
          </div>
          <QuickStatsCard 
            userTokens={userTokens} 
            onViewTokens={onViewTokens}
          />
        </div>

        {/* Main Menu with Enhanced Layout */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Debate Experience</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From AI-powered practice to live competitions, discover the perfect way to enhance your debate skills
            </p>
          </div>
          
          <MainMenuCard 
            onStartDebate={onStartDebate}
            onDebateLive={onDebateLive}
            onJoinMUN={onJoinMUN}
            onCreateDebateRoom={onCreateDebateRoom}
            onViewEvents={onViewEvents}
            onResources={onResources}
            onPublicSpeaking={onPublicSpeaking}
            onDebatesHub={onDebatesHub}
            onHumanDebate={onHumanDebate}
            onDebateHistory={onDebateHistory}
            onInstantDebate={onInstantDebate}
            onAICoach={onAICoach}
          />
        </div>

        {/* Performance Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentDebatesCard />
          <FreudAnalysisCard />
        </div>

        {/* Recent Achievements & Tips Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card-shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-900">
                <Award className="h-6 w-6" />
                <span>Recent Achievements</span>
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Celebrate your debate milestones and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white/50 rounded-lg">
                  <div className={`p-2 rounded-full bg-white/80`}>
                    <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips Enhanced */}
          <Card className="card-shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-900">
                <BookOpen className="h-6 w-6" />
                <span>Pro Tips for Success</span>
              </CardTitle>
              <CardDescription className="text-blue-700">
                Master these techniques to dominate your debates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-500 rounded-full mt-1">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Research Thoroughly</p>
                    <p className="text-sm text-gray-600">Gather comprehensive evidence and understand all perspectives</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-500 rounded-full mt-1">
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Practice Delivery</p>
                    <p className="text-sm text-gray-600">Work on your speaking pace, tone, and body language</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-500 rounded-full mt-1">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Structure Arguments</p>
                    <p className="text-sm text-gray-600">Use clear logic and evidence to build compelling cases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-yellow-500 rounded-full mt-1">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Listen Actively</p>
                    <p className="text-sm text-gray-600">Pay attention to opponents and adapt your strategy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="card-shadow-lg border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
          <CardContent className="p-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Your Debate Journey?</h3>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of students improving their debate skills with AI-powered coaching
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3"
                  onClick={onInstantDebate}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Instant Debate
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8 py-3"
                  onClick={onDebateLive}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Join Live Debate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
