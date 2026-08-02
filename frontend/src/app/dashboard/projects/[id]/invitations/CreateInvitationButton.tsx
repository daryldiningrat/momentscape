"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateInvitationButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  async function handleCreate() {
    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}/invitations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    router.push(`/dashboard/invitations/${data.id}`);
    router.refresh();
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={createBtnStyle}
      >
        + New Invitation
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Invitation name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "0.5rem",
          fontSize: "0.875rem",
          border: "1px solid #333",
          borderRadius: 6,
          backgroundColor: "#1a1a1a",
          color: "#fafafa",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
        }}
      />
      <button onClick={handleCreate} disabled={loading} style={createBtnStyle}>
        {loading ? "Creating..." : "Create"}
      </button>
      <button onClick={() => setShowForm(false)} style={{ ...createBtnStyle, backgroundColor: "#444" }}>
        Cancel
      </button>
    </div>
  );
}

const createBtnStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
