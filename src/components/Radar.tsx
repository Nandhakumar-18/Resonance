import { useState } from 'react';
import { motion } from 'framer-motion';
import type { UserState } from '../types';
import { X } from 'lucide-react';
import { useMockUsers } from '../hooks/useMockUsers';
import { getFrequencyColor } from '../utils/colorUtils';

interface RadarProps {
  currentUser: UserState;
  onSync: (user: UserState) => void;
  onLeave: () => void;
  searchFilter?: string;
}

export const Radar = ({ currentUser, onSync, onLeave, searchFilter = '' }: RadarProps) => {
  const [hoveredUser, setHoveredUser] = useState<UserState | null>(null);

  const allMockUsers = useMockUsers(currentUser.frequency, 12);

  const mockUsers = searchFilter.trim() 
    ? allMockUsers.filter(u => u.thought.toLowerCase().includes(searchFilter.toLowerCase()))
    : allMockUsers;

  const myColor = getFrequencyColor(currentUser.frequency);

  return (
    <section 
      className="flex flex-col items-center justify-center h-screen w-full bg-black text-white relative overflow-hidden"
      aria-label="Radar Map"
    >
      {/* Background ambient glow */}
      <motion.div 
        className="absolute inset-0 opacity-10 filter blur-[100px] pointer-events-none"
        animate={{ backgroundColor: myColor }}
        transition={{ duration: 1 }}
        aria-hidden="true"
      />
      
      {/* Header */}
      <header className="absolute top-6 left-6 z-20">
        <h1 className="text-xl tracking-widest font-light text-gray-400">RADAR</h1>
        <p className="text-xs text-gray-600 mt-1">Scanning for resonance...</p>
      </header>

      <button 
        onClick={onLeave}
        className="absolute top-6 right-6 z-20 p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
        aria-label="Leave Radar"
      >
        <X size={24} className="text-gray-400" />
      </button>

      {/* Radar UI - Improved responsive sizing */}
      <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] aspect-square flex items-center justify-center">
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
            aria-hidden="true"
          />
        ))}
        
        {/* Static Rings */}
        <div className="absolute w-full h-full rounded-full border border-gray-900/50" aria-hidden="true" />
        <div className="absolute w-2/3 h-2/3 rounded-full border border-gray-900/50" aria-hidden="true" />
        <div className="absolute w-1/3 h-1/3 rounded-full border border-gray-900/50" aria-hidden="true" />
        
        {/* Crosshairs */}
        <div className="absolute w-full h-px bg-gray-900/50" aria-hidden="true" />
        <div className="absolute h-full w-px bg-gray-900/50" aria-hidden="true" />

        {/* Center Node (Current User) */}
        <div className="absolute z-10 flex flex-col items-center">
          <motion.div 
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            animate={{ backgroundColor: myColor }}
            aria-label="Your position"
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
          </motion.div>
          {/* Label for center */}
          <div className="absolute top-8 whitespace-nowrap text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none border border-gray-800">
            {currentUser.thought}
          </div>
        </div>

        {/* Other Users */}
        {mockUsers.map((user) => {
          const eDiff = user.frequency.energy - currentUser.frequency.energy;
          const mDiff = user.frequency.mood - currentUser.frequency.mood;
          
          // Improved distance mapping to fit smaller screens better
          // 50% of the container width is the max radius.
          const maxRadius = window.innerWidth < 640 ? 120 : 220; 
          const radius = Math.min(maxRadius, Math.sqrt(eDiff*eDiff + mDiff*mDiff) * 300 + 40); 
          const angle = Math.atan2(mDiff, eDiff);
          
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const userColor = getFrequencyColor(user.frequency);

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
              role="button"
              aria-label={`Sync with user thinking: ${user.thought}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSync(user)}
            >
              <motion.div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
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
                  role="tooltip"
                >
                  "{user.thought}"
                  <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Click to Sync</div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
