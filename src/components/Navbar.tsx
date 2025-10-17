import { MachineId } from "@/types";
import ActionButtons from "./ActionButtons";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface NavbarProps {
  activeMachine: MachineId;
  availableMachines: MachineId[];
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function Navbar({
  activeMachine,
  availableMachines,
  sidebarOpen,
  onSidebarToggle
}: NavbarProps) {
  const hasMultipleMachines = availableMachines.length > 1;
  
  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {hasMultipleMachines && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">{activeMachine}</h1>
        </div>

        <ActionButtons activeMachine={activeMachine} />
      </div>
    </header>
  );
}
