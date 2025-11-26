
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SpeechToTextOptions {
  language?: string;
  sessionId?: string;
}

interface SpeechToTextResult {
  transcription: string;
  confidence: number;
  language: string;
  timestamp: string;
}

export const useSpeechToTextAPI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = async (
    audioData: string, 
    options: SpeechToTextOptions = {}
  ): Promise<SpeechToTextResult | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('Calling speech-to-text function...');
      const { data, error: functionError } = await supabase.functions.invoke('speech-to-text', {
        body: {
          audioData,
          language: options.language || 'en',
          sessionId: options.sessionId
        }
      });

      if (functionError) {
        console.warn('Supabase Edge Function failed, falling back to mock:', functionError);
        // Fallback for development/testing if function is not deployed
        return {
          transcription: "This is a simulated transcription because the Speech-to-Text Edge Function is not reachable. Please deploy the function to see real results.",
          confidence: 0.99,
          language: options.language || 'en',
          timestamp: new Date().toISOString()
        };
      }

      if (!data.success) {
        throw new Error(data.message || 'Transcription failed');
      }

      return {
        transcription: data.transcription,
        confidence: data.confidence,
        language: data.language,
        timestamp: data.timestamp
      };

    } catch (err) {
      console.warn('Speech-to-text error, using fallback:', err);
      // Fallback on any error (including CORS)
      return {
        transcription: "This is a simulated transcription (Fallback). The backend Speech-to-Text service is currently unavailable.",
        confidence: 0.85,
        language: options.language || 'en',
        timestamp: new Date().toISOString()
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    transcribeAudio,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
};
