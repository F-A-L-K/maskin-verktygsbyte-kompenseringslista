import { MachineId, Tool } from "@/types";
import { Clock, Shield, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTools } from "@/hooks/useTools";
import { getAdamBoxValue } from "@/lib/adambox";
import { supabase } from "@/integrations/supabase/client";

interface StatusBarProps {
  activeMachine: MachineId;
}

interface ToolWarning {
  plats: string;
  benämning: string;
  partsSinceLastChange: number;
  maxgräns: number;
  isMax: boolean; // true if at max, false if at warning
}

export default function StatusBar({ activeMachine }: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toolWarnings, setToolWarnings] = useState<ToolWarning[]>([]);
  const [currentWarningIndex, setCurrentWarningIndex] = useState(0);
  const { data: tools } = useTools();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check tool limits every 5 minutes
  useEffect(() => {
    const checkToolLimits = async () => {
      if (!tools || tools.length === 0) return;

      try {
        const currentAdamValue = await getAdamBoxValue(activeMachine);
        if (currentAdamValue === null) return;

        const machineNumber = activeMachine.split(' ')[0];
        const { data: machineData } = await supabase
          .from('verktygshanteringssystem_maskiner')
          .select('id')
          .eq('maskiner_nummer', machineNumber)
          .single();
        
        if (!machineData) return;

        const warnings: ToolWarning[] = [];

        for (const tool of tools) {
          if (!tool.maxgräns || !tool.plats) continue;

          // Get the latest tool change for this tool
          const { data: latestToolChange } = await (supabase as any)
            .from("verktygshanteringssystem_verktygsbyteslista")
            .select("number_of_parts_ADAM")
            .eq("tool_id", tool.id)
            .eq("machine_id", machineData.id)
            .order("date_created", { ascending: false })
            .limit(1);

          if (latestToolChange && latestToolChange.length > 0) {
            const lastAdamValue = latestToolChange[0].number_of_parts_ADAM;
            if (lastAdamValue !== null) {
              const partsSinceLastChange = currentAdamValue - lastAdamValue;
              
              // Check if at or over max limit
              if (partsSinceLastChange >= tool.maxgräns) {
                warnings.push({
                  plats: tool.plats,
                  benämning: tool.benämning,
                  partsSinceLastChange,
                  maxgräns: tool.maxgräns,
                  isMax: true
                });
              }
              // Check if at warning threshold
              else if (tool.maxgräns_varning && partsSinceLastChange >= (tool.maxgräns - tool.maxgräns_varning)) {
                warnings.push({
                  plats: tool.plats,
                  benämning: tool.benämning,
                  partsSinceLastChange,
                  maxgräns: tool.maxgräns,
                  isMax: false
                });
              }
            }
          }
        }

        setToolWarnings(warnings);
      } catch (error) {
        console.error('Error checking tool limits:', error);
      }
    };

    // Check immediately on mount/machine change
    checkToolLimits();

    // Then check every 5 minutes
    const interval = setInterval(checkToolLimits, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tools, activeMachine]);

  // Rotate through warnings every 5 seconds if multiple warnings
  useEffect(() => {
    if (toolWarnings.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentWarningIndex((prev) => (prev + 1) % toolWarnings.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [toolWarnings]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const currentWarning = toolWarnings.length > 0 ? toolWarnings[currentWarningIndex] : null;

  return (
    <div className="bg-[#507E95] text-white px-6 py-2 flex items-center justify-between h-12">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 fill-white" />
            <span className="font-semibold text-md">{activeMachine}</span>
          </div>
        </div>
      </div>

      {/* Tool warnings in center */}
      {currentWarning && (
        <div className="flex items-center gap-2 animate-pulse">
          <AlertTriangle className={`h-5 w-5 ${currentWarning.isMax ? 'text-red-300' : 'text-yellow-300'}`} />
          <span className="font-semibold">
            T{currentWarning.plats} {currentWarning.benämning} - {currentWarning.isMax ? 'Maxgräns nådd' : 'Byt snart'} ({currentWarning.partsSinceLastChange}/{currentWarning.maxgräns} ST)
          </span>
          {toolWarnings.length > 1 && (
            <span className="text-sm opacity-75">
              ({currentWarningIndex + 1}/{toolWarnings.length})
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}

