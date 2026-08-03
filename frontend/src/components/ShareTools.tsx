"use client";

import { useState } from "react";

export default function ShareTools({
  slug,
  guestName,
  guestEmail,
  className,
}: {
  slug: string;
  guestName?: string;
  guestEmail?: string;
  className?: string;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const link = guestName ? `${baseUrl}/p/${slug}?to=${encodeURIComponent(guestName)}` : `${baseUrl}/p/${slug}`;

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    alert("Link copied!");
  }

  async function generateQR() {
    setQrOpen(true);
    if (!qrDataUrl) {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(link, { width: 256, margin: 1 });
      setQrDataUrl(url);
    }
  }

  function downloadQR() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${guestName || slug}.png`;
    a.click();
  }

  function shareWhatsApp() {
    const text = guestName ? `Hi ${guestName}, you are invited! ${link}` : `You are invited! ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareEmail() {
    const subject = "You're Invited!";
    const body = guestName ? `Dear ${guestName},\n\nYou are invited!\n\n${link}` : `You are invited!\n\n${link}`;
    window.open(`mailto:${guestEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
      <button onClick={copyLink} title="Copy Link" style={btnStyle}>📋 Copy Link</button>
      <button onClick={shareWhatsApp} title="Share via WhatsApp" style={btnStyle}>💬 WhatsApp</button>
      <button onClick={shareEmail} title="Share via Email" style={btnStyle}>📧 Email</button>
      <button onClick={generateQR} title="Show QR Code" style={btnStyle}>📱 QR</button>

      {qrOpen && qrDataUrl && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: 12, textAlign: "center" }}>
            <img src={qrDataUrl} alt="QR Code" style={{ width: 200, height: 200 }} />
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#333" }}>{guestName || slug}</p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
              <button onClick={downloadQR} style={{ ...btnStyle, backgroundColor: "#059669" }}>Download</button>
              <button onClick={() => setQrOpen(false)} style={{ ...btnStyle, backgroundColor: "#444" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "0.35rem 0.75rem",
  fontSize: "0.75rem",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
