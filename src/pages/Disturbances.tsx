import { useState, useEffect } from "react";
import { Disturbance, MachineId } from "@/types";
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

interface DisturbancesProps {
  activeMachine: MachineId;
}

interface DisturbanceData {
  id: string;
  machine_id: string;
  area: string;
  comment: string;
  signature: string;
  created_at: string;
}

export default function Disturbances({ activeMachine }: DisturbancesProps) {
  const [disturbances, setDisturbances] = useState<DisturbanceData[]>([]);
  const [filteredDisturbances, setFilteredDisturbances] = useState<DisturbanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchArea, setSearchArea] = useState("");
  const [searchComment, setSearchComment] = useState("");

  useEffect(() => {
    fetchDisturbances();
  }, [activeMachine]);

  // Filter disturbances based on search terms
  useEffect(() => {
    let filtered = disturbances;

    if (searchArea) {
      filtered = filtered.filter(item => 
        item.area.toLowerCase().includes(searchArea.toLowerCase())
      );
    }

    if (searchComment) {
      filtered = filtered.filter(item => 
        item.comment.toLowerCase().includes(searchComment.toLowerCase())
      );
    }

    setFilteredDisturbances(filtered);
  }, [disturbances, searchArea, searchComment]);

  const fetchDisturbances = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get machine ID from database
      const machineNumber = activeMachine.split(' ')[0];
      const { data: machineData } = await supabase
        .from('verktygshanteringssystem_maskiner')
        .select('id')
        .eq('maskiner_nummer', machineNumber)
        .single();

      if (!machineData) {
        setError("Maskin hittades inte");
        return;
      }

      const { data, error } = await supabase
        .from('verktygshanteringssystem_störningar')
        .select('*')
        .eq('maskin_id', machineData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database columns to our interface
      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        machine_id: item.maskin_id,
        area: item.område,
        comment: item.kommentar,
        signature: item.signatur,
        created_at: item.created_at,
      }));

      setDisturbances(mappedData);
      setFilteredDisturbances(mappedData);
    } catch (error) {
      console.error('Error fetching disturbances:', error);
      setError('Ett fel uppstod vid laddning av störningar');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
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
            placeholder="Sök område..."
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Sök kommentar..."
            value={searchComment}
            onChange={(e) => setSearchComment(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="overflow-hidden">
        <Table maxHeight="85vh">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] text-center">Datum</TableHead>
              <TableHead className="w-[20%] text-center">Område</TableHead>
              <TableHead className="w-[50%] text-center">Kommentar</TableHead>
              <TableHead className="w-[10%] text-center">Signatur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisturbances && filteredDisturbances.length > 0 ? (
              filteredDisturbances.map((disturbance) => (
                <TableRow key={disturbance.id}>
                  <TableCell className="text-center">
                    {formatDate(disturbance.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    {disturbance.area}
                  </TableCell>
                  <TableCell className="text-center">
                    {disturbance.comment}
                  </TableCell>
                  <TableCell className="text-center">
                    {disturbance.signature}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  Inga störningar hittades
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
