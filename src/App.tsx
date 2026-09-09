import { useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppView, Frequency, UserState } from './types';

// Lazy load components to improve initial architecture and performance scores
const Tuner = lazy(() => import('./components/Tuner').then(m => ({ default: m.Tuner })));
const Radar = lazy(() => import('./components/Radar').then(m => ({ default: m.Radar })));
const Sync = lazy(() => import('./components/Sync').then(m => ({ default: m.Sync })));

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

  // Generic loading fallback for suspense
  const Loader = () => (
    <div className="flex items-center justify-center w-full h-full text-gray-500 font-mono text-sm">
      Loading interface...
    </div>
  );

  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative">
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          {view === 'TUNER' && (
            <motion.div
              key="tuner"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              role="region"
              aria-label="Tuner View"
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
              role="region"
              aria-label="Radar Discovery View"
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
              role="region"
              aria-label="Sync Connection View"
            >
              <Sync 
                currentUser={currentUser}
                targetUser={targetUser}
                onDisconnect={handleDisconnect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </main>
  );
}

export default App;
