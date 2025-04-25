
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';

export function AuthHeader() {
  const { user, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-50">
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Inloggad som {user}
          </span>
          <Button variant="ghost" onClick={logout}>
            Logga ut
          </Button>
        </div>
      ) : (
        <>
          <Button variant="ghost" onClick={() => setDialogOpen(true)}>
            Logga in
          </Button>
          <LoginDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
      )}
    </div>
  );
}
