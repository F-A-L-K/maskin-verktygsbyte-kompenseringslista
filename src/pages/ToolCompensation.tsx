import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ToolCompensationForm from "@/components/ToolCompensationForm";
import ToolCompensationList from "@/components/ToolCompensationList";
import { ToolCompensation, MachineId } from "@/types";
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";
import { useModbusValue } from "@/hooks/useModbusValue";
import { supabase } from "@/integrations/supabase/client";

interface ToolCompensationPageProps {
  activeMachine: MachineId;
}

export default function ToolCompensationPage({ activeMachine }: ToolCompensationPageProps) {
  const [compensations, setCompensations] = useState<ToolCompensation[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setLastOrder, getLastOrder } = useLastManufacturingOrder();
  const { value: modbusValue, error: modbusError } = useModbusValue();

  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from("verktygskompensering")
      .select(
        "id, maskin, tillverkningsorder, koordinatsystem, verktyg, nummer, riktning, varde, kommentar, signatur, tid"
      )
      .eq("maskin", activeMachine)
      .order("tid", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError("Kunde inte hämta verktygskompensationer.");
          setLoading(false);
          return;
        }

        const mapped =
          data?.map((item) => ({
            id: item.id,
            machineId: item.maskin,
            manufacturingOrder: item.tillverkningsorder ?? "",
            coordinateSystem: item.koordinatsystem ?? undefined,
            tool: item.verktyg ?? undefined,
            number: item.nummer ?? undefined,
            direction: (item.riktning ?? "X") as ToolCompensation["direction"],
            value: item.varde ?? "",
            comment: item.kommentar ?? "",
            signature: item.signatur ?? "",
            timestamp: new Date(item.tid),
          })) || [];
        setCompensations(mapped);
        setLoading(false);
      });
  }, [activeMachine]);

  const handleAddCompensation = async (compensation: ToolCompensation) => {
    const { error } = await supabase.from("verktygskompensering").insert({
      id: compensation.id,
      maskin: compensation.machineId,
      tillverkningsorder: compensation.manufacturingOrder,
      koordinatsystem: compensation.coordinateSystem || null,
      verktyg: compensation.tool || null,
      nummer: compensation.number || null,
      riktning: compensation.direction,
      varde: compensation.value,
      kommentar: compensation.comment,
      signatur: compensation.signature,
      tid: compensation.timestamp.toISOString(),
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{activeMachine} Verktygskompensering</h1>
          <p className="text-muted-foreground">
            Hantera verktygskompensering för maskin {activeMachine}
          </p>
          {modbusValue !== null && (
            <p className="mt-2 text-sm">
              Modbus värde: <span className="font-medium">{modbusValue}</span>
            </p>
          )}
          {modbusError && (
            <p className="mt-2 text-sm text-destructive">{modbusError}</p>
          )}
        </div>
        <Button 
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Ny kompensering</span>
        </Button>
      </div>
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
      />
    </div>
  );
}
