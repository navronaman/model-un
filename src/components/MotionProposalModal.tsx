import { useState, useEffect } from 'react';
import { Delegate, ProposedMotion } from '../types';
import TimeInput from './TimeInput';

interface MotionProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegates: Delegate[];
  onAddMotion: (motion: ProposedMotion) => void;
  currentMotionCount: number;
}

interface MotionFormData {
  proposer: string;
  type: 'speakers_list' | 'moderated_caucus' | 'unmoderated_caucus';
  speakingTime?: number;
  speakerCount?: number;
  totalTime?: number;
}

const MotionProposalModal: React.FC<MotionProposalModalProps> = ({
  isOpen,
  onClose,
  delegates,
  onAddMotion,
  currentMotionCount,
}) => {
  const [formData, setFormData] = useState<MotionFormData>({
    proposer: '',
    type: 'speakers_list',
  });
  const [errors, setErrors] = useState<string[]>([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        proposer: '',
        type: 'speakers_list',
      });
      setErrors([]);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof MotionFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.proposer) {
      newErrors.push('Please select a proposing delegation');
    }

    switch (formData.type) {
      case 'speakers_list':
        if (!formData.speakingTime || formData.speakingTime < 30 || formData.speakingTime > 3600) {
          newErrors.push('Speaking time must be between 30 seconds and 60 minutes');
        }
        if (!formData.speakerCount || formData.speakerCount < 1 || formData.speakerCount > 20) {
          newErrors.push('Number of speakers must be between 1 and 20');
        }
        break;
      case 'moderated_caucus':
        if (!formData.totalTime || formData.totalTime < 30 || formData.totalTime > 3600) {
          newErrors.push('Total time must be between 30 seconds and 60 minutes');
        }
        if (!formData.speakingTime || formData.speakingTime < 30 || formData.speakingTime > 300) {
          newErrors.push('Speaking time must be between 30 and 300 seconds');
        }
        // Check if total time is divisible by speaking time
        if (formData.totalTime && formData.speakingTime) {
          if (formData.totalTime % formData.speakingTime !== 0) {
            newErrors.push('Total time must be divisible by speaking time (e.g., 7 minutes total with 45 seconds speaking time is invalid)');
          }
        }
        break;
      case 'unmoderated_caucus':
        if (!formData.totalTime || formData.totalTime < 30 || formData.totalTime > 3600) {
          newErrors.push('Total time must be between 30 seconds and 60 minutes');
        }
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentMotionCount >= 3) {
      setErrors(['Maximum of 3 motions allowed']);
      return;
    }

    if (!validateForm()) {
      return;
    }

         const newMotion: ProposedMotion = {
       id: `motion-${Date.now()}`,
       type: formData.type,
       proposer: formData.proposer,
       totalTime: formData.totalTime,
       speakingTime: formData.speakingTime,
       speakerCount: formData.speakerCount,
       yayVotes: 0,
       nayVotes: 0,
     };

    onAddMotion(newMotion);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Propose a Motion
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Proposing Delegation */}
            <div>
              <label htmlFor="proposer" className="block text-sm font-medium text-gray-700 mb-1">
                Proposing Delegation *
              </label>
              <select
                id="proposer"
                value={formData.proposer}
                onChange={(e) => handleInputChange('proposer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a delegation</option>
                {delegates.map((delegate) => (
                  <option key={delegate.id} value={delegate.id}>
                    {delegate.delegationName} ({delegate.delegateName})
                  </option>
                ))}
              </select>
            </div>

            {/* Motion Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Motion Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as MotionFormData['type'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="speakers_list">Speaker's List</option>
                <option value="moderated_caucus">Moderated Caucus</option>
                <option value="unmoderated_caucus">Unmoderated Caucus</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {formData.type === 'speakers_list' && (
              <>
                <TimeInput
                  id="speakingTime"
                  label="Speaking Time"
                  value={formData.speakingTime || 0}
                  onChange={(value) => handleInputChange('speakingTime', value)}
                  min={30}
                  max={3600}
                  required
                  placeholder="30 seconds - 60 minutes"
                />
                <div>
                  <label htmlFor="speakerCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Speakers *
                  </label>
                  <input
                    type="number"
                    id="speakerCount"
                    min="1"
                    max="20"
                    value={formData.speakerCount || ''}
                    onChange={(e) => handleInputChange('speakerCount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1-20 speakers"
                    required
                  />
                </div>
              </>
            )}

            {formData.type === 'moderated_caucus' && (
              <>
                <TimeInput
                  id="totalTime"
                  label="Total Time"
                  value={formData.totalTime || 0}
                  onChange={(value) => handleInputChange('totalTime', value)}
                  min={30}
                  max={3600}
                  required
                  placeholder="30 seconds - 60 minutes"
                />
                <TimeInput
                  id="speakingTime"
                  label="Speaking Time"
                  value={formData.speakingTime || 0}
                  onChange={(value) => handleInputChange('speakingTime', value)}
                  min={30}
                  max={300}
                  required
                  placeholder="30-300 seconds"
                />
              </>
            )}

            {formData.type === 'unmoderated_caucus' && (
              <TimeInput
                id="totalTime"
                label="Total Time"
                value={formData.totalTime || 0}
                onChange={(value) => handleInputChange('totalTime', value)}
                min={30}
                max={3600}
                required
                placeholder="30 seconds - 60 minutes"
              />
            )}

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <ul className="text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Motion Count Warning */}
            {currentMotionCount >= 3 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  Maximum of 3 motions allowed. Please vote on existing motions first.
                </p>
              </div>
            )}

                         {/* Action Buttons */}
             <div className="flex justify-end space-x-3 pt-6 sticky bottom-0 bg-white">
               <button
                 type="button"
                 onClick={onClose}
                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={currentMotionCount >= 3}
                 className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Submit Motion
               </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MotionProposalModal;
