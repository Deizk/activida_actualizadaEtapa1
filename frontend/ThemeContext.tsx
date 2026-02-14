import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: 'normal' | 'large';
  setFontSize: (size: 'normal' | 'large') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or system preference could go here
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSizeState] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    // Tailwind uses rems. Changing root font-size scales everything.
    // Default browser is usually 16px.
    if (fontSize === 'large') {
      root.style.fontSize = '18px'; 
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const setFontSize = (size: 'normal' | 'large') => setFontSizeState(size);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};