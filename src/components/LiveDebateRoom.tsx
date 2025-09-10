// @ts-nocheck
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Users, ArrowLeft, Target, Trophy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface DatabaseTopic {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  theme: string | null;
  time_estimate: string | null;
  status: string;
  created_at: string;
  created_by: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  updated_at: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  time_estimate: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface LiveDebateRoomProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onBack: () => void;
  onStartDebate: (topic: Topic, opponent: OnlineUser) => void;
}

interface SuggestTopicFormValues {
  title: string;
  description?: string;
  timeEstimate: string;
}

const LiveDebateRoom = ({
  difficulty,
  theme,
  onBack,
  onStartDebate,
}: LiveDebateRoomProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<OnlineUser | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const { toast } = useToast();

  const fetchTopics = useCallback(async () => {
    setLoadingTopics(true);
    try {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .eq('status', 'approved')
        .eq('difficulty', difficulty)
        .eq('theme', theme)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformed: Topic[] = (data || []).map((dbTopic: DatabaseTopic) => ({
        id: dbTopic.id,
        title: dbTopic.title,
        description: dbTopic.description || '',
        difficulty: ['Easy', 'Medium', 'Hard'].includes(dbTopic.difficulty)
          ? (dbTopic.difficulty as 'Easy' | 'Medium' | 'Hard')
          : 'Medium',
        theme: dbTopic.theme || theme,
        time_estimate: dbTopic.time_estimate || '15 min',
        status: dbTopic.status as Topic['status'],
      }));

      setTopics(transformed);
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoadingTopics(false);
    }
  }, [difficulty, theme]);

  const fetchOnlineUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('online_status')
      .select('user_id, status, profiles (full_name)')
      .eq('status', 'available');

    if (error) return console.error('Error fetching users:', error);

    const users: OnlineUser[] = (data || []).map((entry) => ({
      id: entry.user_id,
      name: entry.profiles?.full_name || 'Unknown',
      status: 'available',
      level: 'Beginner',
      tokens: 0,
      country: 'India',
    }));

    setOnlineUsers(users);
  }, []);

  const handleStartMatchmaking = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('matchmaking_queue').upsert({
      user_id: user.id,
      difficulty,
      theme,
      status: 'searching',
    });

    const { data: opponents } = await supabase
      .from('matchmaking_queue')
      .select('user_id')
      .eq('difficulty', difficulty)
      .eq('theme', theme)
      .eq('status', 'searching')
      .neq('user_id', user.id)
      .limit(1);

    if (opponents?.length) {
      const matchedUserId = opponents[0].user_id;

      await supabase
        .from('matchmaking_queue')
        .update({ status: 'matched' })
        .in('user_id', [user.id, matchedUserId]);

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', matchedUserId)
        .single();

      if (profile) {
        const opponent: OnlineUser = {
          id: matchedUserId,
          name: profile.full_name,
          level: 'Intermediate',
          tokens: 0,
          country: 'India',
          status: 'available',
        };
        setSelectedOpponent(opponent);
        toast({ title: 'Match Found!', description: `You're paired with ${profile.full_name}` });
      }
    } else {
      toast({ title: 'Searching...', description: 'Waiting for an opponent to join...' });
    }
  };

  const suggestForm = useForm<SuggestTopicFormValues>({
    defaultValues: { title: '', description: '', timeEstimate: '' },
  });

  const onSuggestTopic = async (values: SuggestTopicFormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    try {
      const { error } = await supabase.from('debate_topics').insert({
        title: values.title.trim(),
        description: values.description?.trim() || null,
        time_estimate: values.timeEstimate.trim(),
        difficulty,
        theme,
        created_by: user?.id || null,
        status: 'pending',
      });

      if (error) throw error;

      toast({ title: 'Topic Suggested', description: 'Your topic was submitted for approval.' });
      suggestForm.reset();
    } catch (err) {
      console.error('Error suggesting topic:', err);
      toast({ title: 'Error', description: 'Failed to suggest topic.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchOnlineUsers();

    const subscription = supabase
      .channel('online_status_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'online_status',
      }, fetchOnlineUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchTopics, fetchOnlineUsers]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Debate Room</h1>
          <p className="text-gray-600 mt-2">Select a topic and an opponent to start a live debate</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Suggest a Topic Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Suggest a Topic
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Suggest a Topic</DialogTitle></DialogHeader>
          <Form {...suggestForm}>
            <form onSubmit={suggestForm.handleSubmit(onSuggestTopic)} className="space-y-4">
              <FormField
                control={suggestForm.control}
                name="title"
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={suggestForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={suggestForm.control}
                name="timeEstimate"
                rules={{ required: 'Estimated time is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Estimate</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit Suggestion</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Available Topics</span>
            <Badge className="bg-blue-100 text-blue-700">
              {loadingTopics ? 'Loading...' : `${topics.length} topics`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopics ? (
            <p className="text-gray-500">Fetching topics...</p>
          ) : (
            <div className="space-y-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTopic?.id === topic.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{topic.title}</h4>
                    <Badge className="bg-gray-100 text-gray-700">{topic.time_estimate}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                  <Badge className="bg-yellow-100 text-yellow-700">{topic.difficulty}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Opponent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-green-600" />
            <span>Online Opponents</span>
            <Badge className="bg-green-100 text-green-700">{onlineUsers.length} available</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedOpponent?.id === user.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOpponent(user)}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.country}</p>
                  </div>
                  <Badge>{user.level}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Debate */}
      <div className="flex flex-col items-center gap-4">
        <Button
          className="bg-green-500 hover:bg-green-600"
          size="lg"
          disabled={!selectedTopic || !selectedOpponent}
          onClick={() =>
            selectedTopic &&
            selectedOpponent &&
            onStartDebate(selectedTopic, selectedOpponent)
          }
        >
          Start Debate
        </Button>
        <Button variant="secondary" onClick={handleStartMatchmaking}>
          Auto Matchmake
        </Button>
      </div>
    </div>
  );
};

export default LiveDebateRoom;
