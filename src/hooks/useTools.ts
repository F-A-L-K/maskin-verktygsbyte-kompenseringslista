import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '@/types';

export function useTools() {
  return useQuery({
    queryKey: ['tools'],
    queryFn: async (): Promise<Tool[]> => {
      const { data, error } = await supabase
        .from('verktygshanteringssystem_verktyg')
        .select('*')
        .order('benämning');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
  });
}
