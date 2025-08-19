import { useState } from 'react';
import { SessionState, Delegate, ProposedMotion, ActiveMotion } from './types';
import SetupScreen from './components/SetupScreen';
import SessionDashboard from './components/SessionDashboard';
import ActiveMotionDisplay from './components/ActiveMotionDisplay';
import './App.css';

function App() {
  const [sessionState, setSessionState] = useState<SessionState>({
    status: 'setup',
    delegates: [],
    activeMotion: null,
    proposedMotions: [],
  });

  const handleSessionStart = (delegates: Delegate[]) => {
    setSessionState({
      status: 'awaiting_motion',
      delegates,
      activeMotion: null,
      proposedMotions: [],
    });
  };

  const handleAddProposedMotion = (motion: ProposedMotion) => {
    setSessionState(prev => ({
      ...prev,
      proposedMotions: [...prev.proposedMotions, motion],
    }));
  };

  const handleVoteResult = (motionId: string, yayCount: number, nayCount: number) => {
    const motion = sessionState.proposedMotions.find(m => m.id === motionId);
    if (!motion) return;

    const totalVotes = yayCount + nayCount;
    const passes = yayCount > nayCount && totalVotes === sessionState.delegates.length;

    if (passes) {
      // Motion passes - transition to in_motion state
      const activeMotion: ActiveMotion = {
        type: motion.type,
        proposer: motion.proposer,
        totalTime: motion.totalTime,
        speakingTime: motion.speakingTime,
        speakerCount: motion.speakerCount,
      };

      setSessionState(prev => ({
        ...prev,
        status: 'in_motion',
        activeMotion,
        proposedMotions: [], // Clear all proposed motions
      }));
    } else {
      // Motion fails - remove from proposed motions
      setSessionState(prev => ({
        ...prev,
        proposedMotions: prev.proposedMotions.filter(m => m.id !== motionId),
      }));
    }
  };

  const handleFinishMotion = () => {
    setSessionState(prev => ({
      ...prev,
      status: 'awaiting_motion',
      activeMotion: null,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Model UN Session Tracker
          </h1>
          <p className="text-gray-600">
            Committee Chair Dashboard
          </p>
        </header>

        {sessionState.status === 'setup' && (
          <SetupScreen onSessionStart={handleSessionStart} />
        )}

        {sessionState.status === 'awaiting_motion' && (
          <SessionDashboard
            delegates={sessionState.delegates}
            proposedMotions={sessionState.proposedMotions}
            onAddProposedMotion={handleAddProposedMotion}
            onVoteResult={handleVoteResult}
          />
        )}

        {sessionState.status === 'in_motion' && sessionState.activeMotion && (
          <ActiveMotionDisplay
            activeMotion={sessionState.activeMotion}
            delegates={sessionState.delegates}
            onFinishMotion={handleFinishMotion}
          />
        )}
      </div>
    </div>
  );
}

export default App;
