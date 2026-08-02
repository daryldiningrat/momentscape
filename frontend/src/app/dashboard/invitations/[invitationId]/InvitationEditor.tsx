"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Invitation } from "@/lib/invitations";
import type { CmsData } from "@momentscape/database";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function InvitationEditor({
  invitation,
}: {
  invitation: Invitation;
}) {
  const router = useRouter();
  const [name, setName] = useState(invitation.name);
  const [slug, setSlug] = useState(invitation.slug);
  const [message, setMessage] = useState(invitation.message || "");
  const [status, setStatus] = useState(invitation.status);
  const [sections, setSections] = useState((invitation.sections as any[]) || []);
  const [design, setDesign] = useState((invitation.design as any) || {});
  const [colors, setColors] = useState(design.colors || {});
  const [cmsData, setCmsData] = useState<CmsData>((invitation.cmsData as CmsData) || {});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const dirtyRef = useRef(false);
  const dataRef = useRef({ name, slug, message, status, sections, design: { colors, fonts: design.fonts || {} }, cmsData });

  useEffect(() => {
    dataRef.current = { name, slug, message, status, sections, design: { colors, fonts: design.fonts || {} }, cmsData };
  }, [name, slug, message, status, sections, colors, design.fonts, cmsData]);

  const saveInvitation = useCallback(async (newStatus?: string) => {
    setSaving(true);
    setError("");
    const d = dataRef.current;
    const res = await fetch(`/api/invitations/${invitation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: d.name,
        slug: d.slug,
        message: d.message,
        status: newStatus ?? d.status,
        sections: d.sections,
        design: d.design,
        cmsData: d.cmsData,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ? (Array.isArray(data.error) ? data.error.join(", ") : data.error) : "Failed to save");
    } else {
      setLastSaved(new Date().toLocaleTimeString());
    }
    setSaving(false);
    router.refresh();
  }, [invitation.id, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (dirtyRef.current) {
        dirtyRef.current = false;
        saveInvitation();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [saveInvitation]);

  function markDirty() {
    dirtyRef.current = true;
  }

  async function handlePublish() {
    setStatus("published");
    dataRef.current.status = "published";
    await saveInvitation("published");
  }

  function handlePreview() {
    window.open(`/preview/${invitation.slug}`, "_blank");
  }

  async function handleDelete() {
    await fetch(`/api/invitations/${invitation.id}`, { method: "DELETE" });
    router.push(`/dashboard/projects/${invitation.projectId}/invitations`);
  }

  function updateCmsData(path: string, value: string) {
    setCmsData((prev) => {
      const keys = path.split(".");
      const updated: any = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] || {}) };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
    markDirty();
  }

  function getCmsValue(path: string): string {
    const keys = path.split(".");
    let current: any = cmsData;
    for (const key of keys) {
      current = current?.[key];
    }
    return current || "";
  }

  if (showDelete) {
    return (
      <div style={{ maxWidth: 480, margin: "2rem auto", textAlign: "center", fontFamily: "system-ui" }}>
        <h2>Delete Invitation</h2>
        <p style={{ color: "#aaa", marginBottom: "1rem" }}>
          Are you sure you want to delete &quot;{name}&quot;?
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button onClick={() => setShowDelete(false)} style={secondaryBtnStyle}>Cancel</button>
          <button onClick={handleDelete} style={dangerBtnStyle}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <Link href={`/dashboard/projects/${invitation.projectId}/invitations`} style={backLink}>
        ← Back to Invitations
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <h1 style={{ margin: 0 }}>Invitation Editor</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ color: "#666", fontSize: "0.875rem" }}>v{invitation.version}</span>
          {lastSaved && <span style={{ color: "#22c55e", fontSize: "0.75rem" }}>Saved {lastSaved}</span>}
          {saving && <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>Saving...</span>}
          <button onClick={handlePreview} style={secondaryBtnStyle}>Preview</button>
          <button onClick={handlePublish} disabled={status === "published"} style={publishBtnStyle}>Publish</button>
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.5rem" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Invitation Details</legend>
          <label style={labelStyle}>
            Name
            <input value={name} onChange={(e) => { setName(e.target.value); markDirty(); }} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Slug
            <input value={slug} onChange={(e) => { setSlug(e.target.value); markDirty(); }} style={inputStyle} />
          </label>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Event Information</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>
              Event Title
              <input value={getCmsValue("event.title")} onChange={(e) => updateCmsData("event.title", e.target.value)} style={inputStyle} placeholder="Our Wedding" />
            </label>
            <label style={labelStyle}>
              Tagline
              <input value={getCmsValue("event.tagline")} onChange={(e) => updateCmsData("event.tagline", e.target.value)} style={inputStyle} placeholder="Together with their families" />
            </label>
            <label style={labelStyle}>
              Event Name
              <input value={getCmsValue("event.eventName")} onChange={(e) => updateCmsData("event.eventName", e.target.value)} style={inputStyle} placeholder="John & Jane" />
            </label>
            <label style={labelStyle}>
              Date
              <input type="date" value={getCmsValue("event.eventDate")} onChange={(e) => updateCmsData("event.eventDate", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Time
              <input type="time" value={getCmsValue("event.eventTime")} onChange={(e) => updateCmsData("event.eventTime", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Timezone
              <input value={getCmsValue("event.timezone")} onChange={(e) => updateCmsData("event.timezone", e.target.value)} style={inputStyle} placeholder="Asia/Jakarta" />
            </label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Venue</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>
              Venue Name
              <input value={getCmsValue("venue.name")} onChange={(e) => updateCmsData("venue.name", e.target.value)} style={inputStyle} placeholder="Grand Ballroom" />
            </label>
            <label style={labelStyle}>
              Address
              <input value={getCmsValue("venue.address")} onChange={(e) => updateCmsData("venue.address", e.target.value)} style={inputStyle} placeholder="123 Main St" />
            </label>
            <label style={labelStyle} css={{ gridColumn: "span 2" }}>
              Map Link
              <input value={getCmsValue("venue.mapLink")} onChange={(e) => updateCmsData("venue.mapLink", e.target.value)} style={inputStyle} placeholder="https://maps.google.com/..." />
            </label>
            <label style={labelStyle} css={{ gridColumn: "span 2" }}>
              Note
              <textarea value={getCmsValue("venue.note")} onChange={(e) => updateCmsData("venue.note", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Parking available, dress code, etc." />
            </label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Host Information</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>
              Primary Name
              <input value={getCmsValue("host.primaryName")} onChange={(e) => updateCmsData("host.primaryName", e.target.value)} style={inputStyle} placeholder="John Doe" />
            </label>
            <label style={labelStyle}>
              Primary Photo URL
              <input value={getCmsValue("host.primaryPhoto")} onChange={(e) => updateCmsData("host.primaryPhoto", e.target.value)} style={inputStyle} placeholder="https://..." />
            </label>
            <label style={labelStyle}>
              Partner Name
              <input value={getCmsValue("host.partnerName")} onChange={(e) => updateCmsData("host.partnerName", e.target.value)} style={inputStyle} placeholder="Jane Doe" />
            </label>
            <label style={labelStyle}>
              Partner Photo URL
              <input value={getCmsValue("host.partnerPhoto")} onChange={(e) => updateCmsData("host.partnerPhoto", e.target.value)} style={inputStyle} placeholder="https://..." />
            </label>
            <label style={labelStyle}>
              Contact Email
              <input type="email" value={getCmsValue("host.contactEmail")} onChange={(e) => updateCmsData("host.contactEmail", e.target.value)} style={inputStyle} placeholder="john@example.com" />
            </label>
            <label style={labelStyle}>
              Contact Phone
              <input value={getCmsValue("host.contactPhone")} onChange={(e) => updateCmsData("host.contactPhone", e.target.value)} style={inputStyle} placeholder="+123456789" />
            </label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Colors</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
            {["primary", "secondary", "background", "text"].map((key) => (
              <label key={key} style={labelStyle}>
                {key}
                <input type="color" value={(colors as any)[key] || "#000000"} onChange={(e) => { setColors({ ...colors, [key]: e.target.value }); markDirty(); }} style={{ width: "100%", height: 36, border: "1px solid #333", borderRadius: 4, padding: 0 }} />
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => saveInvitation()} disabled={saving} style={primaryBtnStyle}>
            {saving ? "Saving..." : "Save Now"}
          </button>
          <button onClick={() => setShowDelete(true)} style={dangerBtnStyle}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const backLink: React.CSSProperties = { color: "#60a5fa", fontSize: "0.875rem", textDecoration: "none" };
const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem", color: "#ccc" };
const inputStyle: React.CSSProperties = { padding: "0.5rem", fontSize: "0.875rem", border: "1px solid #333", borderRadius: 6, backgroundColor: "#1a1a1a", color: "#fafafa" };
const fieldsetStyle: React.CSSProperties = { border: "1px solid #333", borderRadius: 8, padding: "1.25rem" };
const legendStyle: React.CSSProperties = { fontSize: "1rem", fontWeight: 600, color: "#fafafa", paddingBottom: "0.75rem" };
const primaryBtnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const secondaryBtnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#444", color: "#fafafa", border: "none", borderRadius: 6, cursor: "pointer" };
const publishBtnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const dangerBtnStyle: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
