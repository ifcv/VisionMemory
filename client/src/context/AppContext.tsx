import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  activeAnalysis: any | null;
  setActiveAnalysis: (analysis: any | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeAnalysis, setActiveAnalysis] = useState<any | null>(null);

  return (
    <AppContext.Provider value={{ activeAnalysis, setActiveAnalysis }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
