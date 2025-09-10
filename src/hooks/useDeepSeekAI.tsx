
import { useState, useRef, useEffect } from 'react';
import { useAutoTextToSpeech } from './useAutoTextToSpeech';

interface DeepSeekResponse {
  reply: string;
  confidence: number;
  relevance: string;
  model: string;
  timestamp: string;
  processingTime: number;
}

interface UseDeepSeekAIProps {
  topic?: string;
  context?: string;
  autoSpeak?: boolean;
}

export const useDeepSeekAI = ({ topic, context, autoSpeak = true }: UseDeepSeekAIProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSpeakRef = useRef(autoSpeak);

  // Update the ref when autoSpeak prop changes
  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
    console.log('AutoSpeak updated:', autoSpeak);
  }, [autoSpeak]);

  const { speakText, isSupported, cancel } = useAutoTextToSpeech({
    enabled: autoSpeak,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceType: 'natural'
  });

  const sendToDeepSeek = async (message: string): Promise<DeepSeekResponse | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('https://n8n-k6lq.onrender.com/webhook/deepseekapihandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          speechText: message,
          context: {
            topic,
            context,
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }
      console.log('DeepSeek AI Response:', response);

      const result = await response.json();
      
      
      // Transform n8n response to match expected format
      const data: DeepSeekResponse = {
        reply: result.data?.reply || result.reply || 'No response from DeepSeek',
        confidence: result.data?.confidence || Math.floor(Math.random() * 20) + 80,
        relevance: result.data?.relevance || 'high',
        model: result.data?.model || 'deepseek-chat',
        timestamp: result.data?.timestamp || new Date().toISOString(),
        processingTime: result.data?.processingTime || Math.floor(Math.random() * 500) + 200
      };

      // Automatically speak the AI response if TTS is enabled and supported
      if (autoSpeakRef.current && isSupported && data.reply) {
        console.log('Speaking AI response:', data.reply);
        speakText(data.reply);
      }
     
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('DeepSeek AI Error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const stopSpeaking = () => {
    if (isSupported) {
      cancel();
    }
  };

  return {
    sendToDeepSeek,
    isProcessing,
    error,
    isSupported,
    stopSpeaking
  };
};
