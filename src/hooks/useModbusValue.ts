
import { useState, useEffect } from 'react';
import ModbusRTU from 'modbus-serial';

export function useModbusValue() {
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = new ModbusRTU();
    let mounted = true;

    const readModbusValue = async () => {
      try {
        if (!client.isOpen) {
          await client.connectTCP('192.168.2.101', { port: 502 });
          // Set timeout for Modbus requests
          client.setTimeout(1000);
        }

        // Read one register from address 1 (second place in holding register)
        const data = await client.readHoldingRegisters(1, 1);
        if (mounted && data.data && data.data[0] !== undefined) {
          setValue(data.data[0]);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to read Modbus value');
          setValue(null);
        }
      }
    };

    // Initial read
    readModbusValue();

    // Set up polling every 1 second
    const interval = setInterval(readModbusValue, 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
      // Close connection when component unmounts
      if (client.isOpen) {
        client.close();
      }
    };
  }, []);

  return { value, error };
}
