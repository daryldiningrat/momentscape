"use client";

import { useState, useRef } from "react";

const groupOptions = ["Family", "Friends", "Work", "Acquaintances"];

interface ParsedRow {
  name: string;
  email: string;
  phone: string;
  guestGroup: string;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/["']/g, ""));
  const nameIdx = headers.findIndex((h) => h === "name");
  const emailIdx = headers.findIndex((h) => h.includes("email"));
  const phoneIdx = headers.findIndex((h) => h.includes("phone"));
  const groupIdx = headers.findIndex((h) => h === "group" || h === "guestgroup");

  if (nameIdx === -1 || emailIdx === -1) return [];

  return lines.slice(1).filter((line) => line.trim()).map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/["']/g, ""));
    return {
      name: cols[nameIdx] || "",
      email: cols[emailIdx] || "",
      phone: phoneIdx >= 0 ? cols[phoneIdx] || "" : "",
      guestGroup: groupIdx >= 0 ? cols[groupIdx] || "Family" : "Family",
    };
  });
}

export default function CsvImport({
  invitationId,
  onDone,
}: {
  invitationId: string;
  onDone: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: { row: number; error: string }[] } | null>(null);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string);
      if (rows.length === 0) {
        setError("Could not parse CSV. Expected headers: Name, Email, [Phone], [Group]");
        return;
      }
      setParsedRows(rows);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    setImporting(true);
    setError("");

    const res = await fetch(`/api/invitations/${invitationId}/guests/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: parsedRows }),
    });
    const data = await res.json();
    setResult(data);
    setImporting(false);
    onDone();
  }

  return (
    <div style={{ padding: "1rem", backgroundColor: "#1a1a1a", borderRadius: 8, border: "1px solid #333", marginBottom: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>CSV Import</h3>

      {!result && (
        <>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFile} style={{ color: "#aaa", fontSize: "0.875rem" }} />
            {parsedRows.length > 0 && (
              <button onClick={handleImport} disabled={importing} style={btnStyle}>
                {importing ? "Importing..." : `Import ${parsedRows.length} guests`}
              </button>
            )}
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" }}>{error}</p>}
          <p style={{ color: "#888", fontSize: "0.75rem" }}>
            CSV format: <code>Name,Email,Phone,Group</code>
          </p>

          {parsedRows.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.5rem" }}>
                Preview (first 5 rows):
              </p>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Group</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 5).map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #333" }}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>{row.name}</td>
                      <td style={tdStyle}>{row.email}</td>
                      <td style={tdStyle}>{row.phone || "—"}</td>
                      <td style={tdStyle}>{row.guestGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {result && (
        <div>
          <p style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 600 }}>
            ✅ Imported {result.imported} guests
          </p>
          {result.errors.length > 0 && (
            <div style={{ marginTop: "0.5rem" }}>
              <p style={{ color: "#f59e0b", fontSize: "0.75rem" }}>{result.errors.length} rows skipped:</p>
              <ul style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.25rem", paddingLeft: "1.25rem" }}>
                {result.errors.slice(0, 10).map((e, i) => (
                  <li key={i}>Row {e.row}: {e.error}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => { setResult(null); setParsedRows([]); }} style={{ ...btnStyle, marginTop: "0.75rem", backgroundColor: "#444" }}>
            Import More
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "0.875rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "#888", borderBottom: "1px solid #333" };
const tdStyle: React.CSSProperties = { padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "#fafafa" };
