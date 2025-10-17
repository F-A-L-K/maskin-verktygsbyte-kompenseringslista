import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MachineStatus {
  id: string;
  name: string;
  isRunning: boolean;
  cycleTime: number; // in minutes
  elapsedTime: number; // in minutes
  startTime?: Date;
}

export default function CMM() {
  const [machines, setMachines] = useState<MachineStatus[]>([
    {
      id: "crysta-apex-s",
      name: "Crysta Apex S",
      isRunning: true,
      cycleTime: 10, // 45 minutes cycle time
      elapsedTime: 3,
    },
    {
      id: "crysta-apex-v",
      name: "Crysta Apex V", 
      isRunning: false,
      cycleTime: 22, // 60 minutes cycle time
      elapsedTime: 0,
    }
  ]);

  // Update elapsed time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(machine => {
        if (machine.isRunning && machine.startTime) {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - machine.startTime.getTime()) / (1000 * 60));
          return { ...machine, elapsedTime: elapsed };
        }
        return machine;
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const toggleMachine = (machineId: string) => {
    setMachines(prev => prev.map(machine => {
      if (machine.id === machineId) {
        const newRunningState = !machine.isRunning;
        return {
          ...machine,
          isRunning: newRunningState,
          startTime: newRunningState ? new Date() : undefined,
          elapsedTime: newRunningState ? 0 : machine.elapsedTime
        };
      }
      return machine;
    }));
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRemainingTime = (machine: MachineStatus) => {
    return Math.max(0, machine.cycleTime - machine.elapsedTime);
  };

  const getProgress = (machine: MachineStatus) => {
    return Math.min(100, (machine.elapsedTime / machine.cycleTime) * 100);
  };

  const getStatusColor = (isRunning: boolean) => {
    return isRunning ? "text-green-600 font-medium" : "text-gray-500";
  };

  const getStatusText = (isRunning: boolean) => {
    return isRunning ? "Aktiv" : "Inaktiv";
  };

  return (
    <div className="p-6">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] text-center">Maskin</TableHead>
              <TableHead className="w-[15%] text-center">Status</TableHead>
              <TableHead className="w-[15%] text-center">Förlopp</TableHead>
              <TableHead className="w-[15%] text-center">Återstående tid</TableHead>
              <TableHead className="w-[15%] text-center">Total cykeltid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="text-center font-medium">
                  {machine.name}
                </TableCell>
                <TableCell className="text-center">
                  <span className={getStatusColor(machine.isRunning)}>
                    {getStatusText(machine.isRunning)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                      {formatTime(machine.elapsedTime)} / {formatTime(machine.cycleTime)}
                    </div>
                    <Progress value={getProgress(machine)} className="h-2" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">
                      {formatTime(getRemainingTime(machine))}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">
                    {formatTime(machine.cycleTime)}
                  </span>
                </TableCell>
          
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    

   
    </div>
  );
}
