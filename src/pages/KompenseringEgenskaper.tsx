import { CompensationTable } from "@/components/CompensationTable";
import { MachineId } from "@/types";

interface KompenseringEgenskaperProps {
  activeMachine: MachineId;
}

export default function KompenseringEgenskaper({ activeMachine }: KompenseringEgenskaperProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      <CompensationTable source="/Komp1.csv" />
    </div>
  );
}
