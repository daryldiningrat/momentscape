"use client";

import Link from "next/link";
import type { WeddingTemplateData } from "./buildWeddingTemplateData";
import QrCode from "@/components/QrCode";
import Countdown from "@/components/Countdown";

export default function WeddingTemplate({
  data,
}: {
  data: WeddingTemplateData;
}) {
  const { bride, groom, quote, quoteReference, story, akad, resepsi, liveStreamUrl, gallery, giftAccounts, giftAddress, giftItems, weddingHashtag, guestName, colors, headingFont, bodyFont, showCountdown, dressCode, weddingFrameUrl, shareYourMomentUrl, souvenirCard, healthProtocol, guest } = data;
  const primaryFont = `${headingFont}, 'Georgia', serif`;
  const secondaryFont = `${bodyFont}, 'Georgia', serif`;

  const showSaveDate = showCountdown !== false && !!akad.date;
  const gcalUrl = akad.date
    ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`The Wedding of ${bride.nickname || bride.name} & ${groom.nickname || groom.name}`)}&dates=${akad.date.replace(/-/g, "")}/${akad.date.replace(/-/g, "")}&location=${encodeURIComponent(akad.venue || akad.address || "")}`
    : null;
  const qrValue = guest?.name
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${data.slug}?to=${encodeURIComponent(guest.name)}`
    : "";

  return (
    <div style={{ fontFamily: secondaryFont, backgroundColor: colors.background, color: colors.text, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}20)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        position: "relative",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.6 }}>💐</div>
        <p style={{ fontSize: "0.875rem", letterSpacing: 3, textTransform: "uppercase", color: colors.secondary }}>
          The Wedding Of
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, fontStyle: "italic", margin: "0.5rem 0" }}>
          {bride.nickname || bride.name}
        </h1>
        <p style={{ fontSize: "1.5rem", color: colors.primary, margin: "0.25rem 0" }}>&amp;</p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, fontStyle: "italic", margin: "0.5rem 0" }}>
          {groom.nickname || groom.name}
        </h1>

        {akad.date && (
          <p style={{ fontSize: "1.125rem", color: colors.secondary, marginTop: "1.5rem", textTransform: "capitalize" }}>
            {new Date(akad.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}

        {guestName && (
          <div style={{
            marginTop: "2rem",
            backgroundColor: `${colors.primary}20`,
            borderRadius: 12,
            padding: "1rem 2rem",
            border: `1px solid ${colors.primary}40`,
          }}>
            <p style={{ color: colors.secondary, fontSize: "0.875rem" }}>Kepada Yth.</p>
            <p style={{ fontSize: "1.125rem", fontWeight: 600, color: colors.primary }}>{guestName}</p>
          </div>
        )}
      </section>

      {/* Quote */}
      {quote && (
        <section style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: "1.5rem", fontStyle: "italic", lineHeight: 1.6, color: colors.secondary }}>
            &ldquo;{quote}&rdquo;
          </p>
          {quoteReference && (
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: colors.primary }}>– {quoteReference}</p>
          )}
        </section>
      )}

      {/* Bride & Groom */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "2rem" }}>Lovely Couple</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ flex: "1 1 250px" }}>
            <div style={{
              width: 160, height: 160, borderRadius: "50%",
              backgroundColor: colors.primary + "30",
              margin: "0 auto 1rem",
              backgroundImage: bride.photo ? `url(${bride.photo})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {!bride.photo && <span style={{ fontSize: "3rem", lineHeight: "160px" }}>👰</span>}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 400 }}>{bride.name}</h3>
            <p style={{ fontSize: "0.875rem", color: colors.secondary }}>{bride.parents}</p>
            {bride.instagram && (
              <Link href={`https://instagram.com/${bride.instagram}`} style={{ color: colors.primary, fontSize: "0.875rem" }} target="_blank">@{bride.instagram}</Link>
            )}
          </div>
          <div style={{ flex: "1 1 250px" }}>
            <div style={{
              width: 160, height: 160, borderRadius: "50%",
              backgroundColor: colors.primary + "30",
              margin: "0 auto 1rem",
              backgroundImage: groom.photo ? `url(${groom.photo})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {!groom.photo && <span style={{ fontSize: "3rem", lineHeight: "160px" }}>🤵</span>}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 400 }}>{groom.name}</h3>
            <p style={{ fontSize: "0.875rem", color: colors.secondary }}>{groom.parents}</p>
            {groom.instagram && (
              <Link href={`https://instagram.com/${groom.instagram}`} style={{ color: colors.primary, fontSize: "0.875rem" }} target="_blank">@{groom.instagram}</Link>
            )}
          </div>
        </div>
      </section>

      {/* Our Story */}
      {story.length > 0 && (
        <section style={{ padding: "4rem 2rem", backgroundColor: colors.primary + "08" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 400, marginBottom: "3rem" }}>Our Story</h2>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            {story.map((s, i) => (
              <div key={i} style={{
                position: "relative",
                paddingLeft: "2rem",
                paddingBottom: "2rem",
                borderLeft: `2px solid ${colors.primary}`,
              }}>
                <div style={{
                  position: "absolute",
                  left: -7,
                  top: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: colors.primary,
                }} />
                <p style={{ fontSize: "0.75rem", color: colors.primary, textTransform: "uppercase", letterSpacing: 2 }}>{s.year}</p>
                <h4 style={{ margin: "0.25rem 0" }}>{s.title}</h4>
                <p style={{ fontSize: "0.875rem", color: colors.secondary }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Save the Date */}
      {showSaveDate && (
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "2rem" }}>Save the Date</h2>
          <Countdown target={akad.date} />
          {gcalUrl && (
            <a href={gcalUrl} target="_blank" rel="noreferrer" style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.75rem 2rem",
              backgroundColor: colors.primary,
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}>Simpan Tanggalnya</a>
          )}
        </section>
      )}

      {/* Events - Akad & Resepsi */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "2rem" }}>Wedding Event</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", maxWidth: 800, margin: "0 auto" }}>
          {[{ label: "Akad", event: akad }, { label: "Resepsi", event: resepsi }].map(({ label, event }) =>
            event.date ? (
              <div key={label} style={{ border: `1px solid ${colors.primary}30`, borderRadius: 12, padding: "2rem", backgroundColor: colors.primary + "05" }}>
                <h3 style={{ fontSize: "1.25rem", color: colors.primary }}>{label}</h3>
                <p style={{ fontSize: "1.125rem", marginTop: "0.5rem", textTransform: "capitalize" }}>
                  {new Date(event.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p style={{ color: colors.secondary }}>{event.time} {event.timezone}</p>
                <p style={{ marginTop: "1rem", fontWeight: 600 }}>{event.venue}</p>
                <p style={{ fontSize: "0.875rem", color: colors.secondary }}>{event.address}</p>
                {event.mapLink && (
                  <Link href={event.mapLink} target="_blank" style={{
                    display: "inline-block", marginTop: "1rem", color: colors.primary,
                    fontSize: "0.875rem", textDecoration: "underline",
                  }}>Lihat Lokasi</Link>
                )}
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* Dress Code */}
      {dressCode && (
        <section style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: colors.primary + "08" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>{dressCode.title || "A Guide to Attire"}</h2>
          {dressCode.colors && dressCode.colors.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {dressCode.colors.map((c, i) => (
                <span key={i} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: c, border: "1px solid #ddd", display: "inline-block" }} />
              ))}
            </div>
          )}
          {dressCode.note && <p style={{ color: colors.secondary, maxWidth: 480, margin: "0 auto" }}>{dressCode.note}</p>}
        </section>
      )}

      {/* QR Check-in */}
      {guest?.name && (
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>QR Check-in</h2>
          <p style={{ color: colors.secondary, marginBottom: "1.5rem" }}>Silahkan tunjukan QR Code ini kepada penerima tamu undangan di lokasi acara.</p>
          <div style={{ maxWidth: 320, margin: "0 auto", padding: "1.5rem", backgroundColor: "#fff", borderRadius: 12, border: "1px solid #eee", color: "#333" }}>
            <QrCode value={qrValue} size={140} downloadName="kartu-akses.png" />
            <p style={{ fontWeight: 700, marginTop: "1rem" }}>{bride.nickname || bride.name} &amp; {groom.nickname || groom.name}</p>
            <p style={{ fontSize: "0.875rem", color: "#666" }}>{akad.venue}</p>
            <p style={{ fontSize: "0.875rem", color: "#666" }}>
              {akad.date ? new Date(akad.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
            </p>
            {guest.session && <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", fontWeight: 700 }}>{guest.session.toUpperCase()}</p>}
            <p style={{ marginTop: "1rem", fontWeight: 600 }}>Kepada Yth.</p>
            <p style={{ fontWeight: 700 }}>{guest.name}</p>
            {guest.guestLimit != null && <p style={{ fontSize: "0.875rem", color: "#666" }}>Limit: {guest.guestLimit} orang</p>}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section style={{ padding: "4rem 2rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 400, marginBottom: "2rem" }}>Gallery</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "0.5rem",
            maxWidth: 960,
            margin: "0 auto",
          }}>
            {gallery.map((img, i) => (
              <div key={i} style={{
                aspectRatio: "1",
                backgroundColor: colors.primary + "20",
                borderRadius: 8,
                overflow: "hidden",
              }}>
                <img src={img.url} alt={img.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live Stream */}
      {liveStreamUrl && (
        <section style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: colors.primary + "08" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>Live Streaming</h2>
          <Link href={liveStreamUrl} target="_blank" style={{
            display: "inline-block", padding: "0.75rem 2rem", backgroundColor: colors.primary,
            color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600,
          }}>Join Stream</Link>
        </section>
      )}

      {/* Share Your Moment / Wedding Frame */}
      {(weddingFrameUrl || shareYourMomentUrl) && (
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1.5rem" }}>Share Your Moment</h2>
          {weddingFrameUrl && (
            <Link href={weddingFrameUrl} target="_blank" style={{
              display: "inline-block", padding: "0.75rem 2rem", backgroundColor: colors.primary,
              color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600,
            }}>Open Wedding Frame</Link>
          )}
          {shareYourMomentUrl && (
            <Link href={shareYourMomentUrl} target="_blank" style={{
              display: "inline-block", padding: "0.75rem 2rem", backgroundColor: colors.primary,
              color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, marginLeft: "0.5rem",
            }}>Upload Photos</Link>
          )}
        </section>
      )}

      {/* Wedding Gift */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: colors.primary + "08" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "2rem" }}>Wedding Gift</h2>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          {giftAccounts.map((acc, i) => (
            <div key={i} style={{ marginBottom: "1.5rem", textAlign: "left", padding: "1rem", backgroundColor: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
              <p style={{ fontWeight: 600 }}>{acc.bank} — {acc.accountName}</p>
              <p style={{ fontSize: "1.25rem", color: colors.primary }}>{acc.accountNumber}</p>
              <button onClick={() => navigator.clipboard?.writeText(acc.accountNumber)} style={{
                marginTop: "0.5rem", padding: "0.25rem 0.75rem", fontSize: "0.75rem",
                backgroundColor: colors.primary, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer",
              }}>Salin</button>
            </div>
          ))}
          {giftAddress && (
            <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#fff", borderRadius: 8, border: "1px solid #eee", textAlign: "left" }}>
              <p style={{ fontWeight: 600 }}>Kirim Kado</p>
              <p style={{ color: colors.secondary }}>{giftAddress}</p>
            </div>
          )}
          {giftItems.length > 0 && (
            <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              {giftItems.map((item, i) => (
                <div key={i} style={{ backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #eee" }}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />}
                  <p style={{ padding: "0.5rem", fontSize: "0.75rem", fontWeight: 600 }}>{item.name}</p>
                  <p style={{ padding: "0 0.5rem 0.5rem", fontSize: "0.75rem", color: colors.primary }}>{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Souvenir Card */}
      {souvenirCard && (
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>{souvenirCard.title || "Kartu Souvenir"}</h2>
          {souvenirCard.imageUrl && (
            <img src={souvenirCard.imageUrl} alt={souvenirCard.title} style={{ maxWidth: 320, width: "100%", borderRadius: 8 }} />
          )}
        </section>
      )}

      {/* Health Protocol */}
      {healthProtocol && (
        <section style={{ padding: "2rem", textAlign: "center", fontSize: "0.875rem", color: colors.secondary, maxWidth: 640, margin: "0 auto" }}>
          {healthProtocol}
        </section>
      )}

      {/* Builder Sections */}
      {((data as any).sections || []).filter((s: any) => s.visible).map((section: any, i: number) => (
        <section key={section.id || i} style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          {section.title && <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: "1rem" }}>{section.title}</h2>}
          {section.content && <p style={{ color: colors.secondary, lineHeight: 1.8 }}>{section.content}</p>}
        </section>
      ))}

      {/* Footer */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 400 }}>Thank You</h2>
        <p style={{ color: colors.secondary, marginTop: "0.5rem" }}>
          Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.
        </p>
        <p style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: "1rem" }}>
          — {bride.nickname || bride.name} &amp; {groom.nickname || groom.name} —
        </p>
        {weddingHashtag && (
          <p style={{ marginTop: "1rem", color: colors.primary }}>#{weddingHashtag}</p>
        )}
        <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: colors.secondary }}>
          Digital Wedding Invitation © {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}
