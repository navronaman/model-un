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

  const getMotionTypeInfo = (type: string) => {
    switch (type) {
      case 'speakers_list':
        return { icon: '🎤', color: 'bg-blue-100 text-blue-800', description: 'Formal speaking order with timed speeches' };
      case 'moderated_caucus':
        return { icon: '👥', color: 'bg-green-100 text-green-800', description: 'Interactive discussion with timed responses' };
      case 'unmoderated_caucus':
        return { icon: '💬', color: 'bg-purple-100 text-purple-800', description: 'Free-form discussion period' };
      default:
        return { icon: '❓', color: 'bg-gray-100 text-gray-800', description: 'Unknown motion type' };
    }
  };

  if (!isOpen) return null;

  const motionTypeInfo = getMotionTypeInfo(formData.type);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">
                Propose a Motion
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Create a new motion for committee consideration
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Proposing Delegation */}
            <div>
              <label htmlFor="proposer" className="block text-sm font-semibold text-gray-700 mb-2">
                Proposing Delegation *
              </label>
              <select
                id="proposer"
                value={formData.proposer}
                onChange={(e) => handleInputChange('proposer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Motion Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as MotionFormData['type'])}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="speakers_list">Speaker's List</option>
                <option value="moderated_caucus">Moderated Caucus</option>
                <option value="unmoderated_caucus">Unmoderated Caucus</option>
              </select>
              
              {/* Motion type description */}
              <div className={`mt-3 p-3 rounded-md ${motionTypeInfo.color} bg-opacity-50`}>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{motionTypeInfo.icon}</span>
                  <span className="text-sm font-medium">{motionTypeInfo.description}</span>
                </div>
              </div>
            </div>

            {/* Conditional Fields */}
            {formData.type === 'speakers_list' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <span>🎤</span>
                    <span>Speaker's List Configuration</span>
                  </h4>
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
                  <div className="mt-4">
                    <label htmlFor="speakerCount" className="block text-sm font-medium text-blue-700 mb-2">
                      Number of Speakers *
                    </label>
                    <input
                      type="number"
                      id="speakerCount"
                      min="1"
                      max="20"
                      value={formData.speakerCount || ''}
                      onChange={(e) => handleInputChange('speakerCount', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1-20 speakers"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'moderated_caucus' && (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                    <span>👥</span>
                    <span>Moderated Caucus Configuration</span>
                  </h4>
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
                </div>
              </div>
            )}

            {formData.type === 'unmoderated_caucus' && (
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                    <span>💬</span>
                    <span>Unmoderated Caucus Configuration</span>
                  </h4>
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
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-red-500">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Motion Count Warning */}
            {currentMotionCount >= 3 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-500">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-700">
                      Maximum of 3 motions allowed. Please vote on existing motions first.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={currentMotionCount >= 3}
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Motion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionProposalModal;
