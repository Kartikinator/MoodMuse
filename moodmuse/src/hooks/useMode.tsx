import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModeType = 'support' | 'therapy';

export interface ModeContextType {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ModeType>('support');

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}; 