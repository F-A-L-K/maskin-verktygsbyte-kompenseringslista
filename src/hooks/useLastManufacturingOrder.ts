
import { useState } from 'react';
import { MachineId } from '@/types';

export function useLastManufacturingOrder() {
  const [lastOrders, setLastOrders] = useState<Record<MachineId, string>>({
    "5701": "",
    "5702": "",
    "5703": "",
    "5704": "",
    "5705": "",
    "5706": "",
  });

  const setLastOrder = (machineId: MachineId, order: string) => {
    setLastOrders(prev => ({
      ...prev,
      [machineId]: order
    }));
  };

  const getLastOrder = (machineId: MachineId) => {
    return lastOrders[machineId] || "";
  };

  return {
    setLastOrder,
    getLastOrder
  };
}
