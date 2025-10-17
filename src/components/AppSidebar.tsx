import { MonitorPlay } from "lucide-react";
import { MachineId } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeMachine: MachineId;
  onMachineChange: (machine: MachineId) => void;
  availableMachines: MachineId[];
}

export function AppSidebar({ activeMachine, onMachineChange, availableMachines }: AppSidebarProps) {
  return (
    <Sidebar collapsible="none">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel>Maskiner</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableMachines.map((machine) => {
                const isActive = activeMachine === machine;
                const machineNumber = machine.split(' ')[0];
                const machineName = machine.split(' ').slice(1).join(' ');

                return (
                  <SidebarMenuItem key={machine}>
                    <SidebarMenuButton
                      onClick={() => onMachineChange(machine)}
                      isActive={isActive}
                      className="flex items-center gap-2"
                    >
                      <MonitorPlay className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium">{machineNumber} {machineName}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
