"use client";

import { useState } from "react";

interface RsvpOption {
  id: string;
  label: string;
}

interface RsvpQuestion {
  id: string;
  type: "text" | "choice" | "multi" | "meal" | "song";
  label: string;
  required: boolean;
  options: RsvpOption[];
}

const questionTypes = [
  { value: "text", label: "Text" },
  { value: "choice", label: "Single Choice" },
  { value: "multi", label: "Multiple Choice" },
  { value: "meal", label: "Meal Choice" },
  { value: "song", label: "Song Request" },
];

export default function RsvpFormBuilder({
  questions,
  onChange,
}: {
  questions: RsvpQuestion[];
  onChange: (q: RsvpQuestion[]) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);

  function addQuestion() {
    onChange([
      ...questions,
      {
        id: "q-" + Date.now(),
        type: "text",
        label: "",
        required: false,
        options: [],
      },
    ]);
  }

  function updateQuestion(id: string, field: string, value: unknown) {
    onChange(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  }

  function removeQuestion(id: string) {
    onChange(questions.filter((q) => q.id !== id));
  }

  function moveQuestion(id: string, direction: "up" | "down") {
    const idx = questions.findIndex((q) => q.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === questions.length - 1) return;
    const newArr = [...questions];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
    onChange(newArr);
  }

  function addOption(questionId: string) {
    onChange(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, { id: "opt-" + Date.now(), label: "" }] }
          : q
      )
    );
  }

  function updateOption(questionId: string, optionId: string, label: string) {
    onChange(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) => (o.id === optionId ? { ...o, label } : o)),
            }
          : q
      )
    );
  }

  function removeOption(questionId: string, optionId: string) {
    onChange(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
          : q
      )
    );
  }

  if (showPreview) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>RSVP Form Preview</h3>
          <button onClick={() => setShowPreview(false)} style={secondaryBtn}>← Back to Editor</button>
        </div>
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", color: "#333" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>RSVP</h2>
          {questions.map((q) => (
            <div key={q.id} style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                {q.label || "(Untitled)"}
                {q.required && <span style={{ color: "#ef4444" }}> *</span>}
              </label>
              {q.type === "text" && (
                <input
                  type="text"
                  disabled
                  placeholder="Your answer"
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem" }}
                />
              )}
              {q.type === "song" && (
                <input
                  type="text"
                  disabled
                  placeholder="Artist - Song Title"
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem" }}
                />
              )}
              {(q.type === "choice" || q.type === "meal") &&
                q.options.map((opt) => (
                  <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", fontWeight: 400 }}>
                    <input type="radio" disabled name={q.id} />
                    {opt.label || "(Empty option)"}
                    {q.type === "meal" && <input disabled placeholder="Dietary restrictions" style={{ marginLeft: "auto", padding: "0.25rem", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.75rem", width: 160 }} />}
                  </label>
                ))}
              {q.type === "multi" &&
                q.options.map((opt) => (
                  <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", fontWeight: 400 }}>
                    <input type="checkbox" disabled />
                    {opt.label || "(Empty option)"}
                  </label>
                ))}
            </div>
          ))}
          {questions.length === 0 && <p style={{ color: "#999" }}>No questions yet.</p>}
          <button disabled style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", opacity: 0.5 }}>Submit RSVP</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={addQuestion} style={addBtn}>+ Add Question</button>
          <button onClick={() => setShowPreview(true)} style={{ ...secondaryBtn, fontSize: "0.75rem" }}>👁 Preview</button>
        </div>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} style={{
          padding: "0.75rem",
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          marginBottom: "0.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button onClick={() => moveQuestion(q.id, "up")} style={arrowBtn} disabled={idx === 0}>▲</button>
              <button onClick={() => moveQuestion(q.id, "down")} style={arrowBtn} disabled={idx === questions.length - 1}>▼</button>
            </div>
            <input
              value={q.label}
              onChange={(e) => updateQuestion(q.id, "label", e.target.value)}
              placeholder="Question label"
              style={{ flex: 2, padding: "0.35rem 0.5rem", fontSize: "0.75rem", border: "1px solid #444", borderRadius: 4, backgroundColor: "#222", color: "#fafafa" }}
            />
            <select
              value={q.type}
              onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
              style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", border: "1px solid #444", borderRadius: 4, backgroundColor: "#222", color: "#fafafa" }}
            >
              {questionTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#ccc" }}>
              <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(q.id, "required", e.target.checked)} />
              Required
            </label>
            <button onClick={() => removeQuestion(q.id)} style={{ padding: "0.25rem 0.5rem", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.875rem" }}>×</button>
          </div>

          {(q.type === "choice" || q.type === "multi" || q.type === "meal") && (
            <div style={{ marginTop: "0.75rem", paddingLeft: "2rem" }}>
              {q.options.map((opt) => (
                <div key={opt.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.35rem", alignItems: "center" }}>
                  <input
                    value={opt.label}
                    onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                    placeholder="Option label"
                    style={{ flex: 1, padding: "0.25rem 0.5rem", fontSize: "0.75rem", border: "1px solid #444", borderRadius: 4, backgroundColor: "#222", color: "#fafafa" }}
                  />
                  <button onClick={() => removeOption(q.id, opt.id)} style={{ padding: "0.15rem 0.4rem", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem" }}>×</button>
                </div>
              ))}
              <button onClick={() => addOption(q.id)} style={{ fontSize: "0.75rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                + Add option
              </button>
            </div>
          )}
        </div>
      ))}

      {questions.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666", fontSize: "0.875rem", border: "1px dashed #444", borderRadius: 8 }}>
          <p>No RSVP questions configured yet.</p>
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>Click "+ Add Question" to start building your RSVP form.</p>
        </div>
      )}
    </div>
  );
}

const addBtn: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "0.875rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const secondaryBtn: React.CSSProperties = { padding: "0.5rem 1rem", fontSize: "0.875rem", backgroundColor: "#444", color: "#fafafa", border: "none", borderRadius: 6, cursor: "pointer" };
const arrowBtn: React.CSSProperties = { padding: "0 0.4rem", fontSize: "0.625rem", backgroundColor: "#333", color: "#aaa", border: "1px solid #555", borderRadius: 3, cursor: "pointer", lineHeight: "18px" };
