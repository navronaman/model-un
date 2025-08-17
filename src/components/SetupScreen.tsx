import { useState } from 'react';
import { Delegate } from '../types';

interface SetupScreenProps {
  onSessionStart: (delegates: Delegate[]) => void;
}

interface DelegateFormData {
  delegationName: string;
  delegateName: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSessionStart }) => {
  const [numberOfDelegates, setNumberOfDelegates] = useState<number>(0);
  const [delegateForms, setDelegateForms] = useState<DelegateFormData[]>([]);
  const [showDelegateForms, setShowDelegateForms] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleNumberOfDelegatesChange = (value: number) => {
    setNumberOfDelegates(value);
    if (value >= 5 && value <= 50) {
      const newForms = Array.from({ length: value }, () => ({
        delegationName: '',
        delegateName: '',
      }));
      setDelegateForms(newForms);
      setShowDelegateForms(true);
      setErrors([]);
    } else {
      setShowDelegateForms(false);
      setDelegateForms([]);
    }
  };

  const handleDelegateFormChange = (index: number, field: keyof DelegateFormData, value: string) => {
    const newForms = [...delegateForms];
    newForms[index][field] = value;
    setDelegateForms(newForms);
  };

  const validateForms = (): boolean => {
    const newErrors: string[] = [];

    if (numberOfDelegates < 5 || numberOfDelegates > 50) {
      newErrors.push('Number of delegates must be between 5 and 50');
    }

    delegateForms.forEach((form, index) => {
      if (!form.delegationName.trim()) {
        newErrors.push(`Delegation name is required for delegate ${index + 1}`);
      }
      if (!form.delegateName.trim()) {
        newErrors.push(`Delegate name is required for delegate ${index + 1}`);
      }
    });

    // Check for duplicate delegation names
    const delegationNames = delegateForms.map(form => form.delegationName.trim().toLowerCase());
    const uniqueNames = new Set(delegationNames);
    if (uniqueNames.size !== delegationNames.length) {
      newErrors.push('Delegation names must be unique');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleStartSession = () => {
    if (validateForms()) {
      const delegates: Delegate[] = delegateForms.map((form, index) => ({
        id: `delegate-${index + 1}`,
        delegationName: form.delegationName.trim(),
        delegateName: form.delegateName.trim(),
        votingHistory: [],
        speakingHistory: [],
      }));

      onSessionStart(delegates);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Session Setup
        </h2>
        
        <div className="mb-6">
          <label htmlFor="numberOfDelegates" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Delegates
          </label>
          <input
            type="number"
            id="numberOfDelegates"
            min="5"
            max="50"
            value={numberOfDelegates || ''}
            onChange={(e) => handleNumberOfDelegatesChange(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a number between 5 and 50"
          />
          <p className="text-sm text-gray-500 mt-1">
            Please enter a number between 5 and 50 delegates
          </p>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {showDelegateForms && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Delegate Information
            </h3>
            
            {delegateForms.map((form, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Delegate {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`delegation-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Delegation Name
                    </label>
                    <input
                      type="text"
                      id={`delegation-${index}`}
                      value={form.delegationName}
                      onChange={(e) => handleDelegateFormChange(index, 'delegationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., France, United States, China"
                    />
                  </div>
                  <div>
                    <label htmlFor={`delegate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Delegate Name
                    </label>
                    <input
                      type="text"
                      id={`delegate-${index}`}
                      value={form.delegateName}
                      onChange={(e) => handleDelegateFormChange(index, 'delegateName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., John Smith, Maria Garcia"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <button
                onClick={handleStartSession}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Start Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupScreen;
