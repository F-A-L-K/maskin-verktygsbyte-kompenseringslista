import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavigationTabs() {
  const tabs = [
    { path: "skapa-verktygsbyte", label: "Skapa Verktygsbyte" },
    { path: "historik", label: "Historisk Verktygsbyte" },
    { path: "mätplan", label: "Mätplan" },
    // { path: "cmm", label: "CMM" },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="flex">
        {tabs.map((tab) => {
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => cn(
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
