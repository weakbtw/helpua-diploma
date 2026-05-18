import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(() => {
    const savedTheme = localStorage.getItem('helpua_theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('helpua_theme', highContrast ? 'dark' : 'light');
  }, [highContrast]);

  const reset = () => {
    setHighContrast(false);
  };

  return (
    <AccessibilityContext.Provider value={{ highContrast, setHighContrast, reset }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
