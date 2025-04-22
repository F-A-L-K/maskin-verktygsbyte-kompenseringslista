
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ToolCompensationForm from "@/components/ToolCompensationForm";
import ToolCompensationList from "@/components/ToolCompensationList";
import { ToolCompensation, MachineId } from "@/types";
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";

interface ToolCompensationPageProps {
  activeMachine: MachineId;
}

export default function ToolCompensationPage({ activeMachine }: ToolCompensationPageProps) {
  const [compensations, setCompensations] = useState<ToolCompensation[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const { setLastOrder, getLastOrder } = useLastManufacturingOrder();
  
  const handleAddCompensation = (compensation: ToolCompensation) => {
    setCompensations((prev) => [...prev, compensation]);
    if (compensation.manufacturingOrder) {
      setLastOrder(activeMachine, compensation.manufacturingOrder);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{activeMachine} Verktygskompensering</h1>
          <p className="text-muted-foreground">
            Hantera verktygskompensering för maskin {activeMachine}
          </p>
        </div>
        <Button 
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Ny kompensering</span>
        </Button>
      </div>
      
      <ToolCompensationList compensations={
        compensations.filter(comp => comp.machineId === activeMachine)
      } />
      
      <ToolCompensationForm
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleAddCompensation}
        machineId={activeMachine}
      />
    </div>
  );
}
