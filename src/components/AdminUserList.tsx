
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";

export default function AdminUserList({
  users,
  machines,
  onUpdate
}: {
  users: { id: string, username: string, machines: string[] }[],
  machines: string[],
  onUpdate: () => void
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editMachines, setEditMachines] = useState<string[]>([]);
  const [editError, setEditError] = useState<string | null>(null);

  function handleEdit(uid: string, curr: string[]) {
    setEditId(uid);
    setEditMachines(curr);
    setEditError(null);
  }
  function handleCancel() {
    setEditId(null);
    setEditMachines([]);
    setEditError(null);
  }

  async function saveMachines(userId: string) {
    setEditError(null);
    // Remove all current assignments, then add selected
    let { error: delError } = await supabase.from("user_machines").delete().eq("user_id", userId);
    if (delError) {
      setEditError("Kunde inte spara: " + delError.message);
      return;
    }
    // Add current editMachines as new
    for (let m of editMachines) {
      let { error } = await supabase.from("user_machines").insert({ user_id: userId, machine: m });
      if (error) {
        setEditError("Fel när maskiner sparades: " + error.message);
        return;
      }
    }
    setEditId(null);
    setEditMachines([]);
    onUpdate();
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Användarnamn</TableHead>
          <TableHead>Maskiner</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) =>
          <TableRow key={u.id}>
            <TableCell>{u.username}</TableCell>
            <TableCell>
              {editId === u.id ? (
                <div className="flex flex-wrap gap-2">
                  {machines.map((m) => (
                    <label key={m} className="flex gap-1 items-center text-sm">
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        checked={editMachines.includes(m)}
                        onChange={e => {
                          if (e.target.checked) setEditMachines([...editMachines, m]);
                          else setEditMachines(editMachines.filter(x => x !== m));
                        }}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap text-[.95em]">{u.machines.join(', ')}</div>
              )}
            </TableCell>
            <TableCell>
              {editId === u.id ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveMachines(u.id)}>Spara</Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>Avbryt</Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => handleEdit(u.id, u.machines)}>
                  Ändra maskiner
                </Button>
              )}
              {editId === u.id && editError && <div className="text-destructive text-xs">{editError}</div>}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
