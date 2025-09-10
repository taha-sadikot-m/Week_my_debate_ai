
// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb } from 'lucide-react';

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

interface ArgumentsDisplayProps {
  topic: Topic;
}

const ArgumentsDisplay = ({ topic }: ArgumentsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-shadow border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <Lightbulb className="h-5 w-5" />
            <span>Pro Arguments (Supporting)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topic.aiArguments.pro.map((argument: string, index: number) => (
            <div key={index} className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-800 text-sm">{argument}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-shadow border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <Brain className="h-5 w-5" />
            <span>Con Arguments (Opposing)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topic.aiArguments.con.map((argument: string, index: number) => (
            <div key={index} className="bg-red-50 p-3 rounded-lg">
              <p className="text-red-800 text-sm">{argument}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArgumentsDisplay;
