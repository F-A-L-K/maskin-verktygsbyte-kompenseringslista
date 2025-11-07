import { ToolCompensationTable } from "@/components/ToolCompensationTable";
import { MachineId } from "@/types";

interface KompenseringVerktygProps {
  activeMachine: MachineId;
}

export default function KompenseringVerktyg({ activeMachine }: KompenseringVerktygProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      <ToolCompensationTable source="/Komp2.csv" />
    </div>
  );
}
