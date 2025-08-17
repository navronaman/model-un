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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const formatMotionType = (type: string): string => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTime = (seconds: number): string => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (remainingSeconds === 0) {
        return `${minutes}min`;
      }
      return `${minutes}min ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  const formatMotionDetails = (motion: ProposedMotion): string => {
    switch (motion.type) {
      case 'speakers_list':
        return `${formatTime(motion.speakingTime || 0)} speaking time, ${motion.speakerCount} speakers`;
      case 'moderated_caucus':
        return `${formatTime(motion.totalTime || 0)} total, ${formatTime(motion.speakingTime || 0)} speaking time`;
      case 'unmoderated_caucus':
        return `${formatTime(motion.totalTime || 0)} total`;
      default:
        return '';
    }
  };

  const getProposingDelegate = (motion: ProposedMotion): Delegate | undefined => {
    return delegates.find(delegate => delegate.id === motion.proposer);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Dashboard Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Session Dashboard
            </h2>

            {proposedMotions.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Are there any motions on the floor?
                  </h3>
                  <p className="text-gray-500">
                    No motions have been proposed yet. Click the button in the sidebar to propose a motion.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800">
                    Proposed Motions ({proposedMotions.length}/3)
                  </h3>
                </div>

                <div className="space-y-4">
                  {proposedMotions.map((motion, index) => {
                    const proposingDelegate = getProposingDelegate(motion);
                    return (
                      <div
                        key={motion.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-medium text-gray-800">
                              Motion {index + 1}: {formatMotionType(motion.type)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Proposed by: {proposingDelegate?.delegationName} ({proposingDelegate?.delegateName})
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {formatMotionType(motion.type)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {formatMotionDetails(motion)}
                        </p>
                        <div className="text-sm text-gray-500">
                          Motion ID: {motion.id}
                        </div>
                        
                        {/* Voting Component */}
                        <VotingComponent
                          motion={motion}
                          onVoteSubmit={onVoteResult}
                          totalDelegates={delegates.length}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delegate List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Propose Motion Button - Back in sidebar */}
            <div className="mb-6">
              {proposedMotions.length < 3 ? (
                <button
                  onClick={handleOpenModal}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {proposedMotions.length === 0 ? 'Propose a Motion' : 'Propose Another Motion'}
                </button>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700 text-center">
                    Maximum 3 motions reached
                  </p>
                </div>
              )}
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Delegates ({delegates.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {delegates.map((delegate) => (
                <div
                  key={delegate.id}
                  className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-800">
                    {delegate.delegationName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {delegate.delegateName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Motion Proposal Modal */}
      <MotionProposalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        delegates={delegates}
        onAddMotion={onAddProposedMotion}
        currentMotionCount={proposedMotions.length}
      />
    </div>
  );
};

export default SessionDashboard;