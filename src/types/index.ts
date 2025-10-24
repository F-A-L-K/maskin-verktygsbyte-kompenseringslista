
export interface ToolChange {
  id: string;
  machineId: string;
  toolNumber: string;
  reason: "Slitage" | "Verktygsbrott" | "Övrigt";
  comment: string;
  signature: string;
  timestamp: Date;
  manufacturingOrder: string;
  number_of_parts_ADAM?: number;
  amount_since_last_change?: number;
}

export type MachineId = string;

export interface Machine {
  id: string;
  maskiner_nummer: string;
  maskin_namn: string;
  ip_adambox: string | null;
  tillgång_verktygsbyte: boolean | null;
  tillgång_matrixkod: boolean | null;
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

export interface Tool {
  id: string;
  plats: string | null;
  benämning: string;
  artikelnummer: string | null;
  maxgräns: number | null;
  maxgräns_varning: number | null;
  created_at: string;
  updated_at: string;
}

