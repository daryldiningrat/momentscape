"use client";

import { useEffect, useState } from "react";

export default function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const units = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      {units.map((unit) => (
        <div
          key={unit.label}
          style={{
            minWidth: 70,
            padding: "0.75rem 0.5rem",
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>{String(unit.value).padStart(2, "0")}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.25rem" }}>{unit.label}</div>
        </div>
      ))}
    </div>
  );
}
