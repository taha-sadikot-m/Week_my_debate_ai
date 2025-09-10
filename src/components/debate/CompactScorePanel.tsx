
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface ScoreData {
  creativity: number;
  fluency: number;
  grammar: number;
  confidence: number;
  overall: number;
}

interface CompactScorePanelProps {
  scores: ScoreData;
}

const CompactScorePanel = ({ scores }: CompactScorePanelProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const scoreItems = [
    { label: 'Creativity', value: scores.creativity, color: 'indigo' },
    { label: 'Fluency', value: scores.fluency, color: 'blue' },
    { label: 'Grammar', value: scores.grammar, color: 'green' },
    { label: 'Confidence', value: scores.confidence, color: 'purple' }
  ];

  return (
    <Card className="card-shadow border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Live Performance
          </h3>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Score: {scores.overall}%
          </Badge>
        </div>

        {/* 2x2 Grid for the 4 main scores */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {scoreItems.map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
                <span className={`text-sm font-bold ${getScoreColor(item.value)}`}>
                  {item.value}%
                </span>
              </div>
              <Progress 
                value={item.value} 
                className="h-2" 
              />
            </div>
          ))}
        </div>

        {/* Overall Score Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Overall</span>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${getScoreColor(scores.overall)}`}>
                  {scores.overall}%
                </span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400">Trending</span>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                +2.3%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactScorePanel;
