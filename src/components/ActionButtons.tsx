import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

interface ActionButtonsProps {
  onNewToolChange: () => void;
  onNewCompensation: () => void;
}

export default function ActionButtons({ onNewToolChange, onNewCompensation }: ActionButtonsProps) {
  const location = useLocation();

  return (
    <div className="flex gap-2">
      {location.pathname === "/verktyg" && (
        <Button 
          onClick={onNewToolChange}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nytt verktygsbyte</span>
        </Button>
      )}
      {location.pathname === "/kompensering" && (
        <Button 
          onClick={onNewCompensation}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Ny kompensering</span>
        </Button>
      )}
    </div>
  );
}
