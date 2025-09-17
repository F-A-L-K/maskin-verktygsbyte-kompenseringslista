
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import NewToolChange from "./pages/NewToolChange";
import NewCompensation from "./pages/NewCompensation";
import Home from "./pages/Home";
import { MachineId } from "./types";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { useMachineFromUrl } from "./hooks/useMachineFromUrl";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const AppContent = () => {
  const { availableMachines, activeMachine: defaultMachine, isValidUrl } = useMachineFromUrl();
  const [activeMachine, setActiveMachine] = useState<MachineId>(defaultMachine);
  const [currentTab, setCurrentTab] = useState("verktyg");
  
  // If URL is invalid, show 404 page
  if (!isValidUrl) {
    return <NotFound />;
  }
  
  return (
    <div className="min-h-screen">
      <Navbar
        activeMachine={activeMachine}
        onMachineChange={setActiveMachine}
        availableMachines={availableMachines}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
      <main>
        <Home activeMachine={activeMachine} currentTab={currentTab} />
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
              <Route path="/new-compensation" element={<NewCompensation />} />
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
