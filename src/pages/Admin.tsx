
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";

export default function AdminPage() {
  // Machines State
  const [machines, setMachines] = useState<string[]>([]);
  const [newMachine, setNewMachine] = useState("");
  // Signatures State
  const [signatures, setSignatures] = useState<string[]>([]);
  const [newSignature, setNewSignature] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true);
    fetchMachines();
    fetchSignatures();
  }, []);

  async function fetchMachines() {
    const { data, error } = await supabase.from("machines").select("name");
    if (error) { setError("Kunde inte hämta maskiner."); return; }
    setMachines(data?.map((d) => d.name) ?? []);
    setLoading(false);
  }

  async function fetchSignatures() {
    const { data, error } = await supabase.from("signatures").select("name");
    if (error) { setError("Kunde inte hämta signaturer."); return; }
    setSignatures(data?.map((d) => d.name) ?? []);
    setLoading(false);
  }

  async function handleAddMachine(e: React.FormEvent) {
    e.preventDefault();
    if (!newMachine) return;
    const { error } = await supabase.from("machines").insert([{ name: newMachine }]);
    if (!error) {
      setMachines((prev) => [...prev, newMachine]);
      setNewMachine("");
    }
  }

  async function handleAddSignature(e: React.FormEvent) {
    e.preventDefault();
    if (!newSignature) return;
    const { error } = await supabase.from("signatures").insert([{ name: newSignature }]);
    if (!error) {
      setSignatures((prev) => [...prev, newSignature]);
      setNewSignature("");
    }
  }

  async function handleDeleteMachine(name: string) {
    await supabase.from("machines").delete().eq("name", name);
    setMachines((prev) => prev.filter((m) => m !== name));
  }

  async function handleDeleteSignature(name: string) {
    await supabase.from("signatures").delete().eq("name", name);
    setSignatures((prev) => prev.filter((s) => s !== name));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Adminpanel</h1>
        <p className="text-muted-foreground">
          Hantera maskiner och signaturer som används i registreringen.
        </p>
      </div>
      {error && (
        <div className="text-red-600">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Machines */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Maskiner</h2>
          <form onSubmit={handleAddMachine} className="flex gap-2 mb-4">
            <Input
              value={newMachine}
              onChange={e => setNewMachine(e.target.value)}
              placeholder="Lägg till maskin"
            />
            <Button type="submit">Lägg till</Button>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((m) => (
                <TableRow key={m}>
                  <TableCell>{m}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteMachine(m)}>
                      Ta bort
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Signatures */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Signaturer</h2>
          <form onSubmit={handleAddSignature} className="flex gap-2 mb-4">
            <Input
              value={newSignature}
              onChange={e => setNewSignature(e.target.value)}
              placeholder="Lägg till signatur"
            />
            <Button type="submit">Lägg till</Button>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signatures.map((s) => (
                <TableRow key={s}>
                  <TableCell>{s}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteSignature(s)}>
                      Ta bort
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
