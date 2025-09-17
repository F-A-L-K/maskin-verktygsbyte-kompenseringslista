import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MachineId } from "@/types";
import ToolChangePage from "@/pages/ToolChange";
import ToolCompensationPage from "@/pages/ToolCompensation";

interface NavigationTabsProps {
  activeMachine: MachineId;
  onTabChange: (value: string) => void;
}

export default function NavigationTabs({ 
  activeMachine, 
  onTabChange
}: NavigationTabsProps) {
  return (
    <Tabs defaultValue="verktyg" className="w-full" onValueChange={onTabChange}>
      <div className="flex justify-center">
        <TabsList className="grid w-1/4 grid-cols-2">
          <TabsTrigger value="verktyg">Verktygsbyte</TabsTrigger>
          <TabsTrigger value="kompensering">Kompensering</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="verktyg" className="mt-6">
        <ToolChangePage 
          activeMachine={activeMachine} 
        />
      </TabsContent>
      
      <TabsContent value="kompensering" className="mt-6">
        <ToolCompensationPage 
          activeMachine={activeMachine} 
        />
      </TabsContent>
    </Tabs>
  );
}
