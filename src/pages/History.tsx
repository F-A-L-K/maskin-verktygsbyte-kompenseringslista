import { MachineId } from "@/types";
import ToolChangePage from "./ToolChange";

interface HistoryProps {
  activeMachine: MachineId;
}

export default function History({ activeMachine }: HistoryProps) {
  return (
    <div className="p-6">
      <ToolChangePage activeMachine={activeMachine} />
    </div>
  );
}
