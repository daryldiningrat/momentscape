"use client";

import { useEffect, useState } from "react";

export default function QrCode({
  value,
  size = 120,
  downloadName,
}: {
  value: string;
  size?: number;
  downloadName?: string;
}) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let mounted = true;
    import("qrcode")
      .then((mod) => mod.default.toDataURL(value, { width: size, margin: 1 }))
      .then((dataUrl) => {
        if (mounted) setSrc(dataUrl);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [value, size]);

  if (!src) {
    return <div style={{ width: size, height: size, backgroundColor: "#f0f0f0", borderRadius: 8 }} />;
  }

  const img = <img src={src} width={size} height={size} alt="QR code" style={{ borderRadius: 8 }} />;

  if (downloadName) {
    return (
      <a href={src} download={downloadName} style={{ display: "inline-block" }}>
        {img}
      </a>
    );
  }

  return img;
}
