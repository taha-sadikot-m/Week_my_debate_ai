import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Square, Play, Loader2, Trophy, ArrowLeft, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechToTextAPI } from '@/hooks/useSpeechToTextAPI';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useCustomAuth } from '@/hooks/useCustomAuth';

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
  onViewAnalysis?: (data: any, context: any) => void;
}

const DebateArena = ({ debateId, onBack, onViewAnalysis }: DebateArenaProps) => {
  const [debate, setDebate] = useState<any>(null);
  const [turns, setTurns] = useState<any[]>([]);
  const { user } = useCustomAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { transcribeAudio, isProcessing } = useSpeechToTextAPI();
  const { 
    startListening, 
    stopListening, 
    transcript: nativeTranscript, 
    resetTranscript,
    isSupported: isNativeSupported 
  } = useSpeechToText({ continuous: true });
  
  const transcriptRef = useRef('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync native transcript to ref to access it inside closures
  useEffect(() => {
    transcriptRef.current = nativeTranscript;
  }, [nativeTranscript]);

  const fetchDebateData = async () => {
    if (!user) {
      console.log('DebateArena: No user logged in');
      return;
    }
    setUserId(user.id);
    console.log('DebateArena: Fetching data for debate', debateId);

    // Fetch debate details using RPC
    const { data: debateData, error: debateError } = await supabase
      .rpc('get_debate_details', { p_debate_id: debateId })
      .single();

    if (debateError) {
      console.error('DebateArena: Error fetching debate:', debateError);
      toast({ title: 'Error', description: 'Failed to load debate details', variant: 'destructive' });
      return;
    }
    
    console.log('DebateArena: Debate data fetched:', debateData);
    
    // Transform to match expected structure
    const formattedDebate = {
      ...debateData,
      challenger: { full_name: debateData.challenger_name },
      opponent: { full_name: debateData.opponent_name }
    };
    setDebate(formattedDebate);

    // Fetch turns using RPC
    const { data: turnsData, error: turnsError } = await supabase
      .rpc('get_debate_turns', { p_debate_id: debateId });

    if (turnsError) {
      console.error('DebateArena: Error fetching turns:', turnsError);
    } else {
      console.log('DebateArena: Turns fetched:', turnsData);
      // Transform turns to match expected structure
      const formattedTurns = (turnsData || []).map((t: any) => ({
        ...t,
        speaker: { full_name: t.speaker_name }
      }));
      setTurns(formattedTurns);
    }
  };

  useEffect(() => {
    fetchDebateData();

    const channel = supabase
      .channel(`debate:${debateId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'debates', filter: `id=eq.${debateId}` }, (payload: any) => {
        console.log('DebateArena: Debate update received', payload);
        fetchDebateData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'debate_turns', filter: `debate_id=eq.${debateId}` }, (payload: any) => {
        console.log('DebateArena: Turn update received', payload);
        fetchDebateData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [debateId, user]); // Add user dependency

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  const startRecording = async () => {
    try {
      // Start native STT if supported
      if (isNativeSupported) {
        resetTranscript();
        startListening();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({ title: 'Error', description: 'Could not access microphone', variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      // Stop native STT
      if (isNativeSupported) {
        stopListening();
      }
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob: Blob) => {
    setUploading(true);
    try {
      // Convert blob to base64 using a Promise to ensure we wait for it
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const base64Data = base64Audio.split(',')[1]; // Remove data:audio/webm;base64, prefix

      let transcriptionText = '';

      // Priority 1: Use Native Browser Transcription (Fastest, Free)
      if (isNativeSupported && transcriptRef.current && transcriptRef.current.trim().length > 0) {
        console.log('DebateArena: Using native browser transcription');
        transcriptionText = transcriptRef.current;
      } 
      // Priority 2: Fallback to API (OpenAI/Supabase)
      else {
        console.log('DebateArena: Native STT empty or unsupported, falling back to API...');
        const result = await transcribeAudio(base64Data);
        if (!result) throw new Error('Transcription failed');
        transcriptionText = result.transcription;
      }
      
      console.log('DebateArena: Final Transcription:', transcriptionText);

      // Save turn using RPC
      const nextTurnNumber = (turns.length > 0 ? turns[turns.length - 1].turn_number : 0) + 1;
      
      console.log('DebateArena: Submitting turn', nextTurnNumber);

      const { error } = await supabase
        .rpc('submit_debate_turn', {
          p_debate_id: debateId,
          p_speaker_id: userId,
          p_transcript: transcriptionText,
          p_audio_url: base64Audio,
          p_turn_number: nextTurnNumber,
          p_total_turns: debate.total_turns,
          p_challenger_id: debate.challenger_id,
          p_opponent_id: debate.opponent_id
        });

      if (error) {
        console.error('DebateArena: RPC Error:', error);
        throw error;
      }

      toast({ title: 'Success', description: 'Your argument has been recorded.' });
      
      // Manually refresh data since Realtime might be blocked by RLS/Custom Auth
      console.log('DebateArena: Manually refreshing data after submission...');
      await fetchDebateData();

      // Check if debate is complete and trigger analysis
      // Assuming total_turns represents rounds, so total individual turns is total_turns * 2
      // If total_turns represents actual turns, then just total_turns
      // Based on UI "Round X / Y", Y seems to be total rounds.
      // Let's assume total_turns is ROUNDS for now based on standard debate formats.
      // If nextTurnNumber is the last turn (e.g. 6 for 3 rounds)
      const maxTurns = debate.total_turns * 2; 
      
      if (nextTurnNumber >= maxTurns) {
        console.log('DebateArena: Debate finished, triggering analysis...');
        await triggerAnalysis();
      }
      
    } catch (error: any) {
      console.error('Error saving turn:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save turn', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const triggerAnalysis = async () => {
    try {
      toast({ title: 'Analyzing', description: 'Generating debate analysis...' });
      
      // Fetch latest turns to ensure we have the full transcript
      const { data: allTurns, error: turnsError } = await supabase
        .rpc('get_debate_turns', { p_debate_id: debateId });
      
      if (turnsError || !allTurns) {
        console.error('DebateArena: Failed to fetch turns for analysis');
        return;
      }

      const messages = allTurns.map((t: any) => ({
        id: t.id,
        senderName: t.speaker_name,
        text: t.transcript,
        side: t.speaker_id === debate.challenger_id ? 'FOR' : 'AGAINST',
        timestamp: t.created_at
      }));

      const debateData = {
        roomId: debateId,
        topic: debate.topic,
        messages: messages,
        participants: [
          { id: debate.challenger_id, name: debate.challenger_name, side: 'FOR' },
          { id: debate.opponent_id, name: debate.opponent_name, side: 'AGAINST' }
        ]
      };

      const n8nWebhookUrl = 'https://n8n-k6lq.onrender.com/webhook/human-debate-analysis';
      
      const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: { debateData } })
      });
      
      if (!response.ok) throw new Error('Analysis webhook failed');
      
      const analysisResult = await response.json();
      console.log('DebateArena: Analysis result:', analysisResult);

      // Handle array response from n8n
      const finalAnalysis = Array.isArray(analysisResult) ? analysisResult[0] : analysisResult;

      // Determine winner ID
      let winnerId = null;
      if (finalAnalysis.winner === 'FOR') winnerId = debate.challenger_id;
      else if (finalAnalysis.winner === 'AGAINST') winnerId = debate.opponent_id;

      // Use RPC to update both tables securely
      console.log('DebateArena: Saving analysis via RPC...', { debateId, userId, winnerId });
      
      const { data: rpcData, error: rpcError } = await supabase.rpc('update_debate_analysis', {
        p_debate_id: debateId,
        p_user_id: userId,
        p_analysis_data: finalAnalysis,
        p_winner_id: winnerId
      });

      if (rpcError) {
        console.error('DebateArena: RPC Error updating analysis:', rpcError);
        // Fallback to direct update if RPC fails (though RPC is preferred)
        console.log('DebateArena: Attempting fallback direct update...');
        
        const { error: updateError } = await supabase
            .from('debates')
            .update({ 
                analysis_data: finalAnalysis,
                winner_id: winnerId,
                status: 'completed'
            })
            .eq('id', debateId);

        if (updateError) console.error('DebateArena: Fallback update failed', updateError);
        else console.log('DebateArena: Fallback update success');
        
      } else {
        console.log('DebateArena: Analysis saved via RPC:', rpcData);
        toast({ title: 'Analysis Complete', description: 'Debate analysis has been generated.' });
        await fetchDebateData(); // Refresh UI to show winner
      }

    } catch (err) {
      console.error('DebateArena: Analysis error', err);
      toast({ title: 'Analysis Failed', description: 'Could not generate analysis.', variant: 'destructive' });
    }
  };

  if (!debate) return <div className="text-center p-8 text-gray-400">Loading debate...</div>;

  const isChallenger = debate.challenger_id === userId;
  const isMyTurn = debate.status === 'active' && (
    (debate.current_turn % 2 === 0 && isChallenger) || // Challenger starts (turn 0, 2, 4...)
    (debate.current_turn % 2 !== 0 && !isChallenger)   // Opponent follows (turn 1, 3, 5...)
  );
  const isCompleted = debate.status === 'completed';
  
  let winnerName = 'Draw';
  if (debate.winner_id) {
    if (debate.winner_id === debate.challenger_id) winnerName = debate.challenger?.full_name;
    else if (debate.winner_id === debate.opponent_id) winnerName = debate.opponent?.full_name;
  }

  return (
    <div className="space-y-6">
      <Card className="card-neon">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-orbitron text-gray-50 mb-2">{debate.topic}</CardTitle>
              <div className="flex gap-4 text-sm text-gray-400">
                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                  Round {Math.floor(debate.current_turn / 2) + 1} / {debate.total_turns}
                </Badge>
                <span>{debate.challenger?.full_name} vs {debate.opponent?.full_name}</span>
              </div>
            </div>
            {isCompleted && (
              <div className="text-right flex flex-col items-end gap-2">
                <Badge className={`px-4 py-2 text-lg ${winnerName === 'Draw' ? 'bg-gray-500/20 text-gray-400 border-gray-500/50' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'}`}>
                  <Trophy className="w-4 h-4 mr-2" />
                  {winnerName === 'Draw' ? 'Result: Draw' : `Winner: ${winnerName}`}
                </Badge>
                {onViewAnalysis && debate.analysis_data && (
                  <Button 
                    size="sm" 
                    className="btn-neon-secondary" 
                    onClick={() => {
                      // Extract the correct analysis based on user role
                      let userAnalysis = debate.analysis_data;
                      const isChallenger = debate.challenger_id === userId;
                      
                      // Check if we have the nested structure from n8n (forAnalysis/againstAnalysis)
                      if (debate.analysis_data.forAnalysis || debate.analysis_data.againstAnalysis) {
                        if (isChallenger) {
                          userAnalysis = debate.analysis_data.forAnalysis || debate.analysis_data.feedbackForPro;
                        } else {
                          userAnalysis = debate.analysis_data.againstAnalysis || debate.analysis_data.feedbackForCon;
                        }
                      }
                      
                      // If we still don't have valid analysis data (e.g. it's null), fallback to the whole object
                      if (!userAnalysis) userAnalysis = debate.analysis_data;

                      onViewAnalysis(userAnalysis, { 
                        topic: debate.topic, 
                        duration: 0, 
                        difficulty: 'Medium' 
                      });
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" /> View Analysis
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className=" pr-4 mb-6" ref={scrollRef}>
            <div className="space-y-4">
              {turns.map((turn) => (
                <div key={turn.id} className={`flex flex-col ${turn.speaker_id === userId ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-4 ${
                    turn.speaker_id === userId 
                      ? 'bg-cyan-900/30 border border-cyan-500/30 rounded-tr-none' 
                      : 'bg-gray-800 border border-gray-700 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between mb-2 gap-4">
                      <span className="text-xs font-bold text-gray-400">{turn.speaker?.full_name}</span>
                      <span className="text-xs text-gray-500">Turn {turn.turn_number}</span>
                    </div>
                    <p className="text-gray-200 mb-3">{turn.transcript}</p>
                    {turn.audio_url && !isCompleted && (
                      <audio controls src={turn.audio_url} className="w-full h-8" />
                    )}
                    {isCompleted && (
                      <p className="text-xs text-gray-500 italic">[Audio expired]</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {debate.status === 'active' && (
            <div className="flex justify-center">
              {isMyTurn ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-cyan-400 font-bold animate-pulse">It's your turn to speak!</p>
                  {!isRecording ? (
                    <Button 
                      size="lg" 
                      className="btn-neon-primary rounded-full w-16 h-16 p-0" 
                      onClick={startRecording}
                      disabled={uploading || isProcessing}
                    >
                      <Mic className="w-8 h-8" />
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      variant="destructive" 
                      className="rounded-full w-16 h-16 p-0 animate-pulse" 
                      onClick={stopRecording}
                    >
                      <Square className="w-8 h-8" />
                    </Button>
                  )}
                  {uploading && <span className="text-sm text-gray-400 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Processing...</span>}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-gray-400">Waiting for opponent to respond...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebateArena;
