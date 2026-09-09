import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserState } from '../types';
import { X, Send } from 'lucide-react';

interface SyncProps {
  currentUser: UserState;
  targetUser: UserState;
  onDisconnect: () => void;
}

type Message = {
  id: string;
  text: string;
  senderId: string;
};

export const Sync: React.FC<SyncProps> = ({ currentUser, targetUser, onDisconnect }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds ephemeral sync

  // Ephemeral timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onDisconnect();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onDisconnect]);

  // Mock incoming messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I feel that too.",
        senderId: targetUser.id
      }]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [targetUser.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: input,
      senderId: currentUser.id
    }]);
    setInput('');
  };

  const getColor = (freq: any) => `hsl(${freq.energy * 360}, ${50 + freq.mood * 50}%, ${30 + freq.mood * 30}%)`;
  const myColor = getColor(currentUser.frequency);
  const targetColor = getColor(targetUser.frequency);

  // Gradient background blending the two frequencies
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${myColor}22 0%, #000 50%, ${targetColor}22 100%)`
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white relative" style={backgroundStyle}>
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: targetColor }} />
            <span className="text-sm text-gray-300 font-medium">Syncing with someone...</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-xs text-gray-500 font-mono">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <button 
            onClick={onDisconnect}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
        {/* Initial Thoughts Display */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl text-center opacity-10 pointer-events-none">
          <div className="text-3xl font-light mb-8 italic text-white/50">"{currentUser.thought}"</div>
          <div className="text-3xl font-light italic text-white/50">"{targetUser.thought}"</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 z-10 p-4 no-scrollbar">
          <AnimatePresence>
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] px-5 py-3 rounded-2xl backdrop-blur-md border ${
                      isMe 
                        ? 'bg-white/10 border-white/20 text-white rounded-tr-sm' 
                        : 'bg-black/40 border-gray-800 text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-800/50 backdrop-blur-md z-10">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a thought..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-full pl-6 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-center mt-3 text-[10px] text-gray-600 uppercase tracking-widest">
          Messages disappear after sync ends
        </div>
      </div>
    </div>
  );
};
