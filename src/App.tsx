
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import NewToolChange from "./pages/NewToolChange";
import Home from "./pages/Home";
import { MachineId } from "./types";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { useMachineFromUrl } from "./hooks/useMachineFromUrl";
import Navbar from "./components/Navbar";
import MachineSelector from "./components/MachineSelector";

const queryClient = new QueryClient();

const AppContent = () => {
  const { availableMachines, activeMachine: defaultMachine, isValidUrl, isLoading } = useMachineFromUrl();
  const [activeMachine, setActiveMachine] = useState<MachineId>(defaultMachine);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
  
  return (
    <div className="min-h-screen">
      <Navbar
        activeMachine={activeMachine}
        availableMachines={availableMachines}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <MachineSelector
        activeMachine={activeMachine}
        onMachineChange={setActiveMachine}
        availableMachines={availableMachines}
        isOpen={sidebarOpen}
      />
      <main>
        <Home activeMachine={activeMachine} sidebarOpen={sidebarOpen} />
      </main>
    </div>
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
              <Route path="/new-tool-change" element={<NewToolChange />} />
              <Route path="/:machineId" element={<AppContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </NumericInputProvider>
  );
};

export default App;
