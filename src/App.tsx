
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ToolChangePage from "./pages/ToolChange";
import ToolCompensationPage from "./pages/ToolCompensation";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";
import { FixedNumericKeypad } from "./components/FixedNumericKeypad";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthHeader } from "./components/AuthHeader";

const queryClient = new QueryClient();

const App = () => {
  const [activeMachine, setActiveMachine] = useState<MachineId>("5701");
  
  return (
    <AuthProvider>
      <NumericInputProvider>
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
                <AuthHeader />
                <div className="flex-1 ml-64 p-8">
                  <Routes>
                    <Route path="/verktyg" element={<ToolChangePage activeMachine={activeMachine} />} />
                    <Route path="/kompensering" element={<ToolCompensationPage activeMachine={activeMachine} />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <FixedNumericKeypad />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </NumericInputProvider>
    </AuthProvider>
  );
};

export default App;
