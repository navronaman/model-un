import { useState } from 'react';

interface VotingComponentProps {
  motionId: string;
  yayVotes: number;
  nayVotes: number;
  totalDelegates: number;
  onVoteResult: (motionId: string, yayCount: number, nayCount: number) => void;
}

const VotingComponent: React.FC<VotingComponentProps> = ({
  motionId,
  yayVotes,
  nayVotes,
  totalDelegates,
  onVoteResult,
}) => {
  const [localYayVotes, setLocalYayVotes] = useState(yayVotes);
  const [localNayVotes, setLocalNayVotes] = useState(nayVotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalVotes = localYayVotes + localNayVotes;
  const remainingDelegates = totalDelegates - totalVotes;
  const isComplete = totalVotes === totalDelegates;
  const isPassing = localYayVotes > localNayVotes && isComplete;

  const handleYayChange = (value: number) => {
    const newValue = Math.max(0, Math.min(value, totalDelegates - localNayVotes));
    setLocalYayVotes(newValue);
  };

  const handleNayChange = (value: number) => {
    const newValue = Math.max(0, Math.min(value, totalDelegates - localYayVotes));
    setLocalNayVotes(newValue);
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    
    setIsSubmitting(true);
    // Simulate a brief delay for better UX
    setTimeout(() => {
      onVoteResult(motionId, localYayVotes, localNayVotes);
      setIsSubmitting(false);
    }, 500);
  };

  const getStatusInfo = () => {
    if (!isComplete) {
      return { 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: '⏳',
        description: `${remainingDelegates} delegates remaining`
      };
    }
    if (isPassing) {
      return { 
        label: 'PASSES', 
        color: 'bg-green-100 text-green-800', 
        icon: '✅',
        description: 'Motion will be executed'
      };
    }
    return { 
      label: 'FAILS', 
      color: 'bg-red-100 text-red-800', 
      icon: '❌',
      description: 'Motion will be removed'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
      {/* Voting header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-900 flex items-center space-x-2">
          <span>🗳️</span>
          <span>Vote Count</span>
        </h4>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center space-x-2`}>
          <span>{statusInfo.icon}</span>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Vote inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Yay votes */}
        <div className="bg-green-50 rounded-md p-3 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600">✅</span>
            <label htmlFor={`yay-${motionId}`} className="text-sm font-semibold text-green-700">
              Yay Votes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleYayChange(localYayVotes - 1)}
              disabled={localYayVotes === 0}
              className="w-8 h-8 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="text-sm font-bold">-</span>
            </button>
            <input
              type="number"
              id={`yay-${motionId}`}
              min="0"
              max={totalDelegates - localNayVotes}
              value={localYayVotes}
              onChange={(e) => handleYayChange(parseInt(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-center text-md font-semibold border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={() => handleYayChange(localYayVotes + 1)}
              disabled={localYayVotes + localNayVotes >= totalDelegates}
              className="w-8 h-8 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="text-sm font-bold">+</span>
            </button>
          </div>
        </div>

        {/* Nay votes */}
        <div className="bg-red-50 rounded-md p-3 border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-red-600">❌</span>
            <label htmlFor={`nay-${motionId}`} className="text-sm font-semibold text-red-700">
              Nay Votes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNayChange(localNayVotes - 1)}
              disabled={localNayVotes === 0}
              className="w-8 h-8 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="text-sm font-bold">-</span>
            </button>
            <input
              type="number"
              id={`nay-${motionId}`}
              min="0"
              max={totalDelegates - localYayVotes}
              value={localNayVotes}
              onChange={(e) => handleNayChange(parseInt(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-center text-md font-semibold border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={() => handleNayChange(localNayVotes + 1)}
              disabled={localYayVotes + localNayVotes >= totalDelegates}
              className="w-8 h-8 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="text-sm font-bold">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vote summary */}
      <div className="bg-white rounded-md p-3 border border-gray-200 mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-green-600">{localYayVotes}</div>
            <div className="text-xs text-green-700">Yay</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-600">{localNayVotes}</div>
            <div className="text-xs text-red-700">Nay</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{totalVotes}</div>
            <div className="text-xs text-blue-700">Total</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-600">{remainingDelegates}</div>
            <div className="text-xs text-gray-700">Remaining</div>
          </div>
        </div>
      </div>

      {/* Status and action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusInfo.icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{statusInfo.label}</p>
            <p className="text-xs text-gray-600">{statusInfo.description}</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={`px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isPassing 
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
              : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{isPassing ? '✅ Pass Motion' : '❌ Fail Motion'}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default VotingComponent;
