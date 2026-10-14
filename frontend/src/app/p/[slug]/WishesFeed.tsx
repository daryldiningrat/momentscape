interface Wish {
  id: string;
  name: string;
  status: string;
  message: string | null;
  createdAt: Date;
}

export default function WishesFeed({ wishes }: { wishes: Wish[] }) {
  const attending = wishes.filter((w) => w.status === "CONFIRMED").length;
  const declined = wishes.filter((w) => w.status === "DECLINED").length;

  return (
    <section style={{ padding: "clamp(2rem, 8vw, 4rem) 1rem", maxWidth: 640, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>RSVP &amp; Wishes</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <span style={pillStyle}>{attending} Hadir</span>
        <span style={pillStyle}>{declined} Tidak hadir</span>
      </div>

      {wishes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No wishes yet. Be the first to leave one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {wishes.map((w) => (
            <div key={w.id} style={{ padding: "1rem", backgroundColor: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <strong style={{ fontSize: "0.875rem" }}>{w.name}</strong>
                <span style={{ fontSize: "0.75rem", color: w.status === "CONFIRMED" ? "#10b981" : w.status === "DECLINED" ? "#ef4444" : "#888" }}>
                  {w.status === "CONFIRMED" ? "Hadir" : w.status === "DECLINED" ? "Tidak hadir" : w.status}
                </span>
              </div>
              {w.message && <p style={{ fontSize: "0.875rem", color: "#ccc", whiteSpace: "pre-wrap" }}>{w.message}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const pillStyle: React.CSSProperties = {
  padding: "0.25rem 0.75rem",
  backgroundColor: "#1a1a1a",
  borderRadius: 9999,
  fontSize: "0.875rem",
  color: "#fafafa",
  border: "1px solid #333",
};
