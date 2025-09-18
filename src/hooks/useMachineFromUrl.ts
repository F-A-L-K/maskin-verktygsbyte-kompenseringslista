import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MachineId } from '@/types';
import { useMachines } from './useMachines';

export function useMachineFromUrl() {
  const location = useLocation();
  const { data: machines = [], isLoading } = useMachines();
  
  const { availableMachines, activeMachine, isValidUrl } = useMemo(() => {
    if (isLoading) {
      return {
        availableMachines: [],
        activeMachine: "0000" as MachineId,
        isValidUrl: false
      };
    }

    // Parse machine IDs from URL path
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    // Look for machine pattern like /5701-5702-5703 (exactly 4 digits)
    const machinePattern = pathParts.find(part => /^\d{4}(-\d{4})*$/.test(part));
    
    if (machinePattern) {
      // Extract machine numbers from pattern like "5701-5702-5703"
      const machineNumbers = machinePattern.split('-');
      
      // Filter to only include machines that exist in the database
      const validMachines = machineNumbers
        .filter(num => machines.some(machine => machine.maskiner_nummer === num))
        .map(num => {
          const machine = machines.find(m => m.maskiner_nummer === num);
          return `${num} ${machine?.maskin_namn || 'Unknown'}`;
        });
      
      if (validMachines.length > 0) {
        return {
          availableMachines: validMachines as MachineId[],
          activeMachine: validMachines[0] as MachineId,
          isValidUrl: true
        };
      }
    }
    
    // Invalid URL - return empty arrays to trigger 404
    return {
      availableMachines: [],
      activeMachine: "0000" as MachineId,
      isValidUrl: false
    };
  }, [location.pathname, machines, isLoading]);
  
  return { availableMachines, activeMachine, isValidUrl, isLoading };
}
