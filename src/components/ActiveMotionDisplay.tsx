import { ActiveMotion, Delegate } from '../types';
import UnmoderatedCaucus from './motions/UnmoderatedCaucus';
import ModeratedCaucus from './motions/ModeratedCaucus';
import SpeakerList from './motions/SpeakerList';

interface ActiveMotionDisplayProps {
  activeMotion: ActiveMotion;
  delegates: Delegate[];
  onFinishMotion: () => void;
}

const ActiveMotionDisplay: React.FC<ActiveMotionDisplayProps> = ({
  activeMotion,
  delegates,
  onFinishMotion,
}) => {
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

  const getProposingDelegate = (): Delegate | undefined => {
    return delegates.find(delegate => delegate.id === activeMotion.proposer);
  };

  const proposingDelegate = getProposingDelegate();

  const renderMotionContent = () => {
    switch (activeMotion.type) {
      case 'unmoderated_caucus':
        return <UnmoderatedCaucus activeMotion={activeMotion} />;
      case 'moderated_caucus':
        return <ModeratedCaucus activeMotion={activeMotion} delegates={delegates} />;
      case 'speakers_list':
        return <SpeakerList activeMotion={activeMotion} delegates={delegates} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Unknown motion type</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Active Motion
          </h2>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              IN PROGRESS
            </span>
            <button
              onClick={onFinishMotion}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Finish Motion
            </button>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {formatMotionType(activeMotion.type)}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Proposed by: {proposingDelegate?.delegationName} ({proposingDelegate?.delegateName})
              </p>
              
              <div className="space-y-2">
                {activeMotion.totalTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Time:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatTime(activeMotion.totalTime)}
                    </span>
                  </div>
                )}
                
                {activeMotion.speakingTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Speaking Time:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatTime(activeMotion.speakingTime)}
                    </span>
                  </div>
                )}
                
                {activeMotion.speakerCount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Number of Speakers:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {activeMotion.speakerCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ⏱️
                </div>
                <p className="text-sm text-gray-600">
                  Motion execution in progress<br />
                  Use timers below to manage speaking time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motion-specific content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {renderMotionContent()}
        </div>
      </div>
    </div>
  );
};

export default ActiveMotionDisplay;
