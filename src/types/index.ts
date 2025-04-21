
export interface ToolChange {
  id: string;
  machineId: string;
  toolNumber: string;
  reason: "Slitage" | "Verktygsbrott";
  comment: string;
  signature: string;
  timestamp: Date;
}

export type MachineId = "5701" | "5702" | "5703" | "5704";
