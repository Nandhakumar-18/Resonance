import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Frequency, UserState } from '../types';
import { X } from 'lucide-react';

interface RadarProps {
  currentUser: UserState;
  onSync: (user: UserState) => void;
  onLeave: () => void;
}

// Generate mock users around the user's frequency
const generateMockUsers = (baseFreq: Frequency, count: number): UserState[] => {
  const thoughts = [
    "Just staring at the rain.",
    "Need coffee immediately.",
    "Lost in this new track.",
    "Coding into the void.",
    "Why is everything so loud?",
    "Feeling oddly peaceful today.",
    "Can't stop thinking about the future.",
    "Just vibing.",
    "Who else is awake?",
    "Existential dread kicking in."
  ];

  return Array.from({ length: count }).map((_, i) => {
    // Generate frequencies slightly deviated from base
    const energyOffset = (Math.random() - 0.5) * 0.4;
    const moodOffset = (Math.random() - 0.5) * 0.4;
    
    return {
      id: `user-${i}`,
      frequency: {
        energy: Math.max(0, Math.min(1, baseFreq.energy + energyOffset)),
        mood: Math.max(0, Math.min(1, baseFreq.mood + moodOffset))
      },
      thought: thoughts[Math.floor(Math.random() * thoughts.length)]
    };
  });
};

export const Radar: React.FC<RadarProps> = ({ currentUser, onSync, onLeave }) => {
  const [mockUsers, setMockUsers] = useState<UserState[]>([]);
  const [hoveredUser, setHoveredUser] = useState<UserState | null>(null);

  useEffect(() => {
    setMockUsers(generateMockUsers(currentUser.frequency, 8));
  }, [currentUser.frequency]);

  const getColor = (freq: Frequency) => `hsl(${freq.energy * 360}, ${50 + freq.mood * 50}%, ${30 + freq.mood * 30}%)`;
  const myColor = getColor(currentUser.frequency);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <motion.div 
        className="absolute inset-0 opacity-10 filter blur-[120px]"
        animate={{ backgroundColor: myColor }}
        transition={{ duration: 1 }}
      />
      
      {/* Header */}
      <div className="absolute top-6 left-6 z-20">
        <h1 className="text-xl tracking-widest font-light text-gray-400">RADAR</h1>
        <p className="text-xs text-gray-600 mt-1">Scanning for resonance...</p>
      </div>

      <button 
        onClick={onLeave}
        className="absolute top-6 right-6 z-20 p-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        <X size={24} className="text-gray-400" />
      </button>

      {/* Radar UI */}
      <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
        {/* Pulsing rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-gray-800"
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ 
              width: '100%', 
              height: '100%', 
              opacity: 0 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: ring * 1.3,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Static Rings */}
        <div className="absolute w-full h-full rounded-full border border-gray-900/50" />
        <div className="absolute w-2/3 h-2/3 rounded-full border border-gray-900/50" />
        <div className="absolute w-1/3 h-1/3 rounded-full border border-gray-900/50" />
        
        {/* Crosshairs */}
        <div className="absolute w-full h-px bg-gray-900/50" />
        <div className="absolute h-full w-px bg-gray-900/50" />

        {/* Center Node (Current User) */}
        <div className="absolute z-10">
          <motion.div 
            className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            animate={{ backgroundColor: myColor }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
          {/* Label for center */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none border border-gray-800">
            {currentUser.thought}
          </div>
        </div>

        {/* Other Users */}
        {mockUsers.map((user) => {
          // Calculate distance and angle based on frequency difference
          // This is a simplified mapping for visual effect
          const eDiff = user.frequency.energy - currentUser.frequency.energy;
          const mDiff = user.frequency.mood - currentUser.frequency.mood;
          
          // Map -1..1 difference to -150..150 pixels (or similar)
          const radius = Math.min(250, Math.sqrt(eDiff*eDiff + mDiff*mDiff) * 500 + 50); // Min distance from center
          const angle = Math.atan2(mDiff, eDiff);
          
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const userColor = getColor(user.frequency);

          return (
            <motion.div
              key={user.id}
              className="absolute z-10 cursor-pointer"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x, y, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20, delay: Math.random() * 0.5 }}
              onMouseEnter={() => setHoveredUser(user)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => onSync(user)}
            >
              <motion.div 
                className="w-4 h-4 rounded-full"
                animate={{ backgroundColor: userColor, scale: hoveredUser?.id === user.id ? 1.5 : 1 }}
                whileHover={{ scale: 1.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{ boxShadow: `0 0 10px ${userColor}` }}
              />
              
              {/* Tooltip on hover */}
              {hoveredUser?.id === user.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-gray-300 bg-gray-900/80 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700 shadow-xl pointer-events-none min-w-[120px] text-center"
                >
                  "{user.thought}"
                  <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Click to Sync</div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
