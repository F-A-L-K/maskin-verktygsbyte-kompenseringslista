import { MachineId } from "@/types";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface StatusBarProps {
  activeMachine: MachineId;
}

export default function StatusBar({ activeMachine }: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-statusbar text-statusbar-foreground px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">{activeMachine}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium">110 Väntar på ställ</span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
