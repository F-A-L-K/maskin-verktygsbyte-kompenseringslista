import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export default function ToolHistory() {
  const { toolId } = useParams();
  const navigate = useNavigate();

  // Fetch tool details
  const { data: tool, isLoading: toolLoading } = useQuery({
    queryKey: ['tool', toolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verktygshanteringssystem_verktyg')
        .select('*')
        .eq('id', toolId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!toolId,
  });

  // Fetch tool changes for this tool
  const { data: toolChanges, isLoading: changesLoading } = useQuery({
    queryKey: ['toolChanges', tool?.plats],
    queryFn: async () => {
      if (!tool?.plats) return [];
      
      const { data, error } = await supabase
        .from('verktygshanteringssystem_verktygsbyteslista')
        .select('*')
        .eq('tool_number', tool.plats)
        .order('date_created', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!tool?.plats,
  });

  const isLoading = toolLoading || changesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          Verktyget hittades inte
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
      
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Plats:</span>
              <span className="ml-2 font-medium">T{tool.plats}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Benämning:</span>
              <span className="ml-2 font-medium">{tool.benämning}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Artikelnummer:</span>
              <span className="ml-2 font-medium">{tool.artikelnummer || "-"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max gräns:</span>
              <span className="ml-2 font-medium">
                {tool.maxgräns || "-"} ST
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Datum</TableHead>
              <TableHead className="text-center">Maskin</TableHead>
              <TableHead className="text-center">Orsak</TableHead>
              <TableHead className="text-center">TO</TableHead>
              <TableHead className="text-center">Antal körda</TableHead>
              <TableHead className="text-center">Signatur</TableHead>
              <TableHead className="text-center">Kommentar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toolChanges && toolChanges.length > 0 ? (
              toolChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="text-center">
                    {format(new Date(change.date_created), "yyyy-MM-dd HH:mm", { locale: sv })}
                  </TableCell>
                  <TableCell className="text-center">{change.machine_number || "-"}</TableCell>
                  <TableCell className="text-center">{change.cause || "-"}</TableCell>
                  <TableCell className="text-center">{change.manufacturing_order || "-"}</TableCell>
                  <TableCell className="text-center">{change.amount_since_last_change || "-"}</TableCell>
                  <TableCell className="text-center">{change.signature || "-"}</TableCell>
                  <TableCell className="text-center">{change.comment || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Inga verktygsbyten hittades för detta verktyg
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
