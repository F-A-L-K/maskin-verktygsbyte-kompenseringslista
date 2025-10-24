import { useState, useEffect } from "react";
import { MachineId } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MatrixkodHistorikProps {
  activeMachine: MachineId;
}

interface MatrixkodData {
  id: string;
  tillverkningsorder: string;
  matrixkod_datum: string;
  kommentar: string | null;
  created_at: string;
}

export default function MatrixkodHistorik({ activeMachine }: MatrixkodHistorikProps) {
  const [matrixkoder, setMatrixkoder] = useState<MatrixkodData[]>([]);
  const [filteredMatrixkoder, setFilteredMatrixkoder] = useState<MatrixkodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchOrder, setSearchOrder] = useState("");
  const [searchMatrixkod, setSearchMatrixkod] = useState("");

  useEffect(() => {
    fetchMatrixkoder();
  }, [activeMachine]);

  // Filter matrixkoder based on search terms
  useEffect(() => {
    let filtered = matrixkoder;

    if (searchOrder) {
      filtered = filtered.filter(item => 
        item.tillverkningsorder.toLowerCase().includes(searchOrder.toLowerCase())
      );
    }

    if (searchMatrixkod) {
      filtered = filtered.filter(item => 
        item.matrixkod_datum.toLowerCase().includes(searchMatrixkod.toLowerCase())
      );
    }

    setFilteredMatrixkoder(filtered);
  }, [matrixkoder, searchOrder, searchMatrixkod]);

  const fetchMatrixkoder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('verktygshanteringssystem_matrixkoder' as any)
        .select('*')
        .order('matrixkod_datum', { ascending: false });

      if (error) throw error;

      setMatrixkoder(data || []);
      setFilteredMatrixkoder(data || []);
    } catch (error) {
      console.error('Error fetching matrixkoder:', error);
      setError('Ett fel uppstod vid laddning av matrixkoder');
    } finally {
      setIsLoading(false);
    }
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
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search boxes */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Sök tillverkningsorder..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Sök matrixkod..."
            value={searchMatrixkod}
            onChange={(e) => setSearchMatrixkod(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className=" overflow-hidden">
        <Table maxHeight="85vh">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] text-center">Tillverkningsorder</TableHead>
              <TableHead className="w-[30%] text-center">Matrixkod (ÅÅMMDD)</TableHead>
              <TableHead className="w-[50%] text-center">Kommentar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatrixkoder && filteredMatrixkoder.length > 0 ? (
              filteredMatrixkoder.map((matrixkod) => (
                <TableRow key={matrixkod.id}>
                  <TableCell className="text-center">
                    {matrixkod.tillverkningsorder}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {matrixkod.matrixkod_datum}
                  </TableCell>
                  <TableCell className="text-center">
                    {matrixkod.kommentar || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  Inga matrixkoder hittades
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
