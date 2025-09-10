import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Zap, 
  Brain, 
  Target, 
  MessageSquare, 
  Clock,
  TrendingUp,
  Star,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TOPIC_CATEGORIES, DEFAULT_TOPICS, type DebateConfig } from '@/types/debate';

interface InstantDebateSetupProps {
  onStartDebate: (config: DebateConfig) => void;
  onBack: () => void;
}

const InstantDebateSetup = ({ onStartDebate, onBack }: InstantDebateSetupProps) => {
  const { toast } = useToast();
  
  // Debate configuration
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  
  // UI state
  const [showCustomTopic, setShowCustomTopic] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartDebate = () => {
    const finalTopic = showCustomTopic ? customTopic.trim() : topic.trim();
    
    if (!finalTopic) {
      toast({
        title: 'Topic Required',
        description: 'Please enter or select a debate topic',
        variant: 'destructive',
      });
      return;
    }

    const config: DebateConfig = {
      topic: finalTopic,
      userPosition,
      firstSpeaker,
      difficulty: selectedDifficulty,
      category: selectedCategory || undefined,
      theme: selectedCategory || 'general'
    };
    
    console.log('Starting instant debate with config:', config);
    onStartDebate(config);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCustomTopic(false);
    
    // Set a default topic from the category
    const categoryTopics = DEFAULT_TOPICS[category];
    if (categoryTopics && categoryTopics.length > 0) {
      setTopic(categoryTopics[0]);
    }
  };

  const handleCustomTopicToggle = () => {
    setShowCustomTopic(!showCustomTopic);
    if (!showCustomTopic) {
      setTopic('');
      setSelectedCategory('');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionColor = (position: string) => {
    return position === 'for' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="h-8 w-8 text-yellow-500 mr-2" />
              Instant AI Debate
            </h1>
            <p className="text-gray-600 mt-2">Choose your topic and position to start debating with ArguAI instantly</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Setup */}
        <div className="space-y-6">
          {/* Topic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Choose Your Topic</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Selection */}
              <div>
                <Label htmlFor="category">Topic Category</Label>
                <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPIC_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic Selection */}
              {selectedCategory && !showCustomTopic && (
                <div>
                  <Label htmlFor="topic">Select Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_TOPICS[selectedCategory]?.map((topicText, index) => (
                        <SelectItem key={index} value={topicText}>
                          {topicText}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Custom Topic Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomTopicToggle}
                  className="flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>{showCustomTopic ? 'Use Preset Topics' : 'Custom Topic'}</span>
                </Button>
              </div>

              {/* Custom Topic Input */}
              {showCustomTopic && (
                <div>
                  <Label htmlFor="customTopic">Your Custom Topic</Label>
                  <Textarea
                    id="customTopic"
                    placeholder="Enter your debate topic here..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}

              {/* Selected Topic Display */}
              {(topic || customTopic) && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Selected Topic:</h4>
                  <p className="text-blue-800">
                    {showCustomTopic ? customTopic : topic}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Position and Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span>Debate Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Position */}
              <div>
                <Label>Your Position</Label>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant={userPosition === 'for' ? 'default' : 'outline'}
                    onClick={() => setUserPosition('for')}
                    className="flex-1"
                  >
                    <span className="mr-2">✅</span>
                    FOR
                  </Button>
                  <Button
                    variant={userPosition === 'against' ? 'default' : 'outline'}
                    onClick={() => setUserPosition('against')}
                    className="flex-1"
                  >
                    <span className="mr-2">❌</span>
                    AGAINST
                  </Button>
                </div>
              </div>

              {/* First Speaker */}
              <div>
                <Label>Who Speaks First?</Label>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant={firstSpeaker === 'user' ? 'default' : 'outline'}
                    onClick={() => setFirstSpeaker('user')}
                    className="flex-1"
                  >
                    <span className="mr-2">👤</span>
                    You
                  </Button>
                  <Button
                    variant={firstSpeaker === 'ai' ? 'default' : 'outline'}
                    onClick={() => setFirstSpeaker('ai')}
                    className="flex-1"
                  >
                    <span className="mr-2">🤖</span>
                    AI
                  </Button>
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <Label>AI Difficulty Level</Label>
                <div className="flex space-x-2 mt-2">
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className="flex-1"
                    >
                      <Badge className={`mr-2 ${getDifficultyColor(difficulty)}`}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview and Start */}
        <div className="space-y-6">
          {/* Debate Preview */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-900">
                <Eye className="h-5 w-5" />
                <span>Debate Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topic || customTopic ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Topic:</span>
                      <span className="text-gray-900 font-semibold">
                        {showCustomTopic ? customTopic : topic}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Your Position:</span>
                      <Badge className={getPositionColor(userPosition)}>
                        {userPosition.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">First Speaker:</span>
                      <Badge variant="outline">
                        {firstSpeaker === 'user' ? '👤 You' : '🤖 AI'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">AI Difficulty:</span>
                      <Badge className={getDifficultyColor(selectedDifficulty)}>
                        {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-indigo-200">
                    <Button 
                      onClick={handleStartDebate}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3"
                      size="lg"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Instant Debate
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a topic to see debate preview</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span>Instant Debate Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Instant AI responses with voice synthesis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Adaptive difficulty levels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Real-time argument tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Automatic debate history saving</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Performance analytics and feedback</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstantDebateSetup; 