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
import { Loader2, ChevronsRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HistoryProps {
  activeMachine: MachineId;
}

export default function History({ activeMachine }: HistoryProps) {
  const { data: tools, isLoading, error } = useTools();
  const navigate = useNavigate();

  const handleToolHistory = (toolId: string) => {
    const machineId = activeMachine.split(' ')[0];
    navigate(`/${machineId}/verktygshistorik/${toolId}`);
  };

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
      <div className=" overflow-hidden">
        <Table maxHeight="85vh">
          <TableHeader>
            <TableRow >
              <TableHead className="w-[5%] text-center">Plats</TableHead>
              <TableHead className="w-[25%] text-center">Benämning</TableHead>
              <TableHead className="w-[25%] text-center">Artikelnummer</TableHead>
              <TableHead className="w-[10%] text-center">Antal körda</TableHead>
              <TableHead className="w-[10%] text-center">Max gräns</TableHead>
              <TableHead className="w-[3%] text-center">Mer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {tools && tools.length > 0 ? (
             [...tools]
             .sort((a, b) => (a.plats || "").localeCompare(b.plats || "", undefined, { numeric: true }))
             .map((tool) => (
                <TableRow key={tool.id} >
                  <TableCell className="text-center">T{tool.plats || "-"}</TableCell>
                  <TableCell className="font-medium text-center">{tool.benämning}</TableCell>
                  <TableCell className="text-center">{tool.artikelnummer || "-"}</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center" >
                    {tool.maxgräns !== null ? (
                      <span>{tool.maxgräns} <span className="text-blue-500">ST</span></span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center p-0">
                    <div 
                      className="bg-[#C8D8E0] hover:bg-blue-200 cursor-pointer flex items-center justify-center h-full min-h-[48px] transition-colors"
                      onClick={() => handleToolHistory(tool.id)}
                    >
                      <ChevronsRight className="h-4 w-4 text-blue-800" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
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
