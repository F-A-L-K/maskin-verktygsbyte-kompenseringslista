
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { z } from "zod";

// Simple user creation form (for admin ONLY)
export default function AdminCreateUserForm({ onUserCreated }: { onUserCreated: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (username.length < 3 || password.length < 6) {
      setError("Användarnamn måste vara minst 3 tecken och lösenord minst 6 tecken.");
      return;
    }

    setCreating(true);

    // 1. Sign up user in Supabase auth. Use username as email trick: username@fake.local
    const fakeEmail = `${username}@fake.local`;
    const { data, error: signUpError } = await supabase.auth.admin.createUser({
      email: fakeEmail,
      password,
      email_confirm: true,
    });
    if (signUpError) {
      setError("Kunde inte skapa användare: " + signUpError.message);
      setCreating(false);
      return;
    }
    const userId = data?.user?.id;
    if (!userId) {
      setError("Kunde inte hämta användar-ID.");
      setCreating(false);
      return;
    }
    // 2. Add to profiles with username
    const { error: pError } = await supabase.from("profiles").insert({ id: userId, username });
    if (pError) {
      setError("Kunde inte skapa profil: " + pError.message);
      setCreating(false);
      return;
    }
    setSuccess("Användare skapad!");
    setUsername("");
    setPassword("");
    setCreating(false);
    onUserCreated();
  }

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-1 max-w-sm border p-3 rounded bg-muted/50 mb-2">
      <div className="text-base font-semibold mb-1">Ny användare</div>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Användarnamn" required minLength={3} />
      <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord" required minLength={6} type="password" />
      <Button type="submit" disabled={creating}>{creating ? "Skapar..." : "Skapa användare"}</Button>
      {error && <div className="text-destructive">{error}</div>}
      {success && <div className="text-green-700">{success}</div>}
      <div className="text-xs text-muted-foreground mt-1">Användarnamnet måste vara unikt.</div>
    </form>
  );
}
