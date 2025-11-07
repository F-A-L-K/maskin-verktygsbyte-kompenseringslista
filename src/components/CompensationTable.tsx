import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

interface RawRow {
  id: string;
  property: string;
  toolNumber: string;
  toolDescription: string;
  axisPrimary: string;
  axisSecondary: string;
  machineSide: string;
  operatorSide: string;
  comment: string;
}

type BooleanLabel = "SANT" | "FALSKT" | "";

interface CompensationTableProps {
  source: string;
}

const sanitiseBoolean = (value: string | undefined): BooleanLabel => {
  const normalised = value?.trim().toUpperCase();
  if (!normalised) {
    return "";
  }
  if (normalised === "SANT") {
    return "SANT";
  }
  if (normalised === "FALSKT") {
    return "FALSKT";
  }
  return "";
};

const hasContent = (values: (string | undefined)[]) =>
  values.some((value) => (value ?? "").trim().length > 0);

const BooleanIndicator = ({ value }: { value: BooleanLabel }) => {
  if (value === "SANT") {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-foreground bg-foreground">
        <Check className="h-3 w-3 text-background" strokeWidth={3} />
      </span>
    );
  }

  if (value === "FALSKT") {
    return <span className="inline-flex h-5 w-5 rounded border border-muted-foreground" />;
  }

  return <span className="text-muted-foreground">—</span>;
};

export function CompensationTable({ source }: CompensationTableProps) {
  const [rows, setRows] = useState<RawRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`Kunde inte läsa filen (${response.status})`);
        }

        const csv = await response.text();
        const parsed = Papa.parse<string[]>(csv, {
          delimiter: ";",
          skipEmptyLines: "greedy",
        });

        const parsedRows = parsed.data.filter((row) =>
          hasContent(row as string[])
        ) as string[][];

        const headerIndex = parsedRows.findIndex(
          (row) => row[0]?.trim().toUpperCase() === "ID-#"
        );

        const dataRows = headerIndex >= 0 ? parsedRows.slice(headerIndex + 1) : parsedRows;

        const cleanedRows: RawRow[] = dataRows
          .map((row) => {
            const [id, property, toolNumber, toolDescription, axisPrimary, axisSecondary, machineSide, operatorSide, comment] = row.map((value) => (value ?? "").trim());

            if (!id) {
              return null;
            }

            return {
              id,
              property,
              toolNumber,
              toolDescription,
              axisPrimary,
              axisSecondary,
              machineSide,
              operatorSide,
              comment,
            } satisfies RawRow;
          })
          .filter((value): value is RawRow => value !== null);

        if (isActive) {
          setRows(cleanedRows);
        }
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

    void loadData();

    return () => {
      isActive = false;
    };
  }, [source]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      [
        row.id,
        row.property,
        row.toolNumber,
        row.toolDescription,
        row.axisPrimary,
        row.axisSecondary,
        row.comment,
      ]
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
        <div className="flex-1 overflow-auto rounded-md border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-center">ID</th>
                <th className="px-3 py-2 text-center">Egenskap</th>
                <th className="px-3 py-2 text-center">Nr</th>
                <th className="px-3 py-2 text-center">Verktyg/Benämning</th>
                <th className="px-3 py-2 text-center">Primär kompenseringriktning</th>
                <th className="px-3 py-2 text-center">Sekundär kompenseringriktning</th>
                <th className="px-3 py-2 text-center">Verktygsbunden</th>
                <th className="px-3 py-2 text-center">Programbunden</th>
                <th className="px-3 py-2 text-center">Kommentar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredRows.map((row, index) => {
                const machineLabel = sanitiseBoolean(row.machineSide);
                const operatorLabel = sanitiseBoolean(row.operatorSide);

                return (
                  <tr
                    key={row.id}
                    className={`align-top ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-center font-mono text-xs text-muted-foreground">{row.id}</td>
                    <td className="px-3 py-2 text-center">{row.property || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">{row.toolNumber || "—"}</td>
                    <td className="px-3 py-2 text-center">{row.toolDescription || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">{row.axisPrimary || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">{row.axisSecondary || "—"}</td>
                    <td className="px-3 py-2 text-center">
                      <BooleanIndicator value={machineLabel} />
                  </td>
                  <td className="px-3 py-2 text-center">
                      <BooleanIndicator value={operatorLabel} />
                  </td>
                    <td className="px-3 py-2 whitespace-pre-wrap text-sm leading-relaxed text-center">{row.comment || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


