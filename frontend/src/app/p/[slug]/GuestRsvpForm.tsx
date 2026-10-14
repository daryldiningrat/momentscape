"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RsvpQuestion {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: { id: string; label: string }[];
}

export default function GuestRsvpForm({
  invitationId,
  guestId,
  guestName,
  guestEmail,
  rsvpQuestions,
}: {
  invitationId: string;
  guestId?: string;
  guestName?: string;
  guestEmail?: string;
  rsvpQuestions: RsvpQuestion[];
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(guestName || "");
  const [email, setEmail] = useState(guestEmail || "");
  const [attending, setAttending] = useState("");
  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function updateAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!attending) {
      setError("Please confirm your attendance");
      return;
    }

    setSending(true);
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId,
        guestId,
        name,
        email,
        attending: attending === "yes",
        answers,
        message,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to submit RSVP");
    }
    setSending(false);
  }

  if (submitted) {
    return (
      <section style={{ padding: "clamp(2rem, 8vw, 4rem) 1rem", textAlign: "center", maxWidth: 500, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>🎉 Thank You!</h2>
        <p style={{ color: "#888" }}>Your RSVP has been submitted successfully.</p>
        {guestName && <p style={{ color: "#aaa", marginTop: "0.5rem" }}>We look forward to celebrating with you, {guestName}!</p>}
      </section>
    );
  }

  return (
    <section style={{ padding: "clamp(2rem, 8vw, 4rem) 1rem", textAlign: "center", maxWidth: 500, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "0.5rem" }}>RSVP</h2>
      <p style={{ color: "#888", marginBottom: "1.5rem" }}>
        {guestName ? `Hi, ${guestName}!` : "You're invited!"} Please confirm your attendance.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {!guestName && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            style={inputStyle}
          />
        )}
        {!guestEmail && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
            style={inputStyle}
          />
        )}

        <select value={attending} onChange={(e) => setAttending(e.target.value)} required style={inputStyle}>
          <option value="">Will you attend?</option>
          <option value="yes">Yes, I will attend</option>
          <option value="no">Sorry, I cannot attend</option>
        </select>

        {rsvpQuestions.map((q) => (
          <div key={q.id} style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.875rem" }}>
              {q.label}
              {q.required && <span style={{ color: "#ef4444" }}> *</span>}
            </label>
            {q.type === "text" && (
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                required={q.required}
                style={inputStyle}
              />
            )}
            {q.type === "song" && (
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                placeholder="Artist - Song Title"
                required={q.required}
                style={inputStyle}
              />
            )}
            {q.type === "choice" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {q.options.map((opt) => (
                  <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 400, fontSize: "0.875rem" }}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.label}
                      checked={answers[q.id] === opt.label}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={q.required}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
            {q.type === "meal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {q.options.map((opt) => (
                  <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 400 }}>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.label}
                        checked={answers[q.id] === opt.label}
                        onChange={(e) => updateAnswer(q.id, e.target.value)}
                        required={q.required}
                      />
                      {" "}{opt.label}
                    </label>
                  </div>
                ))}
                {answers[q.id] && (
                  <input
                    type="text"
                    placeholder="Dietary restrictions"
                    onChange={(e) => updateAnswer(q.id + "_diet", e.target.value)}
                    style={{ ...inputStyle, marginLeft: "1.5rem", width: "calc(100% - 1.5rem)" }}
                  />
                )}
              </div>
            )}
            {q.type === "multi" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {q.options.map((opt) => (
                  <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 400, fontSize: "0.875rem" }}>
                    <input
                      type="checkbox"
                      value={opt.label}
                      checked={answers[q.id]?.split(",").includes(opt.label)}
                      onChange={(e) => {
                        const current = (answers[q.id] || "").split(",").filter(Boolean);
                        if (e.target.checked) {
                          current.push(opt.label);
                        } else {
                          const idx = current.indexOf(opt.label);
                          if (idx > -1) current.splice(idx, 1);
                        }
                        updateAnswer(q.id, current.join(","));
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.875rem" }}>
            Doa &amp; Ucapan
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Write your wishes and prayers for us..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</p>}

        <button type="submit" disabled={sending} style={{
          padding: "0.75rem",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "0.5rem",
        }}>
          {sending ? "Sending..." : "Send RSVP"}
        </button>
      </form>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontSize: "0.875rem",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  backgroundColor: "#fff",
  color: "#333",
  outline: "none",
};
