import { useState } from "react";
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
import { ToolChange } from "@/types";
import { format } from "date-fns";

interface ToolChangeListProps {
  toolChanges: ToolChange[];
}

export default function ToolChangeList({ toolChanges }: ToolChangeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredChanges = toolChanges.filter((change) => {
    const query = searchQuery.toLowerCase();
    return (
      change.toolNumber.toLowerCase().includes(query) ||
      change.reason.toLowerCase().includes(query) ||
      change.comment.toLowerCase().includes(query) ||
      change.signature.toLowerCase().includes(query)
    );
  });
  
  const sortedChanges = [...filteredChanges].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card className="border-none">
      <CardHeader>
       
      </CardHeader>
      <CardContent>
        <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
             <TableHead className="w-[10%] text-center">Signatur</TableHead>
             <TableHead className="w-[10%] text-center">Datum</TableHead>   
             <TableHead className="w-[10%] text-center">Verktyg</TableHead>
             <TableHead className="w-[10%] text-center">Anledning</TableHead>
             <TableHead className="w-[60%] text-center">Kommentar</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {sortedChanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Inga verktygsbyten registrerade
                </TableCell>
              </TableRow>
            ) : (
              sortedChanges.map((change, index) => (
                <TableRow key={change.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="text-center">{change.signature}</TableCell>
                    <TableCell className="text-center">{format(change.timestamp, "yyyy-MM-dd HH:mm")}</TableCell>
                   <TableCell className="font-bold text-center">{change.toolNumber}</TableCell>
                   <TableCell className="text-center">
                     <span className={
                       change.reason === "Verktygsbrott" 
                         ? "text-destructive" 
                         : "text-yellow-600"
                     }>
                       {change.reason}
                     </span>
                   </TableCell>
                   
                   <TableCell className="text-center">{change.comment || "-"}</TableCell>
                   
                   
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
