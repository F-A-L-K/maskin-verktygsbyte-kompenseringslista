
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { LogIn, User } from "lucide-react";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Redirect already authenticated user to /admin page
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore && session?.user) {
        navigate("/admin", { replace: true });
      }
    });
    return () => { ignore = true; };
  }, [navigate]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      // Let onAuthStateChange (elsewhere in the app) redirect, but redirect here as fallback
      navigate("/admin");
    } catch (err: any) {
      setError(
        err?.message === "Email not confirmed"
          ? "Bekräfta din e-postadress innan du loggar in."
          : err?.message ?? "Något gick fel, försök igen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border p-8 shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <User className="text-primary" /> Admin-inloggning
        </h1>
        <form className="space-y-4 mt-6" onSubmit={handleAuth}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-postadress
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="anvandare@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Lösenord
            </label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Minst 6 tecken"
            />
          </div>
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "Vänta..." : mode === "login" ? <>Logga in <LogIn className="ml-2" /></> : "Skapa konto"}
          </Button>
        </form>
        <div className="text-center mt-4 text-sm">
          {mode === "login" ? (
            <>
              Inget konto?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => { setMode("signup"); setError(null); }}
                type="button"
                disabled={loading}
              >
                Skapa konto
              </button>
            </>
          ) : (
            <>
              Har du redan ett konto?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => { setMode("login"); setError(null); }}
                type="button"
                disabled={loading}
              >
                Logga in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
