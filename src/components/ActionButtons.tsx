import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ActionButtonsProps {
  onNewToolChange: () => void;
  onNewCompensation: () => void;
  currentTab: string;
}

export default function ActionButtons({ onNewToolChange, onNewCompensation, currentTab }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {currentTab === "verktyg" && (
        <Button 
          onClick={onNewToolChange}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nytt verktygsbyte</span>
        </Button>
      )}
      {currentTab === "kompensering" && (
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
