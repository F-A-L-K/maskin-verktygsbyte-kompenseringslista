import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Monitor } from "lucide-react";
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
          <Button  className="flex items-center gap-2">
            <span className="font-medium">{activeMachine}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {visibleMachines.map((machine) => (
            <DropdownMenuItem
              key={machine}
              onClick={() => {
                onMachineChange(machine);
                setOpen(false);
              }}
              className={activeMachine === machine ? "bg-accent" : ""}
            >
              {machine}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
