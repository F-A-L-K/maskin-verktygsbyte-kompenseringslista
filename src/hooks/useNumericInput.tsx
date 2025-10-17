import { createContext, useState, useCallback, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface NumericInputContextType {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleInput: (input: string) => void;
  clearValue: () => void;
}

const NumericInputContext = createContext<NumericInputContextType | undefined>(undefined);

export const NumericInputProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState('');

  const handleInput = useCallback((input: string) => {
    // Find the currently focused input element
    const activeElement = document.activeElement as HTMLInputElement;
    if (!activeElement || !['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
      return;
    }

    if (input === 'backspace') {
      const newValue = activeElement.value.slice(0, -1);
      activeElement.value = newValue;
      // Trigger input event to ensure form state updates
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    // Get current cursor position
    const cursorPos = activeElement.selectionStart || activeElement.value.length;
    const beforeCursor = activeElement.value.substring(0, cursorPos);
    const afterCursor = activeElement.value.substring(cursorPos);

    // Only allow one + or - at the start
    if ((input === '+' || input === '-')) {
      if (cursorPos === 0) {
        const newValue = input + activeElement.value;
        activeElement.value = newValue;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Insert the number at cursor position
    const newValue = beforeCursor + input + afterCursor;
    activeElement.value = newValue;
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Move cursor position after the inserted number
    activeElement.setSelectionRange(cursorPos + 1, cursorPos + 1);
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
