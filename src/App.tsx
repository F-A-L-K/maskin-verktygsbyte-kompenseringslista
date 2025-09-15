
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolChangePage from "./pages/ToolChange";
import ToolCompensationPage from "./pages/ToolCompensation";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";
import { NumericInputProvider } from "./hooks/useNumericInput";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthHeader } from "./components/AuthHeader";
import MachineSelector from "./components/MachineSelector";
import NavigationButtons from "./components/NavigationButtons";
import ActionButtons from "./components/ActionButtons";

const queryClient = new QueryClient();

const App = () => {
  const [activeMachine, setActiveMachine] = useState<MachineId>("5701");
  const [showToolChangeDialog, setShowToolChangeDialog] = useState(false);
  const [showCompensationDialog, setShowCompensationDialog] = useState(false);
  
  return (
    <AuthProvider>
      <NumericInputProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen">
                <header className="border-b bg-background">
                  <div className="flex items-center justify-between px-6 py-4">
                    <MachineSelector 
                      activeMachine={activeMachine} 
                      onMachineChange={setActiveMachine} 
                    />
                    <NavigationButtons />
                    <div className="flex items-center gap-4">
                      <ActionButtons 
                        onNewToolChange={() => setShowToolChangeDialog(true)}
                        onNewCompensation={() => setShowCompensationDialog(true)}
                      />
                      <AuthHeader />
                    </div>
                  </div>
                </header>
                <main className="p-8">
                  <Routes>
                    <Route path="/verktyg" element={
                      <ToolChangePage 
                        activeMachine={activeMachine} 
                        showDialog={showToolChangeDialog}
                        setShowDialog={setShowToolChangeDialog}
                      />
                    } />
                    <Route path="/kompensering" element={
                      <ToolCompensationPage 
                        activeMachine={activeMachine} 
                        showDialog={showCompensationDialog}
                        setShowDialog={setShowCompensationDialog}
                      />
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </NumericInputProvider>
    </AuthProvider>
  );
};

export default App;
