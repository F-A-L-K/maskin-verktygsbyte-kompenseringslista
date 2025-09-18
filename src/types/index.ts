
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

export type MachineId = string;

export interface Machine {
  id: string;
  maskiner_nummer: string;
  maskin_namn: string;
  ip_adambox: string | null;
  created_at: string;
  updated_at: string;
}

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

