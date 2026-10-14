import type { TemplateData } from "./types";

export default function ModernTemplate({ data }: { data: TemplateData }) {
  const { colors, headingFont, bodyFont, eventTagline, eventTitle, eventName, eventDate, eventTime, timezone, venueName, venueAddress, venueNote, hostPrimaryName, hostPartnerName, guestName, message } = data;
  const primaryFont = `${headingFont}, 'Inter', sans-serif`;
  const secondaryFont = `${bodyFont}, 'Inter', sans-serif`;

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: secondaryFont,
      backgroundColor: colors.background,
      color: colors.text,
    }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "4rem 2rem" }}>
        {guestName && (
          <div style={{
            backgroundColor: colors.accent,
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: 8,
            marginBottom: "2rem",
            textAlign: "center",
            fontWeight: 600,
          }}>
            Hello, {guestName}!
          </div>
        )}

        <div style={{
          width: 60,
          height: 60,
          backgroundColor: colors.primary,
          borderRadius: 8,
          marginBottom: "2rem",
        }} />

        {eventTagline && (
          <p style={{ fontSize: "0.75rem", letterSpacing: 3, textTransform: "uppercase", color: colors.secondary, marginBottom: "0.5rem" }}>
            {eventTagline}
          </p>
        )}

        <h1 style={{ fontSize: "clamp(2rem, 8vw, 2.75rem)", fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
          {eventTitle}
        </h1>

        <p style={{ fontSize: "1.25rem", color: colors.primary, fontWeight: 600, marginTop: "0.5rem", marginBottom: "2.5rem" }}>
          {eventName}
        </p>

        {eventDate && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}>
            <div style={{ backgroundColor: `${colors.primary}15`, padding: "1rem", borderRadius: 8 }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 2, color: colors.secondary }}>Date</p>
              <p style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.25rem" }}>{eventDate}</p>
            </div>
            {eventTime && (
              <div style={{ backgroundColor: `${colors.primary}15`, padding: "1rem", borderRadius: 8 }}>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 2, color: colors.secondary }}>Time</p>
                <p style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.25rem" }}>{eventTime} {timezone}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ borderTop: `2px solid ${colors.primary}30`, paddingTop: "1.5rem" }}>
          <p style={{ fontWeight: 700 }}>{venueName}</p>
          <p style={{ color: colors.secondary, marginTop: "0.25rem" }}>{venueAddress}</p>
          {venueNote && <p style={{ color: colors.secondary, fontSize: "0.875rem", marginTop: "0.5rem" }}>{venueNote}</p>}
        </div>

        {(hostPrimaryName || hostPartnerName) && (
          <div style={{ marginTop: "3rem", borderTop: `2px solid ${colors.primary}30`, paddingTop: "1.5rem" }}>
            <p style={{ fontWeight: 700 }}>{hostPrimaryName}{hostPartnerName ? ` & ${hostPartnerName}` : ""}</p>
            <p style={{ color: colors.secondary, fontSize: "0.875rem" }}>We look forward to celebrating with you</p>
          </div>
        )}

        {message && (
          <p style={{ marginTop: "2rem", color: colors.secondary }}>{message}</p>
        )}
      </div>
    </div>
  );
}
