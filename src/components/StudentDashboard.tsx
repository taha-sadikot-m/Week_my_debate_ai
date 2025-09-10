import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy, TrendingUp, Users, Star, Award, Target, Zap, Brain, Globe, Mic, BookOpen, Bot, Eye, Settings, History, Calendar, Newspaper, Sparkles, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
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
  requireAuth?: (callback: () => void) => void;
  isAuthenticated?: boolean;
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
  onAICoach,
  requireAuth,
  isAuthenticated
}: StudentDashboardProps) => {
  // State for managing expanded cards
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({
    debateArena: false,
    skillBuilder: false,
    progressHub: false
  });

  const toggleCardExpansion = (cardKey: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%22%20height%3D%2760%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2730%22%20cy%3D%2730%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {isAuthenticated ? 'Welcome back to' : 'Welcome to'}{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MyDebate.AI
              </span>
            </h1>
            
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Master the art of debate with AI-powered coaching and live competitions."
                : "Get started with AI-powered debate coaching and join live competitions. Sign in to track your progress and earn tokens."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Quick Stats Overview - Only show for authenticated users */}
            {isAuthenticated && (
              <div className="space-y-4">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Performance</h2>
                  <p className="text-gray-600">Track your debate journey and achievements</p>
                </div>
                <QuickStatsCard 
                  userTokens={userTokens} 
                  onViewTokens={onViewTokens}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            )}

            {/* Featured Quick Actions */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Start</h2>
                <p className="text-gray-600">Jump right into your debate journey</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instant Debate - Featured */}
                <Card 
                  className="group relative overflow-hidden border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-white hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-opacity-60 hover:scale-105 hover:-translate-y-2 ring-2 ring-yellow-300 ring-opacity-50 animate-pulse shadow-yellow-500/20 hover:shadow-yellow-500/30 backdrop-blur-sm"
                  onClick={() => requireAuth ? requireAuth(onInstantDebate) : onInstantDebate()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full w-14 h-14 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Zap className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      ⚡ Instant Debate
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Quick AI debates with ArguAI and voice synthesis
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* AI Coach - Featured */}
                <Card 
                  className="group relative overflow-hidden border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-white hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-opacity-60 hover:scale-105 hover:-translate-y-2 ring-2 ring-emerald-300 ring-opacity-50 animate-pulse shadow-emerald-500/20 hover:shadow-emerald-500/30 backdrop-blur-sm"
                  onClick={() => requireAuth ? requireAuth(onAICoach) : onAICoach()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full w-14 h-14 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Brain className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      🧠 AI Coach
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Get personalized coaching on speech, grammar, and content analysis
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Modern Feature Categories */}
            <div className="space-y-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
                  <h2 className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">
                    Explore Your Journey
                  </h2>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover powerful features designed to elevate your debate skills to the next level
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Debate Modes - Modern Glass Card */}
                <div className="relative">
                  {/* Main Card */}
                  <Card className="relative h-full backdrop-blur-xl bg-white/70 border-0 shadow-2xl shadow-indigo-500/10 rounded-3xl overflow-hidden">
                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-indigo-500/5 rounded-3xl"></div>

                    <CardContent className="relative z-10 p-8 h-full flex flex-col">
                      {/* Header */}
                      <div class="text-center mb-8">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                            <Target className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          🎯 Debate Arena
                        </h3>
                        <p className="text-gray-600">
                          Master different debate formats and challenge levels
                        </p>
                      </div>

                      {/* Feature Buttons */}
                      <div className="space-y-3 flex-1">
                        <button 
                          onClick={() => requireAuth ? requireAuth(onStartDebate) : onStartDebate()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-gray-50 to-slate-50 hover:from-indigo-50 hover:to-purple-50 rounded-2xl p-4 transition-all duration-300 border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-slate-700 to-gray-900 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-indigo-800">🤖 Debate with Gabbar</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-indigo-600">Challenge advanced AI</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-indigo-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        <button 
                          onClick={() => requireAuth ? requireAuth(onDebateLive) : onDebateLive()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl p-4 transition-all duration-300 border border-indigo-200 hover:border-indigo-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-purple-800">⚡ Live Arena</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-purple-600">Real-time competitions</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-purple-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        <button 
                          onClick={() => requireAuth ? requireAuth(onJoinMUN) : onJoinMUN()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl p-4 transition-all duration-300 border border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Globe className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-pink-800">🌍 MUN World</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-pink-600">Global simulations</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-pink-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        {/* Expandable Content */}
                        <div className={`space-y-3 transition-all duration-300 overflow-hidden ${
                          expandedCards.debateArena ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <button 
                            onClick={() => requireAuth ? requireAuth(onHumanDebate) : onHumanDebate()}
                            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-2xl p-4 transition-all duration-300 border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                                <Eye className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900 group-hover/btn:text-emerald-800">👥 Human vs Human</p>
                                <p className="text-sm text-gray-600 group-hover/btn:text-emerald-600">Watch and learn from others</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-emerald-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                            </div>
                          </button>
                        </div>

                        {/* Show More/Less Button */}
                        <button 
                          onClick={() => toggleCardExpansion('debateArena')}
                          className="w-full group/more relative overflow-hidden bg-gradient-to-r from-gray-100 to-slate-100 hover:from-indigo-100 hover:to-purple-100 rounded-2xl p-3 transition-all duration-300 border border-gray-300 hover:border-indigo-400 shadow-sm hover:shadow-md mt-4"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 group-hover/more:text-indigo-700">
                              {expandedCards.debateArena ? 'Show Less' : 'Show More'}
                            </span>
                            {expandedCards.debateArena ? (
                              <ChevronUp className="h-4 w-4 text-gray-600 group-hover/more:text-indigo-600 transition-all duration-300" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-600 group-hover/more:text-indigo-600 transition-all duration-300" />
                            )}
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Hub - Modern Glass Card */}
                <div className="relative">
                  {/* Main Card */}
                  <Card className="relative h-full backdrop-blur-xl bg-white/70 border-0 shadow-2xl shadow-emerald-500/10 rounded-3xl overflow-hidden">
                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-500/5 rounded-3xl"></div>

                    <CardContent className="relative z-10 p-8 h-full flex flex-col">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                            <Brain className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          🧠 Skill Builder
                        </h3>
                        <p className="text-gray-600">
                          Enhance speaking skills and build confidence
                        </p>
                      </div>

                      {/* Feature Buttons */}
                      <div className="space-y-3 flex-1">
                        <button 
                          onClick={() => requireAuth ? requireAuth(onPublicSpeaking) : onPublicSpeaking()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl p-4 transition-all duration-300 border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Mic className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-emerald-800">🎙️ Speaking Lab</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-emerald-600">JAM & presentations</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-emerald-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        <button 
                          onClick={() => requireAuth ? requireAuth(onResources) : onResources()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-4 transition-all duration-300 border border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-blue-800">📚 Knowledge Base</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-blue-600">Guides & techniques</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-blue-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        <button 
                          onClick={() => requireAuth ? requireAuth(onDebatesHub) : onDebatesHub()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 rounded-2xl p-4 transition-all duration-300 border border-cyan-200 hover:border-cyan-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Newspaper className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-cyan-800">📰 Content Hub</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-cyan-600">Articles & insights</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-cyan-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Tracker - Modern Glass Card */}
                <div className="relative">
                  {/* Main Card */}
                  <Card className="relative h-full backdrop-blur-xl bg-white/70 border-0 shadow-2xl shadow-orange-500/10 rounded-3xl overflow-hidden">
                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-orange-500/5 rounded-3xl"></div>

                    <CardContent className="relative z-10 p-8 h-full flex flex-col">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg">
                            <TrendingUp className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          📈 Progress Hub
                        </h3>
                        <p className="text-gray-600">
                          Track achievements and organize your journey
                        </p>
                      </div>

                      {/* Feature Buttons */}
                      <div className="space-y-3 flex-1">
                        <button 
                          onClick={() => requireAuth ? requireAuth(onCreateDebateRoom) : onCreateDebateRoom()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl p-4 transition-all duration-300 border border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Settings className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-orange-800">🏛️ Create Room</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-orange-600">Custom formats</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-orange-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        <button 
                          onClick={() => requireAuth ? requireAuth(onDebateHistory) : onDebateHistory()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl p-4 transition-all duration-300 border border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <History className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-purple-800">📜 My History</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-purple-600">Past performances</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-purple-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>

                        <button 
                          onClick={() => requireAuth ? requireAuth(onViewEvents) : onViewEvents()}
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl p-4 transition-all duration-300 border border-indigo-200 hover:border-indigo-400 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300 group-hover/btn:scale-110">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900 group-hover/btn:text-indigo-800">🎪 Events</p>
                              <p className="text-sm text-gray-600 group-hover/btn:text-indigo-600">Tournaments</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover/btn:text-indigo-600 transition-all duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Additional Features Section */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Track & Analyze</h2>
                <p className="text-gray-600">Monitor your progress and get insights</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-none">
                {/* Recent Debates */}
                <RecentDebatesCard />

                {/* Freud Analysis */}
                <FreudAnalysisCard />
              </div>
            </div>

            {/* Call to Action */}
            <Card className="card-shadow-lg border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
              <CardContent className="p-8">
                <div className="max-w-xl mx-auto">
                  <h3 className="text-2xl font-bold mb-3">Ready to Start Your Debate Journey?</h3>
                  <p className="text-indigo-100 mb-6">
                    Choose from AI debates, live competitions, or MUN simulations to enhance your skills.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6"
                      onClick={() => requireAuth ? requireAuth(onStartDebate) : onStartDebate()}
                    >
                      Start AI Debate
                    </Button>
                    <Button 
                      className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6"
                      onClick={() => requireAuth ? requireAuth(onDebateLive) : onDebateLive()}
                    >
                      Join Live Room
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
