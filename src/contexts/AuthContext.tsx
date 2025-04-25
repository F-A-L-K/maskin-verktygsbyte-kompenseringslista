
import React, { createContext, useContext, useState } from 'react';
import { MachineId } from '@/types';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  user: MachineId | null;
  login: (username: MachineId, password: string) => Promise<boolean>;
  logout: () => void;
  getVisibleMachines: () => MachineId[];
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MachineId | null>(null);

  // Define which machines each user can see
  const machineVisibility: Record<MachineId, MachineId[]> = {
    "5701": ["5701", "5704"],
    "5702": ["5702", "5705"],
    "5703": ["5703", "5706"]
  };

  const login = async (username: MachineId, password: string): Promise<boolean> => {
    // Check if username is valid and password is empty
    if (["5701", "5702", "5703"].includes(username) && password === "") {
      setUser(username);
      
      // Log the successful login attempt
      await supabase
        .from('login_logs')
        .insert([
          { machine_id: username, success: true }
        ]);
      
      return true;
    } else {
      // Log the failed login attempt
      if (["5701", "5702", "5703"].includes(username)) {
        await supabase
          .from('login_logs')
          .insert([
            { machine_id: username, success: false }
          ]);
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const getVisibleMachines = (): MachineId[] => {
    if (!user) return ["5701", "5702", "5703", "5704", "5705", "5706"];
    return machineVisibility[user] || [];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getVisibleMachines }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
