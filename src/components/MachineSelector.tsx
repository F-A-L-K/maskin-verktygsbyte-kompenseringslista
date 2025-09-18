import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MachineId, Machine } from "@/types";

interface MachineSelectorProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
  machineData?: Machine[];
}

export default function MachineSelector({ activeMachine, onMachineChange, availableMachines, machineData }: MachineSelectorProps) {
  const [open, setOpen] = useState(false);
  const hasMultipleMachines = availableMachines.length > 1;

  // Helper function to get active article for a machine
  const getActiveArticle = (machineId: string) => {
    if (!machineData) return null;
    const machineNumber = machineId.split(' ')[0]; // Extract machine number from "5701 Machine Name"
    const machine = machineData.find(m => m.maskiner_nummer === machineNumber);
    return machine?.active_article;
  };

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
        <div className="flex items-center gap-2 w-">
          <span className="font-medium">{activeMachine}</span>
          {getActiveArticle(activeMachine) && (
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              Artikel: {getActiveArticle(activeMachine)}
            </span>
          )}
        </div>
      </div>
      
      {open && hasMultipleMachines && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                <div className="flex items-center justify-between">
                  <span>{machine}</span>
                  {getActiveArticle(machine) && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Artikel: {getActiveArticle(machine)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}