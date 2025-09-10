
// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  TrendingUp,
  ArrowLeft,
  Star,
  Award,
  Brain,
  Calendar,
  Target,
  Gift,
  Crown,
  Zap,
  BookOpen,
  Users,
  Coins,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Lock
} from 'lucide-react';

interface ScoresTokensProps {
  userTokens: number;
  onBack: () => void;
}

const ScoresTokens = ({ userTokens, onBack }: ScoresTokensProps) => {
  // Indian Mythical Achievement Badges
  const mythicalBadges = [
    { 
      name: 'Saraswati\'s Blessing', 
      icon: '🪶', 
      earned: true, 
      description: 'First debate completed - Blessed by the goddess of knowledge',
      tokens: 10,
      rarity: 'Common',
      progress: 100
    },
    { 
      name: 'Hanuman\'s Courage', 
      icon: '🐒', 
      earned: true, 
      description: '5 consecutive wins - Embodies unwavering courage',
      tokens: 50,
      rarity: 'Rare',
      progress: 100
    },
    { 
      name: 'Arjuna\'s Focus', 
      icon: '🏹', 
      earned: true, 
      description: '10 perfect rebuttals - Master archer\'s precision',
      tokens: 25,
      rarity: 'Uncommon',
      progress: 100
    },
    { 
      name: 'Krishna\'s Wisdom', 
      icon: '🪈', 
      earned: false, 
      description: 'Score 9+ in all Freud categories - Divine strategist',
      tokens: 100,
      rarity: 'Epic',
      progress: 65
    },
    { 
      name: 'Garuda\'s Speed', 
      icon: '🦅', 
      earned: false, 
      description: 'Win 3 blitz debates under 2 minutes - Swift as the eagle',
      tokens: 75,
      rarity: 'Rare',
      progress: 33
    },
    { 
      name: 'Bhima\'s Strength', 
      icon: '💪', 
      earned: true, 
      description: 'Defeat 20 opponents - Mighty warrior\'s power',
      tokens: 30,
      rarity: 'Uncommon',
      progress: 100
    },
    { 
      name: 'Vikramaditya\'s Justice', 
      icon: '⚖️', 
      earned: false, 
      description: 'Win parliamentary debate - Legendary king\'s fairness',
      tokens: 150,
      rarity: 'Legendary',
      progress: 0
    },
    { 
      name: 'Chanakya\'s Strategy', 
      icon: '🧠', 
      earned: false, 
      description: 'Top monthly leaderboard - Master strategist\'s mind',
      tokens: 200,
      rarity: 'Legendary',
      progress: 15
    }
  ];

  // Token History
  const tokenHistory = [
    { date: '2025-01-12', activity: 'Won debate: "Climate Change Policy"', tokens: +15, balance: 156, type: 'earned' },
    { date: '2025-01-11', activity: 'Perfect rebuttal in AI debate', tokens: +12, balance: 141, type: 'earned' },
    { date: '2025-01-10', activity: 'Daily practice bonus', tokens: +5, balance: 129, type: 'bonus' },
    { date: '2025-01-09', activity: 'Premium feature unlock', tokens: -20, balance: 124, type: 'spent' },
    { date: '2025-01-08', activity: 'MUN participation bonus', tokens: +25, balance: 144, type: 'earned' },
    { date: '2025-01-07', activity: 'Hanuman\'s Courage badge earned', tokens: +50, balance: 119, type: 'badge' },
    { date: '2025-01-06', activity: 'Lost debate: "Space Exploration"', tokens: +8, balance: 69, type: 'earned' },
    { date: '2025-01-05', activity: 'POI approved by moderator', tokens: +6, balance: 61, type: 'earned' },
  ];

  // Redemption Options
  const redemptionOptions = [
    {
      title: 'Premium Access (1 Month)',
      description: 'Unlock advanced AI opponents, voice analysis, and premium features',
      tokens: 200,
      icon: Crown,
      available: userTokens >= 200,
      category: 'Premium',
      popular: true
    },
    {
      title: 'Scholarship Application',
      description: 'Apply for debate scholarship programs and competitions',
      tokens: 150,
      icon: Award,
      available: userTokens >= 150,
      category: 'Education'
    },
    {
      title: 'Personal Mentor Session',
      description: '1-on-1 coaching session with professional debate coach',
      tokens: 100,
      icon: Users,
      available: userTokens >= 100,
      category: 'Coaching'
    },
    {
      title: 'Tournament Entry',
      description: 'Free entry to national debate tournaments',
      tokens: 75,
      icon: Trophy,
      available: userTokens >= 75,
      category: 'Competition'
    },
    {
      title: 'Advanced Speech Analysis',
      description: 'Detailed AI analysis of your speaking patterns and improvement tips',
      tokens: 50,
      icon: Brain,
      available: userTokens >= 50,
      category: 'Analysis'
    },
    {
      title: 'Debate Resources Pack',
      description: 'Exclusive access to premium debate materials and templates',
      tokens: 30,
      icon: BookOpen,
      available: userTokens >= 30,
      category: 'Resources'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Uncommon': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Legendary': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-emerald-600 bg-emerald-50';
      case 'spent': return 'text-red-600 bg-red-50';
      case 'bonus': return 'text-blue-600 bg-blue-50';
      case 'badge': return 'text-purple-600 bg-purple-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const totalEarnedTokens = mythicalBadges.filter(badge => badge.earned).reduce((sum, badge) => sum + badge.tokens, 0);
  const earnedBadges = mythicalBadges.filter(b => b.earned).length;
  const availableRewards = redemptionOptions.filter(r => r.available).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  My Tokens
                </h1>
                <p className="text-slate-600 text-lg">Track your progress and unlock rewards</p>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Token Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{userTokens}</p>
                  <p className="text-sm text-slate-600 font-medium">Current Balance</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                  <Coins className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalEarnedTokens}</p>
                  <p className="text-sm text-slate-600 font-medium">Total Earned</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{earnedBadges}</p>
                  <p className="text-sm text-slate-600 font-medium">Badges Earned</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{availableRewards}</p>
                  <p className="text-sm text-slate-600 font-medium">Available Rewards</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
                  <Gift className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="badges" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Award className="h-4 w-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Achievement Badges</CardTitle>
                    <CardDescription className="text-slate-600">Unlock legendary powers through debate mastery</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mythicalBadges.map((badge, index) => (
                    <div 
                      key={index} 
                      className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                        badge.earned 
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300' 
                          : 'bg-white/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {badge.earned && (
                        <div className="absolute -top-2 -right-2 p-1 bg-emerald-500 rounded-full">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className="text-center space-y-4">
                        <div className={`text-4xl ${badge.earned ? 'animate-pulse' : 'opacity-50'}`}>
                          {badge.icon}
                        </div>
                        
                        <div>
                          <h4 className={`font-bold text-lg ${badge.earned ? 'text-slate-900' : 'text-slate-500'}`}>
                            {badge.name}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-center space-x-2">
                            <Badge className={`text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                              {badge.rarity}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                              {badge.tokens} tokens
                            </Badge>
                          </div>
                          
                          {!badge.earned && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Progress</span>
                                <span>{badge.progress}%</span>
                              </div>
                              <Progress value={badge.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Token Rewards</CardTitle>
                    <CardDescription className="text-slate-600">Redeem your tokens for premium features and opportunities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {redemptionOptions.map((option, index) => (
                    <div 
                      key={index} 
                      className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                        option.available 
                          ? 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-xl' 
                          : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      {option.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1">
                            Popular
                          </Badge>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-3 rounded-xl ${option.available ? 'bg-gradient-to-br from-blue-400 to-cyan-500' : 'bg-slate-200'}`}>
                            <option.icon className={`h-6 w-6 ${option.available ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg ${option.available ? 'text-slate-900' : 'text-slate-500'}`}>
                              {option.title}
                            </h4>
                            <Badge variant="outline" className="text-xs mt-2 bg-slate-100 text-slate-600 border-slate-200">
                              {option.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {option.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4 text-amber-500" />
                            <span className={`font-bold text-lg ${option.available ? 'text-slate-900' : 'text-slate-400'}`}>
                              {option.tokens}
                            </span>
                          </div>
                          
                          <Button 
                            size="sm" 
                            disabled={!option.available}
                            className={`transition-all duration-300 ${
                              option.available 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white' 
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {option.available ? (
                              <>
                                Redeem
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-1" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Transaction History</CardTitle>
                    <CardDescription className="text-slate-600">Track your token earnings and spending over time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokenHistory.map((entry, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-slate-200 hover:bg-white/80 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
                          {entry.type === 'earned' && <TrendingUp className="h-4 w-4" />}
                          {entry.type === 'spent' && <Gift className="h-4 w-4" />}
                          {entry.type === 'bonus' && <Star className="h-4 w-4" />}
                          {entry.type === 'badge' && <Award className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{entry.activity}</p>
                          <p className="text-sm text-slate-500">{entry.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-bold text-lg ${entry.tokens > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {entry.tokens > 0 ? '+' : ''}{entry.tokens}
                        </p>
                        <p className="text-sm text-slate-500">Balance: {entry.balance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScoresTokens;
