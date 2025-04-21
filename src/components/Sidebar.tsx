
import { cn } from "@/lib/utils";
import { MachineId } from "@/types";

interface SidebarProps {
  activeMachine: MachineId;
  setActiveMachine: (machine: MachineId) => void;
}

export default function Sidebar({ activeMachine, setActiveMachine }: SidebarProps) {
  const machines: MachineId[] = ["5701", "5702", "5703", "5704"];

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Verktygshantering</h1>
      </div>
      
      <div className="p-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2 opacity-70">MASKINER</h2>
        <div className="space-y-1">
          {machines.map((machine) => (
            <button
              key={machine}
              onClick={() => setActiveMachine(machine)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
                activeMachine === machine 
                  ? "bg-machine-active text-machine-foreground" 
                  : "hover:bg-machine-hover"
              )}
            >
              {machine}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
