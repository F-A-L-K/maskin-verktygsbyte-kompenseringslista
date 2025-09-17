
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { useMachineFromUrl } from "./hooks/useMachineFromUrl";
import MachineSelector from "./components/MachineSelector";
import ActionButtons from "./components/ActionButtons";

const queryClient = new QueryClient();

const AppContent = () => {
  const { availableMachines, activeMachine: defaultMachine, isValidUrl } = useMachineFromUrl();
  const [activeMachine, setActiveMachine] = useState<MachineId>(defaultMachine);
  const [showToolChangeDialog, setShowToolChangeDialog] = useState(false);
  const [showCompensationDialog, setShowCompensationDialog] = useState(false);
  
  // If URL is invalid, show 404 page
  if (!isValidUrl) {
    return <NotFound />;
  }
  
  return (
    <div className="min-h-screen">
      <header className="bg-background border-b ">
        <div className="flex items-center justify-between px-6 py-4">
          <MachineSelector 
            activeMachine={activeMachine} 
            onMachineChange={setActiveMachine}
            availableMachines={availableMachines}
          />
          <div className="flex items-center gap-4">
            <ActionButtons 
              onNewToolChange={() => setShowToolChangeDialog(true)}
              onNewCompensation={() => setShowCompensationDialog(true)}
            />
          </div>
        </div>
      </header>
      <main className="p-8">
        <Home 
          activeMachine={activeMachine} 
          showDialog={showToolChangeDialog}
          setShowDialog={setShowToolChangeDialog}
          showCompensationDialog={showCompensationDialog}
          setShowCompensationDialog={setShowCompensationDialog}
        />
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
