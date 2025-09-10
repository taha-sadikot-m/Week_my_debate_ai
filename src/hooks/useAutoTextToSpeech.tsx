// @ts-nocheck
import { useTextToSpeech } from './useTextToSpeech';
import { useCallback, useEffect } from 'react';

interface UseAutoTextToSpeechOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceType?: 'natural' | 'enhanced' | 'default';
}

export const useAutoTextToSpeech = (options: UseAutoTextToSpeechOptions = {}) => {
  const {
    enabled = true,
    rate = 0.9,
    pitch = 1.0,
    volume = 0.8,
    voiceType = 'natural'
  } = options;

  const { speak, cancel, voices, isSupported } = useTextToSpeech({
    rate,
    pitch,
    volume
  });

  const selectBestVoice = useCallback(() => {
    if (!voices.length) {
      console.log('No voices available for TTS');
      return null;
    }

    //console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

    // Find the best voice based on preference
    const preferenceOrder = {
      natural: ['Natural', 'Enhanced', 'Premium'],
      enhanced: ['Enhanced', 'Premium', 'Natural'],
      default: ['Google', 'Microsoft', 'Apple']
    };

    const keywords = preferenceOrder[voiceType] || preferenceOrder.default;
    
    for (const keyword of keywords) {
      const voice = voices.find(v => 
        v.name.includes(keyword) && v.lang.startsWith('en-')
      );
      if (voice) {
        console.log(`Selected voice: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // Fallback to any English voice
    const fallbackVoice = voices.find(v => v.lang.startsWith('en-'));
    if (fallbackVoice) {
      console.log(`Using fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
      return fallbackVoice;
    }

    // Last resort - use any available voice
    const anyVoice = voices[0];
    if (anyVoice) {
      console.log(`Using any available voice: ${anyVoice.name} (${anyVoice.lang})`);
      return anyVoice;
    }

    console.warn('No suitable voice found for TTS');
    return null;
  }, [voices, voiceType]);

  const speakText = useCallback((text: string) => {
    if (!enabled) {
      console.log('TTS is disabled');
      return;
    }
    
    if (!isSupported) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }
    
    if (!text) {
      console.warn('No text provided for TTS');
      return;
    }

    console.log('Attempting to speak text:', text.substring(0, 100) + '...');

    // Cancel any ongoing speech
    cancel();

    // Clean text for better speech
    const cleanText = text
      .replace(/[*_~`]/g, '') // Remove markdown formatting
      .replace(/\n+/g, '. ') // Replace line breaks with pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanText.length === 0) {
      console.warn('Text is empty after cleaning');
      return;
    }

    // Use the browser's speech synthesis directly for better control
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        const bestVoice = selectBestVoice();
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        // Add event handlers for better user experience
        utterance.onstart = () => {
          console.log('Speech started successfully');
        };

        utterance.onend = () => {
          console.log('Speech ended successfully');
        };

        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
        };

        window.speechSynthesis.speak(utterance);
        console.log('Speech synthesis initiated');
      } catch (error) {
        console.error('Error creating speech utterance:', error);
      }
    } else {
      console.error('Speech synthesis not available in this browser');
    }
  }, [enabled, isSupported, rate, pitch, volume, selectBestVoice, cancel]);

  const stopSpeaking = useCallback(() => {
    console.log('Stopping speech synthesis');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    cancel();
  }, [cancel]);

  // Auto-load voices
  useEffect(() => {
    if ('speechSynthesis' in window && voices.length === 0) {
      console.log('Loading available voices...');
      // Trigger voice loading
      window.speechSynthesis.getVoices();
    }
  }, [voices.length]);

  return {
    speakText,
    stopSpeaking,
    isSupported,
    availableVoices: voices,
    bestVoice: selectBestVoice()
  };
};