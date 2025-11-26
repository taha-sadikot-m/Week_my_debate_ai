import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ChallengeCreation from './ChallengeCreation';
import ChallengeList from './ChallengeList';
import DebateArena from './DebateArena';
import DebateAnalysis from '../../DebateAnalysis.tsx';

interface OneOnOneDebateHubProps {
  onBack: () => void;
}

const OneOnOneDebateHub = ({ onBack }: OneOnOneDebateHubProps) => {
  const [view, setView] = useState<'list' | 'create' | 'arena' | 'analysis'>('list');
  const [selectedDebateId, setSelectedDebateId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [debateContext, setDebateContext] = useState<any>(null);

  const handleCreateChallenge = () => setView('create');
  const handleSelectDebate = (debateId: string) => {
    setSelectedDebateId(debateId);
    setView('arena');
  };
  const handleViewAnalysis = (data: any, context: any) => {
    setAnalysisData(data);
    setDebateContext(context);
    setView('analysis');
  };
  const handleBackToList = () => {
    setView('list');
    setSelectedDebateId(null);
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-orbitron neon-text">1:1 Debate Arena</h1>
          <Button onClick={onBack} variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        {view === 'list' && (
          <ChallengeList 
            onCreateChallenge={handleCreateChallenge} 
            onSelectDebate={handleSelectDebate}
            onViewAnalysis={handleViewAnalysis}
          />
        )}

        {view === 'create' && (
          <ChallengeCreation 
            onBack={handleBackToList} 
            onChallengeCreated={handleBackToList} 
          />
        )}

        {view === 'arena' && selectedDebateId && (
          <DebateArena 
            debateId={selectedDebateId} 
            onBack={handleBackToList}
            onViewAnalysis={handleViewAnalysis}
          />
        )}

        {view === 'analysis' && analysisData && (
          <DebateAnalysis 
            analysisData={analysisData}
            onBack={handleBackToList}
            debateContext={debateContext}
          />
        )}
      </div>
    </div>
  );
};

export default OneOnOneDebateHub;
