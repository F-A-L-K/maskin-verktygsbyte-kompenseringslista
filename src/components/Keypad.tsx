
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

export default function Keypad({ value, onChange, maxLength = 10, className }: KeypadProps) {
  const handleKeyPress = (key: string) => {
    if (key === "clear") {
      onChange("");
    } else if (key === "backspace") {
      onChange(value.slice(0, -1));
    } else {
      if (maxLength && value.length >= maxLength) return;
      onChange(value + key);
    }
  };

  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "clear", "0", "backspace"
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {keys.map((key) => (
        <Button
          key={key}
          type="button"
          variant={key === "clear" ? "destructive" : key === "backspace" ? "outline" : "default"}
          className={cn(
            "h-12 text-lg font-medium",
            key === "backspace" && "col-span-1",
            key === "clear" && "col-span-1"
          )}
          onClick={() => handleKeyPress(key)}
        >
          {key === "backspace" ? "←" : key === "clear" ? "C" : key}
        </Button>
      ))}
    </div>
  );
}
