import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserState } from '../types';
import { X, Send } from 'lucide-react';
import { getFrequencyColor } from '../utils/colorUtils';

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

export const Sync = ({ currentUser, targetUser, onDisconnect }: SyncProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds ephemeral sync
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const myColor = getFrequencyColor(currentUser.frequency);
  const targetColor = getFrequencyColor(targetUser.frequency);

  // Gradient background blending the two frequencies
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${myColor}22 0%, #000 50%, ${targetColor}22 100%)`
  };

  return (
    <section 
      className="flex flex-col h-screen w-full bg-black text-white relative" 
      style={backgroundStyle}
      aria-label="Active Sync Session"
    >
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse" 
              style={{ backgroundColor: targetColor }} 
              aria-hidden="true"
            />
            <span className="text-xs sm:text-sm text-gray-300 font-medium">Syncing...</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div 
            className="text-xs sm:text-sm text-gray-400 font-mono"
            aria-live="polite"
            aria-label={`${timeLeft} seconds remaining`}
          >
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <button 
            onClick={onDisconnect}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full p-1"
            aria-label="Disconnect Sync"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Interaction Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden relative">
        {/* Initial Thoughts Display */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl text-center opacity-[0.07] pointer-events-none px-4"
          aria-hidden="true"
        >
          <div className="text-xl sm:text-3xl font-light mb-6 sm:mb-8 italic text-white/80">"{currentUser.thought}"</div>
          <div className="text-xl sm:text-3xl font-light italic text-white/80">"{targetUser.thought}"</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 sm:gap-4 z-10 p-2 sm:p-4 no-scrollbar" role="log" aria-live="polite">
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
                    className={`max-w-[85%] sm:max-w-[70%] px-4 sm:px-5 py-2 sm:py-3 rounded-2xl backdrop-blur-md border text-sm sm:text-base ${
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
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 sm:p-6 border-t border-gray-800/50 backdrop-blur-md z-10">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
          <label htmlFor="message-input" className="sr-only">Type a message</label>
          <input
            id="message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a thought..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-full pl-5 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-shadow"
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 sm:right-2 p-2 sm:p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Send message"
          >
            <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </form>
        <div className="text-center mt-2 sm:mt-3 text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-widest">
          Messages disappear after sync ends
        </div>
      </footer>
    </section>
  );
};
