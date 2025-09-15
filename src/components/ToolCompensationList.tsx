
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
              <TableHead>Tillverkningsorder</TableHead>
              <TableHead>Koordinatsystem</TableHead>
              <TableHead>Verktyg</TableHead>
              <TableHead>Nummer</TableHead>
              <TableHead>Riktning</TableHead>
              <TableHead>Värde</TableHead>
              <TableHead>Kommentar</TableHead>
              <TableHead>Signatur</TableHead>
              <TableHead>Tid</TableHead>
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
              sortedCompensations.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell>{comp.manufacturingOrder || "-"}</TableCell>
                  <TableCell>{comp.coordinateSystem || "-"}</TableCell>
                  <TableCell>{comp.tool || "-"}</TableCell>
                  <TableCell>{comp.number || "-"}</TableCell>
                  <TableCell>{comp.direction}</TableCell>
                  <TableCell>{comp.value}</TableCell>
                  <TableCell>{comp.comment || "-"}</TableCell>
                  <TableCell>{comp.signature}</TableCell>
                  <TableCell>
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
