
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username) {
      setError("Ange ett maskin-ID");
      return;
    }

    if (!["5701", "5702", "5703"].includes(username)) {
      setError("Ogiltigt maskin-ID. Använd 5701, 5702 eller 5703.");
      return;
    }

    const success = await login(username as MachineId, password);
    
    if (success) {
      onOpenChange(false);
      toast({
        title: "Inloggad",
        description: `Inloggad som ${username}`,
      });
    } else {
      setError("Felaktigt lösenord eller användar-ID");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Logga in</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Maskin-ID</Label>
            <Input 
              id="username"
              placeholder="5701, 5702, 5703" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button onClick={handleLogin} className="w-full">
            Logga in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
