import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimerEnd?: () => void;
  onTimerComplete?: () => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  autoStart?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onTimerEnd,
  onTimerComplete,
  label = 'Timer',
  size = 'medium',
  autoStart = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
    setIsPaused(false);
  }, [duration, autoStart]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimerEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft, onTimerEnd]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
        return seconds.toString();
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleComplete = () => {
    setTimeLeft(0);
    setIsRunning(false);
    onTimerComplete?.();
  }

  const isComplete = timeLeft === 0;

  // Size classes
  const textSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {label && (
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
      )}
      
      {/* Time display */}
      <div className="flex items-center justify-center">
        <span className={`font-mono font-bold ${textSizeClasses[size]} ${
          isComplete ? 'text-red-600' : 'text-gray-800'
        }`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex space-x-2">
        {!isRunning && !isPaused && timeLeft > 0 && (
          <button
            onClick={handleStart}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Start
          </button>
        )}
        
        {isRunning && !isPaused && (
          <button
            onClick={handlePause}
            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
          >
            Pause
          </button>
        )}
        
        {isPaused && (
          <button
            onClick={handleResume}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Resume
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset
        </button>

        {isRunning && !isPaused && (
            <button
                onClick={handleComplete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
                Complete Speech
            </button>
        )}
      </div>

      {/* Status indicator */}
      <div className="text-xs text-gray-500">
        {isComplete && <span className="text-red-600 font-medium">Time's up!</span>}
        {isRunning && !isPaused && <span className="text-green-600 font-medium">Running</span>}
        {isPaused && <span className="text-yellow-600 font-medium">Paused</span>}
        {!isRunning && !isPaused && timeLeft > 0 && <span className="text-gray-600">Ready</span>}
      </div>
    </div>
  );
};

export default Timer;