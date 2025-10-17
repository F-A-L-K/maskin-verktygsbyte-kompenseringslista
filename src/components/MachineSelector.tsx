import { MachineId } from "@/types";

interface MachineSelectorProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
  isOpen: boolean;
}

export default function MachineSelector({ activeMachine, onMachineChange, availableMachines, isOpen }: MachineSelectorProps) {
  const hasMultipleMachines = availableMachines.length > 1;

  if (!hasMultipleMachines || !isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r shadow-lg z-40 overflow-y-auto">
      <div className="py-2">
        <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
          Maskiner
        </div>
        {availableMachines.map((machine) => (
          <div
            key={machine}
            onClick={() => onMachineChange(machine)}
            className={`px-4 py-3 cursor-pointer hover:bg-accent transition-colors ${
              activeMachine === machine ? "bg-primary text-primary-foreground font-medium" : ""
            }`}
          >
            <span>{machine}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}