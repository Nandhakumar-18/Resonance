import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Frequency, UserState } from '../types';

interface UserContextType {
  currentUser: UserState | null;
  setCurrentUser: (user: UserState | null) => void;
  updateFrequency: (frequency: Frequency, thought: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);

  const updateFrequency = (frequency: Frequency, thought: string) => {
    setCurrentUser({
      id: 'me',
      frequency,
      thought
    });
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, updateFrequency }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
