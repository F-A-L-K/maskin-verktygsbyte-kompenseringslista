import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { useMachineFromUrl } from "./hooks/useMachineFromUrl";
import StatusBar from "./components/StatusBar";
import NavigationTabs from "./components/NavigationTabs";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CreateToolChange from "./pages/CreateToolChange";
import History from "./pages/History";
import ToolHistory from "./pages/ToolHistory";
import Settings from "./pages/Settings";
import MI from "./pages/MI";
import Matplan from "./pages/Matplan";
import CMM from "./pages/CMM";

const queryClient = new QueryClient();

const AppContent = () => {
  const { availableMachines, activeMachine: defaultMachine, isValidUrl, isLoading } = useMachineFromUrl();
  const [activeMachine, setActiveMachine] = useState<MachineId>(defaultMachine);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update active machine when URL changes
  useEffect(() => {
    if (defaultMachine !== "0000") {
      setActiveMachine(defaultMachine);
    }
  }, [defaultMachine]);

  // Handle machine change - navigate to skapa-verktygsbyte
  const handleMachineChange = (machine: MachineId) => {
    setActiveMachine(machine);
    
    // Extract the machine pattern from current URL
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentMachinePattern = pathParts.find(part => /^\d{4}(-\d{4})*$/.test(part));
    
    // Get the new machine number
    const newMachineNumber = machine.split(' ')[0];
    
    // If we have multiple machines in URL, preserve all except change the active one
    if (currentMachinePattern && currentMachinePattern.includes('-')) {
      // For now, just navigate to the new machine pattern with all machines
      // This keeps the sidebar intact
      navigate(`/${currentMachinePattern}/skapa-verktygsbyte`);
    } else {
      // Single machine or no pattern found - navigate to the new machine
      navigate(`/${newMachineNumber}/skapa-verktygsbyte`);
    }
  };
  
  // Show loading while checking machines
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If URL is invalid, show 404 page
  if (!isValidUrl) {
    return <NotFound />;
  }

  const hasMultipleMachines = availableMachines.length > 1;
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        {hasMultipleMachines && (
          <AppSidebar
            activeMachine={activeMachine}
            onMachineChange={handleMachineChange}
            availableMachines={availableMachines}
          />
        )}
        <div className="flex-1 flex flex-col">
          <StatusBar activeMachine={activeMachine} />
          <NavigationTabs />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="skapa-verktygsbyte" replace />} />
              <Route path="mi" element={<MI />} />
              <Route path="skapa-verktygsbyte" element={<CreateToolChange activeMachine={activeMachine} />} />
              <Route path="historik" element={<History activeMachine={activeMachine} />} />
              <Route path="verktygshistorik/:toolId" element={<ToolHistory />} />
              <Route path="inställningar" element={<Settings />} />
              <Route path="mätplan" element={<Matplan />} />
              <Route path="cmm" element={<CMM />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <NumericInputProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/:machineId/*" element={<AppContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </NumericInputProvider>
  );
};

export default App;
