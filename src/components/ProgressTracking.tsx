import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Star, 
  Zap, 
  Brain, 
  Mic, 
  ArrowLeft, 
  CheckCircle2, 
  Circle,
  Flame,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';

interface ProgressTrackingProps {
  onBack: () => void;
}

const ProgressTracking = ({ onBack }: ProgressTrackingProps) => {
  // Dummy Data
  const performanceData = [
    { month: 'Jan', score: 65, debates: 4 },
    { month: 'Feb', score: 68, debates: 6 },
    { month: 'Mar', score: 72, debates: 5 },
    { month: 'Apr', score: 75, debates: 8 },
    { month: 'May', score: 74, debates: 4 },
    { month: 'Jun', score: 82, debates: 10 },
  ];

  const skillsData = [
    { subject: 'Logic', A: 85, fullMark: 100 },
    { subject: 'Rhetoric', A: 70, fullMark: 100 },
    { subject: 'Confidence', A: 90, fullMark: 100 },
    { subject: 'Listening', A: 65, fullMark: 100 },
    { subject: 'Rebuttal', A: 75, fullMark: 100 },
    { subject: 'Vocabulary', A: 80, fullMark: 100 },
  ];

  const goals = [
    {
      id: 1,
      title: "Debate Novice",
      description: "Complete your first 5 debates",
      current: 5,
      target: 5,
      completed: true,
      reward: "50 Tokens",
      icon: <Mic className="h-5 w-5 text-cyan-400" />
    },
    {
      id: 2,
      title: "Logic Master",
      description: "Achieve a Logic score of 90+ in 3 consecutive debates",
      current: 1,
      target: 3,
      completed: false,
      reward: "100 Tokens",
      icon: <Brain className="h-5 w-5 text-fuchsia-500" />
    },
    {
      id: 3,
      title: "Consistent Speaker",
      description: "Participate in a debate every day for a week",
      current: 4,
      target: 7,
      completed: false,
      reward: "200 Tokens",
      icon: <Flame className="h-5 w-5 text-orange-500" />
    },
    {
      id: 4,
      title: "Tournament Ready",
      description: "Win 10 debates against AI (Hard difficulty)",
      current: 3,
      target: 10,
      completed: false,
      reward: "500 Tokens",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 font-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Progress Tracking
            </h1>
            <p className="text-gray-400">Monitor your growth and achieve your goals</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-gray-800 bg-gray-900/50 hover:bg-gray-800 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-cyan-500/10 rounded-full">
                <Trophy className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Debates</p>
                <h3 className="text-2xl font-bold text-white">37</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-fuchsia-500/10 rounded-full">
                <Target className="h-6 w-6 text-fuchsia-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Win Rate</p>
                <h3 className="text-2xl font-bold text-white">68%</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Avg. Score</p>
                <h3 className="text-2xl font-bold text-white">78/100</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Current Rank</p>
                <h3 className="text-2xl font-bold text-white">Gold III</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Chart */}
          <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-cyan-400" />
                Performance History
              </CardTitle>
              <CardDescription className="text-gray-400">Your debate scores over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                      itemStyle={{ color: '#22d3ee' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="mr-2 h-5 w-5 text-fuchsia-500" />
                Skill Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">Your strengths and areas for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#d946ef"
                      strokeWidth={2}
                      fill="#d946ef"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-emerald-500" />
                  Active Goals
                </CardTitle>
                <CardDescription className="text-gray-400">Complete these goals to earn tokens and badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                          {goal.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-100">{goal.title}</h4>
                          <p className="text-sm text-gray-400">{goal.description}</p>
                        </div>
                      </div>
                      {goal.completed ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Completed</Badge>
                      ) : (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">{goal.reward}</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{goal.current} / {goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2 bg-gray-700" indicatorClassName={goal.completed ? "bg-emerald-500" : "bg-cyan-500"} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity / Next Steps */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                  Daily Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6">
                <div className="text-5xl font-bold text-white mb-2 font-orbitron">4</div>
                <p className="text-indigo-200">Days in a row</p>
                <div className="flex justify-center gap-2 mt-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-xs">
                      <Flame className="h-4 w-4" />
                    </div>
                  ))}
                  {[5, 6, 7].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 text-xs">
                      {i}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600">
                    <Trophy className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Platinum Rank</h4>
                    <p className="text-sm text-gray-400">Reach 2000 total score points</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0">
                    View All Ranks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
