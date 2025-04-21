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
    <Card>
      <CardHeader>
        <CardTitle>Verktygsbyten</CardTitle>
        <CardDescription>
          Historik över alla verktygsbyten
        </CardDescription>
        <div className="pt-2">
          <Input
            placeholder="Sök..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Verktyg</TableHead>
              <TableHead>Anledning</TableHead>
              <TableHead>Kommentar</TableHead>
              <TableHead>Signatur</TableHead>
              <TableHead>Tid</TableHead>
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
              sortedChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-medium">{change.toolNumber}</TableCell>
                  <TableCell>
                    <span className={
                      change.reason === "Verktygsbrott" 
                        ? "text-destructive" 
                        : "text-yellow-600"
                    }>
                      {change.reason}
                    </span>
                  </TableCell>
                  <TableCell>{change.comment || "-"}</TableCell>
                  <TableCell>{change.signature}</TableCell>
                  <TableCell>
                    {format(change.timestamp, "yyyy-MM-dd HH:mm:ss")}
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
