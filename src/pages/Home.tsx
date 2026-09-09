import { useNavigate } from 'react-router-dom';
import { Tuner } from '../components/Tuner';
import { useUser } from '../context/UserContext';
import type { Frequency } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const { updateFrequency } = useUser();

  const handleSetFrequency = (freq: Frequency, thought: string) => {
    updateFrequency(freq, thought);
    navigate('/discover');
  };

  return (
    <div className="pt-20 h-screen w-screen bg-black">
      <Tuner onSetFrequency={handleSetFrequency} />
    </div>
  );
};
