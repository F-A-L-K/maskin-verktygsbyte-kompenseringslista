
import { cn } from "@/lib/utils";
import { MachineId } from "@/types";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  activeMachine: MachineId;
  setActiveMachine: (machine: MachineId) => void;
}

export default function Sidebar({ activeMachine, setActiveMachine }: SidebarProps) {
  const location = useLocation();
  const machines: MachineId[] = ["5701", "5702", "5703", "5704"];

  const pages = [
    { path: "/verktyg", title: "Verktygsbyte" },
    { path: "/kompensering", title: "Verktygskompensering" },
    { path: "/admin", title: "Admin" },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Verktygshantering</h1>
      </div>
      
      <div className="p-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2 opacity-70">MASKINER</h2>
        <div className="space-y-1 mb-6">
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

        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2 opacity-70">SIDOR</h2>
        <div className="space-y-1">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className={cn(
                "block w-full text-left px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
                location.pathname === page.path
                  ? "bg-machine-active text-machine-foreground"
                  : "hover:bg-machine-hover"
              )}
            >
              {page.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
