
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MachineId } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export function LoginDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [selectedMachine, setSelectedMachine] = useState<MachineId>("5701");

  const handleLogin = () => {
    login(selectedMachine);
    onOpenChange(false);
    toast({
      title: "Inloggad",
      description: `Inloggad som ${selectedMachine}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Logga in</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-2">
            {["5701", "5702", "5703"].map((machine) => (
              <Button
                key={machine}
                variant={selectedMachine === machine ? "default" : "outline"}
                onClick={() => setSelectedMachine(machine as MachineId)}
              >
                {machine}
              </Button>
            ))}
          </div>
          <Button onClick={handleLogin} className="w-full">
            Logga in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
