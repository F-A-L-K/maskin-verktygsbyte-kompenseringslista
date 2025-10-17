import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavigationTabs() {
  const location = useLocation();

  const tabs = [
    { path: "mi", label: "MI" },
    { path: "skapa-verktygsbyte", label: "Skapa Verktygsbyte" },
    { path: "historik", label: "Historisk Verktygsbyte" },
    { path: "mätplan", label: "Mätplan" },
    { path: "cmm", label: "CMM" },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = location.pathname.endsWith(tab.path);
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={cn(
                "px-6 py-3 font-medium transition-colors relative",
                isActive
                  ? "text-[#507E95] border-b-[2px] border-[#507E95]"
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
