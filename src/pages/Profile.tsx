import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogOut, Shield, Moon, Bell } from 'lucide-react';
import { getFrequencyColor } from '../utils/colorUtils';

export const Profile = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [displayName, setDisplayName] = useState(currentUser?.id || 'me');
  
  // Protect route
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const myColor = getFrequencyColor(currentUser.frequency);

  return (
    <div className="pt-24 min-h-screen w-screen bg-black text-white px-6 pb-20">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-center border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-light tracking-widest uppercase">Profile</h1>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2">
            <LogOut size={18} />
            <span className="text-sm">Disconnect</span>
          </button>
        </header>

        <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6" aria-label="Personalized Experience Settings">
          <div className="flex items-center gap-6 mb-8">
            <div 
              className="w-20 h-20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              style={{ backgroundColor: myColor }}
            />
            <div>
              <h2 className="text-xl font-medium mb-1">Your Resonance</h2>
              <p className="text-sm text-gray-400 font-mono">
                E: {Math.round(currentUser.frequency.energy * 100)}% | M: {Math.round(currentUser.frequency.mood * 100)}%
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-sm text-gray-400 uppercase tracking-wider">Display Alias</label>
              <input 
                id="displayName"
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-black border border-gray-800 rounded-lg px-4 py-3 focus:border-gray-600 focus:outline-none transition-colors"
                aria-label="Edit display alias"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400 uppercase tracking-wider">Last Broadcasted Thought</span>
              <div className="bg-black border border-gray-800 rounded-lg px-4 py-4 italic text-gray-300">
                "{currentUser.thought}"
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4" aria-label="App Preferences">
          <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Preferences</h2>
          
          <button className="flex items-center justify-between w-full bg-gray-900/30 border border-gray-800 hover:bg-gray-800/50 transition-colors rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-gray-400" />
              <span>Theme Mode</span>
            </div>
            <span className="text-xs text-gray-500 uppercase">Dark (Enforced)</span>
          </button>
          
          <button className="flex items-center justify-between w-full bg-gray-900/30 border border-gray-800 hover:bg-gray-800/50 transition-colors rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-400" />
              <span>Sync Notifications</span>
            </div>
            <div className="w-10 h-5 bg-white/20 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0 scale-110 shadow-md"></div>
            </div>
          </button>
          
          <button className="flex items-center justify-between w-full bg-gray-900/30 border border-gray-800 hover:bg-gray-800/50 transition-colors rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-400" />
              <span>Privacy & Safety</span>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};
