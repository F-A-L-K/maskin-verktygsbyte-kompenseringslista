import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MachineId } from '@/types';

// No predefined machines - accept any 4-digit number

export function useMachineFromUrl() {
  const location = useLocation();
  
  const { availableMachines, activeMachine, isValidUrl } = useMemo(() => {
    // Parse machine IDs from URL path
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    // Look for machine pattern like /5701-5702-5703 (exactly 4 digits)
    const machinePattern = pathParts.find(part => /^\d{4}(-\d{4})*$/.test(part));
    
    if (machinePattern) {
      // Extract machine numbers from pattern like "5701-5702-5703"
      const machineNumbers = machinePattern.split('-');
      
      // Convert to full machine IDs (accept any 4-digit number)
      const machines = machineNumbers
        .map(num => `${num} Fanuc Robodrill` as MachineId);
      
      if (machines.length > 0) {
        return {
          availableMachines: machines,
          activeMachine: machines[0] as MachineId,
          isValidUrl: true
        };
      }
    }
    
    // Invalid URL - return empty arrays to trigger 404
    return {
      availableMachines: [],
      activeMachine: "0000 Fanuc Robodrill" as MachineId,
      isValidUrl: false
    };
  }, [location.pathname]);
  
  return { availableMachines, activeMachine, isValidUrl };
}
