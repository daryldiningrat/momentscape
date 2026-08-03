"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import CsvImport from "./CsvImport";

const groups = ["Family", "Friends", "Work", "Acquaintances"];
export const rsvpStatuses = ["PENDING", "CONFIRMED", "DECLINED", "WAITLISTED"];

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  guestGroup: string;
  rsvpStatus: string;
  viewCount: number;
}

export default function GuestManager({
  invitationId,
  invitationName,
  backHref,
}: {
  invitationId: string;
  invitationName: string;
  backHref: string;
}) {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formGroup, setFormGroup] = useState("Family");
  const [formError, setFormError] = useState("");

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("search", search);
    if (filterGroup) params.set("group", filterGroup);
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/invitations/${invitationId}/guests?${params}`);
    if (res.ok) {
      const data = await res.json();
      setGuests(data.guests);
      setTotal(data.total);
    }
    setLoading(false);
  }, [invitationId, page, search, filterGroup, filterStatus]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  function openAdd() {
    setEditingGuest(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormGroup("Family");
    setFormError("");
    setShowForm(true);
  }

  function openEdit(g: Guest) {
    setEditingGuest(g);
    setFormName(g.name);
    setFormEmail(g.email);
    setFormPhone(g.phone || "");
    setFormGroup(g.guestGroup);
    setFormError("");
    setShowForm(true);
  }

  async function handleSave() {
    setFormError("");
    if (!formName || !formEmail) { setFormError("Name and email are required"); return; }

    if (editingGuest) {
      await fetch(`/api/invitations/${invitationId}/guests/${editingGuest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, phone: formPhone, guestGroup: formGroup }),
      });
    } else {
      await fetch(`/api/invitations/${invitationId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, phone: formPhone, guestGroup: formGroup }),
      });
    }

    setShowForm(false);
    router.refresh();
    fetchGuests();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this guest?")) return;
    await fetch(`/api/invitations/${invitationId}/guests/${id}`, { method: "DELETE" });
    router.refresh();
    fetchGuests();
  }

  const totalPages = Math.ceil(total / 15);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <Link href={backHref} style={{ color: "#60a5fa", fontSize: "0.875rem", textDecoration: "none" }}>← Back</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
        <h1>Guests — {invitationName}</h1>
        <button onClick={openAdd} style={btnStyle}>+ Add Guest</button>
      </div>

      <CsvImport invitationId={invitationId} onDone={fetchGuests} />

      <div style={{ display: "flex", gap: "0.75rem", margin: "1rem 0", flexWrap: "wrap" }}>
        <input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={filterInput}
        />
        <select value={filterGroup} onChange={(e) => { setFilterGroup(e.target.value); setPage(1); }} style={filterSelect}>
          <option value="">All Groups</option>
          {groups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={filterSelect}>
          <option value="">All Status</option>
          {rsvpStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {showForm && (
        <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>{editingGuest ? "Edit Guest" : "Add Guest"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Name" style={filterInput} />
            <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="Email" style={filterInput} />
            <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Phone" style={filterInput} />
            <select value={formGroup} onChange={(e) => setFormGroup(e.target.value)} style={filterSelect}>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {formError && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>{formError}</p>}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button onClick={handleSave} style={btnStyle}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, backgroundColor: "#444" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Group</th>
              <th style={thStyle}>RSVP</th>
              <th style={thStyle}>Views</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={tdStyle}>{g.name}</td>
                <td style={tdStyle}>{g.email}</td>
                <td style={tdStyle}>{g.phone || "—"}</td>
                <td style={tdStyle}>{g.guestGroup}</td>
                <td style={tdStyle}>
                  <span style={rsvpBadge(g.rsvpStatus)}>{g.rsvpStatus}</span>
                </td>
                <td style={tdStyle}>{g.viewCount}</td>
                <td style={tdStyle}>
                  <button onClick={() => openEdit(g)} style={smallBtnStyle}>Edit</button>
                  <button onClick={() => handleDelete(g.id)} style={{ ...smallBtnStyle, backgroundColor: "#dc2626" }}>×</button>
                </td>
              </tr>
            ))}
            {guests.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "#666" }}>No guests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={smallBtnStyle}>← Prev</button>
          <span style={{ color: "#aaa", fontSize: "0.875rem", lineHeight: "32px" }}>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={smallBtnStyle}>Next →</button>
        </div>
      )}
    </div>
  );
}

function rsvpBadge(status: string): React.CSSProperties {
  const colors: Record<string, string> = { PENDING: "#6b7280", CONFIRMED: "#10b981", DECLINED: "#ef4444", WAITLISTED: "#f59e0b" };
  return { backgroundColor: colors[status] || "#6b7280", color: "#fff", padding: "0.125rem 0.5rem", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 600 };
}

const btnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "0.875rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const smallBtnStyle: React.CSSProperties = { padding: "0.25rem 0.5rem", fontSize: "0.75rem", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", marginRight: "0.25rem" };
const filterInput: React.CSSProperties = { padding: "0.4rem 0.5rem", fontSize: "0.75rem", border: "1px solid #333", borderRadius: 6, backgroundColor: "#1a1a1a", color: "#fafafa" };
const filterSelect: React.CSSProperties = { padding: "0.4rem 0.5rem", fontSize: "0.75rem", border: "1px solid #333", borderRadius: 6, backgroundColor: "#1a1a1a", color: "#fafafa" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "0.5rem", fontSize: "0.75rem", color: "#888", borderBottom: "1px solid #333", fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: "0.5rem", fontSize: "0.875rem", color: "#fafafa" };
