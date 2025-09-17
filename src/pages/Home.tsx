import { useState } from "react";
import { MachineId } from "@/types";
import ToolChangePage from "./ToolChange";
import ToolCompensationPage from "./ToolCompensation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomeProps {
  activeMachine: MachineId;
}

export default function Home({ 
  activeMachine
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
