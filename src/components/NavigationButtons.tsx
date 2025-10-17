import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function NavigationButtons() {
  const location = useLocation();

  const pages = [
    { path: "/verktyg", title: "Verktygsbyte" },
    { path: "/kompensering", title: "Kompensering" },
    { path: "/mätplan", title: "Mätplan" },
    ];

  return (
    <div className="flex justify-center">
      <div className="flex bg-white border border-gray-300 rounded-full p-1 shadow-sm">
        {pages.map((page) => {
          const isActive = location.pathname === page.path;
          return (
            <Link key={page.path} to={page.path}>
              <div
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-blue-100 text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {isActive && <Check className="h-4 w-4 text-gray-600" />}
                <span>{page.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
