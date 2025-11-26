import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Swords, Clock, CheckCircle, XCircle, PlayCircle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { DUMMY_ANALYSIS_DATA } from '../../../data/dummyAnalysis.ts';

interface ChallengeListProps {
  onCreateChallenge: () => void;
  onSelectDebate: (debateId: string) => void;
  onViewAnalysis?: (data: any, context: any) => void;
}

const ChallengeList = ({ onCreateChallenge, onSelectDebate, onViewAnalysis }: ChallengeListProps) => {
  const [debates, setDebates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useCustomAuth();
  const [userId, setUserId] = useState<string | null>(null);

  const fetchDebates = async () => {
    setLoading(true);
    if (!user) {
      console.log('ChallengeList: No user logged in');
      setLoading(false);
      return;
    }
    setUserId(user.id);
    console.log('ChallengeList: Fetching debates for user', user.id);

    // Use RPC to fetch debates securely
    const { data, error } = await supabase
      .rpc('get_user_debates', { p_user_id: user.id });

    if (error) {
      console.error('ChallengeList: Error fetching debates:', error);
      toast({
        title: 'Error fetching debates',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      console.log('ChallengeList: Debates fetched:', data);
      // Transform data to match expected structure if needed, 
      // but the RPC returns flat structure with challenger_name/opponent_name
      // We need to map it to match the component's expectation of nested objects if we want to keep the render logic simple
      // Or update the render logic. Let's map it.
      const formattedDebates = (data || []).map((d: any) => ({
        ...d,
        challenger: { full_name: d.challenger_name },
        opponent: { full_name: d.opponent_name }
      }));
      setDebates(formattedDebates);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebates();
    
    // Subscribe to changes
    const channel = supabase
      .channel('public:debates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'debates' }, (payload: any) => {
        console.log('ChallengeList: Realtime update received', payload);
        fetchDebates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // Add user dependency

  const handleAccept = async (debateId: string) => {
    if (!user) return;
    console.log('ChallengeList: Accepting debate', debateId);
    
    const { data, error } = await supabase
      .rpc('accept_debate_challenge', { 
        p_debate_id: debateId,
        p_user_id: user.id 
      });

    if (error) {
      console.error('ChallengeList: Error accepting debate:', error);
      toast({ title: 'Error', description: 'Failed to accept challenge', variant: 'destructive' });
    } else {
      console.log('ChallengeList: Debate accepted result:', data);
      toast({ title: 'Challenge Accepted!', description: 'The debate is now active.' });
      fetchDebates(); // Refresh list immediately
    }
  };

  const handleReject = async (debateId: string) => {
    if (!user) return;
    console.log('ChallengeList: Rejecting debate', debateId);

    const { data, error } = await supabase
      .rpc('reject_debate_challenge', { 
        p_debate_id: debateId,
        p_user_id: user.id 
      });

    if (error) {
      console.error('ChallengeList: Error rejecting debate:', error);
      toast({ title: 'Error', description: 'Failed to reject challenge', variant: 'destructive' });
    } else {
      console.log('ChallengeList: Debate rejected result:', data);
      fetchDebates(); // Refresh list immediately
    }
  };

  const pendingChallenges = debates.filter(d => d.status === 'pending');
  const activeDebates = debates.filter(d => d.status === 'active');
  const historyDebates = debates.filter(d => d.status === 'completed' || d.status === 'rejected');

  const DebateCard = ({ debate }: { debate: any }) => {
    const isChallenger = debate.challenger_id === userId;
    const opponentName = isChallenger ? debate.opponent?.full_name : debate.challenger?.full_name;
    const myRole = isChallenger ? debate.challenger_role : (debate.challenger_role === 'For' ? 'Against' : 'For');

    return (
      <Card className="card-neon mb-4 hover:bg-gray-900/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-50 mb-2">{debate.topic}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Swords className="w-4 h-4" /> vs {opponentName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {debate.total_turns} Rounds
                </span>
                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                  You are: {myRole}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {debate.status === 'pending' && !isChallenger && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAccept(debate.id)} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(debate.id)}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
              {debate.status === 'pending' && isChallenger && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Waiting for response</Badge>
              )}
              {debate.status === 'active' && (
                <Button size="sm" className="btn-neon-primary" onClick={() => onSelectDebate(debate.id)}>
                  <PlayCircle className="w-4 h-4 mr-1" /> Enter Arena
                </Button>
              )}
              {debate.status === 'completed' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onSelectDebate(debate.id)}>
                    View Transcript
                  </Button>
                  {onViewAnalysis && (
                    <Button 
                      size="sm" 
                      className="btn-neon-secondary" 
                      onClick={() => onViewAnalysis(debate.analysis_data || DUMMY_ANALYSIS_DATA, { 
                        topic: debate.topic, 
                        duration: 0, 
                        difficulty: 'Medium' 
                      })}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" /> View Analysis
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-50">Your Debates</h2>
        <Button onClick={onCreateChallenge} className="btn-neon-primary">
          <Swords className="mr-2 h-4 w-4" /> New Challenge
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="active">Active ({activeDebates.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingChallenges.length})</TabsTrigger>
          <TabsTrigger value="history">History ({historyDebates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeDebates.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active debates.</p>
          ) : (
            activeDebates.map(debate => <DebateCard key={debate.id} debate={debate} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {pendingChallenges.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No pending challenges.</p>
          ) : (
            pendingChallenges.map(debate => <DebateCard key={debate.id} debate={debate} />)
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {historyDebates.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No debate history.</p>
          ) : (
            historyDebates.map(debate => <DebateCard key={debate.id} debate={debate} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengeList;
