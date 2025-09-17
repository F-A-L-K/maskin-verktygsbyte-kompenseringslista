import { MachineId } from "@/types";
import ToolChangePage from "./ToolChange";
import ToolCompensationPage from "./ToolCompensation";

interface HomeProps {
  activeMachine: MachineId;
  currentTab: string;
}

export default function Home({ 
  activeMachine,
  currentTab
}: HomeProps) {
  return (
    <div className="p-6">
      {currentTab === "verktyg" && (
        <ToolChangePage 
          activeMachine={activeMachine} 
        />
      )}
      
      {currentTab === "kompensering" && (
        <ToolCompensationPage 
          activeMachine={activeMachine} 
        />
      )}
    </div>
  );
}
