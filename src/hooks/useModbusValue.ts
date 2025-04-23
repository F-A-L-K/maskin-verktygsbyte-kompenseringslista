
import { useState, useEffect } from 'react';

// Browser-friendly implementation to simulate Modbus communication
export function useModbusValue() {
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    let simulatedValue = Math.floor(Math.random() * 100); // Start with random value
    
    const simulateModbusReading = () => {
      try {
        // Simulate successful reading with small random changes to look realistic
        if (Math.random() > 0.1) { // 10% chance of failure to simulate network issues
          // Small fluctuation in the value to simulate real readings
          simulatedValue += Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
          if (mounted) {
            setValue(simulatedValue);
            setError(null);
          }
        } else {
          // Occasionally simulate a connection error
          if (mounted) {
            setError('Failed to read Modbus value');
            // Don't update the value when there's an error
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to read Modbus value');
          setValue(null);
        }
      }
    };

    // Simulate initial read
    simulateModbusReading();
    
    // Set up polling every 1 second
    const interval = setInterval(simulateModbusReading, 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { value, error };
}

// For future implementation with real devices, we would add:
// 
// export async function connectToModbusDevice(ipAddress: string, port: number) {
//   // Implementation would go here once we have a proper browser-compatible Modbus library
// }
