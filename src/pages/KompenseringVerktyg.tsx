import { MachineId } from "@/types";

interface KompenseringVerktygProps {
  activeMachine: MachineId;
}

export default function KompenseringVerktyg({ activeMachine }: KompenseringVerktygProps) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kompensering verktyg</h1>
      <p className="text-muted-foreground">Aktiv maskin: {activeMachine}</p>
      {/* Content will be implemented */}
    </div>
  );
}
