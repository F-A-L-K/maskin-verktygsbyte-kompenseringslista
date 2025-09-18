import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Machine } from '@/types';

export function useMachines() {
  return useQuery({
    queryKey: ['machines'],
    queryFn: async (): Promise<Machine[]> => {
      const { data, error } = await supabase
        .from('verktygshanteringssystem_maskiner')
        .select('*')
        .order('maskiner_nummer');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
  });
}

export function useMachineByNumber(machineNumber: string) {
  return useQuery({
    queryKey: ['machine', machineNumber],
    queryFn: async (): Promise<Machine | null> => {
      const { data, error } = await supabase
        .from('verktygshanteringssystem_maskiner')
        .select('*')
        .eq('maskiner_nummer', machineNumber)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: !!machineNumber && machineNumber.length === 4,
  });
}