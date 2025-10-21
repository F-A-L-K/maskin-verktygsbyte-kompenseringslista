import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Filter, X, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useMachineFromUrl } from "@/hooks/useMachineFromUrl";
import { useState, useEffect } from "react";

export default function ToolHistory() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { activeMachine } = useMachineFromUrl();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  
  // Filter states
  const [manufacturingOrder, setManufacturingOrder] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [selectedSignatures, setSelectedSignatures] = useState<string[]>([]);
  const [availableCauses, setAvailableCauses] = useState<string[]>([]);
  const [availableSignatures, setAvailableSignatures] = useState<string[]>([]);

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

  // Fetch tool changes for this tool on this specific machine
  const { data: toolChanges, isLoading: changesLoading } = useQuery({
    queryKey: ['toolChanges', toolId, activeMachine],
    queryFn: async () => {
      if (!toolId || !activeMachine) return [];
      
      // Extract machine number from activeMachine and get machine ID
      const machineNumber = activeMachine.split(' ')[0];
      
      const { data: machineData } = await supabase
        .from('verktygshanteringssystem_maskiner')
        .select('id')
        .eq('maskiner_nummer', machineNumber)
        .single();
      
      if (!machineData) return [];
      
      const { data, error } = await supabase
        .from('verktygshanteringssystem_verktygsbyteslista')
        .select('*')
        .eq('tool_id', toolId)
        .eq('machine_id', machineData.id)
        .order('date_created', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!toolId && !!activeMachine,
  });

  // Extract unique causes and signatures for filter dropdowns
  useEffect(() => {
    if (!toolChanges) return;

    const causes = [...new Set(toolChanges.map(change => change.cause).filter(Boolean))];
    const signatures = [...new Set(toolChanges.map(change => change.signature).filter(Boolean))];
    
    setAvailableCauses(causes);
    setAvailableSignatures(signatures);
  }, [toolChanges]);

  // Filter data based on all filter criteria
  useEffect(() => {
    if (!toolChanges) return;

    let filtered = toolChanges;

    // Apply manufacturing order filter
    if (manufacturingOrder) {
      filtered = filtered.filter((change: any) => 
        change.manufacturing_order?.toLowerCase().includes(manufacturingOrder.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((change: any) => 
        new Date(change.date_created) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((change: any) => 
        new Date(change.date_created) <= toDate
      );
    }

    // Apply cause filter
    if (selectedCauses.length > 0) {
      filtered = filtered.filter((change: any) => 
        selectedCauses.includes(change.cause)
      );
    }

    // Apply signature filter
    if (selectedSignatures.length > 0) {
      filtered = filtered.filter((change: any) => 
        selectedSignatures.includes(change.signature)
      );
    }

    setFilteredData(filtered);
  }, [toolChanges, manufacturingOrder, dateFrom, dateTo, selectedCauses, selectedSignatures]);

  const clearAllFilters = () => {
    setManufacturingOrder("");
    setDateFrom("");
    setDateTo("");
    setSelectedCauses([]);
    setSelectedSignatures([]);
  };

  const toggleCause = (cause: string) => {
    setSelectedCauses(prev => 
      prev.includes(cause) 
        ? prev.filter(c => c !== cause)
        : [...prev, cause]
    );
  };

  const toggleSignature = (signature: string) => {
    setSelectedSignatures(prev => 
      prev.includes(signature) 
        ? prev.filter(s => s !== signature)
        : [...prev, signature]
    );
  };

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
    <div className="p-6 space-y-6">
      {/* Tool Information Card */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20 overflow-hidden">
        <div className="bg-card/80 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Verktygsinformation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plats</p>
              <p className="text-2xl font-bold text-primary">T{tool.plats}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Benämning</p>
              <p className="text-lg font-semibold text-foreground">{tool.benämning}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Artikelnummer</p>
              <p className="text-lg font-medium text-foreground">{tool.artikelnummer || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Max gräns</p>
              <p className="text-lg font-semibold text-foreground">
                {tool.maxgräns || "-"} <span className="text-sm text-muted-foreground">ST</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-muted/30 px-6 py-3 border-b">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Sökfilter
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tillverkningsorder Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Tillverkningsorder
              </label>
              <Input
                placeholder="Sök tillverkningsorder..."
                value={manufacturingOrder}
                onChange={(e) => setManufacturingOrder(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Från datum
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Till datum
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Avancerade filter
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-10 justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Anledning & Signatur
                    {(selectedCauses.length + selectedSignatures.length) > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                        {selectedCauses.length + selectedSignatures.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-popover" align="end">
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-3 text-foreground flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        Anledning
                      </h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {availableCauses.length > 0 ? (
                          availableCauses.map((cause) => (
                            <DropdownMenuCheckboxItem
                              key={cause}
                              checked={selectedCauses.includes(cause)}
                              onCheckedChange={() => toggleCause(cause)}
                              className="text-sm"
                            >
                              {cause}
                            </DropdownMenuCheckboxItem>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-2">Inga anledningar tillgängliga</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-3 text-foreground flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        Signatur
                      </h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {availableSignatures.length > 0 ? (
                          availableSignatures.map((signature) => (
                            <DropdownMenuCheckboxItem
                              key={signature}
                              checked={selectedSignatures.includes(signature)}
                              onCheckedChange={() => toggleSignature(signature)}
                              className="text-sm"
                            >
                              {signature}
                            </DropdownMenuCheckboxItem>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-2">Inga signaturer tillgängliga</div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs h-8"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Rensa alla
                      </Button>
                      <div className="text-xs font-medium text-muted-foreground">
                        {selectedCauses.length + selectedSignatures.length} valda
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <Table maxHeight="70vh">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[10%]">Tid</TableHead>
              <TableHead className="text-center w-[10%]">Anledning</TableHead>
              <TableHead className="text-center w-[10%]">Tillverkningsorder</TableHead>
              <TableHead className="text-center w-[10%]">Antal körda</TableHead>
              <TableHead className="text-center w-[10%]">Signatur</TableHead>
              <TableHead className="text-center w-[20%]">Kommentar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="text-center">
                    {format(new Date(change.date_created), "yyyy-MM-dd HH:mm", { locale: sv })}
                  </TableCell>
                  <TableCell className="text-center">{change.cause || "-"}</TableCell>
                  <TableCell className="text-center">{change.manufacturing_order || "-"}</TableCell>
                  <TableCell className="text-center">{change.amount_since_last_change || "-"}</TableCell>
                  <TableCell className="text-center">{change.signature || "-"}</TableCell>
                  <TableCell className="text-center">{change.comment || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {manufacturingOrder || dateFrom || dateTo || selectedCauses.length > 0 || selectedSignatures.length > 0 
                    ? "Inga verktygsbyten matchade filtren" 
                    : "Inga verktygsbyten hittades för detta verktyg"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
