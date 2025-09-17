import { useState } from "react";
import { MachineId } from "@/types";
import ToolChangePage from "./ToolChange";
import ToolCompensationPage from "./ToolCompensation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomeProps {
  activeMachine: MachineId;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  showCompensationDialog: boolean;
  setShowCompensationDialog: (show: boolean) => void;
}

export default function Home({ 
  activeMachine, 
  showDialog, 
  setShowDialog, 
  showCompensationDialog, 
  setShowCompensationDialog 
}: HomeProps) {
  return (
    <Tabs defaultValue="verktyg" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="verktyg">Verktygsbyte</TabsTrigger>
        <TabsTrigger value="kompensering">Kompensering</TabsTrigger>
      </TabsList>
      
      <TabsContent value="verktyg" className="mt-6">
        <ToolChangePage 
          activeMachine={activeMachine} 
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </TabsContent>
      
      <TabsContent value="kompensering" className="mt-6">
        <ToolCompensationPage 
          activeMachine={activeMachine} 
          showDialog={showCompensationDialog}
          setShowDialog={setShowCompensationDialog}
        />
      </TabsContent>
    </Tabs>
  );
}
