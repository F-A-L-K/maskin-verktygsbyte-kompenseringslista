import { MachineId } from "@/types";

interface KompenseringEgenskaperProps {
  activeMachine: MachineId;
}

export default function KompenseringEgenskaper({ activeMachine }: KompenseringEgenskaperProps) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kompensering egenskaper</h1>
      <p className="text-muted-foreground">Aktiv maskin: {activeMachine}</p>
      {/* Content will be implemented */}
    </div>
  );
}
