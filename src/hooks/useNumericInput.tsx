
import { useState, useCallback } from 'react';

export const useNumericInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadPosition, setKeypadPosition] = useState({ top: 0, left: 0 });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const rect = e.target.getBoundingClientRect();
    setKeypadPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setShowKeypad(true);
  };

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

  const closeKeypad = useCallback(() => {
    setShowKeypad(false);
  }, []);

  return {
    value,
    setValue,
    showKeypad,
    keypadPosition,
    handleFocus,
    handleInput,
    closeKeypad,
  };
};
