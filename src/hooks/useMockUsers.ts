import { useMemo } from 'react';
import type { Frequency } from '../types';

export const useMockUsers = (baseFreq: Frequency | undefined, count: number) => {
  const mockUsers = useMemo(() => {
    if (!baseFreq) return [];
    
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
  }, [baseFreq, count]);

  return mockUsers;
};
