import { MachineId, Machine } from "@/types";
import MachineSelector from "./MachineSelector";
import ActionButtons from "./ActionButtons";
import { Button } from "./ui/button";

interface NavbarProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
  currentTab: string;
  onTabChange: (value: string) => void;
  machineData?: Machine[];
}

export default function Navbar({
  activeMachine,
  onMachineChange,
  availableMachines,
  currentTab,
  onTabChange,
  machineData
}: NavbarProps) {
  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-6 py-4">
      <MachineSelector 
            activeMachine={activeMachine} 
            onMachineChange={onMachineChange}
            availableMachines={availableMachines}
            machineData={machineData}
          />
        <div className="flex items-center gap-6">
        
          
          <div className="flex gap-2">
            <Button
              variant={currentTab === "verktyg" ? "default" : "outline"}
              onClick={() => onTabChange("verktyg")}
            >
              Verktygsbyte
            </Button>
            <Button
              variant={currentTab === "kompensering" ? "default" : "outline"}
              onClick={() => onTabChange("kompensering")}
            >
              Kompensering
            </Button>
          </div>
        </div>

        <ActionButtons 
          activeMachine={activeMachine}
          currentTab={currentTab}
        />
      </div>
    </header>
  );
}
