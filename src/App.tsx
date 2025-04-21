import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ToolChangePage from "./pages/ToolChange";
import ToolCompensationPage from "./pages/ToolCompensation";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [activeMachine, setActiveMachine] = useState<MachineId>("5701");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen">
            <Sidebar 
              activeMachine={activeMachine} 
              setActiveMachine={setActiveMachine} 
            />
            
            <div className="flex-1 ml-64 p-8">
              <Routes>
                <Route path="/" element={<ToolChangePage activeMachine={activeMachine} />} />
                <Route path="/compensation" element={<ToolCompensationPage activeMachine={activeMachine} />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
