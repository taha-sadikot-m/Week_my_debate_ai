import React, { useState } from 'react';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, GraduationCap, Calendar, Edit, Trophy, Target, TrendingUp, Award, Star, Zap, Brain, Mic, Flame, CheckCircle2, Circle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
// @ts-ignore
import ProfileEditForm from './ProfileEditForm';

const DUMMY_USER = {
  id: 'dummy-123',
  email: 'demo@debateworld.ai',
  full_name: 'Alex Debater',
  user_role: 'student',
  tokens: 1250,
  email_verified: true,
  age: 20,
  gender: 'Prefer not to say',
  country: 'United Kingdom',
  school: 'Oxford University',
  interests: ['politics', 'technology', 'ethics_philosophy', 'global_affairs'],
  is_profile_completed: true,
  avatar_url: null
};

const PERFORMANCE_DATA = [
  { month: 'Jan', score: 65, debates: 4 },
  { month: 'Feb', score: 68, debates: 6 },
  { month: 'Mar', score: 72, debates: 5 },
  { month: 'Apr', score: 75, debates: 8 },
  { month: 'May', score: 74, debates: 4 },
  { month: 'Jun', score: 82, debates: 10 },
];

const SKILLS_DATA = [
  { subject: 'Logic', A: 85, fullMark: 100 },
  { subject: 'Rhetoric', A: 70, fullMark: 100 },
  { subject: 'Confidence', A: 90, fullMark: 100 },
  { subject: 'Listening', A: 65, fullMark: 100 },
  { subject: 'Rebuttal', A: 75, fullMark: 100 },
  { subject: 'Vocabulary', A: 80, fullMark: 100 },
];

const GOALS = [
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

const UserProfile = () => {
  const { user: authUser } = useCustomAuth();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Use authenticated user or fallback to dummy data
  const user = authUser || DUMMY_USER;

  return (
    <div className="min-h-screen bg-gray-950 p-6 font-primary">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400">My Profile</h1>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-950 border-cyan-500 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">Edit Profile</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Update your profile information and interests.
                  </DialogDescription>
                </DialogHeader>
                <ProfileEditForm 
                  onSuccess={() => setIsEditOpen(false)} 
                  initialData={user}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: User Info & Interests */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <Card className="card-neon border-cyan-500/30">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center mb-4 border-2 border-cyan-500 relative group">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-cyan-400" />
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">{user.full_name || 'User'}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-cyan-900 text-cyan-300 border-cyan-700">
                    {user.user_role || 'Student'}
                  </Badge>
                  <Badge className="bg-fuchsia-900 text-fuchsia-300 border-fuchsia-700">
                    Level 5 Debater
                  </Badge>
                </div>
                
                <div className="w-full mt-6 space-y-3 text-left border-t border-gray-800 pt-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-cyan-500" />
                    <span>Age: {user.age || 'Not set'}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <User className="h-4 w-4 mr-3 text-cyan-500" />
                    <span>Gender: {user.gender || 'Not set'}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-cyan-500" />
                    <span>{user.country || 'Country not set'}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <GraduationCap className="h-4 w-4 mr-3 text-cyan-500" />
                    <span>{user.school || 'School not set'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests Card */}
            <Card className="card-neon border-fuchsia-500/30">
              <CardHeader>
                <CardTitle className="text-fuchsia-400 text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-fuchsia-900/40 text-fuchsia-300 border-fuchsia-700 px-3 py-1">
                        {interest.replace('_', ' ')}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No interests selected yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Stats & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-cyan-950/50 rounded-full mb-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{user.tokens || 0}</p>
                  <p className="text-xs text-gray-400">Tokens</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-fuchsia-950/50 rounded-full mb-2">
                    <Trophy className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-gray-400">Wins</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-purple-950/50 rounded-full mb-2">
                    <Mic className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">28</p>
                  <p className="text-xs text-gray-400">Debates</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-green-950/50 rounded-full mb-2">
                    <Star className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">4.8</p>
                  <p className="text-xs text-gray-400">Avg Score</p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
                <TabsTrigger value="goals">Goals & Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills Radar */}
                  <Card className="card-neon border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Skill Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILLS_DATA}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fill="#06b6d4"
                            fillOpacity={0.3}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                            itemStyle={{ color: '#22d3ee' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Progress Chart */}
                  <Card className="card-neon border-fuchsia-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-fuchsia-400 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Score Progression
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PERFORMANCE_DATA}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#d946ef" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="goals" className="mt-6">
                <Card className="card-neon border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-400" />
                      Active Goals
                    </CardTitle>
                    <CardDescription>Complete goals to earn tokens and badges</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {GOALS.map((goal) => (
                      <div key={goal.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg">
                              {goal.icon}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-200">{goal.title}</h3>
                              <p className="text-sm text-gray-400">{goal.description}</p>
                            </div>
                          </div>
                          {goal.completed ? (
                            <Badge className="bg-green-900/50 text-green-400 border-green-800 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-700">
                              {goal.current} / {goal.target}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2 bg-gray-800" indicatorClassName={goal.completed ? "bg-green-500" : "bg-cyan-500"} />
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2 text-xs text-yellow-500/80">
                          <Award className="h-3 w-3" />
                          <span>Reward: {goal.reward}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
