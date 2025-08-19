import { useState } from 'react';
import { Delegate, ProposedMotion } from '../types';
import MotionProposalModal from './MotionProposalModal';
import VotingComponent from './VotingComponent';

interface SessionDashboardProps {
  delegates: Delegate[];
  proposedMotions: ProposedMotion[];
  onAddProposedMotion: (motion: ProposedMotion) => void;
  onVoteResult: (motionId: string, yayCount: number, nayCount: number) => void;
}

const SessionDashboard: React.FC<SessionDashboardProps> = ({
  delegates,
  proposedMotions,
  onAddProposedMotion,
  onVoteResult,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getProposingDelegate = (delegateId: string) => {
    return delegates.find(delegate => delegate.id === delegateId);
  };

  const getMotionTypeDisplay = (type: string) => {
    switch (type) {
      case 'speakers_list':
        return { label: "Speaker's List", icon: "🎤", color: "bg-blue-100 text-blue-800" };
      case 'moderated_caucus':
        return { label: "Moderated Caucus", icon: "👥", color: "bg-green-100 text-green-800" };
      case 'unmoderated_caucus':
        return { label: "Unmoderated Caucus", icon: "💬", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: "Unknown", icon: "❓", color: "bg-gray-100 text-gray-800" };
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Desktop-optimized header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="bg-yellow-500 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Session Dashboard
              </h2>
              <p className="text-yellow-100 text-sm mt-1">
                Manage motions and delegate participation
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Quick stats - desktop optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{delegates.length}</div>
              <div className="text-sm text-blue-700">Delegates</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{proposedMotions.length}</div>
              <div className="text-sm text-yellow-700">Motions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {proposedMotions.filter(m => m.yayVotes + m.nayVotes === delegates.length).length}
              </div>
              <div className="text-sm text-green-700">Voted</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {proposedMotions.filter(m => m.yayVotes > m.nayVotes).length}
              </div>
              <div className="text-sm text-purple-700">Passing</div>
            </div>
          </div>

          {/* Propose motion button */}
          <div className="mb-6">
            <button
              onClick={() => setShowModal(true)}
              disabled={proposedMotions.length >= 3}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-2">
                <span>➕</span>
                <span>Propose a Motion</span>
                {proposedMotions.length >= 3 && (
                  <span className="text-sm opacity-75">(Max reached)</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Motions section */}
        <div className="lg:col-span-3">
          {proposedMotions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Are there any motions on the floor?
                </h3>
                <p className="text-gray-600">
                  No motions have been proposed yet. Click the button above to propose a motion.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>📋</span>
                <span>Proposed Motions ({proposedMotions.length}/3)</span>
              </h3>
              
              <div className="grid gap-4">
                {proposedMotions.map((motion) => {
                  const proposingDelegate = getProposingDelegate(motion.proposer);
                  const motionType = getMotionTypeDisplay(motion.type);
                  const totalVotes = motion.yayVotes + motion.nayVotes;
                  const voteProgress = (totalVotes / delegates.length) * 100;
                  
                  return (
                    <div key={motion.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                      {/* Motion header */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{motionType.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{motionType.label}</h4>
                              <p className="text-sm text-gray-600">
                                Proposed by {proposingDelegate?.delegationName}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${motionType.color}`}>
                            {motionType.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Motion details */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                          {motion.speakingTime && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-sm font-medium text-blue-700">Speaking Time</div>
                              <div className="text-lg font-semibold text-blue-900">{formatTime(motion.speakingTime)}</div>
                            </div>
                          )}
                          {motion.totalTime && (
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-sm font-medium text-green-700">Total Time</div>
                              <div className="text-lg font-semibold text-green-900">{formatTime(motion.totalTime)}</div>
                            </div>
                          )}
                          {motion.speakerCount && (
                            <div className="bg-purple-50 rounded-lg p-3">
                              <div className="text-sm font-medium text-purple-700">Speakers</div>
                              <div className="text-lg font-semibold text-purple-900">{motion.speakerCount}</div>
                            </div>
                          )}
                        </div>

                        {/* Voting progress */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Voting Progress</span>
                            <span className="text-sm text-gray-500">{totalVotes}/{delegates.length} delegates</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${voteProgress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Voting component */}
                        <VotingComponent
                          motionId={motion.id}
                          yayVotes={motion.yayVotes}
                          nayVotes={motion.nayVotes}
                          totalDelegates={delegates.length}
                          onVoteResult={onVoteResult}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Delegates sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 sticky top-24">
            <div className="bg-gray-600 px-4 py-3 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>👥</span>
                <span>Delegates ({delegates.length})</span>
              </h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {delegates.map((delegate) => (
                  <div key={delegate.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-medium text-gray-900 text-sm">
                      {delegate.delegationName}
                    </div>
                    <div className="text-xs text-gray-600">
                      {delegate.delegateName}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-blue-600">
                        {delegate.votingHistory.length} votes
                      </span>
                      <span className="text-green-600">
                        {delegate.speakingHistory.length} speeches
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motion proposal modal */}
      <MotionProposalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        delegates={delegates}
        onAddMotion={onAddProposedMotion}
        currentMotionCount={proposedMotions.length}
      />
    </div>
  );
};

export default SessionDashboard;