import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { MachineId } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface MachineSelectorProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
}

export default function MachineSelector({ activeMachine, onMachineChange }: MachineSelectorProps) {
  const [open, setOpen] = useState(false);
  const { getVisibleMachines } = useAuth();
  
  const visibleMachines = getVisibleMachines();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className={`flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 shadow-sm cursor-pointer hover:text-muted-foreground transition-colors ${open ? 'rounded-t-full rounded-b-none' : 'rounded-full'}`}>
            <span className="font-medium">Maskin {activeMachine}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? '-rotate-90' : ''}`} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-48 mt-0 border border-gray-300 rounded-b-lg shadow-lg"
          style={{ 
            marginLeft: '0px',
            borderTop: 'none',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px'
          }}
        >
          {visibleMachines.map((machine) => (
            <DropdownMenuItem
              key={machine}
              onClick={() => {
                onMachineChange(machine);
                setOpen(false);
              }}
              className={activeMachine === machine ? "bg-accent h-16" : "h-16"}
            >
              Maskin {machine}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
