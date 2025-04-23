
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import AdminUserList from "@/components/AdminUserList";
import AdminCreateUserForm from "@/components/AdminCreateUserForm";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [machines, setMachines] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check admin privileges on load
  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // user_roles table, check for admin
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      if (data?.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  // Fetch all machines and users (usernames, ids, their assigned machines)
  async function refreshData() {
    setLoading(true);
    setError(null);
    try {
      // Fetch known machines: name from verktygsbyte, verktygskompensering, user_machines
      const machinesSet = new Set<string>();
      // Fetch all distinct machines from main tables for admin to assign
      let { data: tbMachines } = await supabase.from("verktygsbyte").select("maskin");
      tbMachines?.forEach((x) => machinesSet.add(x.maskin));
      let { data: tcMachines } = await supabase.from("verktygskompensering").select("maskin");
      tcMachines?.forEach((x) => machinesSet.add(x.maskin));
      let { data: um } = await supabase.from("user_machines").select("machine");
      um?.forEach((x) => machinesSet.add(x.machine));
      setMachines([...machinesSet].sort());

      // Fetch users
      const { data: profiles, error: uErr } = await supabase.from("profiles").select("id,username");
      if (uErr) throw new Error(uErr.message);

      // For each user, fetch assigned machines
      const { data: assignments } = await supabase.from("user_machines").select("user_id,machine");
      // index by user_id
      const userMap = profiles.map((p) => ({
        ...p,
        machines: assignments?.filter((a) => a.user_id === p.id).map((a) => a.machine) || []
      }));

      setUsers(userMap);
    } catch (err: any) {
      setError("Kunde inte hämta användare eller maskiner: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) refreshData();
  }, [isAdmin]);

  if (!isAdmin && !loading) {
    return (
      <div className="text-xl text-red-700">Du har inte behörighet att se denna sida.</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Adminpanel: Användare & Maskiner</h1>
      <p className="text-muted-foreground max-w-lg">
        Lägg till nya användare och koppla dem till maskiner. Bara användare med admin-behörighet ser denna sida.
      </p>
      {error && <div className="text-destructive">{error}</div>}
      {loading ? <div>Laddar...</div> : <>
        <AdminCreateUserForm onUserCreated={refreshData} />
        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">Användare & maskintillgång</h2>
          <AdminUserList
            users={users}
            machines={machines}
            onUpdate={refreshData}
          />
        </div>
      </>}
    </div>
  );
}
