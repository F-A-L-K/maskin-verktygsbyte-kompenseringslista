
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Delete } from "lucide-react";
import { useNumericInput } from "@/hooks/useNumericInput";

export const FixedNumericKeypad = () => {
  const { handleInput } = useNumericInput();

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 w-[320px] z-50">
      <div className="grid grid-cols-3 gap-2">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleInput(num.toString())}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleInput("-")}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleInput("0")}
        >
          0
        </Button>
        <Button
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleInput("+")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-14 col-span-3 text-lg font-medium hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => handleInput("backspace")}
        >
          <Delete className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
