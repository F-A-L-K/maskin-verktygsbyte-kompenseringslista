
import { useState } from 'react';
import { MachineId } from '@/types';

export function useLastManufacturingOrder() {
  const [lastOrders, setLastOrders] = useState<Record<MachineId, string>>({
    "5401 Fanuc Robodrill": "",
    "5701 Fanuc Robodrill": "",
    "5702 Fanuc Robodrill": "",
    "5703 Fanuc Robodrill": "",
    "5704 Fanuc Robodrill": "",
    "5705 Fanuc Robodrill": "",
    "5706 Fanuc Robodrill": "",
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
