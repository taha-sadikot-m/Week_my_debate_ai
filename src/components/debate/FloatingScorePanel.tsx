
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Zap, Brain, MessageCircle, Trophy } from 'lucide-react';

interface ScoreData {
  creativity: number;
  fluency: number;
  grammar: number;
  confidence: number;
  overall: number;
}

interface FloatingScorePanelProps {
  scores: ScoreData;
}

const FloatingScorePanel = ({ scores }: FloatingScorePanelProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scoreItems = [
    { label: 'Creativity', value: scores.creativity, icon: Brain },
    { label: 'Fluency', value: scores.fluency, icon: MessageCircle },
    { label: 'Grammar', value: scores.grammar, icon: Zap },
    { label: 'Confidence', value: scores.confidence, icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Card className="w-80 card-shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="text-lg">Live Scores</span>
            </div>
            <Badge 
              className={`text-lg font-bold ${getScoreColor(scores.overall)} bg-transparent border-2`}
              style={{ 
                borderColor: scores.overall >= 90 ? '#16a34a' : 
                           scores.overall >= 75 ? '#2563eb' : 
                           scores.overall >= 60 ? '#ca8a04' : '#dc2626'
              }}
            >
              {scores.overall}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-2 gap-3">
            {scoreItems.map((item, index) => (
              <div
                key={item.label}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <item.icon className="h-4 w-4 text-indigo-600" />
                  <span className={`text-sm font-bold ${getScoreColor(item.value)}`}>
                    {item.value}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(item.value)}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Performance */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                Overall Performance
              </span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">+5% from last debate</span>
              </div>
            </div>
            
            <Progress value={scores.overall} className="h-3 mb-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Keep improving your arguments!
              </span>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Excellent
              </Badge>
            </div>
          </div>

          {/* Real-time Update Indicator */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Updating in real-time</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingScorePanel;
