import { useState, useEffect } from "react";
import { Disturbance, MachineId } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DisturbancesProps {
  activeMachine: MachineId;
}

export default function Disturbances({ activeMachine }: DisturbancesProps) {
  const [disturbances, setDisturbances] = useState<Disturbance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For now, we'll use mock data since the database table doesn't exist yet
  useEffect(() => {
    setLoading(true);
    setError(null);
    
  
    setLoading(false);
  }, [activeMachine]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-6">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Störningar</h1>
        
 
    </div>
  );
}
