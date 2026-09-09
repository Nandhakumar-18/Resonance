import type { Frequency } from '../types';

export const getFrequencyColor = (freq: Frequency): string => {
  return `hsl(${freq.energy * 360}, ${50 + freq.mood * 50}%, ${30 + freq.mood * 30}%)`;
};
