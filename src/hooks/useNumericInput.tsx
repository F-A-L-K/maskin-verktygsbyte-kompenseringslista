
import React, { createContext, useState, useCallback, useContext } from 'react';

interface NumericInputContextType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleInput: (input: string) => void;
  clearValue: () => void;
}

const NumericInputContext = createContext<NumericInputContextType | undefined>(undefined);

export const NumericInputProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('');

  const handleInput = useCallback((input: string) => {
    if (input === 'backspace') {
      setValue(prev => prev.slice(0, -1));
      return;
    }

    setValue(prev => {
      // Handle first character being + or -
      if ((input === '+' || input === '-') && prev === '') {
        return input;
      }
      
      // Don't allow multiple + or - signs
      if ((input === '+' || input === '-') && (prev.includes('+') || prev.includes('-'))) {
        return prev;
      }

      return prev + input;
    });
  }, []);

  const clearValue = useCallback(() => {
    setValue('');
  }, []);

  return (
    <NumericInputContext.Provider value={{ value, setValue, handleInput, clearValue }}>
      {children}
    </NumericInputContext.Provider>
  );
};

export const useNumericInput = () => {
  const context = useContext(NumericInputContext);
  if (!context) {
    throw new Error('useNumericInput must be used within a NumericInputProvider');
  }
  return context;
};
