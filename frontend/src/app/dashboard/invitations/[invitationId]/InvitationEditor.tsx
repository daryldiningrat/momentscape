"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Invitation } from "@/lib/invitations";
import type { CmsData } from "@momentscape/database";
import { templates, type TemplateId } from "@/templates";
import TemplateRenderer from "@/components/TemplateRenderer";
import SectionsEditor from "@/components/SectionsEditor";
import RsvpFormBuilder from "@/components/RsvpFormBuilder";

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
  const [rsvpQuestions, setRsvpQuestions] = useState((invitation.metadata as any)?.rsvpQuestions || []);
  const [design, setDesign] = useState((invitation.design as any) || {});
  const [colors, setColors] = useState(design.colors || {});
  const [cmsData, setCmsData] = useState<CmsData>((invitation.cmsData as CmsData) || {});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    ((invitation.design as any)?.templateId as TemplateId) || "classic"
  );
  const [fonts, setFonts] = useState(design.fonts || { heading: "Playfair Display", body: "Inter" });
  const dirtyRef = useRef(false);
  const dataRef = useRef({ name, slug, message, status, sections, design: { colors, fonts: design.fonts || {} }, cmsData });

  useEffect(() => {
    dataRef.current = { name, slug, message, status, sections, design: { ...design, colors, fontFamily: design.fontFamily, fonts, templateId: selectedTemplate }, cmsData };
  }, [name, slug, message, status, sections, colors, fonts, design.fonts, cmsData, selectedTemplate]);

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
        metadata: { rsvpQuestions: rsvpQuestions },
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

  function handleTemplateChange(id: TemplateId) {
    setSelectedTemplate(id);
    markDirty();
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
          <legend style={legendStyle}>Template</legend>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {(Object.entries(templates) as [TemplateId, { name: string }][]).map(([id, tpl]) => (
              <button
                key={id}
                onClick={() => handleTemplateChange(id)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  borderRadius: 6,
                  border: selectedTemplate === id ? "2px solid #2563eb" : "1px solid #333",
                  backgroundColor: selectedTemplate === id ? "#1e3a5f" : "#1a1a1a",
                  color: selectedTemplate === id ? "#fff" : "#fafafa",
                  fontWeight: selectedTemplate === id ? 600 : 400,
                }}
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </fieldset>

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
          <legend style={legendStyle}>Sections Builder</legend>
          <SectionsEditor
            sections={sections}
            onChange={(newSections) => { setSections(newSections); markDirty(); }}
          />
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>RSVP Form Builder</legend>
          <RsvpFormBuilder
            questions={rsvpQuestions}
            onChange={(newQuestions) => { setRsvpQuestions(newQuestions); markDirty(); }}
          />
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
          <legend style={legendStyle}>Wedding - Bride</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>Full Name <input value={getCmsValue("wedding.bride.name")} onChange={(e) => updateCmsData("wedding.bride.name", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Nickname <input value={getCmsValue("wedding.bride.nickname")} onChange={(e) => updateCmsData("wedding.bride.nickname", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle} css={{ gridColumn: "span 2" }}>Parents <input value={getCmsValue("wedding.bride.parents")} onChange={(e) => updateCmsData("wedding.bride.parents", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Instagram <input value={getCmsValue("wedding.bride.instagram")} onChange={(e) => updateCmsData("wedding.bride.instagram", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Photo URL <input value={getCmsValue("wedding.bride.photo")} onChange={(e) => updateCmsData("wedding.bride.photo", e.target.value)} style={inputStyle} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Wedding - Groom</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>Full Name <input value={getCmsValue("wedding.groom.name")} onChange={(e) => updateCmsData("wedding.groom.name", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Nickname <input value={getCmsValue("wedding.groom.nickname")} onChange={(e) => updateCmsData("wedding.groom.nickname", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle} css={{ gridColumn: "span 2" }}>Parents <input value={getCmsValue("wedding.groom.parents")} onChange={(e) => updateCmsData("wedding.groom.parents", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Instagram <input value={getCmsValue("wedding.groom.instagram")} onChange={(e) => updateCmsData("wedding.groom.instagram", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Photo URL <input value={getCmsValue("wedding.groom.photo")} onChange={(e) => updateCmsData("wedding.groom.photo", e.target.value)} style={inputStyle} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Wedding - Quote</legend>
          <label style={labelStyle}>Quote <textarea value={getCmsValue("wedding.quote")} onChange={(e) => updateCmsData("wedding.quote", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></label>
          <label style={labelStyle}>Reference <input value={getCmsValue("wedding.quoteReference")} onChange={(e) => updateCmsData("wedding.quoteReference", e.target.value)} style={inputStyle} /></label>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Wedding - Akad</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>Venue <input value={getCmsValue("wedding.akad.venue")} onChange={(e) => updateCmsData("wedding.akad.venue", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Address <input value={getCmsValue("wedding.akad.address")} onChange={(e) => updateCmsData("wedding.akad.address", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Date <input type="date" value={getCmsValue("wedding.akad.date")} onChange={(e) => updateCmsData("wedding.akad.date", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Time <input placeholder="08.00 - selesai" value={getCmsValue("wedding.akad.time")} onChange={(e) => updateCmsData("wedding.akad.time", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Timezone <input value={getCmsValue("wedding.akad.timezone")} onChange={(e) => updateCmsData("wedding.akad.timezone", e.target.value)} style={inputStyle} placeholder="WIB" /></label>
            <label style={labelStyle}>Map <input value={getCmsValue("wedding.akad.mapLink")} onChange={(e) => updateCmsData("wedding.akad.mapLink", e.target.value)} style={inputStyle} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Wedding - Resepsi</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>Venue <input value={getCmsValue("wedding.resepsi.venue")} onChange={(e) => updateCmsData("wedding.resepsi.venue", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Address <input value={getCmsValue("wedding.resepsi.address")} onChange={(e) => updateCmsData("wedding.resepsi.address", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Date <input type="date" value={getCmsValue("wedding.resepsi.date")} onChange={(e) => updateCmsData("wedding.resepsi.date", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Time <input placeholder="11.00 - 13.00" value={getCmsValue("wedding.resepsi.time")} onChange={(e) => updateCmsData("wedding.resepsi.time", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Timezone <input value={getCmsValue("wedding.resepsi.timezone")} onChange={(e) => updateCmsData("wedding.resepsi.timezone", e.target.value)} style={inputStyle} placeholder="WIB" /></label>
            <label style={labelStyle}>Map <input value={getCmsValue("wedding.resepsi.mapLink")} onChange={(e) => updateCmsData("wedding.resepsi.mapLink", e.target.value)} style={inputStyle} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Wedding - Extra</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>Stream URL <input value={getCmsValue("wedding.liveStreamUrl")} onChange={(e) => updateCmsData("wedding.liveStreamUrl", e.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}>Hashtag <input value={getCmsValue("wedding.weddingHashtag")} onChange={(e) => updateCmsData("wedding.weddingHashtag", e.target.value)} style={inputStyle} placeholder="WeddingFarahDaryl" /></label>
            <label style={labelStyle} css={{ gridColumn: "span 2" }}>Gift Address <textarea value={getCmsValue("wedding.giftAddress")} onChange={(e) => updateCmsData("wedding.giftAddress", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Design Customizer</legend>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.5rem" }}>Color Palette Presets</p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {[
                { name: "Elegant", colors: { primary: "#d4a574", secondary: "#8b7355", accent: "#c9a96e", background: "#faf8f5", text: "#2d2d2d" } },
                { name: "Bold", colors: { primary: "#1a1a2e", secondary: "#16213e", accent: "#e94560", background: "#0f0f1a", text: "#fafafa" } },
                { name: "Fresh", colors: { primary: "#2d6a4f", secondary: "#40916c", accent: "#d8f3dc", background: "#f0faf4", text: "#1b4332" } },
              ].map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => { setColors({ ...theme.colors }); markDirty(); }}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.75rem",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: 6,
                    color: "#fafafa",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                    {Object.values(theme.colors).map((c, i) => (
                      <span key={i} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c, display: "inline-block" }} />
                    ))}
                  </div>
                  {theme.name}
                </button>
              ))}
              <button
                onClick={() => { setColors({ primary: "#d4a574", secondary: "#8b7355", accent: "#c9a96e", background: "#faf8f5", text: "#2d2d2d" }); markDirty(); }}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem", backgroundColor: "#333", border: "1px solid #555", borderRadius: 6, color: "#aaa", cursor: "pointer" }}
              >
                Reset
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
            {[
              { key: "primary", label: "Primary" },
              { key: "secondary", label: "Secondary" },
              { key: "accent", label: "Accent" },
              { key: "background", label: "Background" },
              { key: "text", label: "Text" },
            ].map(({ key, label }) => (
              <label key={key} style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={(colors as any)[key] || "#000000"}
                  onChange={(e) => { setColors({ ...colors, [key]: e.target.value }); markDirty(); }}
                  style={{ width: 32, height: 32, border: "1px solid #333", borderRadius: 4, padding: 0, cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.75rem" }}>{label}</span>
              </label>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #333", paddingTop: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.5rem" }}>Typography</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <label style={{ ...labelStyle, flex: 1 }}>
                Heading Font
                <select
                  value={fonts.heading}
                  onChange={(e) => { setFonts({ ...fonts, heading: e.target.value }); markDirty(); }}
                  style={inputStyle}
                >
                  {["Playfair Display", "Inter", "Lora", "Montserrat", "Cormorant Garamond"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>
              <label style={{ ...labelStyle, flex: 1 }}>
                Body Font
                <select
                  value={fonts.body}
                  onChange={(e) => { setFonts({ ...fonts, body: e.target.value }); markDirty(); }}
                  style={inputStyle}
                >
                  {["Inter", "Lora", "Montserrat", "Playfair Display", "Cormorant Garamond"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>
            </div>
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
