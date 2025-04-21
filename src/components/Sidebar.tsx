
import { Link, useLocation } from "react-router-dom";
import { MachineId } from "@/types";
import { cn } from "@/lib/utils";
import { Settings, Wrench, Ruler } from "lucide-react";

interface SidebarProps {
  activeMachine: MachineId;
  setActiveMachine: (machine: MachineId) => void;
}

export default function Sidebar({ activeMachine, setActiveMachine }: SidebarProps) {
  const location = useLocation();
  const machines: MachineId[] = ["5701", "5702", "5703", "5704"];

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Verktygshantering</h1>
      </div>
      
      <div className="p-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2 opacity-70">MASKINER</h2>
        <div className="space-y-1">
          {machines.map((machine) => (
            <button
              key={machine}
              onClick={() => setActiveMachine(machine)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
                activeMachine === machine 
                  ? "bg-machine-active text-machine-foreground" 
                  : "hover:bg-machine-hover"
              )}
            >
              {machine}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border mt-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2 opacity-70">NAVIGATION</h2>
        <nav className="space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
              location.pathname === "/" 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "hover:bg-sidebar-accent/50"
            )}
          >
            <Wrench size={18} />
            <span>Verktygsbyte</span>
          </Link>
          <Link
            to="/compensation"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
              location.pathname === "/compensation" 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "hover:bg-sidebar-accent/50"
            )}
          >
            <Ruler size={18} />
            <span>Verktygskompensering</span>
          </Link>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-sidebar-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors hover:bg-sidebar-accent/50"
        >
          <Settings size={18} />
          <span>Inställningar</span>
        </Link>
      </div>
    </div>
  );
}
