
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VolumeX, Brain, Sparkles } from 'lucide-react';
import { useAutoTextToSpeech } from '@/hooks/useAutoTextToSpeech';

interface AIResponseProps {
  aiResponse: string;
  onNextRound: () => void;
}

const AIResponse = ({ aiResponse, onNextRound }: AIResponseProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const { speakText, stopSpeaking, isSupported } = useAutoTextToSpeech({
    enabled: true,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceType: 'natural'
  });

  // Auto-speak AI response when it appears
  useEffect(() => {
    if (aiResponse && isSupported) {
      setIsSpeaking(true);
      
      // Create a custom utterance to track speaking state
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        
        // Try to find an Indian accent voice
        const voices = speechSynthesis.getVoices();
        const indianVoice = voices.find(voice => 
          voice.lang.includes('en-IN') || 
          voice.name.toLowerCase().includes('indian') ||
          voice.name.toLowerCase().includes('ravi') ||
          voice.name.toLowerCase().includes('aditi')
        );
        
        if (indianVoice) {
          utterance.voice = indianVoice;
        } else {
          // Fallback to a British or Australian accent
          const fallbackVoice = voices.find(voice => 
            voice.lang.includes('en-GB') || 
            voice.lang.includes('en-AU')
          );
          if (fallbackVoice) {
            utterance.voice = fallbackVoice;
          }
        }
        
        // Adjust speech parameters for Indian accent characteristics
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => {
          console.log('AI Response speech started');
        };
        
        utterance.onend = () => {
          console.log('AI Response speech ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('AI Response speech error:', event.error);
          setIsSpeaking(false);
        };
        
        speechSynthesis.speak(utterance);
      }
    }
  }, [aiResponse, isSupported]);

  const handleStopSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto card-shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          <span>ArguAI Response</span>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Auto TTS
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI Response Text */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900">ArguAI</span>
            </div>
            
            {/* Stop Speech Button */}
            {isSpeaking && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStopSpeech}
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              >
                <VolumeX className="h-4 w-4 mr-1" />
                Stop Speech
              </Button>
            )}
          </div>
          
          <p className="text-gray-800 leading-relaxed text-lg">
            {aiResponse}
          </p>
          
          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="mt-4 flex items-center space-x-2 text-blue-600">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Speaking...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Status:</span>
            <Badge className={isSpeaking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {isSpeaking ? 'Speaking' : 'Ready'}
            </Badge>
          </div>
          
          <Button
            onClick={onNextRound}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            disabled={isSpeaking}
          >
            Continue Debate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
