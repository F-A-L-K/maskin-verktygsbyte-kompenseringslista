import { MachineId } from "@/types";
import { useTools } from "@/hooks/useTools";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface HistoryProps {
  activeMachine: MachineId;
}

export default function History({ activeMachine }: HistoryProps) {
  const { data: tools, isLoading, error } = useTools();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Ett fel uppstod vid laddning av verktyg
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plats</TableHead>
              <TableHead>Benämning</TableHead>
              <TableHead>Artikelnummer</TableHead>
              <TableHead className="text-right">Antal körda</TableHead>
              <TableHead className="text-right">Min gräns</TableHead>
              <TableHead className="text-right">Max gräns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools && tools.length > 0 ? (
              tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>{tool.plats || "-"}</TableCell>
                  <TableCell className="font-medium">{tool.benämning}</TableCell>
                  <TableCell>{tool.artikelnummer || "-"}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">
                    {tool.mingräns !== null ? tool.mingräns : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {tool.maxgräns !== null ? tool.maxgräns : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Inga verktyg hittades
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
