import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Filter, X, Calendar, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Compact Tool Info & Filters */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {/* Collapsed Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">T{tool.plats}</span>
              <div className="h-6 w-px bg-border"></div>
              <span className="text-base font-semibold text-foreground">{tool.benämning}</span>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t bg-muted/20">
            <div className="p-4 space-y-4">
              {/* Additional Tool Details */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Artikelnummer</p>
                  <p className="text-sm font-medium text-foreground">{tool.artikelnummer || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Max gräns</p>
                  <p className="text-sm font-semibold text-foreground">
                    {tool.maxgräns || "-"} <span className="text-xs text-muted-foreground">ST</span>
                  </p>
                </div>
              </div>

              {/* Search Filters */}
              <div className="space-y-3">
                
                {/* Tillverkningsorder and Avancerade filter row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Tillverkningsorder
                    </label>
                    <Input
                      placeholder="Sök..."
                      value={manufacturingOrder}
                      onChange={(e) => setManufacturingOrder(e.target.value)}
                      className="h-9"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Anledning & Signatur
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full h-9 justify-start">
                          <Filter className="h-3 w-3 mr-2" />
                          Filter
                          {(selectedCauses.length + selectedSignatures.length) > 0 && (
                            <span className="ml-auto bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[18px] h-[18px] flex items-center justify-center">
                              {selectedCauses.length + selectedSignatures.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 bg-popover z-50" align="end">
                        <div className="p-3">
                          <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-2">
                              <span className="w-1 h-3 bg-primary rounded-full"></span>
                              Anledning
                            </h4>
                            <div className="space-y-1 max-h-28 overflow-y-auto">
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
                                <div className="text-sm text-muted-foreground py-1 px-2">Inga anledningar tillgängliga</div>
                              )}
                            </div>
                          </div>
                          <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-2">
                              <span className="w-1 h-3 bg-primary rounded-full"></span>
                              Signatur
                            </h4>
                            <div className="space-y-1 max-h-28 overflow-y-auto">
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
                                <div className="text-sm text-muted-foreground py-1 px-2">Inga signaturer tillgängliga</div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="text-xs h-7 px-2"
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

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Från datum
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 pointer-events-none" />
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Till datum
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 pointer-events-none" />
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
