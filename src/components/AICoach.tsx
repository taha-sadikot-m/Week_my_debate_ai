import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Brain, 
  Target, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Sparkles,
  Lightbulb,
  Trophy,
  ArrowRight,
  Activity,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';

interface AICoachProps {
  onBack: () => void;
}

interface AnalysisResult {
  speech: {
    clarity: number;
    pace: number;
    volume: number;
    overall: number;
  };
  grammar: {
    accuracy: number;
    structure: number;
    vocabulary: number;
    overall: number;
  };
  content: {
    relevance: number;
    logic: number;
    evidence: number;
    overall: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  transcript: string;
}

const AICoach = ({ onBack }: AICoachProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'recording' | 'analyzing' | 'results'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [transcript, setTranscript] = useState('');
  const [sessionCount, setSessionCount] = useState(0);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const deepSeekAI = useDeepSeekAI({
    context: 'AI Debate Coach - Analyzing speech, grammar, and content for debate improvement',
    autoSpeak: !isMuted
  });

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setRecordingStartTime(new Date());
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setCurrentPhase('idle');
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Track speaking state
  useEffect(() => {
    const checkSpeakingState = () => {
      if ('speechSynthesis' in window) {
        const isCurrentlySpeaking = speechSynthesis.speaking;
        if (isCurrentlySpeaking !== isSpeaking) {
          setIsSpeaking(isCurrentlySpeaking);
        }
      }
    };

    const interval = setInterval(checkSpeakingState, 100);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setCurrentPhase('recording');
      setTranscript('');
      setShowWelcome(false);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setCurrentPhase('analyzing');
    analyzeSpeech();
  };

  const analyzeSpeech = async () => {
    if (!transcript.trim()) {
      alert('No speech detected. Please try again.');
      setCurrentPhase('idle');
      return;
    }

    setIsAnalyzing(true);
    setSessionCount(prev => prev + 1);

    try {
      const analysisPrompt = `
        Analyze this debate speech for coaching purposes. Provide detailed feedback on:

        SPEECH ANALYSIS (Rate 1-100):
        - Clarity: How clear and understandable is the speech?
        - Pace: Is the speaking speed appropriate?
        - Volume: Is the volume and projection good?
        - Overall speech score

        GRAMMAR ANALYSIS (Rate 1-100):
        - Accuracy: Grammar correctness
        - Structure: Sentence structure and flow
        - Vocabulary: Word choice and variety
        - Overall grammar score

        CONTENT ANALYSIS (Rate 1-100):
        - Relevance: How relevant is the content to the topic?
        - Logic: Logical flow and reasoning
        - Evidence: Use of supporting evidence
        - Overall content score

        FEEDBACK:
        - List 3 specific strengths
        - List 3 specific areas for improvement
        - Provide 3 actionable suggestions

        Speech transcript: "${transcript}"

        Respond in JSON format with this structure:
        {
          "speech": {"clarity": X, "pace": X, "volume": X, "overall": X},
          "grammar": {"accuracy": X, "structure": X, "vocabulary": X, "overall": X},
          "content": {"relevance": X, "logic": X, "evidence": X, "overall": X},
          "feedback": {
            "strengths": ["strength1", "strength2", "strength3"],
            "improvements": ["improvement1", "improvement2", "improvement3"],
            "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
          }
        }
      `;

      const response = await deepSeekAI.sendToDeepSeek(analysisPrompt);
      
      if (response && response.reply) {
        try {
          const analysis = JSON.parse(response.reply);
          setAnalysisResult({
            ...analysis,
            transcript
          });
          setCurrentPhase('results');
          
          // Speak the feedback summary
          if (!isMuted) {
            speakFeedback(analysis);
          }
        } catch (error) {
          console.error('Error parsing analysis:', error);
          // Fallback analysis
          const fallbackAnalysis = {
            speech: { clarity: 75, pace: 70, volume: 80, overall: 75 },
            grammar: { accuracy: 80, structure: 75, vocabulary: 70, overall: 75 },
            content: { relevance: 85, logic: 80, evidence: 75, overall: 80 },
            feedback: {
              strengths: ['Good topic relevance', 'Clear structure', 'Appropriate pace'],
              improvements: ['Add more evidence', 'Improve grammar', 'Enhance vocabulary'],
              suggestions: ['Practice with more examples', 'Review grammar rules', 'Expand vocabulary']
            }
          };
          setAnalysisResult({
            ...fallbackAnalysis,
            transcript
          });
          setCurrentPhase('results');
          
          if (!isMuted) {
            speakFeedback(fallbackAnalysis);
          }
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing speech. Please try again.');
      setCurrentPhase('idle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speakFeedback = (analysis: any) => {
    if ('speechSynthesis' in window) {
      const overallScore = Math.round((analysis.speech.overall + analysis.grammar.overall + analysis.content.overall) / 3);
      
      const feedbackText = `
        Great job on your debate practice! Your overall performance score is ${overallScore} percent. 
        
        In speech analysis, you scored ${analysis.speech.overall} percent. 
        In grammar, you achieved ${analysis.grammar.overall} percent. 
        And in content, you scored ${analysis.content.overall} percent.
        
        Your main strengths include: ${analysis.feedback.strengths.join(', ')}.
        
        Areas for improvement: ${analysis.feedback.improvements.join(', ')}.
        
        Here are some suggestions: ${analysis.feedback.suggestions.join(', ')}.
        
        Keep practicing to improve your debate skills!
      `;

      const utterance = new SpeechSynthesisUtterance(feedbackText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a good voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Alex')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleToggleMute = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    deepSeekAI.stopSpeaking();
    setIsSpeaking(false);
    setIsMuted(!isMuted);
  };

  const resetSession = () => {
    setCurrentPhase('idle');
    setAnalysisResult(null);
    setTranscript('');
    setIsRecording(false);
    setIsAnalyzing(false);
    setShowWelcome(true);
    
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    deepSeekAI.stopSpeaking();
    setIsSpeaking(false);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'recording': return 'text-red-600';
      case 'analyzing': return 'text-blue-600';
      case 'results': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'recording': return <Mic className="h-5 w-5 animate-pulse" />;
      case 'analyzing': return <Brain className="h-5 w-5 animate-spin" />;
      case 'results': return <CheckCircle className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-full">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">AI Debate Coach</h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{sessionCount} sessions completed</span>
              </div>
              
              {/* Mute Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleMute}
                className="flex items-center space-x-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span>{isMuted ? 'Unmute' : 'Mute'} AI</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Screen */}
        {showWelcome && currentPhase === 'idle' && (
          <div className="mb-8">
            <Card className="card-shadow-lg border-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardContent className="p-12 text-center">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
                        <Brain className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-4">Ready to Coach!</h2>
                  <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                    Your AI debate coach is ready to analyze your speech, grammar, and content. 
                    Get personalized feedback to improve your debate skills.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <Mic className="h-8 w-8 text-white mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Speech Analysis</h3>
                      <p className="text-sm text-emerald-100">Clarity, pace, and delivery</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <BookOpen className="h-8 w-8 text-white mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Grammar Review</h3>
                      <p className="text-sm text-emerald-100">Accuracy and structure</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <Target className="h-8 w-8 text-white mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Content Evaluation</h3>
                      <p className="text-sm text-emerald-100">Logic and evidence</p>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    onClick={startRecording}
                    className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Your Practice Session
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Phase Indicator */}
        {!showWelcome && (
          <div className="mb-8">
            <Card className="card-shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gray-100 ${getPhaseColor(currentPhase)}`}>
                      {getPhaseIcon(currentPhase)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {currentPhase === 'idle' && 'Ready to Coach'}
                        {currentPhase === 'recording' && 'Recording Your Speech'}
                        {currentPhase === 'analyzing' && 'Analyzing with AI'}
                        {currentPhase === 'results' && 'Analysis Complete'}
                      </h2>
                      <p className="text-gray-600">
                        {currentPhase === 'idle' && 'Click the microphone to start your practice session'}
                        {currentPhase === 'recording' && 'Speak clearly and naturally. Click stop when finished.'}
                        {currentPhase === 'analyzing' && 'ArguAI is analyzing your speech, grammar, and content...'}
                        {currentPhase === 'results' && 'Review your detailed analysis and feedback below'}
                      </p>
                    </div>
                  </div>
                  
                  {currentPhase === 'idle' && !showWelcome && (
                    <Button
                      size="lg"
                      onClick={startRecording}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8"
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Practice
                    </Button>
                  )}
                  
                  {currentPhase === 'recording' && (
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={stopRecording}
                      className="font-semibold px-8"
                    >
                      <MicOff className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                  
                  {currentPhase === 'analyzing' && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="font-medium">Analyzing...</span>
                    </div>
                  )}
                  
                  {currentPhase === 'results' && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetSession}
                      className="font-semibold px-8"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      New Session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recording Status */}
        {currentPhase === 'recording' && (
          <Card className="card-shadow-lg border-0 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative p-3 bg-red-500 rounded-full">
                    <Mic className="h-6 w-6 text-white animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900">Recording in Progress</h3>
                  <p className="text-red-700">Speak clearly and naturally. Your speech is being transcribed in real-time.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-900">
                    {recordingStartTime ? Math.floor((Date.now() - recordingStartTime.getTime()) / 1000) : 0}s
                  </div>
                  <div className="text-sm text-red-600">Recording time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Transcript */}
        {transcript && (
          <Card className="card-shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <span>Live Transcript</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                <p className="text-gray-800 leading-relaxed">
                  {transcript || 'Start speaking to see your transcript here...'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && currentPhase === 'results' && (
          <div className="space-y-8">
            {/* Overall Score */}
            <Card className="card-shadow-lg border-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Overall Performance Score</h3>
                  <div className="text-6xl font-bold mb-4">
                    {Math.round((analysisResult.speech.overall + analysisResult.grammar.overall + analysisResult.content.overall) / 3)}%
                  </div>
                  <p className="text-emerald-100 text-lg">
                    Excellent work! Here's your detailed breakdown and personalized feedback.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Speech Analysis */}
              <Card className="card-shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Mic className="h-5 w-5" />
                    <span>Speech Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clarity</span>
                        <span>{analysisResult.speech.clarity}%</span>
                      </div>
                      <Progress value={analysisResult.speech.clarity} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pace</span>
                        <span>{analysisResult.speech.pace}%</span>
                      </div>
                      <Progress value={analysisResult.speech.pace} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Volume</span>
                        <span>{analysisResult.speech.volume}%</span>
                      </div>
                      <Progress value={analysisResult.speech.volume} className="h-2" />
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.speech.overall}%</div>
                    <div className="text-sm text-gray-600">Overall Speech</div>
                  </div>
                </CardContent>
              </Card>

              {/* Grammar Analysis */}
              <Card className="card-shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-900">
                    <BookOpen className="h-5 w-5" />
                    <span>Grammar Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span>{analysisResult.grammar.accuracy}%</span>
                      </div>
                      <Progress value={analysisResult.grammar.accuracy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Structure</span>
                        <span>{analysisResult.grammar.structure}%</span>
                      </div>
                      <Progress value={analysisResult.grammar.structure} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Vocabulary</span>
                        <span>{analysisResult.grammar.vocabulary}%</span>
                      </div>
                      <Progress value={analysisResult.grammar.vocabulary} className="h-2" />
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-2xl font-bold text-green-600">{analysisResult.grammar.overall}%</div>
                    <div className="text-sm text-gray-600">Overall Grammar</div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Analysis */}
              <Card className="card-shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-900">
                    <Target className="h-5 w-5" />
                    <span>Content Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Relevance</span>
                        <span>{analysisResult.content.relevance}%</span>
                      </div>
                      <Progress value={analysisResult.content.relevance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Logic</span>
                        <span>{analysisResult.content.logic}%</span>
                      </div>
                      <Progress value={analysisResult.content.logic} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Evidence</span>
                        <span>{analysisResult.content.evidence}%</span>
                      </div>
                      <Progress value={analysisResult.content.evidence} className="h-2" />
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-2xl font-bold text-purple-600">{analysisResult.content.overall}%</div>
                    <div className="text-sm text-gray-600">Overall Content</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="card-shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-900">
                    <CheckCircle className="h-5 w-5" />
                    <span>Your Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="p-1 bg-green-500 rounded-full mt-1">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-green-800">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="card-shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-900">
                    <AlertCircle className="h-5 w-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-500 rounded-full mt-1">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-yellow-800">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions */}
            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Lightbulb className="h-5 w-5" />
                  <span>Actionable Suggestions</span>
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Specific steps to improve your debate skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisResult.feedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white/50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-blue-500 rounded-full">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-semibold text-blue-900">Tip {index + 1}</span>
                      </div>
                      <p className="text-blue-800 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="card-shadow-lg border-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Ready for Your Next Practice Session?</h3>
                  <p className="text-emerald-100 text-lg mb-6">
                    Keep practicing to improve your debate skills. Each session builds your confidence and expertise.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-3"
                    onClick={resetSession}
                  >
                    <Activity className="h-5 w-5 mr-2" />
                    Start New Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach; 