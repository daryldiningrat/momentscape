"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        padding: "0.25rem 0.75rem",
        fontSize: "0.875rem",
        backgroundColor: "transparent",
        color: "#aaa",
        border: "1px solid #555",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Sign Out
    </button>
  );
}
