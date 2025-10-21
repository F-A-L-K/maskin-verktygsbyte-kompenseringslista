import { MachineId } from "@/types";
import { Clock, User, Shield } from "lucide-react";
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
    <div className="bg-statusbar text-white px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-white fill-white" />
            <span className="font-semibold text-xs">{activeMachine}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <User className="h-4 w-4 text-white fill-white" />
            <span className="font-medium text-xs">Fredrik Falk</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
