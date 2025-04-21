
import { MachineId } from "@/types";

interface ToolCompensationPageProps {
  activeMachine: MachineId;
}

export default function ToolCompensationPage({ activeMachine }: ToolCompensationPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verktygskompensering</h1>
        <p className="text-muted-foreground">
          Hantera verktygskompensering för maskin {activeMachine}
        </p>
      </div>
      
      <div className="bg-secondary/50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-medium mb-2">Funktionalitet under utveckling</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Verktygskompensering kommer att implementeras i nästa uppdatering. Använd verktygsbyte-funktionen tillsvidare.
        </p>
      </div>
    </div>
  );
}
