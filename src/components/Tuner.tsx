import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Frequency } from '../types';
import { Radio } from 'lucide-react';

interface TunerProps {
  onSetFrequency: (freq: Frequency, thought: string) => void;
}

export const Tuner: React.FC<TunerProps> = ({ onSetFrequency }) => {
  const [frequency, setFrequency] = useState<Frequency>({ energy: 0.5, mood: 0.5 });
  const [thought, setThought] = useState('');
  const padRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return; // Only if left mouse button is pressed
    if (!padRef.current) return;
    
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    setFrequency({
      energy: x / rect.width,
      mood: 1 - (y / rect.height) // Invert Y so up is positive mood
    });
  };

  const handleBroadcast = () => {
    if (thought.trim() === '') return;
    onSetFrequency(frequency, thought);
  };

  // Calculate dynamic color based on frequency
  // Energy (X) controls Hue shift, Mood (Y) controls Saturation/Lightness
  const color = `hsl(${frequency.energy * 360}, ${50 + frequency.mood * 50}%, ${30 + frequency.mood * 30}%)`;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 opacity-20 filter blur-[100px]"
        animate={{ backgroundColor: color }}
        transition={{ duration: 0.5 }}
      />

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-widest mb-2 uppercase">Tune In</h1>
          <p className="text-gray-400 text-sm">Find your frequency to discover others.</p>
        </div>

        {/* The 2D Pad */}
        <div 
          className="relative w-64 h-64 border border-gray-700 rounded-2xl cursor-crosshair overflow-hidden shadow-2xl"
          ref={padRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{
             background: 'radial-gradient(circle at center, #111 0%, #000 100%)'
          }}
        >
          {/* Axis labels */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase">Joy</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase">Melancholy</div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 uppercase -rotate-90 origin-left">Calm</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 uppercase rotate-90 origin-right">High Energy</div>

          {/* Grid lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-800/50" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-800/50" />

          {/* The Handle */}
          <motion.div 
            className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center"
            animate={{
              left: `${frequency.energy * 100}%`,
              top: `${(1 - frequency.mood) * 100}%`,
              backgroundColor: color
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="w-1 h-1 bg-white rounded-full" />
          </motion.div>
        </div>

        <div className="w-full">
          <input 
            type="text" 
            placeholder="What's resonating with you right now?"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-center text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
            maxLength={50}
            value={thought}
            onChange={e => setThought(e.target.value)}
          />
        </div>

        <button 
          onClick={handleBroadcast}
          disabled={thought.trim() === ''}
          className="group relative px-8 py-3 rounded-full font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-transform active:scale-95"
        >
          <motion.div 
            className="absolute inset-0 opacity-80"
            animate={{ backgroundColor: color }}
          />
          <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition-opacity" />
          <div className="relative z-10 flex items-center gap-2 text-white">
            <Radio size={18} className="animate-pulse" />
            <span>Broadcast</span>
          </div>
        </button>
      </div>
    </div>
  );
};
