"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const projectTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    type: "wedding",
    description: "",
    eventDate: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        eventDate: form.eventDate || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create project");
      setLoading(false);
      return;
    }

    const project = await res.json();
    router.push(`/dashboard/projects/${project.id}`);
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>New Project</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Type
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={inputStyle}
          >
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>
        <label style={labelStyle}>
          Event Date
          <input
            type="datetime-local"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Location
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={inputStyle}
          />
        </label>
        {error && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</p>}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/dashboard" style={cancelStyle}>Cancel</Link>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "1.5rem",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  fontSize: "0.875rem",
  color: "#ccc",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  fontSize: "1rem",
  border: "1px solid #333",
  borderRadius: 6,
  backgroundColor: "#1a1a1a",
  color: "#fafafa",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const cancelStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  color: "#aaa",
  textDecoration: "none",
};
