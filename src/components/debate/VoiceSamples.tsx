
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, TestTube } from 'lucide-react';
import { useAutoTextToSpeech } from '@/hooks/useAutoTextToSpeech';

const VoiceSamples = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [testText, setTestText] = useState('Hello! This is a test of the text-to-speech functionality. How are you today?');
  
  const { speakText, stopSpeaking, isSupported, availableVoices, bestVoice } = useAutoTextToSpeech({
    enabled: true,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceType: 'natural'
  });

  const handleTestTTS = () => {
    if (!isSupported) {
      alert('Text-to-speech is not supported in this browser');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      
      // Create a custom utterance to track speaking state
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        
        utterance.onstart = () => {
          console.log('Test TTS started');
        };
        
        utterance.onend = () => {
          console.log('Test TTS ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Test TTS error:', event.error);
          setIsSpeaking(false);
        };
        
        speechSynthesis.speak(utterance);
      }
    }
  };

  const voiceSamples = [
    {
      id: 1,
      title: "Welcome Speech",
      text: "Welcome to DebateWorld AI! I'm excited to engage in a thoughtful discussion with you today.",
      speaker: "AI Moderator",
      accent: "British"
    },
    {
      id: 2,
      title: "Opening Statement",
      text: "Ladies and gentlemen, today we will explore the fascinating topic of artificial intelligence in education.",
      speaker: "AI Opponent",
      accent: "Indian"
    },
    {
      id: 3,
      title: "Rebuttal Example",
      text: "While I understand your perspective, I must respectfully disagree with several points you've raised.",
      speaker: "AI Opponent",
      accent: "American"
    }
  ];

  const playSample = (text: string) => {
    if (!isSupported) {
      alert('Text-to-speech is not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
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
      // Fallback to a British accent
      const fallbackVoice = voices.find(voice => 
        voice.lang.includes('en-GB') || voice.lang.includes('en-AU')
      );
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
      }
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-blue-600" />
            <span>Voice Samples & TTS Test</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            TTS Ready
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* TTS Test Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <TestTube className="h-4 w-4 mr-2" />
            Test Text-to-Speech
          </h4>
          <div className="space-y-3">
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded text-sm"
              rows={3}
              placeholder="Enter text to test TTS..."
            />
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleTestTTS}
                variant={isSpeaking ? "destructive" : "default"}
                size="sm"
                disabled={!isSupported}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-1" />
                    Stop Test
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-1" />
                    Test TTS
                  </>
                )}
              </Button>
              {!isSupported && (
                <span className="text-sm text-red-600">TTS not supported</span>
              )}
              {isSupported && (
                <span className="text-sm text-green-600">
                  TTS Supported • {availableVoices.length} voices available
                </span>
              )}
            </div>
            {bestVoice && (
              <div className="text-xs text-blue-700">
                Selected voice: {bestVoice.name} ({bestVoice.lang})
              </div>
            )}
          </div>
        </div>

        {/* Voice Samples */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Sample AI Responses</h4>
          <div className="space-y-3">
            {voiceSamples.map((sample) => (
              <div key={sample.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">{sample.title}</h5>
                    <p className="text-xs text-gray-600">
                      {sample.speaker} • {sample.accent} accent
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playSample(sample.text)}
                    disabled={!isSupported}
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                </div>
                <p className="text-sm text-gray-700">{sample.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TTS Status */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">TTS Status</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Browser Support:</span>
              <span className={isSupported ? 'text-green-600' : 'text-red-600'}>
                {isSupported ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Available Voices:</span>
              <span className="text-blue-600">{availableVoices.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Selected Voice:</span>
              <span className="text-gray-600">
                {bestVoice ? `${bestVoice.name} (${bestVoice.lang})` : 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          * Voice quality depends on your browser's text-to-speech capabilities. Some languages may not be available on all devices.
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSamples;
