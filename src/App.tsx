import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tuner } from './components/Tuner';
import { Radar } from './components/Radar';
import { Sync } from './components/Sync';
import type { AppView, Frequency, UserState } from './types';

function App() {
  const [view, setView] = useState<AppView>('TUNER');
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);
  const [targetUser, setTargetUser] = useState<UserState | null>(null);

  const handleSetFrequency = (frequency: Frequency, thought: string) => {
    setCurrentUser({
      id: 'me',
      frequency,
      thought
    });
    setView('RADAR');
  };

  const handleSync = (user: UserState) => {
    setTargetUser(user);
    setView('SYNC');
  };

  const handleLeaveRadar = () => {
    setCurrentUser(null);
    setView('TUNER');
  };

  const handleDisconnect = () => {
    setTargetUser(null);
    setView('RADAR');
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'TUNER' && (
          <motion.div
            key="tuner"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Tuner onSetFrequency={handleSetFrequency} />
          </motion.div>
        )}

        {view === 'RADAR' && currentUser && (
          <motion.div
            key="radar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Radar 
              currentUser={currentUser} 
              onSync={handleSync}
              onLeave={handleLeaveRadar}
            />
          </motion.div>
        )}

        {view === 'SYNC' && currentUser && targetUser && (
          <motion.div
            key="sync"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
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
}

export default App;
