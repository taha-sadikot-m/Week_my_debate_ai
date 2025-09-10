
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Radio, Volume2 } from 'lucide-react';

interface VoiceInputButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

const VoiceInputButton = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  disabled = false 
}: VoiceInputButtonProps) => {
  return (
    <Card className="card-shadow border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Main Recording Button */}
          <Button
            size="lg"
            disabled={disabled}
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`w-32 h-32 rounded-full text-white font-bold text-lg transition-all duration-300 shadow-2xl ${
              isRecording 
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse scale-110 shadow-red-500/50' 
                : disabled 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 hover:scale-105 shadow-indigo-500/30'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {isRecording ? (
                <MicOff className="h-12 w-12" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
              <span className="text-sm font-bold">
                {isRecording ? 'Stop' : 'Speak'}
              </span>
            </div>
          </Button>

          {/* Recording Status */}
          <div className="text-center space-y-3">
            {isRecording ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    Recording in Progress
                  </span>
                  <Volume2 className="h-5 w-5 text-red-500 animate-bounce" />
                </div>
                
                {/* Enhanced Waveform Animation */}
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-red-500 to-red-300 rounded-full animate-pulse"
                      style={{
                        width: '4px',
                        height: `${Math.random() * 32 + 12}px`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${0.5 + Math.random() * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  🎤 Start Speaking
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm">
                  {disabled 
                    ? 'Wait for your turn to speak' 
                    : 'Press the button and deliver your argument with confidence'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Voice Quality Indicator */}
          {!isRecording && !disabled && (
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Advanced STT • Real-time transcription ready</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInputButton;
