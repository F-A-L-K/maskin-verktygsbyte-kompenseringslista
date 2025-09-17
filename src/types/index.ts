
export interface ToolChange {
  id: string;
  machineId: string;
  toolNumber: string;
  reason: "Slitage" | "Verktygsbrott";
  comment: string;
  signature: string;
  timestamp: Date;
  manufacturingOrder: string;
}

export type MachineId = "5701 Fanuc Robodrill" | "5702 Fanuc Robodrill" | "5703 Fanuc Robodrill" | "5704 Fanuc Robodrill" | "5705 Fanuc Robodrill" | "5706 Fanuc Robodrill";

export interface ToolCompensation {
  id: string;
  machineId: string;
  coordinateSystem?: string;
  tool?: string;
  number?: string;
  direction: "X" | "Y" | "Z" | "R" | "L";
  value: string;
  comment: string;
  signature: string;
  timestamp: Date;
  manufacturingOrder: string;
}

