import { MachineId } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateToolChangeProps {
  activeMachine: MachineId;
}

export default function CreateToolChange({ activeMachine }: CreateToolChangeProps) {
  const navigate = useNavigate();

  const getMachineNumber = (machineId: MachineId): string => {
    return machineId.split(' ')[0];
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Skapa Verktygsbyte</h2>
        <Button 
          onClick={() => navigate(`/new-tool-change?machine=${getMachineNumber(activeMachine)}`)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nytt verktygsbyte</span>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Klicka på "Nytt verktygsbyte" för att registrera ett nytt verktygsbyte.
      </p>
    </div>
  );
}
