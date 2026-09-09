import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Radar } from '../components/Radar';
import { Sync } from '../components/Sync';
import { useUser } from '../context/UserContext';
import type { UserState } from '../types';
import { Search, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Discover = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState<UserState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Protect route
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSync = (user: UserState) => {
    setTargetUser(user);
  };

  const handleLeaveRadar = () => {
    navigate('/');
  };

  const handleDisconnect = () => {
    setTargetUser(null);
  };

  return (
    <div className="pt-20 h-screen w-screen bg-black overflow-hidden relative flex flex-col">
      <AnimatePresence mode="wait">
        {!targetUser ? (
          <motion.div
            key="radar-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 relative"
          >
            {/* Content Discovery Area */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
              <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full flex items-center px-4 py-2 shadow-lg">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="search"
                  placeholder="Discover frequencies..."
                  className="bg-transparent border-none outline-none text-white text-sm w-full ml-3"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search content and thoughts"
                />
                <button aria-label="Filter results" className="text-gray-400 hover:text-white">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <Radar 
              currentUser={currentUser} 
              onSync={handleSync}
              onLeave={handleLeaveRadar}
              searchFilter={searchQuery}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sync-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 bg-black"
          >
            <Sync 
              currentUser={currentUser}
              targetUser={targetUser}
              onDisconnect={handleDisconnect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
