
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ToolChangePage from "./pages/ToolChange";
import ToolCompensationPage from "./pages/ToolCompensation";
import NotFound from "./pages/NotFound";
import { MachineId } from "./types";
import { FixedNumericKeypad } from "./components/FixedNumericKeypad";
import { NumericInputProvider } from "./hooks/useNumericInput";
import AdminPage from "./pages/Admin";
import AuthPage from "./pages/AuthPage";
import { supabase } from "@/integrations/supabase/client";

// Helper component to gate /admin route
function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore && session?.user) setIsAuthenticated(true);
      setLoading(false);
      if (!ignore && !session?.user) {
        navigate("/auth", { state: { from: location }, replace: true });
      }
    });
    // Listen for auth state changes and update accordingly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth", { state: { from: location }, replace: true });
      }
    });
    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, [navigate, location.pathname]);

  if (loading) return <div className="p-6 text-center text-muted-foreground">Laddar...</div>;
  return isAuthenticated ? children : null;
}

const queryClient = new QueryClient();

const App = () => {
  const [activeMachine, setActiveMachine] = useState<MachineId>("5701");
  
  return (
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
              
              <div className="flex-1 ml-64 p-8">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/verktyg" element={<ToolChangePage activeMachine={activeMachine} />} />
                  <Route path="/kompensering" element={<ToolCompensationPage activeMachine={activeMachine} />} />
                  {/* Admin page is protected */}
                  <Route path="/admin" element={
                    <RequireAuth>
                      <AdminPage />
                    </RequireAuth>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <FixedNumericKeypad />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </NumericInputProvider>
  );
};

export default App;
