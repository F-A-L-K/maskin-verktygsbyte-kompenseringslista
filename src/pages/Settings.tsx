import { useState, useEffect } from "react";
import { useTools } from "@/hooks/useTools";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const { data: tools, isLoading, refetch } = useTools();
  const [maxValues, setMaxValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize maxValues when tools are loaded
  useEffect(() => {
    if (tools) {
      const initialValues: Record<string, string> = {};
      tools.forEach(tool => {
        initialValues[tool.id] = tool.maxgräns !== null ? tool.maxgräns.toString() : "";
      });
      setMaxValues(initialValues);
    }
  }, [tools]);

  const handleInputChange = (toolId: string, value: string) => {
    setMaxValues({ ...maxValues, [toolId]: value });
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    // Validate all inputs
    for (const [toolId, value] of Object.entries(maxValues)) {
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        toast.error("Maxgräns måste vara ett positivt tal");
        return;
      }
    }

    setIsSaving(true);
    
    try {
      // Update all changed tools
      const updates = Object.entries(maxValues).map(async ([toolId, value]) => {
        return supabase
          .from('verktygshanteringssystem_verktyg')
          .update({ 
            maxgräns: value ? Number(value) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', toolId);
      });

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error("Några uppdateringar misslyckades");
      }

      toast.success("Maxgränser uppdaterade");
      setHasChanges(false);
      refetch();
    } catch (error) {
      console.error('Error updating max limits:', error);
      toast.error("Kunde inte uppdatera maxgränser");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#507E95]" />
      </div>
    );
  }

  const sortedTools = tools?.sort((a, b) => {
    const numA = parseInt(a.plats || "0");
    const numB = parseInt(b.plats || "0");
    return numA - numB;
  }) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Verktyg Maxgränser</h2>
        <Button
          onClick={handleSaveAll}
          disabled={!hasChanges || isSaving}
          className="bg-[#507E95] hover:bg-[#3d6273]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sparar...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Spara
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table maxHeight="70vh">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Verktyg</TableHead>  
              <TableHead className="w-[60%]">Maxgräns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Inga verktyg hittades
                </TableCell>
              </TableRow>
            ) : (
              sortedTools.map((tool) => {
                return (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">
                      T{tool.plats} {tool.benämning}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={maxValues[tool.id] || ""}
                        onChange={(e) => handleInputChange(tool.id, e.target.value)}
                        placeholder="Ange maxgräns"
                        className="h-9 max-w-[200px]"
                        disabled={isSaving}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
