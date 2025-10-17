import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MachineId } from "@/types";

interface ActionButtonsProps {
  activeMachine: MachineId;
}

export default function ActionButtons({ activeMachine }: ActionButtonsProps) {
  const navigate = useNavigate();

  // Extract machine number from full machine ID (e.g., "5701 Fanuc Robodrill" -> "5701")
  const getMachineNumber = (machineId: MachineId): string => {
    return machineId.split(' ')[0];
  };

  return (
    <Button 
      onClick={() => navigate(`/new-tool-change?machine=${getMachineNumber(activeMachine)}`)}
      className="flex items-center gap-2"
    >
      <Plus size={16} />
      <span>Nytt verktygsbyte</span>
    </Button>
  );
}
