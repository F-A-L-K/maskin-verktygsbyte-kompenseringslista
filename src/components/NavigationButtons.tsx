import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavigationButtons() {
  const location = useLocation();

  const pages = [
    { path: "/verktyg", title: "Verktygsbyte" },
    { path: "/kompensering", title: "Verktygskompensering" },
  ];

  return (
    <div className="flex gap-2 justify-center">
      {pages.map((page) => (
        <Link key={page.path} to={page.path}>
          <Button
            variant={location.pathname === page.path ? "default" : "outline"}
            className={cn(
              "px-6 py-2 font-medium transition-colors",
              location.pathname === page.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {page.title}
          </Button>
        </Link>
      ))}
    </div>
  );
}
