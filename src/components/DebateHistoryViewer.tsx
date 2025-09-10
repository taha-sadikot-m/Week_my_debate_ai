import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Users, 
  Clock, 
  Trophy, 
  Search, 
  Filter,
  Download,
  Settings,
  Eye,
  Info,
  RefreshCw,
  Database,
  Trash2
} from 'lucide-react';
import { debateHistoryService } from '@/services/temporaryDebateHistoryService';
import type { HumanDebateRecord } from '@/types/debate';
import { useToast } from '@/hooks/use-toast';

interface DebateHistoryViewerProps {
  onBack: () => void;
  onViewDebate: (debate: HumanDebateRecord) => void;
}

const DebateHistoryViewer = ({ onBack, onViewDebate }: DebateHistoryViewerProps) => {
  const [debates, setDebates] = useState<HumanDebateRecord[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<HumanDebateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'topic'>('newest');
  const [filterByRole, setFilterByRole] = useState<'all' | 'FOR' | 'AGAINST' | 'OBSERVER'>('all');
  const [filterByStatus, setFilterByStatus] = useState<'all' | 'completed' | 'active' | 'waiting'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDebate, setExpandedDebate] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDebateHistory();
    loadStats();
  }, []);

  useEffect(() => {
    filterAndSortDebates();
  }, [debates, searchTerm, sortBy, filterByRole, filterByStatus]);

  const loadDebateHistory = async () => {
    setIsLoading(true);
    try {
      const debateRecords = await debateHistoryService.getAllDebates();
      setDebates(debateRecords);
      console.log(`📚 Loaded ${debateRecords.length} debates from temporary storage`);
    } catch (error) {
      console.error('Error loading debate history:', error);
      toast({
        title: 'Error Loading History',
        description: 'Failed to load debate history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const storageStats = await debateHistoryService.getStorageStats();
      setStats(storageStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterAndSortDebates = () => {
    let filtered = [...debates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(debate =>
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by role
    if (filterByRole !== 'all') {
      filtered = filtered.filter(debate =>
        debate.participants.some(p => p.side === filterByRole)
      );
    }

    // Filter by status
    if (filterByStatus !== 'all') {
      filtered = filtered.filter(debate => debate.status === filterByStatus);
    }

    // Sort debates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'topic':
          return a.topic.localeCompare(b.topic);
        default:
          return 0;
      }
    });

    setFilteredDebates(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Ongoing';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end.getTime() - start.getTime()) / 60000);
    return `${duration} min`;
  };

  const getSideStats = (debate: HumanDebateRecord) => {
    const forCount = debate.participants.filter(p => p.side === 'FOR').length;
    const againstCount = debate.participants.filter(p => p.side === 'AGAINST').length;
    const observerCount = debate.participants.filter(p => p.side === 'OBSERVER').length;
    
    return { forCount, againstCount, observerCount };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    loadDebateHistory();
    loadStats();
    toast({
      title: 'Refreshed',
      description: 'Debate history has been refreshed'
    });
  };

  const handleExport = () => {
    try {
      debateHistoryService.downloadJSON();
      toast({
        title: 'Export Complete',
        description: 'Debate history has been downloaded'
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export debate history',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDebate = async (debateId: string) => {
    try {
      await debateHistoryService.deleteDebate(debateId);
      setDebates(prev => prev.filter(d => d.id !== debateId));
      toast({
        title: 'Debate Deleted',
        description: 'Debate has been removed from history'
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete debate',
        variant: 'destructive'
      });
    }
  };

  const toggleExpandedDebate = (debateId: string) => {
    setExpandedDebate(expandedDebate === debateId ? null : debateId);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading debate history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Debate History</h1>
            <p className="text-sm text-gray-600">View and manage your debate records</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalRecords}</div>
                <div className="text-sm text-blue-700">Total Debates</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {debates.filter(d => d.status === 'completed').length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {debates.filter(d => d.status === 'waiting').length}
                </div>
                <div className="text-sm text-yellow-700">Waiting</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{stats.totalSize}</div>
                <div className="text-sm text-gray-700">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search debates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="topic">Topic A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Role</label>
              <Select value={filterByRole} onValueChange={(value: any) => setFilterByRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="FOR">FOR</SelectItem>
                  <SelectItem value="AGAINST">AGAINST</SelectItem>
                  <SelectItem value="OBSERVER">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status</label>
              <Select value={filterByStatus} onValueChange={(value: any) => setFilterByStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debate List */}
      {filteredDebates.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                No debates found
              </h3>
              <p className="text-sm text-gray-400">
                {debates.length === 0 
                  ? 'No debate history available. Start a debate to see it here.'
                  : 'No debates match your current filters.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDebates.map((debate) => {
            const sideStats = getSideStats(debate);
            const isExpanded = expandedDebate === debate.id;
            
            return (
              <Card key={debate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{debate.topic}</h3>
                        <Badge className={getStatusColor(debate.status)}>
                          {debate.status}
                        </Badge>
                        {debate.winner && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Winner: {debate.winner}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{debate.participants.length} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{debate.messages.length} messages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(debate.createdAt)}</span>
                        </div>
                        {debate.endedAt && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(debate.createdAt, debate.endedAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>FOR: {sideStats.forCount}</span>
                        <span>AGAINST: {sideStats.againstCount}</span>
                        <span>Observers: {sideStats.observerCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpandedDebate(debate.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {isExpanded ? 'Hide' : 'View'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDebate(debate)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Replay
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDebate(debate.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Recent Messages</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {debate.messages.slice(-5).map((message) => (
                          <div key={message.id} className="text-sm bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{message.senderName}</span>
                              <Badge variant="outline" className="text-xs">
                                {message.side}
                              </Badge>
                              <span className="text-gray-500 text-xs">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{message.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DebateHistoryViewer; 