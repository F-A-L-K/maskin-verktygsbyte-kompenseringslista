
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ToolChangeForm from "@/components/ToolChangeForm";
import ToolChangeList from "@/components/ToolChangeList";
import { ToolChange, MachineId } from "@/types";
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";
import { supabase } from "@/integrations/supabase/client";

interface ToolChangePageProps {
  activeMachine: MachineId;
}

export default function ToolChangePage({ activeMachine }: ToolChangePageProps) {
  const [toolChanges, setToolChanges] = useState<ToolChange[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setLastOrder, getLastOrder } = useLastManufacturingOrder();

  // Fetch tool changes from Supabase
  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from("verktygsbyte")
      .select(
        "id, maskin, verktyg, anledning, kommentar, signatur, tid, tillverkningsorder"
      )
      .eq("maskin", activeMachine)
      .order("tid", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError("Kunde inte hämta verktygsbyten.");
          setLoading(false);
          return;
        }
        const mapped =
          data?.map((item) => ({
            id: item.id,
            machineId: item.maskin,
            manufacturingOrder: item.tillverkningsorder ?? "",
            toolNumber: item.verktyg ?? "",
            reason: (item.anledning ?? "Slitage") as ToolChange["reason"],
            comment: item.kommentar ?? "",
            signature: item.signatur ?? "",
            timestamp: new Date(item.tid),
          })) || [];
        setToolChanges(mapped);
        setLoading(false);
      });
  }, [activeMachine]);

  // Add new tool change to Supabase & local state
  const handleAddToolChange = async (toolChange: ToolChange) => {
    // Save to Supabase
    const { error } = await supabase.from("verktygsbyte").insert({
      id: toolChange.id,
      maskin: toolChange.machineId,
      tillverkningsorder: toolChange.manufacturingOrder,
      verktyg: toolChange.toolNumber,
      anledning: toolChange.reason,
      kommentar: toolChange.comment,
      signatur: toolChange.signature,
      tid: toolChange.timestamp.toISOString(),
    });
    if (error) {
      setError("Kunde inte spara verktygsbyte.");
      return;
    }
    setToolChanges((prev) => [...prev, toolChange]);
    if (toolChange.manufacturingOrder) {
      setLastOrder(activeMachine, toolChange.manufacturingOrder);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{activeMachine} Verktygsbyte</h1>
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

      {error && (
        <div className="text-red-600 px-2">{error}</div>
      )}
      {loading ? (
        <div className="text-gray-500 px-2">Laddar verktygsbyten...</div>
      ) : (
        <ToolChangeList toolChanges={toolChanges} />
      )}

      <ToolChangeForm
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleAddToolChange}
        machineId={activeMachine}
      />
    </div>
  );
}

