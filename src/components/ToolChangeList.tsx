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
    <div className="p-6">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%] text-center">Signatur</TableHead>
              <TableHead className="w-[15%] text-center">Datum</TableHead>   
              <TableHead className="w-[10%] text-center">Verktyg</TableHead>
              <TableHead className="w-[12%] text-center">Anledning</TableHead>
              <TableHead className="w-[12%] text-center">Körda artiklar</TableHead>
              <TableHead className="w-[39%] text-center">Kommentar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedChanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Inga verktygsbyten registrerade
                </TableCell>
              </TableRow>
            ) : (
              sortedChanges.map((change, index) => (
                <TableRow key={change.id}>
                  <TableCell className="text-center">{change.signature}</TableCell>
                  <TableCell className="text-center">{format(change.timestamp, "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell className="font-medium text-center">{change.toolNumber}</TableCell>
                  <TableCell className="text-center">
                    <span className={
                      change.reason === "Verktygsbrott" 
                        ? "text-red-600 font-medium" 
                        : "text-orange-600 font-medium"
                    }>
                      {change.reason}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {change.amount_since_last_change ? (
                      <span>{change.amount_since_last_change} <span className="text-blue-500">ST</span></span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center">{change.comment || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
