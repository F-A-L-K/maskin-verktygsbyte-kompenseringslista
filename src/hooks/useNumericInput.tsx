
import { useState, useCallback } from 'react';

export const useNumericInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

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

  return {
    value,
    setValue,
    handleInput,
  };
};
