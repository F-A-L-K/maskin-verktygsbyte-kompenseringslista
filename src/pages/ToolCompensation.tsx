
import { useState, useEffect } from "react";
import ToolCompensationForm from "@/components/ToolCompensationForm";
import ToolCompensationList from "@/components/ToolCompensationList";
import { ToolCompensation, MachineId } from "@/types";
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";
import { supabase } from "@/integrations/supabase/client";

interface ToolCompensationPageProps {
  activeMachine: MachineId;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

export default function ToolCompensationPage({ activeMachine, showDialog, setShowDialog }: ToolCompensationPageProps) {
  const [compensations, setCompensations] = useState<ToolCompensation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestManufacturingOrder, setLatestManufacturingOrder] = useState<string>("");
  const { setLastOrder, getLastOrder } = useLastManufacturingOrder();

  // Fetch compensations from Supabase
  useEffect(() => {
    setLoading(true);
    setError(null);
    (supabase as any)
      .from("Verktygshanteringssystem_kompenseringslista")
      .select(
        "id, machine_number, manufacturing_order, compnum_coordinate_system, compnum_tool, compnum_number, compensation_direction, compensation_value, comment, signature, date_created"
      )
      .eq("machine_number", activeMachine)
      .order("date_created", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError("Kunde inte hämta verktygskompensationer.");
          setLoading(false);
          return;
        }

        const mapped =
          data?.map((item) => ({
            id: item.id,
            machineId: item.machine_number ?? "",
            manufacturingOrder: item.manufacturing_order ?? "",
            coordinateSystem: item.compnum_coordinate_system ?? undefined,
            tool: item.compnum_tool ?? undefined,
            number: item.compnum_number ?? undefined,
            direction: (item.compensation_direction ?? "X") as ToolCompensation["direction"],
            value: item.compensation_value ?? "",
            comment: item.comment ?? "",
            signature: item.signature ?? "",
            timestamp: new Date(item.date_created),
          })) || [];
        setCompensations(mapped);
        if (mapped.length > 0) {
          setLatestManufacturingOrder(mapped[0].manufacturingOrder);
        }
        setLoading(false);
      });
  }, [activeMachine]);

  // Add new compensation to Supabase & local state
  const handleAddCompensation = async (compensation: ToolCompensation) => {
    const { error } = await (supabase as any).from("Verktygshanteringssystem_kompenseringslista").insert({
      id: compensation.id,
      machine_number: compensation.machineId,
      manufacturing_order: compensation.manufacturingOrder,
      compnum_coordinate_system: compensation.coordinateSystem || null,
      compnum_tool: compensation.tool || null,
      compnum_number: compensation.number || null,
      compensation_direction: compensation.direction,
      compensation_value: compensation.value,
      comment: compensation.comment,
      signature: compensation.signature,
      date_created: compensation.timestamp.toISOString(),
    });
    if (error) {
      setError("Kunde inte spara verktygskompensation.");
      return;
    }
    setCompensations((prev) => [...prev, compensation]);
    if (compensation.manufacturingOrder) {
      setLastOrder(activeMachine, compensation.manufacturingOrder);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-600 px-2">{error}</div>
      )}
      {loading ? (
        <div className="text-gray-500 px-2">Laddar verktygskompensationer...</div>
      ) : (
        <ToolCompensationList compensations={compensations} />
      )}

      <ToolCompensationForm
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleAddCompensation}
        machineId={activeMachine}
        defaultManufacturingOrder={latestManufacturingOrder}
      />
    </div>
  );
}
