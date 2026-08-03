import type { TemplateData } from "./types";

export default function ClassicTemplate({ data }: { data: TemplateData }) {
  const { colors, headingFont, bodyFont, eventTagline, eventTitle, eventName, eventDate, eventTime, timezone, venueName, venueAddress, venueNote, hostPrimaryName, hostPartnerName, guestName, message } = data;
  const primaryFont = `${headingFont}, 'Georgia', serif`;
  const secondaryFont = `${bodyFont}, 'Georgia', serif`;

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: secondaryFont,
      background: `linear-gradient(135deg, ${colors.background}, ${colors.secondary}20)`,
      color: colors.text,
      padding: "3rem 2rem",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌸</div>

        {guestName && (
          <p style={{ fontSize: "1.125rem", color: colors.accent, fontStyle: "italic", marginBottom: "1.5rem" }}>
            Dear {guestName},
          </p>
        )}

        {eventTagline && (
          <p style={{ fontSize: "0.75rem", letterSpacing: 4, textTransform: "uppercase", color: colors.secondary, marginBottom: "1rem" }}>
            {eventTagline}
          </p>
        )}

        <h1 style={{ fontSize: "3rem", fontWeight: 400, marginBottom: "0.5rem", fontStyle: "italic" }}>
          {eventTitle}
        </h1>

        <p style={{ fontSize: "1.5rem", color: colors.primary, marginBottom: "2rem" }}>
          {eventName}
        </p>

        {eventDate && (
          <div style={{
            border: `2px solid ${colors.primary}`,
            borderRadius: 4,
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "inline-block",
          }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{eventDate}</p>
            {eventTime && <p style={{ marginTop: "0.25rem", color: colors.secondary }}>{eventTime} {timezone}</p>}
          </div>
        )}

        <div style={{ borderTop: `1px solid ${colors.secondary}40`, paddingTop: "2rem", marginTop: "2rem" }}>
          <p style={{ fontSize: "1.25rem", color: colors.secondary }}>{venueName}</p>
          <p style={{ color: colors.secondary }}>{venueAddress}</p>
          {venueNote && <p style={{ color: colors.secondary, fontStyle: "italic", marginTop: "0.5rem" }}>{venueNote}</p>}
        </div>

        {(hostPrimaryName || hostPartnerName) && (
          <p style={{ fontSize: "1.125rem", marginTop: "3rem", color: colors.primary }}>
            — {hostPrimaryName}{hostPartnerName ? ` & ${hostPartnerName}` : ""}
          </p>
        )}

        {message && (
          <p style={{ marginTop: "2rem", fontStyle: "italic", color: colors.secondary }}>{message}</p>
        )}

        <div style={{ fontSize: "2rem", marginTop: "2rem" }}>💐</div>
      </div>
    </div>
  );
}
