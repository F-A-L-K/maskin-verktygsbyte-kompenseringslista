import { MachineId } from "@/types";
import MachineSelector from "./MachineSelector";
import ActionButtons from "./ActionButtons";
import NavigationTabs from "./NavigationTabs";

interface NavbarProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
  currentTab: string;
  onTabChange: (value: string) => void;
}

export default function Navbar({
  activeMachine,
  onMachineChange,
  availableMachines,
  currentTab,
  onTabChange
}: NavbarProps) {
  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <MachineSelector 
          activeMachine={activeMachine} 
          onMachineChange={onMachineChange}
          availableMachines={availableMachines}
        />
      <ActionButtons 
        activeMachine={activeMachine}
        currentTab={currentTab}
      />
      </div>
      <div className="px-6 pb-4">
        <NavigationTabs 
          activeMachine={activeMachine} 
          onTabChange={onTabChange}
        />
      </div>
    </header>
  );
}
