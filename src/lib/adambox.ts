/**
 * AdamBox integration utilities
 */

// Machine ID to IP address mapping
const MACHINE_IP_MAPPING: Record<string, string> = {
  "5701 Fanuc Robodrill": "192.168.3.25",
  "5702 Fanuc Robodrill": "192.168.3.26", 
  "5703 Fanuc Robodrill": "192.168.3.27",
  "5704 Fanuc Robodrill": "192.168.3.28",
  "5705 Fanuc Robodrill": "192.168.3.29",
  "5706 Fanuc Robodrill": "192.168.3.30",
  // Add more machines as needed
};

/**
 * Get AdamBox value for a specific machine
 * @param machineId - The machine ID
 * @returns Promise<number | null> - The AdamBox value or null if error
 */
export async function getAdamBoxValue(machineId: string): Promise<number | null> {
  try {
    const ipAddress = MACHINE_IP_MAPPING[machineId];
    
    if (!ipAddress) {
      console.warn(`No IP address configured for machine: ${machineId}`);
      return null;
    }

    // Call the backend API
    const response = await fetch(`http://localhost:8000/api/adambox?ip=${encodeURIComponent(ipAddress)}`);
    
    if (!response.ok) {
      console.error(`Failed to get AdamBox value: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.error(`AdamBox error: ${data.error}`);
      return null;
    }

    return data.value;
  } catch (error) {
    console.error('Error getting AdamBox value:', error);
    return null;
  }
}

/**
 * Get IP address for a machine
 * @param machineId - The machine ID
 * @returns string | null - The IP address or null if not found
 */
export function getMachineIP(machineId: string): string | null {
  return MACHINE_IP_MAPPING[machineId] || null;
}

/**
 * Convert machine number to full machine ID
 * @param machineNumber - The machine number (e.g., "5701")
 * @returns string - The full machine ID (e.g., "5701 Fanuc Robodrill")
 */
export function getFullMachineId(machineNumber: string): string {
  const fullId = `${machineNumber} Fanuc Robodrill`;
  return fullId;
}
