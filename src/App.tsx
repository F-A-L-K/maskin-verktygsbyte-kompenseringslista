
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { useMachineFromUrl } from "./hooks/useMachineFromUrl";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const AppContent = () => {
  const { availableMachines, activeMachine: defaultMachine, isValidUrl } = useMachineFromUrl();
  const [activeMachine, setActiveMachine] = useState<MachineId>(defaultMachine);
  const [showToolChangeDialog, setShowToolChangeDialog] = useState(false);
  const [showCompensationDialog, setShowCompensationDialog] = useState(false);
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
        showDialog={showToolChangeDialog}
        setShowDialog={setShowToolChangeDialog}
        showCompensationDialog={showCompensationDialog}
        setShowCompensationDialog={setShowCompensationDialog}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
      <main className="p-8">
        {/* Content is now handled by NavigationTabs */}
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
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </NumericInputProvider>
  );
};

export default App;
