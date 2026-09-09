import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Frequency } from '../types';
import { Radio } from 'lucide-react';

interface TunerProps {
  onSetFrequency: (freq: Frequency, thought: string) => void;
}

export const Tuner = ({ onSetFrequency }: TunerProps) => {
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
    // Use Math.max/min to constrain to bounds
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && thought.trim() !== '') {
      handleBroadcast();
    }
  };

  // Calculate dynamic color based on frequency
  const color = `hsl(${frequency.energy * 360}, ${50 + frequency.mood * 50}%, ${30 + frequency.mood * 30}%)`;

  return (
    <section 
      className="flex flex-col items-center justify-center h-screen w-full bg-black text-white p-4 sm:p-6 relative overflow-hidden"
      aria-label="Frequency Tuner"
    >
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 opacity-20 filter blur-[100px] pointer-events-none"
        animate={{ backgroundColor: color }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      />

      <div className="z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center gap-6 sm:gap-8">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-light tracking-widest mb-1 sm:mb-2 uppercase">Tune In</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Find your frequency to discover others.</p>
        </header>

        {/* The 2D Pad */}
        <div 
          className="relative w-56 h-56 sm:w-64 sm:h-64 border border-gray-700 rounded-2xl cursor-crosshair overflow-hidden shadow-2xl"
          ref={padRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{
             background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
             touchAction: 'none' // prevent scrolling on mobile while dragging
          }}
          role="slider"
          aria-label="2D Frequency Pad"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(frequency.energy * 100)}
          tabIndex={0}
        >
          {/* Axis labels */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase font-medium select-none pointer-events-none">Joy</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase font-medium select-none pointer-events-none">Melancholy</div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 uppercase font-medium select-none pointer-events-none -rotate-90 origin-left">Calm</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 uppercase font-medium select-none pointer-events-none rotate-90 origin-right">High Energy</div>

          {/* Grid lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-800/50" aria-hidden="true" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-800/50" aria-hidden="true" />

          {/* The Handle */}
          <motion.div 
            className="absolute w-6 h-6 sm:w-8 sm:h-8 -ml-3 -mt-3 sm:-ml-4 sm:-mt-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center pointer-events-none"
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

        <div className="w-full relative">
          <label htmlFor="thought-input" className="sr-only">Your thought</label>
          <input 
            id="thought-input"
            type="text" 
            placeholder="What's resonating with you right now?"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-center text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-shadow"
            maxLength={50}
            value={thought}
            onChange={e => setThought(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button 
          onClick={handleBroadcast}
          disabled={thought.trim() === ''}
          className="group relative px-6 py-3 sm:px-8 sm:py-3 rounded-full font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500"
          aria-label="Broadcast frequency"
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
    </section>
  );
};
