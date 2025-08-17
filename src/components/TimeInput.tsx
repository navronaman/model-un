import { useState, useEffect } from 'react';

interface TimeInputProps {
  id: string;
  label: string;
  value: number; // Always in seconds
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  placeholder?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = 3600,
  required = false,
  placeholder,
}) => {
  const [unit, setUnit] = useState<'seconds' | 'minutes'>('seconds');
  const [displayValue, setDisplayValue] = useState<number | string>('');

  useEffect(() => {
    if (unit === 'minutes') {
      setDisplayValue(value > 0 ? value / 60 : '');
    } else {
      setDisplayValue(value > 0 ? value : '');
    }
  }, [value, unit]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);

    const parsedValue = parseInt(rawValue, 10);
    if (!isNaN(parsedValue)) {
      const seconds = unit === 'minutes' ? parsedValue * 60 : parsedValue;
      onChange(seconds);
    } else {
      onChange(0);
    }
  };

  const handleUnitChange = (newUnit: 'seconds' | 'minutes') => {
    if (newUnit === unit) return;
    setUnit(newUnit);
  };
  
  const getMinMaxForUnit = () => {
    if (unit === 'minutes') {
      return {
        min: Math.ceil(min / 60),
        max: Math.floor(max / 60),
      };
    }
    return { min, max };
  };

  const { min: currentMin, max: currentMax } = getMinMaxForUnit();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      <div className="flex space-x-2">
        <input
          type="number"
          id={id}
          min={currentMin}
          max={currentMax}
          value={displayValue}
          onChange={handleValueChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder || `${currentMin}-${currentMax} ${unit}`}
          required={required}
        />
                 <div className="flex border border-gray-300 rounded-md overflow-hidden">
           <button
             type="button"
             onClick={() => handleUnitChange('seconds')}
             className={`px-4 py-2 text-sm font-medium transition-colors rounded-l-md ${
               unit === 'seconds'
                 ? 'bg-blue-600 text-white border-blue-600'
                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
             }`}
           >
             Seconds
           </button>
           <button
             type="button"
             onClick={() => handleUnitChange('minutes')}
             className={`px-4 py-2 text-sm font-medium transition-colors rounded-r-md ${
               unit === 'minutes'
                 ? 'bg-blue-600 text-white border-blue-600'
                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
             }`}
           >
             Minutes
           </button>
         </div>
      </div>
    </div>
  );
};

export default TimeInput;