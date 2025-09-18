import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MachineId } from "@/types";

interface ActionButtonsProps {
  activeMachine: MachineId;
  currentTab: string;
}

export default function ActionButtons({ activeMachine, currentTab }: ActionButtonsProps) {
  const navigate = useNavigate();

  // Extract machine number from full machine ID (e.g., "5701 Fanuc Robodrill" -> "5701")
  const getMachineNumber = (machineId: MachineId): string => {
    return machineId.split(' ')[0];
  };

  return (
    <div className="flex gap-2">
      {currentTab === "verktyg" && (
        <Button 
          onClick={() => navigate(`/new-tool-change?machine=${getMachineNumber(activeMachine)}`)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nytt verktygsbyte</span>
        </Button>
      )}
      {currentTab === "kompensering" && (
        <Button 
          onClick={() => navigate(`/new-compensation?machine=${getMachineNumber(activeMachine)}`)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Ny kompensering</span>
        </Button>
      )}
    </div>
  );
}
