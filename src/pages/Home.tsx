import { MachineId } from "@/types";
import ToolChangePage from "./ToolChange";

interface HomeProps {
  activeMachine: MachineId;
  sidebarOpen: boolean;
}

export default function Home({ 
  activeMachine,
  sidebarOpen
}: HomeProps) {
  return (
    <div className={`p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <ToolChangePage activeMachine={activeMachine} />
    </div>
  );
}
