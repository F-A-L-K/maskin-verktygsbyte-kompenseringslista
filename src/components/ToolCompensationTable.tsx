import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

interface ToolRow {
  location: string;
  name: string;
  compensation: string;
}

interface MetadataRow {
  label: string;
  value: string;
}

interface ToolCompensationTableProps {
  source: string;
}

const normalise = (value: string | undefined) => (value ?? "").trim();

const hasData = (row: string[]) => row.some((cell) => normalise(cell).length > 0);

export function ToolCompensationTable({ source }: ToolCompensationTableProps) {
  const [metadata, setMetadata] = useState<MetadataRow[]>([]);
  const [rows, setRows] = useState<ToolRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resolvedSource = useMemo(() => {
    const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    if (/^https?:\/\//i.test(source) || source.startsWith("//")) {
      return source;
    }
    if (source.startsWith("/")) {
      return `${backendBase}${source}` || source;
    }
    return source;
  }, [source]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(resolvedSource);
        if (!response.ok) {
          throw new Error(`Kunde inte läsa filen (${response.status})`);
        }

        const csv = await response.text();
        const parsed = Papa.parse<string[]>(csv, {
          delimiter: ";",
          skipEmptyLines: "greedy",
        });

        const parsedRows = (parsed.data as string[][]).filter((row) => hasData(row));

        const headerIndex = parsedRows.findIndex((row) =>
          normalise(row[0]).toLowerCase().startsWith("plats/koord")
        );

        const metadataRows = headerIndex >= 0 ? parsedRows.slice(0, headerIndex) : [];
        const dataRows = headerIndex >= 0 ? parsedRows.slice(headerIndex + 1) : parsedRows;

        const metadataItems: MetadataRow[] = metadataRows
          .map((row) => ({
            label: normalise(row[0]).replace(/:$/, ""),
            value: normalise(row.slice(1).join(" ")),
          }))
          .filter((item) => item.label.length > 0 || item.value.length > 0);

        const toolRows: ToolRow[] = dataRows
          .map((row) => {
            const [location, name, compensation] = [
              normalise(row[0]),
              normalise(row[1]),
              normalise(row[2]),
            ];

            if (!location && !name) {
              return null;
            }

            return {
              location,
              name,
              compensation,
            } satisfies ToolRow;
          })
          .filter((value): value is ToolRow => value !== null);

        if (!isActive) {
          return;
        }

        setMetadata(metadataItems);
        setRows(toolRows);
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Okänt fel");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [resolvedSource]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      [row.location, row.name, row.compensation]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [rows, searchTerm]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex w-full items-center gap-2 sm:w-72">
          <span className="text-sm font-medium text-muted-foreground">Sök</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Filtrera tabellen"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="text-xs text-muted-foreground">
          Visar {filteredRows.length} av {rows.length} rader
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-8 text-sm text-muted-foreground">
          Laddar tabell...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-destructive/40 bg-destructive/10 p-8 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border max-h-[70vh]">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="sticky top-0 z-10 px-3 py-2 text-center bg-muted/80 backdrop-blur-sm">Plats/Koord.</th>
                <th className="sticky top-0 z-10 px-3 py-2 text-center bg-muted/80 backdrop-blur-sm">Benämning</th>
                <th className="sticky top-0 z-10 px-3 py-2 whitespace-nowrap text-center bg-muted/80 backdrop-blur-sm">Komp. Nr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredRows.map((row, index) => (
                <tr
                  key={`${row.location}-${row.name}`}
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                >
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground text-center">{row.location || "—"}</td>
                  <td className="px-3 py-2 text-center">{row.name || "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-center">{row.compensation || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


