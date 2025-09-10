
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, TrendingUp, Star } from 'lucide-react';

interface QuickStatsCardProps {
  userTokens: number;
  onViewTokens: () => void;
  isAuthenticated?: boolean;
}

const QuickStatsCard = ({ userTokens, onViewTokens, isAuthenticated = true }: QuickStatsCardProps) => {
  const stats = [
    {
      icon: Trophy,
      value: isAuthenticated ? userTokens : 'Demo',
      label: 'Tokens Earned',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      clickable: isAuthenticated,
      onClick: onViewTokens
    },
    {
      icon: Target,
      value: isAuthenticated ? 23 : 'Sign in',
      label: 'Debates Won',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      clickable: false
    },
    {
      icon: TrendingUp,
      value: isAuthenticated ? 8.5 : 'to track',
      label: 'Avg Freud Score',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      clickable: false
    },
    {
      icon: Star,
      value: isAuthenticated ? 12 : 'progress',
      label: 'Badges Earned',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      clickable: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`card-shadow ${stat.clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
          onClick={stat.clickable ? stat.onClick : undefined}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsCard;
