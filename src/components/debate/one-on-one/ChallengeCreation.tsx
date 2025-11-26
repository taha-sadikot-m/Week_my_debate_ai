import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomAuth } from '../../../hooks/useCustomAuth.js';

interface ChallengeCreationProps {
  onBack: () => void;
  onChallengeCreated: () => void;
}

const ChallengeCreation = ({ onBack, onChallengeCreated }: ChallengeCreationProps) => {
  const [topic, setTopic] = useState('');
  const [opponentId, setOpponentId] = useState('');
  const [role, setRole] = useState<'For' | 'Against'>('For');
  const [turns, setTurns] = useState('2');
  const [users, setUsers] = useState<{ id: string; full_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useCustomAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (authLoading) {
        console.log('ChallengeCreation: Auth loading...');
        return;
      }

      if (!user) {
        console.log('ChallengeCreation: No user logged in');
        return;
      }

      console.log('ChallengeCreation: Fetching users for', user.id);

      // Use RPC to fetch users to avoid RLS issues with custom auth
      const { data, error } = await supabase
        .rpc('get_challengeable_users', { p_user_id: user.id });

      if (error) {
        console.error('ChallengeCreation: Error fetching users:', error);
        toast({
          title: 'Error fetching users',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('ChallengeCreation: Users fetched:', data);
        setUsers(data || []);
      }
    };

    fetchUsers();
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error('Not authenticated');

      console.log('ChallengeCreation: Creating debate...');

      // Use RPC to create debate
      const { error } = await supabase
        .rpc('create_debate_challenge', {
          p_challenger_id: user.id,
          p_opponent_id: opponentId,
          p_topic: topic,
          p_role: role,
          p_turns: parseInt(turns)
        });

      if (error) throw error;

      toast({
        title: 'Challenge Sent!',
        description: 'Your opponent has been notified.',
      });
      onChallengeCreated();
    } catch (error: any) {
      console.error('ChallengeCreation: Error creating debate:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-neon max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-orbitron text-gray-50">Create Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-gray-300">Debate Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
              placeholder="Enter the topic for debate..."
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opponent" className="text-gray-300">Select Opponent</Label>
            <Select value={opponentId} onValueChange={setOpponentId} required>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose a user to challenge" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || 'Unknown User'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">Your Role</Label>
              <Select value={role} onValueChange={(val: 'For' | 'Against') => setRole(val)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="For">For (Pro)</SelectItem>
                  <SelectItem value="Against">Against (Con)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turns" className="text-gray-300">Rounds (Turns per user)</Label>
              <Select value={turns} onValueChange={setTurns}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="1">1 Round</SelectItem>
                  <SelectItem value="2">2 Rounds</SelectItem>
                  <SelectItem value="3">3 Rounds</SelectItem>
                  <SelectItem value="5">5 Rounds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-neon-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Send Challenge'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChallengeCreation;
