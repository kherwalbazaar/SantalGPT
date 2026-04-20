import { createContext, useContext, useState, useEffect } from 'react';

const ScriptContext = createContext();

export function useScript() {
  const context = useContext(ScriptContext);
  if (!context) {
    throw new Error('useScript must be used within ScriptProvider');
  }
  return context;
}

export function ScriptProvider({ children }) {
  const [scriptMode, setScriptMode] = useState(() => {
    const saved = localStorage.getItem('santalgpt_script_mode');
    return saved || 'olchiki';
  });

  useEffect(() => {
    localStorage.setItem('santalgpt_script_mode', scriptMode);
  }, [scriptMode]);

  const toggleScript = () => {
    setScriptMode(prev => prev === 'olchiki' ? 'latin' : 'olchiki');
  };

  return (
    <ScriptContext.Provider value={{ scriptMode, toggleScript }}>
      {children}
    </ScriptContext.Provider>
  );
}
