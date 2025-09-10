
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
      const { data, error: functionError } = await supabase.functions.invoke('speech-to-text', {
        body: {
          audioData,
          language: options.language || 'en',
          sessionId: options.sessionId
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Speech-to-text error:', err);
      return null;
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
