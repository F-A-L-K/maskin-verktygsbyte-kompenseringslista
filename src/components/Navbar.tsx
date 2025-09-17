import { MachineId } from "@/types";
import MachineSelector from "./MachineSelector";
import ActionButtons from "./ActionButtons";
import NavigationTabs from "./NavigationTabs";

interface NavbarProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  showCompensationDialog: boolean;
  setShowCompensationDialog: (show: boolean) => void;
  currentTab: string;
  onTabChange: (value: string) => void;
}

export default function Navbar({
  activeMachine,
  onMachineChange,
  availableMachines,
  showDialog,
  setShowDialog,
  showCompensationDialog,
  setShowCompensationDialog,
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
          onNewToolChange={() => setShowDialog(true)}
          onNewCompensation={() => setShowCompensationDialog(true)}
          currentTab={currentTab}
        />
      </div>
      <div className="px-6 pb-4">
        <NavigationTabs 
          activeMachine={activeMachine} 
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          showCompensationDialog={showCompensationDialog}
          setShowCompensationDialog={setShowCompensationDialog}
          onTabChange={onTabChange}
        />
      </div>
    </header>
  );
}
