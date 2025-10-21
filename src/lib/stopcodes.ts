/**
 * Stop codes configuration
 * Maps stop code numbers to their descriptions
 */

export interface StopCodeInfo {
  code: string;
  name: string;
  description?: string;
}

export const STOP_CODES: Record<string, StopCodeInfo> = {
  "300": {
    code: "300",
    name: "Order saknas",
    description: "No active manufacturing order"
  },

};

export function getStopCodeInfo(code: string | null | undefined): StopCodeInfo | null {
  if (!code) return null;
  return STOP_CODES[code] || null;
}

export function getStopCodeDisplayName(code: string | null | undefined): string {
  // If empty or null, machine is running
  if (!code || code.trim() === "") {
    return "Körs"; // "Running" in Swedish
  }
  
  const info = getStopCodeInfo(code);
  if (info) {
    return `${info.code} ${info.name}`;
  }
  return code || "";
}

/**
 * Determines the status bar color based on stop code and machine status
 */
export function getStatusBarColor(stopCode: string | null | undefined, status: string): string {
  // If machine is running (no stop code or empty), show green
  if (!stopCode || stopCode.trim() === "" || status.toLowerCase().includes("running")) {
    return "bg-green-600"; // Green for running
  }
  
  // If stop code is 300, show blue
  if (stopCode === "300") {
    return "bg-blue-600"; // Blue for "order saknas"
  }
  
  // All other stop codes show red
  return "bg-red-600"; // Red for any other stop
}
