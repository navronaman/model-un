import { ActiveMotion } from '../../types';
import Timer from '../Timer';

interface UnmoderatedCaucusProps {
  activeMotion: ActiveMotion;
}

const UnmoderatedCaucus: React.FC<UnmoderatedCaucusProps> = ({ activeMotion }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Unmoderated Caucus
        </h3>
        <p className="text-gray-600">
          Total time: {activeMotion.totalTime ? Math.floor(activeMotion.totalTime / 60) : 0} minutes
        </p>
      </div>

      <div className="flex justify-center">
        <Timer
          duration={activeMotion.totalTime || 0}
          label="Unmoderated Caucus Timer"
          size="large"
          autoStart={false}
        />
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Delegates may now engage in informal discussion.</p>
        <p>Click "Start" to begin the timer.</p>
      </div>
    </div>
  );
};

export default UnmoderatedCaucus;
