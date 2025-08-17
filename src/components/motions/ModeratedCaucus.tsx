import { useState } from 'react';
import { ActiveMotion, Delegate } from '../../types';
import Timer from '../Timer';

interface ModeratedCaucusProps {
  activeMotion: ActiveMotion;
  delegates: Delegate[];
}

interface SpeakerSlot {
  id: number;
  selectedDelegate: Delegate | null;
  isComplete: boolean;
}

const ModeratedCaucus: React.FC<ModeratedCaucusProps> = ({ activeMotion, delegates }) => {
  const speakerCount = activeMotion.totalTime && activeMotion.speakingTime 
    ? Math.floor(activeMotion.totalTime / activeMotion.speakingTime) 
    : 0;

  const [speakerSlots, setSpeakerSlots] = useState<SpeakerSlot[]>(
    Array.from({ length: speakerCount }, (_, index) => ({
      id: index + 1,
      selectedDelegate: null,
      isComplete: false,
    }))
  );

  const handleDelegateSelect = (slotId: number, delegateId: string) => {
    const delegate = delegates.find(d => d.id === delegateId);
    setSpeakerSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, selectedDelegate: delegate }
          : slot
      )
    );
  };

  const handleSpeakerComplete = (slotId: number) => {
    setSpeakerSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, isComplete: true }
          : slot
      )
    );
  };

  const completedSpeakers = speakerSlots.filter(slot => slot.isComplete).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Moderated Caucus
        </h3>
        <p className="text-gray-600">
          {speakerCount} speakers • {activeMotion.speakingTime ? Math.floor(activeMotion.speakingTime / 60) : 0} minutes each
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Progress: {completedSpeakers} / {speakerCount} speakers completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speakerSlots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 border rounded-lg ${
              slot.isComplete 
                ? 'bg-green-50 border-green-200' 
                : slot.selectedDelegate 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">
                Speaker {slot.id}
              </h4>
              {slot.isComplete && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Complete
                </span>
              )}
            </div>

            {!slot.selectedDelegate ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Delegate
                </label>
                <select
                  value=""
                  onChange={(e) => handleDelegateSelect(slot.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a delegate...</option>
                  {delegates.map((delegate) => (
                    <option key={delegate.id} value={delegate.id}>
                      {delegate.delegationName} ({delegate.delegateName})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Selected: </span>
                  <span className="text-gray-600">
                    {slot.selectedDelegate.delegationName} ({slot.selectedDelegate.delegateName})
                  </span>
                </div>
                
                {!slot.isComplete && (
                  <Timer
                    duration={activeMotion.speakingTime || 0}
                    label={`Speaker ${slot.id} Timer`}
                    size="small"
                    autoStart={false}
                    onTimerEnd={() => handleSpeakerComplete(slot.id)}
                    onTimerComplete={() => handleSpeakerComplete(slot.id)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Select delegates for each speaking slot and start their individual timers.</p>
        <p>Each speaker gets {activeMotion.speakingTime ? Math.floor(activeMotion.speakingTime / 60) : 0} minutes to speak.</p>
      </div>
    </div>
  );
};

export default ModeratedCaucus;
