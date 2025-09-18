import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MachineId } from "@/types";

interface MachineSelectorProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
}

export default function MachineSelector({ activeMachine, onMachineChange, availableMachines }: MachineSelectorProps) {
  const [open, setOpen] = useState(false);
  const hasMultipleMachines = availableMachines.length > 1;

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 ${hasMultipleMachines ? 'cursor-pointer hover:text-muted-foreground transition-colors' : ''}`}
        onClick={hasMultipleMachines ? () => setOpen(!open) : undefined}
      >
        {hasMultipleMachines && (
          <>
            {open ? (
              <X className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <Menu className="h-4 w-4 transition-transform duration-200" />
            )}
          </>
        )}
        <span className="font-medium">{activeMachine}</span>
      </div>
      
      {open && hasMultipleMachines && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {availableMachines.map((machine) => (
              <div
                key={machine}
                onClick={() => {
                  onMachineChange(machine);
                  setOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeMachine === machine ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                {machine}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}