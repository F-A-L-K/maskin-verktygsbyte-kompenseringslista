
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ToolChangeForm from "@/components/ToolChangeForm";
import ToolChangeList from "@/components/ToolChangeList";
import { ToolChange, MachineId } from "@/types";

interface ToolChangePageProps {
  activeMachine: MachineId;
}

export default function ToolChangePage({ activeMachine }: ToolChangePageProps) {
  const [toolChanges, setToolChanges] = useState<ToolChange[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  
  const handleAddToolChange = (toolChange: ToolChange) => {
    setToolChanges((prev) => [...prev, toolChange]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verktygsbyte</h1>
          <p className="text-muted-foreground">
            Hantera verktygsbyten för maskin {activeMachine}
          </p>
        </div>
        <Button 
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nytt verktygsbyte</span>
        </Button>
      </div>
      
      <ToolChangeList toolChanges={
        toolChanges.filter(change => change.machineId === activeMachine)
      } />
      
      <ToolChangeForm
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleAddToolChange}
        machineId={activeMachine}
      />
    </div>
  );
}
