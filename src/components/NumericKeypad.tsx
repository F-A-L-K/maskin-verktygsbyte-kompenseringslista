
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Delete } from "lucide-react";

interface NumericKeypadProps {
  onInput: (value: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

export const NumericKeypad = ({ onInput, onClose, position }: NumericKeypadProps) => {
  const handleButtonClick = (value: string) => {
    onInput(value);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div
        className="absolute bg-white rounded-xl shadow-lg p-4 animate-in fade-in slide-in-from-bottom-5"
        style={{
          top: `${position.top + 40}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="grid grid-cols-3 gap-2 w-[240px]">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleButtonClick(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleButtonClick("-")}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleButtonClick("0")}
          >
            0
          </Button>
          <Button
            variant="outline"
            className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleButtonClick("+")}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-14 col-span-3 text-lg font-medium hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleButtonClick("backspace")}
          >
            <Delete className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
