import { useState } from 'react';
import { ProposedMotion } from '../types';

interface VotingComponentProps {
  motion: ProposedMotion;
  onVoteSubmit: (motionId: string, yayCount: number, nayCount: number) => void;
  totalDelegates: number;
}

const VotingComponent: React.FC<VotingComponentProps> = ({
  motion,
  onVoteSubmit,
  totalDelegates,
}) => {
  const [yayVotes, setYayVotes] = useState<number>(motion.yayVotes);
  const [nayVotes, setNayVotes] = useState<number>(motion.nayVotes);

  const handleSubmit = () => {
    onVoteSubmit(motion.id, yayVotes, nayVotes);
  };

  const totalVotes = yayVotes + nayVotes;
  const remainingVotes = totalDelegates - totalVotes;
  const isPassing = yayVotes > nayVotes;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Vote Count</h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor={`yay-${motion.id}`} className="block text-xs font-medium text-gray-600 mb-1">
            Yay Votes
          </label>
          <input
            type="number"
            id={`yay-${motion.id}`}
            min="0"
            max={totalDelegates}
            value={yayVotes}
            onChange={(e) => setYayVotes(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div>
          <label htmlFor={`nay-${motion.id}`} className="block text-xs font-medium text-gray-600 mb-1">
            Nay Votes
          </label>
          <input
            type="number"
            id={`nay-${motion.id}`}
            min="0"
            max={totalDelegates}
            value={nayVotes}
            onChange={(e) => setNayVotes(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500">
          Total: {totalVotes} / {totalDelegates} delegates
          {remainingVotes > 0 && (
            <span className="ml-2 text-orange-600">
              ({remainingVotes} remaining)
            </span>
          )}
        </div>
        
        <div className={`text-sm font-medium ${
          totalVotes === totalDelegates 
            ? (isPassing ? 'text-green-600' : 'text-red-600')
            : 'text-gray-500'
        }`}>
          {totalVotes === totalDelegates 
            ? (isPassing ? 'PASSES' : 'FAILS')
            : 'Pending'
          }
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          disabled={totalVotes !== totalDelegates}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isPassing
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }"
        >
          {isPassing ? 'Pass Motion' : 'Fail Motion'}
        </button>
      </div>
    </div>
  );
};

export default VotingComponent;
