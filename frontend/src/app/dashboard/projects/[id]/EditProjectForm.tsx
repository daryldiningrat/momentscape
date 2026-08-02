"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";

const projectTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate" },
];

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: project.title,
    type: project.type,
    description: project.description || "",
    eventDate: project.eventDate ? new Date(project.eventDate).toISOString().slice(0, 16) : "",
    location: project.location || "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  async function handleSave() {
    setError("");
    setSaving(true);

    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        eventDate: form.eventDate || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update");
      setSaving(false);
      return;
    }

    setEditing(false);
    setSaving(false);
    router.refresh();
  }

  async function handleDelete() {
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  if (showDelete) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <h2>Delete Project</h2>
        <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
          Are you sure you want to delete &quot;{project.title}&quot;? This action can be undone.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button onClick={() => setShowDelete(false)} style={cancelBtnStyle}>Cancel</button>
          <button onClick={handleDelete} style={deleteBtnStyle}>Delete</button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div style={{ maxWidth: 480 }}>
        <h1>Edit Project</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <label style={labelStyle}>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
              {projectTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </label>
          <label style={labelStyle}>
            Event Date
            <input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} />
          </label>
          {error && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</p>}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setEditing(false)} style={cancelBtnStyle}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={buttonStyle}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{project.title}</h1>
        <span style={badgeStyle(project.type)}>{project.type}</span>
      </div>
      {project.description && <p style={{ color: "#aaa", marginTop: "0.5rem" }}>{project.description}</p>}
      {project.eventDate && (
        <p style={{ color: "#ccc", marginTop: "0.25rem" }}>
          Event: {new Date(project.eventDate).toLocaleString()}
        </p>
      )}
      {project.location && <p style={{ color: "#888", marginTop: "0.25rem" }}>{project.location}</p>}

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button onClick={() => setEditing(true)} style={buttonStyle}>Edit</button>
        <button onClick={() => setShowDelete(true)} style={deleteBtnStyle}>Delete</button>
        <Link href={`/dashboard/projects/${project.id}/invitations`} style={inviteLinkStyle}>Invitations</Link>
        <Link href="/dashboard" style={cancelBtnStyle}>Back</Link>
      </div>
    </div>
  );
}

function badgeStyle(type: string): React.CSSProperties {
  const colors: Record<string, string> = {
    wedding: "#f59e0b",
    birthday: "#ec4899",
    corporate: "#3b82f6",
  };
  return {
    backgroundColor: colors[type] || "#6b7280",
    color: "#fff",
    padding: "0.125rem 0.5rem",
    borderRadius: 9999,
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
  };
}

const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem", color: "#ccc" };
const inputStyle: React.CSSProperties = { padding: "0.5rem", fontSize: "1rem", border: "1px solid #333", borderRadius: 6, backgroundColor: "#1a1a1a", color: "#fafafa" };
const buttonStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer" };
const deleteBtnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: 6, cursor: "pointer" };
const cancelBtnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", color: "#aaa", textDecoration: "none" };
const inviteLinkStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", textDecoration: "none" };
