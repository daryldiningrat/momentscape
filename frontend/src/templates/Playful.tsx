import type { TemplateData } from "./types";

export default function PlayfulTemplate({ data }: { data: TemplateData }) {
  const { colors, headingFont, bodyFont, eventTagline, eventTitle, eventName, eventDate, eventTime, timezone, venueName, venueAddress, venueNote, hostPrimaryName, hostPartnerName, guestName, message } = data;
  const primaryFont = `${headingFont}, 'Comic Sans MS', cursive`;
  const secondaryFont = `${bodyFont}, 'Comic Sans MS', cursive`;

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: secondaryFont,
      background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`,
      color: "#fff",
      padding: "2rem",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "3rem", margin: 0 }}>🎉</p>

        {guestName && (
          <div style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            borderRadius: 9999,
            padding: "0.75rem 2rem",
            margin: "1.5rem auto",
            display: "inline-block",
          }}>
            <span style={{ fontWeight: 700 }}>{guestName}</span>, you&apos;re invited!
          </div>
        )}

        {eventTagline && (
          <p style={{ fontSize: "1.25rem", opacity: 0.9, marginTop: "1rem" }}>
            {eventTagline}
          </p>
        )}

        <h1 style={{ fontSize: "clamp(2.25rem, 9vw, 3.5rem)", fontWeight: 900, margin: "1rem 0 0.5rem", textShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}>
          {eventTitle}
        </h1>

        <p style={{ fontSize: "clamp(1.25rem, 5vw, 1.75rem)", marginBottom: "2rem", opacity: 0.95 }}>
          {eventName}
        </p>

        {eventDate && (
          <div style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 24,
            padding: "1.5rem",
            marginBottom: "2rem",
          }}>
            <p style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)", fontWeight: 800 }}>{eventDate}</p>
            {eventTime && <p style={{ fontSize: "1.25rem", marginTop: "0.25rem" }}>{eventTime} {timezone}</p>}
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>📍 {venueName}</p>
          <p style={{ opacity: 0.85 }}>{venueAddress}</p>
          {venueNote && <p style={{ opacity: 0.75, marginTop: "0.5rem" }}>{venueNote}</p>}
        </div>

        {(hostPrimaryName || hostPartnerName) && (
          <p style={{ fontSize: "1.25rem", marginTop: "3rem", fontWeight: 600 }}>
            🎊 {hostPrimaryName}{hostPartnerName ? ` & ${hostPartnerName}` : ""} 🎊
          </p>
        )}

        {message && (
          <p style={{ marginTop: "1.5rem", opacity: 0.9 }}>{message}</p>
        )}

        <div style={{ fontSize: "2rem", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          🎈🎂🎈
        </div>
      </div>
    </div>
  );
}
