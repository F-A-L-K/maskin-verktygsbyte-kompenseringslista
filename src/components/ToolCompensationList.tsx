
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToolCompensation } from "@/types";
import { format } from "date-fns";
import { useState } from "react";

interface ToolCompensationListProps {
  compensations: ToolCompensation[];
}

export default function ToolCompensationList({ compensations }: ToolCompensationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCompensations = compensations.filter((comp) => {
    const query = searchQuery.toLowerCase();
    return (
      (comp.coordinateSystem?.toLowerCase().includes(query) ?? false) ||
      (comp.tool?.toLowerCase().includes(query) ?? false) ||
      (comp.number?.toLowerCase().includes(query) ?? false) ||
      comp.direction.toLowerCase().includes(query) ||
      comp.value.toLowerCase().includes(query) ||
      comp.comment.toLowerCase().includes(query) ||
      comp.signature.toLowerCase().includes(query)
    );
  });
  
  const sortedCompensations = [...filteredCompensations].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card className="border-none">
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Tillverkningsorder</TableHead>
              <TableHead className="text-center">Koordinatsystem</TableHead>
              <TableHead className="text-center">Verktyg</TableHead>
              <TableHead className="text-center">Nummer</TableHead>
              <TableHead className="text-center">Riktning</TableHead>
              <TableHead className="text-center">Värde</TableHead>
              <TableHead className="text-center">Kommentar</TableHead>
              <TableHead className="text-center">Signatur</TableHead>
              <TableHead className="text-center">Tid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompensations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Inga kompenseringar registrerade
                </TableCell>
              </TableRow>
            ) : (
              sortedCompensations.map((comp, index) => (
                <TableRow key={comp.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <TableCell className="text-center">{comp.manufacturingOrder || "-"}</TableCell>
                  <TableCell className="text-center">{comp.coordinateSystem || "-"}</TableCell>
                  <TableCell className="text-center">{comp.tool || "-"}</TableCell>
                  <TableCell className="text-center">{comp.number || "-"}</TableCell>
                  <TableCell className="text-center">{comp.direction}</TableCell>
                  <TableCell className="text-center">{comp.value}</TableCell>
                  <TableCell className="text-center">{comp.comment || "-"}</TableCell>
                  <TableCell className="text-center">{comp.signature}</TableCell>
                  <TableCell className="text-center">
                    {format(comp.timestamp, "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
