import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import MI from "./pages/MI";

const queryClient = new QueryClient();

const AppContent = () => {
  const { availableMachines, activeMachine: defaultMachine, isValidUrl, isLoading } = useMachineFromUrl();
  const [activeMachine, setActiveMachine] = useState<MachineId>(defaultMachine);
  
  // Update active machine when URL changes
  useEffect(() => {
    if (defaultMachine !== "0000") {
      setActiveMachine(defaultMachine);
    }
  }, [defaultMachine]);
  
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
            onMachineChange={setActiveMachine}
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
