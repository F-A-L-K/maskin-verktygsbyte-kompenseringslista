
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Delete } from "lucide-react";

interface FixedNumericKeypadProps {
  onInput: (value: string) => void;
}

export const FixedNumericKeypad = ({ onInput }: FixedNumericKeypadProps) => {
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 w-[320px]">
      <div className="grid grid-cols-3 gap-2">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            onClick={() => onInput(num.toString())}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          onClick={() => onInput("-")}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          onClick={() => onInput("0")}
        >
          0
        </Button>
        <Button
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          onClick={() => onInput("+")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-14 col-span-3 text-lg font-medium hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onInput("backspace")}
        >
          <Delete className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
