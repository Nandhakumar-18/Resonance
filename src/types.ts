export type Frequency = {
  energy: number; // 0 to 1 (X axis)
  mood: number; // 0 to 1 (Y axis)
};

export type UserState = {
  id: string;
  frequency: Frequency;
  thought: string;
};

export type AppView = 'TUNER' | 'RADAR' | 'SYNC';
