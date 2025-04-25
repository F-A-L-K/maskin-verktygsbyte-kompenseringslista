
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';

export function AuthHeader() {
  const { user, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {user ? (
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-md">
          <span className="text-sm text-muted-foreground">
            Inloggad som {user}
          </span>
          <Button variant="ghost" onClick={logout} size="sm">
            Logga ut
          </Button>
        </div>
      ) : (
        <>
          <Button variant="default" onClick={() => setDialogOpen(true)}>
            Logga in
          </Button>
          <LoginDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
      )}
    </div>
  );
}
