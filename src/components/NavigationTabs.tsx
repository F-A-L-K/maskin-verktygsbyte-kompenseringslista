import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavigationTabs() {
  const location = useLocation();

  const tabs = [
    { path: "/skapa-verktygsbyte", label: "Skapa Verktygsbyte" },
    { path: "/historik", label: "Historisk Verktygsbyte" },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={cn(
                "px-6 py-3 font-medium transition-colors relative",
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
